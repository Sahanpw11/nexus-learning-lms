import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';

export interface Client {
  url: string;
  close: () => Promise<void>;
  request: (method: string, path: string, options?: { token?: string; body?: unknown }) => Promise<{ status: number; body: any }>;
}

// Imports are deferred so each test file can set its environment before config.ts reads it.
export async function startApi(): Promise<Client> {
  const { createApp } = await import('../src/app.js');
  const { initSchema, pool } = await import('../src/db.js');
  await initSchema();
  const server: Server = await new Promise((resolve) => {
    const s = createApp().listen(0, () => resolve(s));
  });
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

  return {
    url,
    close: async () => {
      await new Promise((resolve) => server.close(resolve));
      await pool.end();
    },
    request: async (method, path, { token, body } = {}) => {
      const response = await fetch(url + path, {
        method,
        headers: {
          ...(body !== undefined && { 'Content-Type': 'application/json' }),
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      return { status: response.status, body: await response.json() };
    },
  };
}
