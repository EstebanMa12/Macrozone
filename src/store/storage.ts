import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { StateStorage } from "zustand/middleware";

// During Expo's static web export the app is prerendered in a Node
// environment where `window`/`localStorage` do not exist. AsyncStorage's web
// implementation touches `window`, so we guard every call and no-op on the
// server to avoid `ReferenceError: window is not defined`.
const isServer = Platform.OS === "web" && typeof window === "undefined";

export const persistentStorage: StateStorage = {
  getItem: async (name) => {
    if (isServer) {
      return null;
    }
    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    if (isServer) {
      return;
    }
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      // Ignore write failures (e.g. storage unavailable).
    }
  },
  removeItem: async (name) => {
    if (isServer) {
      return;
    }
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      // Ignore removal failures.
    }
  },
};
