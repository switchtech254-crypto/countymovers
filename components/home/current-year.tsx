"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Renders 2026 on the server and swaps to the real year on the client, with no hydration mismatch. */
export function CurrentYear() {
  const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => 2026);
  return <>{year}</>;
}