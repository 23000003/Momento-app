import { View, Text, Pressable } from "react-native";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { WalletNotConnectedError } from "@/utils/exception.util";
import { SolanaBlockchainService } from "@/services/solana.service";
import { WalletContextType } from "@/types/interface/WalletInterface";

export default function TestSendSol(props: WalletContextType) {
  const {
    phantomWalletPublicKey,
    session,
    setSubmitting,
    sharedSecret,
    // transacMessage,
  } = props;

  const testSendSol = async () => {
    if (!phantomWalletPublicKey) throw new WalletNotConnectedError();

    const transferTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(phantomWalletPublicKey.toBase58()),
        toPubkey: new PublicKey("HjkykCuufyDkBwVNAFVRczTs6SysPWUeMJ8FNb7NGfY4"),
        lamports: LAMPORTS_PER_SOL * 0.5,
      })
    );

    const propsTransaction = {
      phantomWalletPublicKey,
      transaction: transferTransaction,
      session,
      setSubmitting,
      sharedSecret,
    };

    await SolanaBlockchainService.signAndSendTransaction(propsTransaction);
  };

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#3b82f6" : "#2563eb",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          },
        ]}
        onPress={testSendSol}
      >
        <Text>Send Sol</Text>
      </Pressable>
    </View>
  );
}
