import React, { useEffect, useState } from 'react';
import { chatAPI } from '../../services/api';
import type { ChatMessage, MessageReceipt } from '../../../../shared/types';
import Modal from './Modal';
import { apiError, formatListTime, formatTime, initials } from './utils';

// "today 10:42", "yesterday 18:05", "12 Oct 09:30"
const when = (iso: string | null) => {
  if (!iso) return '';
  const day = formatListTime(iso);
  return `${day.includes(':') ? 'today' : day.toLowerCase() === 'yesterday' ? 'yesterday' : day} ${formatTime(iso)}`;
};

// "Message info": who has received and read one of your messages, and when.
const ReceiptsModal = ({ message, onClose }: { message: ChatMessage; onClose: () => void }) => {
  const [receipts, setReceipts] = useState<MessageReceipt[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    chatAPI
      .receipts(message.id)
      .then(({ data }) => setReceipts(data))
      .catch((e) => setError(apiError(e, 'Could not load message info')));
  }, [message.id]);

  return (
    <Modal title="Message info" onClose={onClose}>
      <p className="text-sm text-orange-950 bg-orange-50 rounded-lg px-3 py-2 mb-4 break-words">
        {message.body ?? message.attachment?.name ?? 'Message'}
      </p>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {!receipts && !error && <p className="text-sm text-gray-500">Loading…</p>}
      <ul className="divide-y divide-gray-100" aria-label="Recipients">
        {receipts?.map((r) => (
          <li key={r.user_id} className="flex items-center gap-3 py-2.5">
            <span className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 text-xs font-medium flex items-center justify-center flex-shrink-0" aria-hidden="true">
              {initials(r.full_name)}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm text-gray-800 truncate">{r.full_name}</span>
              <span className="block text-xs text-gray-600">
                {r.read ? (
                  <span className="text-sky-600">Read {when(r.read_at)}</span>
                ) : r.delivered ? (
                  <>Delivered {when(r.delivered_at)}</>
                ) : (
                  'Not delivered yet'
                )}
                {r.read && r.delivered_at && <span className="text-gray-500"> · delivered {when(r.delivered_at)}</span>}
              </span>
            </span>
            <span className={r.read ? 'text-sky-500' : 'text-gray-500'} aria-hidden="true">
              {r.read || r.delivered ? '✓✓' : '✓'}
            </span>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default ReceiptsModal;
