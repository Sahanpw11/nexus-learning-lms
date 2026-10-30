import { OAuth2Client } from 'google-auth-library';
import { config } from './config';
import { HttpError } from './errors';

export interface GoogleIdentity {
  email: string;
  name: string;
}

let client: OAuth2Client | null = null;

// Checks the ID token's signature, audience and expiry against Google's published keys.
async function verifyGoogleIdToken(idToken: string): Promise<GoogleIdentity> {
  if (!config.googleClientId) throw new HttpError(503, 'Google sign-in is not configured');
  client ??= new OAuth2Client(config.googleClientId);
  let payload;
  try {
    payload = (await client.verifyIdToken({ idToken, audience: config.googleClientId })).getPayload();
  } catch {
    throw new HttpError(401, 'Invalid Google sign-in');
  }
  if (!payload?.email || !payload.email_verified) throw new HttpError(401, 'Google account email is not verified');
  return { email: payload.email.toLowerCase(), name: payload.name ?? payload.email.split('@')[0] };
}

// Routes call through this object so tests can stand in for Google without real tokens.
export const googleVerifier = { verify: verifyGoogleIdToken };
