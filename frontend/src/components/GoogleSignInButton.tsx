import React, { useEffect, useRef, useState } from 'react';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// Renders Google's own "Sign in with Google" button; the credential it returns is checked by the API.
const GoogleSignInButton = ({ onCredential }: { onCredential: (credential: string) => void }) => {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(Boolean(window.google));
  const callback = useRef(onCredential);
  callback.current = onCredential;

  useEffect(() => {
    if (ready) return;
    // The script tag in index.html loads async; wait for it instead of failing on a slow network.
    const timer = window.setInterval(() => {
      if (window.google) {
        setReady(true);
        window.clearInterval(timer);
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, [ready]);

  useEffect(() => {
    if (!ready || !clientId || !container.current || !window.google) return;
    container.current.replaceChildren(); // effects can run twice (StrictMode); never show two buttons
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => callback.current(response.credential),
    });
    window.google.accounts.id.renderButton(container.current, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: 'continue_with',
      width: container.current.offsetWidth || 320,
    });
  }, [ready]);

  if (!clientId) {
    return <p className="text-sm text-gray-500 text-center">Google sign-in is not configured.</p>;
  }
  return <div ref={container} className="w-full flex justify-center min-h-[44px]" />;
};

export default GoogleSignInButton;
