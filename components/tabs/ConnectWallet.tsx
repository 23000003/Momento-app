import { Pressable, Text } from "react-native";
import { SolanaBlockchainService } from "@/services/solana.service";
import { useState } from "react";

export default function ConnectWalletComponent() {
  const [connectMessage, setConnectMessage] = useState<string | null>(null);

  console.log(connectMessage); //eslint

  const ConnectWalletOnClick = async () => {
    const message = await SolanaBlockchainService.connectWallet();
    setConnectMessage(message);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? "#3b82f6" : "#2563eb",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 8,
        },
      ]}
      onPress={ConnectWalletOnClick}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>
        Connect Wallet w
      </Text>
    </Pressable>
  );
}
