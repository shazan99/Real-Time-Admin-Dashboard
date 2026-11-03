import clevertap from "clevertap-web-sdk";

// CleverTap project this app reports to. Override per environment with
// VITE_CLEVERTAP_ACCOUNT_ID / VITE_CLEVERTAP_REGION in a .env file.
// Region must match the dashboard URL (e.g. in1.dashboard.clevertap.com -> "in1",
// eu1.dashboard.clevertap.com -> leave empty, the SDK defaults to eu1).
const ACCOUNT_ID = import.meta.env.VITE_CLEVERTAP_ACCOUNT_ID || "W84-4WR-565Z";
const REGION = import.meta.env.VITE_CLEVERTAP_REGION || "";

// id of the header element that opens the CleverTap Web Inbox; use this same
// value as the "Inbox selector" when configuring Web Inbox in the dashboard
export const CT_INBOX_SELECTOR = "ct-web-inbox";

// id of the Home page container for Web Native Display (banner/carousel) campaigns
export const CT_NATIVE_DISPLAY_DIV = "ct-native-display-home";

let initialized = false;

export const initCleverTap = () => {
  if (initialized) return;
  initialized = true;

  clevertap.privacy.push({ optOut: false });
  clevertap.privacy.push({ useIP: false });
  // SPA mode: tracks route changes as page views and dismisses popups on navigation
  clevertap.spa = true;
  clevertap.init(ACCOUNT_ID, REGION);
  // 3 = verbose logs in the browser console, handy while testing campaigns
  clevertap.setLogLevel(import.meta.env.DEV ? 3 : 1);

  // Key-value / JSON Web Native Display campaigns are delivered as DOM events;
  // banner and carousel templates render into CT_NATIVE_DISPLAY_DIV on their own
  document.addEventListener("CT_web_native_display", (event) => {
    const data = (event as CustomEvent).detail;
    console.info("[CleverTap] web native display (kv)", data);
    clevertap.renderNotificationViewed(data);
  });
  document.addEventListener("CT_web_native_display_json", (event) => {
    const data = (event as CustomEvent).detail;
    console.info("[CleverTap] web native display (json)", data);
    clevertap.renderNotificationViewed(data);
  });
};

type CleverTapUser = {
  id?: string | number;
  name?: string;
  email?: string;
  phone?: string | null;
  jobTitle?: string | null;
  timezone?: string | null;
  avatarUrl?: string | null;
};

// getIdentity runs on most page loads; only send the full profile once per session
let lastProfileSent = "";

// Identifies the user so their profile and events are tied together in the dashboard
export const clevertapLogin = (user: CleverTapUser) => {
  if (!user.email) return;

  const fingerprint = JSON.stringify(user);
  if (fingerprint === lastProfileSent) return;
  lastProfileSent = fingerprint;

  const site: Record<string, unknown> = {
    Identity: user.email,
    Email: user.email,
    "MSG-email": true,
    "MSG-push": true,
  };
  if (user.name) site.Name = user.name;
  if (user.phone) site.Phone = user.phone;
  if (user.avatarUrl) site.Photo = user.avatarUrl;
  if (user.id !== undefined) site["User ID"] = String(user.id);
  if (user.jobTitle) site["Job Title"] = user.jobTitle;
  if (user.timezone) site.Timezone = user.timezone;

  clevertap.onUserLogin.push({ Site: site });
};

export const clevertapLogout = () => {
  lastProfileSent = "";
  clevertap.event.push("Logged Out");
  // the next onUserLogin starts a fresh profile instead of merging into this one
  clevertap.logout();
};

export const clevertapEvent = (
  name: string,
  properties?: Record<string, string | number | boolean | Date>,
) => {
  if (properties) {
    clevertap.event.push(name, properties);
  } else {
    clevertap.event.push(name);
  }
};

// Shows the web push soft prompt. It only appears once Web Push and the soft prompt
// are enabled in the dashboard, and is suppressed for a week after the user declines.
export const clevertapAskForPush = () => {
  clevertap.notifications.push({
    titleText: "Would you like to receive Push Notifications?",
    bodyText:
      "We promise to only send you relevant content and give you updates on your deals and tasks",
    okButtonText: "Sign me up!",
    rejectButtonText: "No thanks",
    okButtonColor: "#1677ff",
    serviceWorkerPath: "/clevertap_sw.js",
  });
};

export default clevertap;
