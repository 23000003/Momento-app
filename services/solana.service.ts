import { 
    clusterApiUrl,
    Connection,
    PublicKey
} from '@solana/web3.js';
import * as Linking from 'expo-linking';
import bs58 from 'bs58';
import { SolanaConfig } from '@/config/solana'

export class SolanaBlockchainService {
    
    static ConnectWallet = async () : Promise<string> => {
        const params = new URLSearchParams({
            dapp_encryption_public_key: bs58.encode(SolanaConfig.dappKeyPair.publicKey),
            cluster: "devnet",
            app_url: "http://localhost:8081",
            redirect_link: SolanaConfig.onConnectRedirectLink,
        });
    
        const url = `https://phantom.app/ul/v1/connect?${params.toString()}`;
        Linking.openURL(url);

        return "Connected";
    }
    static DisconnectWallet = async () : Promise<string> => {

        return "HWA";
    }
    static SignAndSendTransaction = async () : Promise<string> => {

        return "HWA";
    }
}