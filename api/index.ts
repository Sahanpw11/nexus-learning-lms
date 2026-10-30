// Vercel serverless entry for the API; vercel.json rewrites /api/* here.
// The schema is created by `npm run migrate` during the build, not per cold start.
import { createApp } from '../backend/src/app';

export default createApp();
