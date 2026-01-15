import { useState } from "react";
import { Platform } from "react-native";
import { JazzExpoProvider } from "jazz-tools/expo";
import { RNCrypto } from "jazz-tools/react-native-core/crypto/RNCrypto";

import { onAnonymousAccountDiscarded } from "@/jazz/actions";
import { AppAccount } from "@/jazz/schema";

export const DEFAULT_PROFILE_NAME = "Anonymous User";

export function JazzProvider({ children }: { children: React.ReactNode }) {
  const [authSecretStorageKey] = useState<string>(() => {
    if (Platform.OS === "ios") {
      const { Settings } = require("react-native");
      const stored = Settings.get("jazz-authSecretStorageKey") as string | null;
      if (stored) {
        return stored;
      }
      const newKey = "jazz-" + Date.now();
      Settings.set({ "jazz-authSecretStorageKey": newKey });
      return newKey;
    } else {
      // For non-iOS platforms, use a simple static key
      return "jazz-default-key";
    }
  });

  if (!authSecretStorageKey) {
    return null;
  }

  return (
    <JazzExpoProvider
      sync={{
        peer: "wss://cloud.jazz.tools/?key=andrei",
        when: "never",
      }}
      CryptoProvider={RNCrypto}
      AccountSchema={AppAccount}
      defaultProfileName={DEFAULT_PROFILE_NAME}
      onAnonymousAccountDiscarded={onAnonymousAccountDiscarded}
      authSecretStorageKey={authSecretStorageKey}
    >
      {children}
    </JazzExpoProvider>
  );
}
