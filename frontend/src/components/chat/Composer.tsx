import React, { useRef, useState } from 'react';
import { PaperAirplaneIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { ChatMessage, SendMessage } from '../../../../shared/types';
import { ALLOWED_TYPES, apiError, formatSize, uploadFile } from './utils';

interface Props {
  canPost: boolean;
  replyTo: ChatMessage | null;
  onCancelReply: () => void;
  onSend: (message: SendMessage) => Promise<void>;
  onTyping: (typing: boolean) => void;
}

// The server shows "typing" for 6s per signal, so refreshing every 3s keeps it on while the user types.
const TYPING_REFRESH_MS = 3000;

const Composer = ({ canPost, replyTo, onCancelReply, onSend, onTyping }: Props) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const lastTypingSignal = useRef(0);

  if (!canPost) {
    return <p className="px-6 py-4 text-sm text-center text-gray-500 border-t border-gray-200 bg-white">Only community admins can post announcements.</p>;
  }

  const send = async () => {
    const body = text.trim();
    if ((!body && !file) || sending) return;
    setSending(true);
    setError('');
    try {
      const attachment = file ? await uploadFile(file) : undefined;
      await onSend({ body: body || undefined, attachment, reply_to_id: replyTo?.id });
      setText('');
      setFile(null);
      lastTypingSignal.current = 0; // sending clears typing on the server
      onCancelReply();
    } catch (err) {
      setError(err instanceof Error && !('isAxiosError' in err) ? err.message : apiError(err, 'Message not sent. Try again.'));
    } finally {
      setSending(false);
    }
  };

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null;
    e.target.value = '';
    setError('');
    if (picked && !ALLOWED_TYPES.includes(picked.type)) return setError('That file type cannot be shared');
    setFile(picked);
  };

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-3">
      {error && <p role="alert" className="text-sm text-red-600 mb-2">{error}</p>}
      {replyTo && (
        <div className="flex items-start gap-2 mb-2 rounded-lg bg-gray-100 border-l-4 border-orange-400 px-3 py-2">
          <div className="flex-1 min-w-0 text-xs">
            <p className="font-medium text-gray-700">Replying to {replyTo.sender_name}</p>
            <p className="text-gray-600 truncate">{replyTo.body ?? replyTo.attachment?.name ?? ''}</p>
          </div>
          <button type="button" onClick={onCancelReply} className="p-1 text-gray-500 hover:text-gray-700" aria-label="Cancel reply">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      {file && (
        <div className="flex items-center gap-2 mb-2 rounded-lg bg-orange-50 px-3 py-2 text-sm">
          <PaperClipIcon className="h-4 w-4 text-orange-600" />
          <span className="flex-1 truncate text-orange-900">{file.name}</span>
          <span className="text-xs text-orange-800">{formatSize(file.size)}</span>
          <button type="button" onClick={() => setFile(null)} className="p-1 text-orange-800 hover:text-orange-950" aria-label="Remove attachment">
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex items-end gap-2">
        <input ref={fileInput} type="file" className="hidden" accept={ALLOWED_TYPES.join(',')} onChange={pickFile} />
        <button type="button" onClick={() => fileInput.current?.click()} className="p-2.5 rounded-full text-gray-500 hover:bg-gray-100" aria-label="Attach a file">
          <PaperClipIcon className="h-5 w-5" />
        </button>
        <label htmlFor="chat-message" className="sr-only">Message</label>
        <textarea
          id="chat-message"
          rows={1}
          value={text}
          maxLength={4000}
          onChange={(e) => {
            setText(e.target.value);
            const now = Date.now();
            if (!e.target.value.trim()) {
              if (lastTypingSignal.current) onTyping(false);
              lastTypingSignal.current = 0;
            } else if (now - lastTypingSignal.current > TYPING_REFRESH_MS) {
              lastTypingSignal.current = now;
              onTyping(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Type a message"
          className="flex-1 resize-none max-h-32 px-4 py-2.5 rounded-2xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500"
        />
        <button
          type="button"
          onClick={send}
          disabled={sending || (!text.trim() && !file)}
          className="p-2.5 rounded-full bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-40"
          aria-label={sending ? 'Sending' : 'Send message'}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Composer;
