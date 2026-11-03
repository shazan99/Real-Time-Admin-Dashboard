// clevertap-web-sdk ships without type definitions; this covers the parts the app uses
declare module "clevertap-web-sdk" {
  type Queue<T> = { push: (...items: T[]) => void };

  interface CleverTap {
    spa: boolean;
    init: (accountId: string, region?: string, targetDomain?: string, token?: string) => void;
    setLogLevel: (level: 0 | 1 | 2 | 3) => void;
    privacy: Queue<Record<string, boolean>>;
    onUserLogin: Queue<{ Site: Record<string, unknown> }>;
    profile: Queue<{ Site: Record<string, unknown> }>;
    event: { push: (name: string, properties?: Record<string, unknown>) => void };
    notifications: Queue<Record<string, unknown>>;
    renderNotificationViewed: (detail: unknown) => void;
    renderNotificationClicked: (detail: unknown) => void;
    getCleverTapID: () => string;
    logout: () => void;
    clear: () => void;
  }

  const clevertap: CleverTap;
  export default clevertap;
}
