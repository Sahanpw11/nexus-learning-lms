import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  MegaphoneIcon,
  PencilSquareIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Sidebar from '../components/Sidebar';
import ConversationView from '../components/chat/ConversationView';
import Modal from '../components/chat/Modal';
import NewChatModal from '../components/chat/NewChatModal';
import { apiError, formatListTime, initials } from '../components/chat/utils';
import { useAuth } from '../contexts/AuthContext';
import { chatAPI } from '../services/api';
import type { CommunitySummary, ConversationSummary } from '../../../shared/types';

const LIST_POLL_MS = 5000;
type Tab = 'chats' | 'communities';
type Creating = 'direct' | 'group' | 'community' | null;

const preview = (c: ConversationSummary) => {
  if (c.typing.length) return c.kind === 'direct' ? 'typing…' : `${c.typing[0].split(' ')[0]} is typing…`;
  const m = c.last_message;
  if (!m) return c.kind === 'class' ? 'Class chat' : 'No messages yet';
  const text = m.deleted ? 'This message was deleted' : m.body ?? `📎 ${m.attachment_name}`;
  return c.kind === 'direct' ? text : `${m.sender_name.split(' ')[0]}: ${text}`;
};

const Avatar = ({ c }: { c: ConversationSummary }) => (
  <span className="w-11 h-11 rounded-full bg-orange-100 text-orange-700 text-sm font-medium flex items-center justify-center flex-shrink-0" aria-hidden="true">
    {c.kind === 'direct' ? initials(c.name) : c.kind === 'announcement' ? <MegaphoneIcon className="h-5 w-5" /> : <UserGroupIcon className="h-5 w-5" />}
  </span>
);

const Chat = () => {
  const { user } = useAuth();
  const isStaff = user?.role === 'teacher' || user?.role === 'admin';
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('c') ? Number(params.get('c')) : null;
  const [tab, setTab] = useState<Tab>('chats');
  const [conversations, setConversations] = useState<ConversationSummary[] | null>(null);
  const [communities, setCommunities] = useState<CommunitySummary[] | null>(null);
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState<Creating>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [addingTo, setAddingTo] = useState<CommunitySummary | null>(null);
  const [error, setError] = useState('');

  const select = useCallback((id: number | null) => setParams(id ? { c: String(id) } : {}), [setParams]);

  const loadConversations = useCallback(async () => {
    try {
      setConversations((await chatAPI.conversations()).data);
    } catch (err) {
      setError(apiError(err, 'Could not load your chats'));
    }
  }, []);

  const loadCommunities = useCallback(async () => {
    try {
      setCommunities((await chatAPI.communities()).data);
    } catch (err) {
      setError(apiError(err, 'Could not load communities'));
    }
  }, []);

  useEffect(() => {
    loadConversations();
    loadCommunities();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') loadConversations();
    }, LIST_POLL_MS);
    return () => window.clearInterval(timer);
  }, [loadConversations, loadCommunities]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (conversations ?? []).filter((c) => !q || c.name.toLowerCase().includes(q));
  }, [conversations, query]);

  if (!user) return null;

  const created = (id: number | null) => {
    setCreating(null);
    loadConversations();
    loadCommunities();
    if (id) {
      setTab('chats');
      select(id);
    } else setTab('communities');
  };

  return (
    <div className="h-screen relative overflow-hidden font-sf flex" style={{ backgroundColor: '#fcfcf7' }}>
      <Sidebar />
      <main className="ml-20 flex-1 flex min-w-0 h-screen">
        {/* Left: chat list / communities */}
        <section
          className={`w-full md:w-96 border-r border-gray-200 bg-white flex-col ${selectedId ? 'hidden md:flex' : 'flex'}`}
          aria-label="Chats"
        >
          <div className="px-4 pt-5 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-light text-gray-800">Messages</h1>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
                  aria-label="New conversation"
                  aria-expanded={menuOpen}
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-11 z-20 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1" role="menu">
                    {(
                      [
                        ['direct', 'New chat', ChatBubbleLeftRightIcon],
                        ['group', 'New group', UsersIcon],
                        ...(isStaff ? [['community', 'New community', MegaphoneIcon]] : []),
                      ] as [Creating, string, typeof UsersIcon][]
                    ).map(([mode, label, Icon]) => (
                      <button
                        key={label}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          setCreating(mode);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Icon className="h-4 w-4 text-gray-500" /> {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-3" role="tablist" aria-label="Chat sections">
              {(['chats', 'communities'] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-1.5 rounded-lg text-sm capitalize ${tab === t ? 'bg-white shadow-sm text-gray-800 font-medium' : 'text-gray-600'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            {tab === 'chats' && (
              <>
                <label htmlFor="chat-search" className="sr-only">Search chats</label>
                <input
                  id="chat-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search chats"
                  className="w-full px-4 py-2 rounded-xl bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </>
            )}
          </div>

          {error && <p role="alert" className="px-4 py-2 text-sm text-red-600">{error}</p>}

          {tab === 'chats' ? (
            <ul className="flex-1 overflow-y-auto" aria-label="Conversations">
              {conversations === null && <li className="p-6 text-sm text-gray-500 text-center">Loading…</li>}
              {conversations && visible.length === 0 && (
                <li className="p-6 text-sm text-gray-500 text-center">
                  {query ? 'No chats match your search.' : 'No chats yet. Start one with the pencil button above.'}
                </li>
              )}
              {visible.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => select(c.id)}
                    aria-current={c.id === selectedId ? 'true' : undefined}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${c.id === selectedId ? 'bg-orange-50' : ''}`}
                  >
                    <Avatar c={c} />
                    <span className="flex-1 min-w-0">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="font-medium text-gray-800 truncate">{c.name}</span>
                        {c.last_message && (
                          <span className={`text-xs flex-shrink-0 ${c.unread_count ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                            {formatListTime(c.last_message.created_at)}
                          </span>
                        )}
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <span className={`text-sm truncate ${c.typing.length ? 'text-orange-600' : 'text-gray-600'}`}>{preview(c)}</span>
                        {c.unread_count > 0 && (
                          <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center flex-shrink-0" aria-label={`${c.unread_count} unread`}>
                            {c.unread_count}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {communities === null && <p className="text-sm text-gray-500 text-center">Loading…</p>}
              {communities?.length === 0 && (
                <p className="text-sm text-gray-500 text-center p-4">
                  {isStaff ? 'No communities yet. Create one from the pencil button above.' : 'You are not in any communities yet.'}
                </p>
              )}
              {communities?.map((co) => (
                <article key={co.id} className="rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50">
                    <h2 className="font-medium text-gray-800">{co.name}</h2>
                    {co.description && <p className="text-xs text-gray-600 mt-0.5">{co.description}</p>}
                  </div>
                  <ul className="divide-y divide-gray-100">
                    <li>
                      <button type="button" onClick={() => { setTab('chats'); select(co.announcement_conversation_id); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50">
                        <MegaphoneIcon className="h-5 w-5 text-orange-500" />
                        <span className="text-sm text-gray-800">Announcements</span>
                      </button>
                    </li>
                    {co.groups.map((g) => (
                      <li key={g.id} className="flex items-center gap-3 px-4 py-2.5">
                        <UserGroupIcon className="h-5 w-5 text-gray-500" />
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm text-gray-800 truncate">{g.name}</span>
                          <span className="block text-xs text-gray-500">{g.member_count} members{g.kind === 'class' ? ' · class' : ''}</span>
                        </span>
                        {g.is_member ? (
                          <button type="button" onClick={() => { setTab('chats'); select(g.id); }} className="text-xs text-orange-600 hover:text-orange-700">
                            Open
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500">Ask an admin to join</span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
                    {co.my_role === 'admin' ? (
                      <button type="button" onClick={() => setAddingTo(co)} className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700">
                        <PlusIcon className="h-4 w-4" /> Add a group
                      </button>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm(`Leave ${co.name}?`)) return;
                        try {
                          await chatAPI.leaveCommunity(co.id, user.apiId);
                          loadCommunities();
                          loadConversations();
                        } catch (err) {
                          setError(apiError(err, 'Could not leave the community'));
                        }
                      }}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Leave
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Right: open conversation */}
        {selectedId ? (
          <ConversationView
            key={selectedId}
            conversationId={selectedId}
            meId={user.apiId}
            onBack={() => select(null)}
            onLeft={() => {
              select(null);
              loadConversations();
            }}
            onActivity={loadConversations}
          />
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-8 text-gray-500">
            <ChatBubbleLeftRightIcon className="h-14 w-14 text-orange-300 mb-4" />
            <p className="text-lg text-gray-700">Your messages</p>
            <p className="text-sm mt-1 max-w-sm">Chat with classmates and teachers, share files, and follow your class and community announcements.</p>
          </div>
        )}
      </main>

      {creating && <NewChatModal mode={creating} onClose={() => setCreating(null)} onCreated={created} />}
      {addingTo && (
        <AddGroupModal
          community={addingTo}
          conversations={(conversations ?? []).filter((c) => (c.kind === 'group' || c.kind === 'class') && c.my_role === 'admin' && !c.community_id)}
          onClose={() => setAddingTo(null)}
          onAdded={() => {
            setAddingTo(null);
            loadCommunities();
            loadConversations();
          }}
        />
      )}
    </div>
  );
};

const AddGroupModal = ({
  community,
  conversations,
  onClose,
  onAdded,
}: {
  community: CommunitySummary;
  conversations: ConversationSummary[];
  onClose: () => void;
  onAdded: () => void;
}) => {
  const [error, setError] = useState('');
  return (
    <Modal title={`Add a group to ${community.name}`} onClose={onClose}>
      {error && <p role="alert" className="text-sm text-red-600 mb-3">{error}</p>}
      {conversations.length === 0 ? (
        <p className="text-sm text-gray-600">You can add groups and class chats you are an admin of that are not already in a community.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {conversations.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-gray-800">
                {c.name} <span className="text-xs text-gray-500">· {c.member_count} members</span>
              </span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await chatAPI.addGroupToCommunity(community.id, c.id);
                    onAdded();
                  } catch (err) {
                    setError(apiError(err, 'Could not add the group'));
                  }
                }}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default Chat;
