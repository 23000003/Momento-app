import { WalletProvider } from "@/context/PhantomWalletContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <WalletProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </WalletProvider>
  );
}
