import React, { useState } from 'react';
import { chatAPI } from '../../services/api';
import ContactPicker from './ContactPicker';
import Modal from './Modal';
import { apiError } from './utils';

type Mode = 'direct' | 'group' | 'community';

// One dialog for starting a direct chat, creating a group, or (staff only) creating a community.
const NewChatModal = ({
  mode,
  onClose,
  onCreated,
}: {
  mode: Mode;
  onClose: () => void;
  onCreated: (conversationId: number | null) => void;
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const title = mode === 'direct' ? 'New chat' : mode === 'group' ? 'New group' : 'New community';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'direct' && selected.length !== 1) return setError('Choose someone to chat with');
    if (mode !== 'direct' && !name.trim()) return setError('Give it a name');
    setSaving(true);
    try {
      if (mode === 'direct') onCreated((await chatAPI.startDirect(selected[0])).data.id);
      else if (mode === 'group') {
        onCreated((await chatAPI.createGroup({ name: name.trim(), description: description.trim() || undefined, member_ids: selected })).data.id);
      } else {
        await chatAPI.createCommunity({ name: name.trim(), description: description.trim() || undefined });
        onCreated(null);
      }
    } catch (err) {
      setError(apiError(err, 'Something went wrong'));
      setSaving(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {error && <p role="alert" className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        {mode !== 'direct' && (
          <>
            <div>
              <label htmlFor="chat-name" className="block text-xs font-medium text-gray-600 mb-1.5">
                {mode === 'group' ? 'Group name' : 'Community name'}
              </label>
              <input
                id="chat-name"
                value={name}
                maxLength={100}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label htmlFor="chat-description" className="block text-xs font-medium text-gray-600 mb-1.5">
                Description (optional)
              </label>
              <textarea
                id="chat-description"
                value={description}
                maxLength={500}
                rows={2}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>
          </>
        )}
        {mode === 'community' ? (
          <p className="text-sm text-gray-600">
            A community gets an Announcements channel only its admins can post in. Add your groups and class chats to it after creating it.
          </p>
        ) : (
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1.5">{mode === 'direct' ? 'Message' : 'Add members'}</p>
            <ContactPicker multiple={mode === 'group'} selected={selected} onChange={setSelected} />
          </div>
        )}
        <button type="submit" disabled={saving} className="btn-primary w-full py-3 rounded-xl text-sm font-medium text-white disabled:opacity-50">
          {saving ? 'Working…' : mode === 'direct' ? 'Start chat' : 'Create'}
        </button>
      </form>
    </Modal>
  );
};

export default NewChatModal;
