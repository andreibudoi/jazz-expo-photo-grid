import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "jazz-tools/expo/polyfills";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AccountProvider } from "@/jazz/account-provider";
import { JazzProvider } from "@/jazz/jazz-provider";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <JazzProvider>
      <AccountProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AccountProvider>
    </JazzProvider>
  );
}
