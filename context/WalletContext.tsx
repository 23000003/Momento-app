import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import * as Linking from "expo-linking";
import bs58 from "bs58";
import nacl from "tweetnacl";
import React, { useEffect, useState, createContext } from "react";
import { decryptPayload } from "@/utils/payloadCrypt";
import { SolanaConfig } from "@/config/solana";

type WalletContextType = { 
    phantomWalletPublicKey: PublicKey | null,
    submitting: boolean,
    sharedSecret: Uint8Array<ArrayBufferLike> | undefined,
    session: string | null,
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export default function WalletProvider({ children } : React.PropsWithChildren<{}>) {
    
    const [phantomWalletPublicKey, setPhantomWalletPublicKey] =
        useState<PublicKey | null>(null);
    
      const [submitting, setSubmitting] = useState(false);
    
      const [sharedSecret, setSharedSecret] = useState<Uint8Array<ArrayBufferLike> | undefined>();

      const [session, setSession] = useState<string | null>(null);
    
      const [deepLink, setDeepLink] = useState<string | null>(null);
    
      // On app start up, listen for a "url" event
      useEffect(() => {
        const listenURL = Linking.addEventListener("url", handleDeepLink);
        return () => {
          listenURL.remove();
        };
      }, [])
    
      // On app start up, check if we were opened by an inbound deeplink. If so, track the intial URL
      // Then, listen for a "url" event
      useEffect(() => {
        const initializeDeeplinks = async () => {
          const initialUrl = await Linking.getInitialURL();
          if (initialUrl) {
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
          const sharedSecretDapp = nacl.box.before(
            bs58.decode(params.get("phantom_encryption_public_key")!),
            SolanaConfig.dappKeyPair.secretKey
          );
          const connectData = decryptPayload(
            params.get("data")!,
            params.get("nonce")!,
            sharedSecretDapp
          );
          setSharedSecret(sharedSecretDapp);
          setSession(connectData.session);
          setPhantomWalletPublicKey(new PublicKey(connectData.public_key));
          console.log(`connected to ${connectData.public_key.toString()}`);
        }
    
      }, [deepLink]); 
    
      const handleDeepLink = ({ url }: Linking.EventType) => {
        setDeepLink(url);
      };

    return (
        <WalletContext.Provider value={{ phantomWalletPublicKey, submitting, sharedSecret, session }}>
            {children}
        </WalletContext.Provider>
    );
    
}
