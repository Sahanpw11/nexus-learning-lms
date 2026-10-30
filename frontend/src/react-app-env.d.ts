/// <reference types="react-scripts" />
declare module '*.otf' {
  const url: string;
  export default url;
}

// Google Identity Services (loaded from accounts.google.com/gsi/client in index.html); only what the app uses.
interface GoogleCredentialResponse {
  credential: string;
}
interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (options: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
        renderButton: (parent: HTMLElement, options: Record<string, string | number>) => void;
        disableAutoSelect: () => void;
      };
    };
  };
}
