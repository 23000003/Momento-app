import nacl from "tweetnacl";
import {
    clusterApiUrl,
    Connection,
} from "@solana/web3.js";
import * as Linking from "expo-linking";

class SolanaConfig {
    static dappKeyPair = nacl.box.keyPair();
    static connection = new Connection(clusterApiUrl("devnet"));
    static onConnectRedirectLink = Linking.createURL("onConnect");
    static onDisconnectRedirectLink = Linking.createURL("onDisconnect");
    static onSignAndSendTransactionRedirectLink = Linking.createURL("onSignAndSendTransaction");  
}

export { 
    SolanaConfig
};