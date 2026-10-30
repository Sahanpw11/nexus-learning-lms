import React, { useEffect, useMemo, useState } from 'react';
import { chatAPI } from '../../services/api';
import type { ChatContact } from '../../../../shared/types';
import { apiError, initials } from './utils';

interface Props {
  multiple: boolean;
  selected: number[];
  onChange: (ids: number[]) => void;
  exclude?: number[];
}

// Lists only people the API says this user may message (classmates/teachers, or everyone for staff).
const ContactPicker = ({ multiple, selected, onChange, exclude = [] }: Props) => {
  const [contacts, setContacts] = useState<ChatContact[] | null>(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    chatAPI
      .contacts()
      .then(({ data }) => setContacts(data))
      .catch((e) => setError(apiError(e, 'Could not load contacts')));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (contacts ?? []).filter(
      (c) => !exclude.includes(c.id) && (!q || c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)),
    );
  }, [contacts, query, exclude]);

  const toggle = (id: number) => {
    if (!multiple) return onChange([id]);
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

  if (error) return <p role="alert" className="text-sm text-red-600">{error}</p>;
  if (!contacts) return <p className="text-sm text-gray-500">Loading contacts…</p>;

  return (
    <div>
      <label htmlFor="contact-search" className="sr-only">Search people</label>
      <input
        id="contact-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or email"
        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-orange-500"
      />
      <ul className="mt-3 max-h-64 overflow-y-auto divide-y divide-gray-100" aria-label="People">
        {visible.length === 0 && <li className="py-6 text-center text-sm text-gray-500">No one to show. Students can message classmates and their teachers.</li>}
        {visible.map((c) => {
          const checked = selected.includes(c.id);
          return (
            <li key={c.id}>
              <label className="flex items-center gap-3 py-2.5 px-1 cursor-pointer hover:bg-gray-50 rounded-lg">
                <input
                  type={multiple ? 'checkbox' : 'radio'}
                  name="contact"
                  checked={checked}
                  onChange={() => toggle(c.id)}
                  className="accent-orange-500"
                />
                <span className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 text-xs font-medium flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  {initials(c.full_name)}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-gray-800 truncate">{c.full_name}</span>
                  <span className="block text-xs text-gray-500 truncate capitalize">{c.role} · {c.email}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ContactPicker;
