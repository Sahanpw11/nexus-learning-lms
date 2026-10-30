import React, { useState } from 'react';
import { UserPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { chatAPI } from '../../services/api';
import type { ConversationDetail, Presence } from '../../../../shared/types';
import ContactPicker from './ContactPicker';
import Modal from './Modal';
import { apiError, initials, presenceLabel } from './utils';

interface Props {
  conversation: ConversationDetail;
  meId: number;
  presence: Presence[];
  onChanged: (updated: ConversationDetail | null) => void; // null: I left
  onClose: () => void;
}

const kindLabel = { direct: 'Direct message', group: 'Group', class: 'Class chat', announcement: 'Community announcements' };

const ConversationInfo = ({ conversation, meId, presence, onChanged, onClose }: Props) => {
  const [adding, setAdding] = useState(false);
  const [toAdd, setToAdd] = useState<number[]>([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(conversation.name);
  const [description, setDescription] = useState(conversation.description ?? '');
  const [error, setError] = useState('');

  const isGroup = conversation.kind === 'group';
  const isAdmin = conversation.my_role === 'admin';

  const run = async (action: () => Promise<ConversationDetail | null>) => {
    setError('');
    try {
      onChanged(await action());
      return true;
    } catch (err) {
      setError(apiError(err, 'That did not work'));
      return false;
    }
  };

  return (
    <aside className="w-full md:w-80 border-l border-gray-200 bg-white flex flex-col" aria-label="Conversation details">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="font-medium text-gray-800">Details</h2>
        <button type="button" onClick={onClose} className="p-1 rounded-lg text-gray-500 hover:bg-gray-100" aria-label="Close details">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {error && <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <section>
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">{kindLabel[conversation.kind]}</p>
          {editing ? (
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                run(async () => (await chatAPI.updateGroup(conversation.id, { name: name.trim(), description: description.trim() || null })).data).then((ok) => ok && setEditing(false));
              }}
            >
              <label htmlFor="group-name" className="sr-only">Group name</label>
              <input id="group-name" value={name} maxLength={100} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm" />
              <label htmlFor="group-description" className="sr-only">Description</label>
              <textarea id="group-description" value={description} maxLength={500} rows={2} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm resize-none" />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary px-3 py-1.5 rounded-lg text-sm text-white">Save</button>
                <button type="button" onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-800 break-words">{conversation.name}</h3>
              {conversation.description && <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{conversation.description}</p>}
              {conversation.community_name && <p className="text-xs text-gray-500 mt-2">Part of the {conversation.community_name} community</p>}
              {isGroup && isAdmin && (
                <button type="button" onClick={() => setEditing(true)} className="mt-2 text-sm text-orange-600 hover:text-orange-700">
                  Edit name and description
                </button>
              )}
            </>
          )}
          {conversation.kind === 'class' && <p className="text-xs text-gray-500 mt-2">Members follow class enrollment.</p>}
        </section>

        <section>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">{conversation.member_count} members</h3>
            {isGroup && isAdmin && (
              <button type="button" onClick={() => setAdding(true)} className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700">
                <UserPlusIcon className="h-4 w-4" /> Add
              </button>
            )}
          </div>
          <ul className="space-y-1">
            {conversation.members.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-1.5">
                <span className="relative w-8 h-8 rounded-full bg-orange-100 text-orange-700 text-xs font-medium flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  {initials(m.full_name)}
                  {presence.find((p) => p.user_id === m.id)?.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm text-gray-800 truncate">
                    {m.full_name}
                    {m.id === meId && ' (you)'}
                  </span>
                  <span className="block text-xs text-gray-500">
                    <span className="capitalize">{m.role}</span>
                    {m.member_role === 'admin' && conversation.kind !== 'direct' && ' · admin'}
                    {m.id !== meId && presenceLabel(presence.find((p) => p.user_id === m.id)) && ` · ${presenceLabel(presence.find((p) => p.user_id === m.id))}`}
                  </span>
                </span>
                {isGroup && isAdmin && m.id !== meId && (
                  <span className="flex flex-col items-end text-xs">
                    <button
                      type="button"
                      onClick={() => run(async () => (await chatAPI.setMemberRole(conversation.id, m.id, m.member_role === 'admin' ? 'member' : 'admin')).data)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {m.member_role === 'admin' ? 'Remove admin' : 'Make admin'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        run(async () => {
                          await chatAPI.removeMember(conversation.id, m.id);
                          return (await chatAPI.conversation(conversation.id)).data;
                        })
                      }
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        {isGroup && (
          <button
            type="button"
            onClick={() =>
              run(async () => {
                await chatAPI.removeMember(conversation.id, meId);
                return null;
              })
            }
            className="w-full py-2 rounded-xl text-sm text-red-600 border border-red-200 hover:bg-red-50"
          >
            Leave group
          </button>
        )}
      </div>

      {adding && (
        <Modal title="Add members" onClose={() => setAdding(false)}>
          <div className="space-y-4">
            <ContactPicker multiple selected={toAdd} onChange={setToAdd} exclude={conversation.members.map((m) => m.id)} />
            <button
              type="button"
              disabled={toAdd.length === 0}
              onClick={() =>
                run(async () => (await chatAPI.addMembers(conversation.id, toAdd)).data).then((ok) => {
                  if (!ok) return;
                  setAdding(false);
                  setToAdd([]);
                })
              }
              className="btn-primary w-full py-3 rounded-xl text-sm font-medium text-white disabled:opacity-50"
            >
              Add {toAdd.length || ''}
            </button>
          </div>
        </Modal>
      )}
    </aside>
  );
};

export default ConversationInfo;
