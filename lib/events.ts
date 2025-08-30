"use client";

export type AppEvent =
  | { type: "products/changed" }
  | { type: "categories/changed" }
  | { type: "team-categories/changed" }
  | { type: "team-members/changed" }
  | { type: "location-categories/changed" }
  | { type: "locations/changed" };

const CHANNEL_NAME = "nagabalm-events";

export function postAppEvent(event: AppEvent) {
  try {
    const bc = new BroadcastChannel(CHANNEL_NAME);
    bc.postMessage(event);
    bc.close();
  } catch {}
}

export function subscribeAppEvents(onEvent: (event: AppEvent) => void) {
  try {
    const bc = new BroadcastChannel(CHANNEL_NAME);
    const handler = (e: MessageEvent<AppEvent>) => onEvent(e.data);
    bc.addEventListener("message", handler as any);
    return () => {
      try {
        bc.removeEventListener("message", handler as any);
      } catch {}
      try {
        bc.close();
      } catch {}
    };
  } catch {
    return () => {};
  }
}
