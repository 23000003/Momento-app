import React, { 
  useEffect, 
  useState, 
  createContext, 
  useContext 
} from "react";
import { PublicKey } from "@solana/web3.js";
import * as Linking from "expo-linking";
import bs58 from "bs58";
import { decryptPayload } from "@/utils/payloadCrypt.util";
import { SolanaConfig } from "@/config/solana";
import { WalletContextType } from "@/types/interface/WalletInterface";
import { useRouter } from "expo-router";

const WalletContext = createContext<WalletContextType>({
    phantomWalletPublicKey: null,
    submitting: false,
    sharedSecret: undefined,
    session: null,
    transacMessage: null,
    setSubmitting: () => {},
});

export function WalletProvider({ 
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [phantomWalletPublicKey, setPhantomWalletPublicKey] =
        useState<PublicKey | null>(null);
    
    const [submitting, setSubmitting] = useState(false);
  
    const [sharedSecret, setSharedSecret] = useState<Uint8Array<ArrayBufferLike> | undefined>();

    const [session, setSession] = useState<string | null>(null);
  
    const [deepLink, setDeepLink] = useState<string | null>(null);

    const [transacMessage, setTransacMessage] = useState<string | null>(null);

    const router = useRouter();
    
    // On app start up, check if we were opened by an inbound deeplink. If so, track the intial URL
    // Then, listen for a "url" event
    useEffect(() => {
      const initializeDeeplinks = async () => {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          console.log(initialUrl)
          setDeepLink(initialUrl);
        }
      };
      initializeDeeplinks();
      const listener = Linking.addEventListener("url", handleDeepLink);
      return () => {
        listener.remove();
      };
    }, []);

    // Handle in-bound links
    useEffect(() => {
      setSubmitting(false);
      if (!deepLink) return;

      const url = new URL(deepLink);
      const params = url.searchParams;

      if (params.get("errorCode")) {
        const error = Object.fromEntries([...params]);
        const message =
          error?.errorMessage ??
          JSON.stringify(Object.fromEntries([...params]), null, 2);
        console.log("error: ", message);
        return;
      }

      if (/onConnect/.test(url.pathname)) {
        try{
          console.log("1");
          const sharedSecretDapp = SolanaConfig.naclHelper.box.before(
            bs58.decode(params.get("phantom_encryption_public_key")!),
            SolanaConfig.dappKeyPair.secretKey
          );
          console.log("2");
          const connectData = decryptPayload(
            params.get("data")!,
            params.get("nonce")!,
            sharedSecretDapp
          );

          console.log("3");
          setSharedSecret(sharedSecretDapp);
          setSession(connectData.session);
          console.log(connectData.session);
          setPhantomWalletPublicKey(new PublicKey(connectData.public_key));
          console.log(`connected to ${connectData.public_key.toString()}`);
          router.back();
        }
        catch(error){
          console.log(error, "HERE")
        }
      }

      if (/onDisconnect/.test(url.pathname)) {
        setPhantomWalletPublicKey(null);
        console.log("disconnected");
        router.back();
      }

      if (/onSignAndSendTransaction/.test(url.pathname)) {
        const signAndSendTransactionData = decryptPayload(
          params.get("data")!,
          params.get("nonce")!,
          sharedSecret
        );
        console.log("transaction submitted: ", signAndSendTransactionData);

        setTransacMessage(signAndSendTransactionData.signature)

        setTimeout(() => {
          setTransacMessage(null);
        }, 10000)

        router.back();
      }
    }, [deepLink]);
    
    const handleDeepLink = ({ url }: Linking.EventType) => {
      setDeepLink(url);
    };

    return (
        <WalletContext.Provider 
          value={{ 
            phantomWalletPublicKey, 
            submitting, 
            sharedSecret, 
            session, 
            transacMessage, 
            setSubmitting 
          }}
        >
            {children}
        </WalletContext.Provider>
    );
    
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  return context;
}