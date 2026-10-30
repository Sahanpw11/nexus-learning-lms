import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, InformationCircleIcon, MegaphoneIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { chatAPI } from '../../services/api';
import type { ChatMessage, ConversationDetail, ConversationStatus, SendMessage } from '../../../../shared/types';
import Composer from './Composer';
import ConversationInfo from './ConversationInfo';
import MessageBubble from './MessageBubble';
import ReceiptsModal from './ReceiptsModal';
import { apiError, dayLabel, initials, presenceLabel } from './utils';

// shortcut: polling (no sockets on Vercel functions); move to a realtime service if chats get busy.
const POLL_MS = 3000;

interface Props {
  conversationId: number;
  meId: number;
  onBack: () => void;
  onLeft: () => void;
  onActivity: () => void; // something changed that the chat list should show
}

const ConversationView = ({ conversationId, meId, onBack, onLeft, onActivity }: Props) => {
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasOlder, setHasOlder] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [status, setStatus] = useState<ConversationStatus | null>(null);
  const [infoFor, setInfoFor] = useState<ChatMessage | null>(null);
  const [error, setError] = useState('');
  const scroller = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const lastRead = useRef(0);

  // Replace the newest page with fresh data while keeping any older pages already loaded.
  const mergeLatest = useCallback((latest: ChatMessage[]) => {
    setMessages((current) => {
      const oldestLatest = latest[0]?.id ?? Infinity;
      return [...current.filter((m) => m.id < oldestLatest), ...latest];
    });
  }, []);

  const refresh = useCallback(async () => {
    const [{ data }, { data: live }] = await Promise.all([chatAPI.messages(conversationId), chatAPI.status(conversationId)]);
    setStatus(live);
    mergeLatest(data);
    const newest = data[data.length - 1];
    if (newest && newest.id > lastRead.current && document.visibilityState === 'visible') {
      lastRead.current = newest.id;
      chatAPI.markRead(conversationId, newest.id).then(onActivity).catch(() => undefined);
    }
  }, [conversationId, mergeLatest, onActivity]);

  useEffect(() => {
    let cancelled = false;
    setDetail(null);
    setStatus(null);
    setMessages([]);
    setReplyTo(null);
    setError('');
    stickToBottom.current = true;
    lastRead.current = 0;
    (async () => {
      try {
        const [{ data: d }, { data: first }] = await Promise.all([chatAPI.conversation(conversationId), chatAPI.messages(conversationId)]);
        if (cancelled) return;
        setDetail(d);
        chatAPI.status(conversationId).then(({ data: live }) => !cancelled && setStatus(live)).catch(() => undefined);
        setMessages(first);
        setHasOlder(first.length === 50);
        const newest = first[first.length - 1];
        if (newest) {
          lastRead.current = newest.id;
          chatAPI.markRead(conversationId, newest.id).then(onActivity).catch(() => undefined);
        }
      } catch (err) {
        if (!cancelled) setError(apiError(err, 'Could not open this conversation'));
      }
    })();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') refresh().catch(() => undefined);
    }, POLL_MS);
    // Membership and names change less often; refresh them on a slower beat.
    const detailTimer = window.setInterval(() => {
      chatAPI.conversation(conversationId).then(({ data }) => !cancelled && setDetail(data)).catch(() => undefined);
    }, POLL_MS * 5);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      window.clearInterval(detailTimer);
    };
  }, [conversationId, refresh, onActivity]);

  useLayoutEffect(() => {
    if (stickToBottom.current && scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [messages]);

  const onScroll = () => {
    const el = scroller.current;
    if (el) stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const loadOlder = async () => {
    const el = scroller.current;
    const before = messages[0]?.id;
    if (!before || !el) return;
    const previousHeight = el.scrollHeight;
    const { data } = await chatAPI.messages(conversationId, before);
    setHasOlder(data.length === 50);
    stickToBottom.current = false;
    setMessages((current) => [...data, ...current]);
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight - previousHeight; // keep the reader's place
    });
  };

  const replaceMessage = (updated: ChatMessage) => setMessages((current) => current.map((m) => (m.id === updated.id ? updated : m)));

  const send = async (message: SendMessage) => {
    const { data } = await chatAPI.send(conversationId, message);
    stickToBottom.current = true;
    lastRead.current = data.id;
    setMessages((current) => [...current, data]);
    onActivity();
  };

  const react = async (message: ChatMessage, emoji: string) => {
    const mineAlready = message.reactions.find((r) => r.mine)?.emoji === emoji;
    try {
      replaceMessage((mineAlready ? await chatAPI.unreact(message.id) : await chatAPI.react(message.id, emoji)).data);
    } catch (err) {
      setError(apiError(err, 'Could not react'));
    }
  };

  const remove = async (message: ChatMessage) => {
    if (!window.confirm('Delete this message for everyone?')) return;
    try {
      replaceMessage((await chatAPI.deleteMessage(message.id)).data);
      onActivity();
    } catch (err) {
      setError(apiError(err, 'Could not delete the message'));
    }
  };

  if (error && !detail) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p role="alert" className="text-sm text-red-600">{error}</p>
      </div>
    );
  }
  if (!detail) return <div className="flex-1 flex items-center justify-center text-sm text-gray-500">Loading…</div>;

  const showSenders = detail.kind !== 'direct';
  const other = detail.kind === 'direct' ? detail.members.find((m) => m.id !== meId) : undefined;
  const typingNames = status?.typing.map((t) => t.full_name.split(' ')[0]) ?? [];
  const typingText = typingNames.length
    ? detail.kind === 'direct'
      ? 'typing…'
      : `${typingNames.slice(0, 2).join(', ')}${typingNames.length > 2 ? ' and others' : ''} ${typingNames.length > 1 ? 'are' : 'is'} typing…`
    : '';
  const subtitle =
    typingText ||
    (other
      ? presenceLabel(status?.presence.find((p) => p.user_id === other.id)) || other.role
      : `${detail.member_count} members${detail.community_name ? ` · ${detail.community_name}` : ''}`);

  return (
    <div className="flex-1 flex min-w-0">
      <section className={`flex-1 flex flex-col min-w-0 ${showInfo ? 'hidden md:flex' : 'flex'}`} aria-label={`Conversation with ${detail.name}`}>
        <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
          <button type="button" onClick={onBack} className="md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100" aria-label="Back to chats">
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <span className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 text-sm font-medium flex items-center justify-center flex-shrink-0" aria-hidden="true">
            {detail.kind === 'announcement' ? <MegaphoneIcon className="h-5 w-5" /> : detail.kind === 'direct' ? initials(detail.name) : <UserGroupIcon className="h-5 w-5" />}
          </span>
          <button type="button" onClick={() => setShowInfo(true)} className="flex-1 min-w-0 text-left">
            <h1 className="font-medium text-gray-800 truncate">{detail.name}</h1>
            <p className={`text-xs truncate ${typingText ? 'text-orange-600' : 'text-gray-500'}`} aria-live="polite">
              {subtitle}
            </p>
          </button>
          <button type="button" onClick={() => setShowInfo((v) => !v)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100" aria-label="Conversation details" aria-expanded={showInfo}>
            <InformationCircleIcon className="h-5 w-5" />
          </button>
        </header>

        <div ref={scroller} onScroll={onScroll} className="flex-1 overflow-y-auto px-4 py-4 space-y-2 bg-[#f7f5ef]" aria-live="polite">
          {hasOlder && (
            <div className="text-center">
              <button type="button" onClick={loadOlder} className="text-xs text-orange-600 hover:text-orange-700 bg-white rounded-full px-3 py-1 shadow-sm">
                Load earlier messages
              </button>
            </div>
          )}
          {messages.length === 0 && <p className="text-center text-sm text-gray-500 mt-10">No messages yet. Say hello!</p>}
          {messages.map((m, i) => {
            const newDay = i === 0 || new Date(messages[i - 1].created_at).toDateString() !== new Date(m.created_at).toDateString();
            const sameSender = i > 0 && !newDay && messages[i - 1].sender_id === m.sender_id;
            return (
              <React.Fragment key={m.id}>
                {newDay && (
                  <div className="text-center py-2">
                    <span className="text-xs text-gray-600 bg-white rounded-full px-3 py-1 shadow-sm">{dayLabel(m.created_at)}</span>
                  </div>
                )}
                <MessageBubble
                  message={m}
                  mine={m.sender_id === meId}
                  showSender={showSenders && !sameSender}
                  onReply={setReplyTo}
                  onReact={react}
                  onDelete={remove}
                  onInfo={setInfoFor}
                />
              </React.Fragment>
            );
          })}
        </div>
        {error && <p role="alert" className="px-4 py-1 text-xs text-red-600 bg-red-50">{error}</p>}
        <Composer
          canPost={detail.can_post}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
          onSend={send}
          onTyping={(typing) => chatAPI.typing(conversationId, typing).catch(() => undefined)}
        />
      </section>

      {showInfo && (
        <ConversationInfo
          conversation={detail}
          meId={meId}
          presence={status?.presence ?? []}
          onClose={() => setShowInfo(false)}
          onChanged={(updated) => {
            if (!updated) return onLeft();
            setDetail(updated);
            onActivity();
          }}
        />
      )}
      {infoFor && <ReceiptsModal message={infoFor} onClose={() => setInfoFor(null)} />}
    </div>
  );
};

export default ConversationView;
