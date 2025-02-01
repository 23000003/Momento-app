import { Text, View } from "react-native";
import { Link } from "expo-router";
import { useWalletContext } from "@/context/PhantomWalletContext";
import TestSendSol from "@/components/TestSendSol";
import TestClaimToken from "@/components/TestClaimToken";
import TestMintNFT from "@/components/TestMintNFT";
export default function Index() {
  const {
    phantomWalletPublicKey,
    session,
    setSubmitting,
    sharedSecret,
    transacMessage,
  } = useWalletContext();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit thi5s screen.</Text>
      <Link href="/profile">Go to Profile Tab</Link>
      {phantomWalletPublicKey ? (
        <>
          <Text>Wallet: {phantomWalletPublicKey.toBase58()}</Text>
          <TestSendSol
            {...{
              phantomWalletPublicKey,
              session,
              setSubmitting,
              sharedSecret,
              transacMessage,
            }}
          />
          <TestClaimToken
            {...{
              phantomWalletPublicKey,
              session,
              setSubmitting,
              sharedSecret,
              transacMessage,
            }}
          />
          {transacMessage && <Text>{transacMessage}</Text>}
        </>
      ) : null}
      <TestMintNFT
        {...{
          phantomWalletPublicKey,
          session,
          setSubmitting,
          sharedSecret,
          transacMessage,
        }}
      />
    </View>
  );
}
