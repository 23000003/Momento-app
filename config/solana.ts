import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import nacl from "tweetnacl";
import {
    clusterApiUrl,
    Connection,
} from "@solana/web3.js";
import * as Linking from "expo-linking";

export const SolanaConfig = {
    dappKeyPair: nacl.box.keyPair(),
    connection: new Connection(clusterApiUrl("devnet")),
    onConnectRedirectLink: Linking.createURL("onConnect"),
    onDisconnectRedirectLink: Linking.createURL("onDisconnect"),
    onSignAndSendTransactionRedirectLink: Linking.createURL("onSignAndSendTransaction"),
    naclHelper: nacl,
}