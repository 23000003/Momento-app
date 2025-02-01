import { PublicKey } from "@solana/web3.js";

export interface WalletContextType { 
    phantomWalletPublicKey: PublicKey | null,
    submitting?: boolean,
    sharedSecret: Uint8Array<ArrayBufferLike> | undefined,
    session: string | null,
    transacMessage?: string | null,
    setSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
}