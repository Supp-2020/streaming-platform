"use client";
import { useEffect, useState } from "react";
import { useStore } from "./store";

/** Rehydrates the persisted store on the client and returns true once done (avoids SSR mismatch). */
export function useHydrated() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    Promise.resolve(useStore.persist.rehydrate()).then(() => setOk(true));
  }, []);
  return ok;
}
