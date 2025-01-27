import {
    transact,
    Web3MobileWallet,
} from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { Pressable, Text } from "react-native";


async function connectWallet() {
    try{
        const result = await transact(async (wallet: Web3MobileWallet) => {
            const authResult = await wallet.authorize({
              chain: 'solana:devnet',
              identity: {
                name: 'Momento',
                uri:  'http://localhost:8081',
                icon: "favicon.ico",
              },
            });
            return authResult;
        });
        return result;
    }catch(e){
        console.error(e);
    }
}


export default function ConnectWalletComponent() {
  
    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? '#3b82f6' : '#2563eb',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          },
        ]}
        onPress={connectWallet}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Connect Wallet
        </Text>
      </Pressable>
    );
}
