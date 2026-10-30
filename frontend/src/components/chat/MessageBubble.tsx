import React, { useEffect, useState } from 'react';
import { ArrowUturnLeftIcon, DocumentIcon, FaceSmileIcon, InformationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { chatAPI } from '../../services/api';
import type { ChatMessage } from '../../../../shared/types';
import { formatSize, formatTime } from './utils';

export const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

interface Props {
  message: ChatMessage;
  mine: boolean;
  showSender: boolean;
  onReply: (m: ChatMessage) => void;
  onReact: (m: ChatMessage, emoji: string) => void;
  onDelete: (m: ChatMessage) => void;
  onInfo: (m: ChatMessage) => void;
}

// Signed links expire after 5 minutes, so they're fetched when needed instead of stored.
function useAttachmentUrl(messageId: number, enabled: boolean) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    chatAPI
      .attachmentUrl(messageId)
      .then(({ data }) => !cancelled && setUrl(data.download_url))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [messageId, enabled]);
  return url;
}

// ✓ sent · grey ✓✓ delivered to everyone · blue ✓✓ read by everyone.
const Ticks = ({ message }: { message: ChatMessage }) => {
  const { recipients, read_count, delivered_count } = message;
  const readByAll = recipients > 0 && read_count >= recipients;
  const deliveredToAll = recipients > 0 && delivered_count >= recipients;
  const label =
    recipients > 1
      ? `Read by ${read_count} of ${recipients}, delivered to ${delivered_count}`
      : readByAll
        ? 'Read'
        : deliveredToAll
          ? 'Delivered'
          : 'Sent';
  return (
    <span className={readByAll ? 'text-sky-500' : 'text-gray-500'} title={label} aria-label={label}>
      {readByAll || deliveredToAll ? '✓✓' : '✓'}
    </span>
  );
};

const Attachment = ({ message }: { message: ChatMessage }) => {
  const attachment = message.attachment!;
  const isImage = attachment.content_type.startsWith('image/');
  const imageUrl = useAttachmentUrl(message.id, isImage);

  const openFile = async () => {
    const { data } = await chatAPI.attachmentUrl(message.id);
    window.open(data.download_url, '_blank', 'noopener');
  };

  if (isImage) {
    return imageUrl ? (
      <button type="button" onClick={openFile} className="block mb-1" aria-label={`Open image ${attachment.name}`}>
        <img src={imageUrl} alt={attachment.name} className="rounded-lg max-h-64 max-w-full object-cover" />
      </button>
    ) : (
      <div className="w-56 h-40 rounded-lg bg-gray-100 animate-pulse mb-1" aria-label="Loading image" />
    );
  }
  return (
    <button type="button" onClick={openFile} className="flex items-center gap-3 p-2.5 mb-1 rounded-lg bg-black/5 hover:bg-black/10 text-left w-full">
      <DocumentIcon className="h-8 w-8 text-orange-500 flex-shrink-0" />
      <span className="min-w-0">
        <span className="block text-sm font-medium truncate">{attachment.name}</span>
        <span className="block text-xs opacity-70">{formatSize(attachment.size)}</span>
      </span>
    </button>
  );
};

const MessageBubble = ({ message, mine, showSender, onReply, onReact, onDelete, onInfo }: Props) => {
  const [picking, setPicking] = useState(false);

  return (
    <div className={`group flex ${mine ? 'justify-end' : 'justify-start'}`} data-testid="message">
      <div className={`relative max-w-[75%] flex items-end gap-1 ${mine ? 'flex-row-reverse' : ''}`}>
        <div
          className={`rounded-2xl px-3.5 py-2 shadow-sm ${
            mine ? 'bg-orange-500 text-white rounded-br-md' : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
          }`}
        >
          {showSender && !mine && <p className="text-xs font-medium text-orange-600 mb-0.5">{message.sender_name}</p>}
          {message.reply_to && (
            <div className={`text-xs rounded-lg px-2.5 py-1.5 mb-1.5 border-l-4 ${mine ? 'bg-white/20 border-white/70' : 'bg-gray-100 border-orange-400'}`}>
              <p className="font-medium">{message.reply_to.sender_name}</p>
              <p className="truncate opacity-80">{message.reply_to.deleted ? 'Deleted message' : message.reply_to.body ?? 'Attachment'}</p>
            </div>
          )}
          {message.deleted ? (
            <p className="text-sm italic opacity-70">This message was deleted</p>
          ) : (
            <>
              {message.attachment && <Attachment message={message} />}
              {message.body && <p className="text-sm whitespace-pre-wrap break-words">{message.body}</p>}
            </>
          )}
          <p className={`text-[11px] mt-0.5 flex items-center justify-end gap-1 ${mine ? 'text-white/80' : 'text-gray-400'}`}>
            {formatTime(message.created_at)}
            {mine && !message.deleted && (
              <span className="bg-white rounded px-0.5 text-[10px] leading-none">
                <Ticks message={message} />
              </span>
            )}
          </p>
          {message.reactions.length > 0 && (
            <div className={`flex flex-wrap gap-1 mt-1 ${mine ? 'justify-end' : ''}`}>
              {message.reactions.map((r) => (
                <button
                  key={r.emoji}
                  type="button"
                  onClick={() => onReact(message, r.emoji)}
                  className={`text-xs px-1.5 py-0.5 rounded-full border ${r.mine ? 'bg-orange-50 border-orange-300 text-orange-900' : 'bg-white border-gray-200 text-gray-700'}`}
                  aria-label={`${r.emoji} ${r.count}${r.mine ? ', you reacted' : ''}`}
                >
                  {r.emoji} {r.count}
                </button>
              ))}
            </div>
          )}
        </div>

        {!message.deleted && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            <button type="button" onClick={() => onReply(message)} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200" aria-label="Reply">
              <ArrowUturnLeftIcon className="h-4 w-4" />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setPicking((p) => !p)}
                className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200"
                aria-label="React"
                aria-expanded={picking}
              >
                <FaceSmileIcon className="h-4 w-4" />
              </button>
              {picking && (
                <div className={`absolute bottom-9 z-10 flex gap-1 bg-white rounded-full shadow-lg border border-gray-100 px-2 py-1 ${mine ? 'right-0' : 'left-0'}`}>
                  {QUICK_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setPicking(false);
                        onReact(message, emoji);
                      }}
                      className="text-lg hover:scale-125 transition-transform"
                      aria-label={`React ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {mine && (
              <button type="button" onClick={() => onInfo(message)} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200" aria-label="Message info">
                <InformationCircleIcon className="h-4 w-4" />
              </button>
            )}
            {mine && (
              <button type="button" onClick={() => onDelete(message)} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 hover:text-red-600" aria-label="Delete message">
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
