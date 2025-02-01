
import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { WalletNotConnectedError } from "@/utils/exception.util";
import { SolanaBlockchainService } from "@/services/solana.service";
import { WalletContextType } from '@/types/interface/WalletInterface';

export default function TestClaimToken(props: WalletContextType) {
    const { 
        phantomWalletPublicKey, 
        session, 
        setSubmitting, 
        sharedSecret,
        transacMessage
    } = props;


    const testClaimToken = async () => {
        if(!phantomWalletPublicKey) throw new WalletNotConnectedError();
    
        const propsClaimToken = {
          phantomWalletPublicKey,
          session,
          amount: 1,
          setSubmitting,
          sharedSecret
        }
    
        await SolanaBlockchainService.claimMomentoToken(
          propsClaimToken
        );
    }

    return (
        <View>
            <Pressable
                style={({ pressed }) => [
                    {
                    backgroundColor: pressed ? '#3b82f6' : '#2563eb',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                    },
                ]}
                onPress={testClaimToken}
                >
                    <Text>Claim Token</Text>
            </Pressable>
        </View>
    )
}