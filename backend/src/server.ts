import { createApp } from './app';
import { config } from './config';
import { initSchema } from './db';

async function main() {
  // A database failure must stop startup rather than leave /health reporting healthy.
  await initSchema();
  createApp().listen(config.port, '0.0.0.0', () => {
    console.log(`Nexus Learning API listening on port ${config.port}`);
  });
}

main().catch((error) => {
  console.error('Failed to start API:', error);
  process.exit(1);
});
