import { Transaction } from "@solana/web3.js";
import * as Linking from "expo-linking";
import bs58 from "bs58";
import { SolanaConfig } from "@/config/solana";
import { encryptPayload } from "@/utils/payloadCrypt.util";
import { buildUrl } from "@/types/constants/solana-url";
import { WalletContextType } from "@/types/interface/WalletInterface";
import { WalletNotConnectedError } from "@/utils/exception.util";

interface SignAndSendTransactionParams extends WalletContextType {
  transaction: Transaction;
}

interface DisconnectWalletParams {
  sharedSecret: Uint8Array<ArrayBufferLike>;
  session: string;
}

interface ClaimMomentoTokenParams extends WalletContextType {
  amount: number;
}

interface MintNFTParams extends WalletContextType {
  image: string | null;
}

export class SolanaBlockchainService {
  static connectWallet = async (): Promise<string> => {
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(
        SolanaConfig.dappKeyPair.publicKey
      ),
      cluster: "devnet",
      app_url: "http://localhost:8081",
      redirect_link: SolanaConfig.onConnectRedirectLink,
    });

    const url = buildUrl("connect", params);
    Linking.openURL(url);

    return "Connected";
  };
  static disconnectWallet = async ({
    sharedSecret,
    session,
  }: DisconnectWalletParams): Promise<string> => {
    const payload = { session };
    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(
        SolanaConfig.dappKeyPair.publicKey
      ),
      nonce: bs58.encode(nonce),
      redirect_link: SolanaConfig.onDisconnectRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });

    const url = buildUrl("disconnect", params);
    Linking.openURL(url);

    return "Disconnected";
  };
  static signAndSendTransaction = async ({
    phantomWalletPublicKey,
    transaction,
    session,
    setSubmitting,
    sharedSecret,
  }: SignAndSendTransactionParams): Promise<void> => {
    if (!phantomWalletPublicKey) throw new WalletNotConnectedError();

    setSubmitting(true);

    transaction.feePayer = phantomWalletPublicKey;
    transaction.recentBlockhash = (
      await SolanaConfig.connection.getLatestBlockhash()
    ).blockhash;

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
    });

    const payload = {
      session,
      transaction: bs58.encode(serializedTransaction),
    };

    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(
        SolanaConfig.dappKeyPair.publicKey
      ),
      nonce: bs58.encode(nonce),
      redirect_link: SolanaConfig.onSignAndSendTransactionRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });

    const url = buildUrl("signAndSendTransaction", params);

    Linking.openURL(url);
  };
  static claimMomentoToken = async ({
    phantomWalletPublicKey,
    session,
    setSubmitting,
    sharedSecret,
    amount,
  }: ClaimMomentoTokenParams): Promise<void> => {
    if (!phantomWalletPublicKey) throw new WalletNotConnectedError();

    setSubmitting(true);

    console.log("1");
    try {
      /**
       * will convert to axios
       */
      const res = await fetch("http://192.168.50.136:3000/solana/claim-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicKey: phantomWalletPublicKey.toBase58(),
          amount: amount,
        }),
      });

      const data = await res.json();
      console.log(data.instruction, "333");

      const transaction = Transaction.from(
        Buffer.from(data.instruction, "base64")
      );
      console.log("3.1");

      const payload = {
        session,
        transaction: bs58.encode(
          transaction.serialize({
            requireAllSignatures: false,
          })
        ),
      };
      console.log("4");
      const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);
      console.log("5");
      const params = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(
          SolanaConfig.dappKeyPair.publicKey
        ),
        nonce: bs58.encode(nonce),
        redirect_link: SolanaConfig.onSignAndSendTransactionRedirectLink,
        payload: bs58.encode(encryptedPayload),
      });

      const url = buildUrl("signAndSendTransaction", params);

      Linking.openURL(url);
    } catch (err) {
      console.log(err);
    }
  };

  static mintNFT = async ({
    image,
    phantomWalletPublicKey,
    session,
    setSubmitting,
    sharedSecret,
  }: MintNFTParams) => {
    if (!phantomWalletPublicKey) throw new WalletNotConnectedError();

    console.log("1");

    setSubmitting(true);

    /**
     * will convert to axios
     */
    const res = await fetch("http://192.168.50.136:3000/solana/mint-nft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicKey: phantomWalletPublicKey.toBase58(),
        image: image,
      }),
    });

    console.log(res);

    const data = await res.json();

    console.log(data.message);
  };
}
