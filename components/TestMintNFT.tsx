import { 
    View, 
    Text, 
    Pressable, 
    Alert, 
    StyleSheet, 
    Image 
} from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { WalletNotConnectedError } from "@/utils/exception.util";
import { SolanaBlockchainService } from "@/services/solana.service";
import { WalletContextType } from '@/types/interface/WalletInterface';

export default function TestMintNFT(props: WalletContextType) {

    const { 
        phantomWalletPublicKey, 
        session, 
        setSubmitting, 
        sharedSecret,
        transacMessage
    } = props;

    const [image, setImage] = useState<string>('');

    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            console.log(result.assets[0].uri);
        }
    };

    const testMintNFT = async () => {
        // if(!phantomWalletPublicKey) throw new WalletNotConnectedError();
    
        const propsMintNFT = {
          image,
          phantomWalletPublicKey,
          session,
          amount: 1,
          setSubmitting,
          sharedSecret
        }
    
        await SolanaBlockchainService.mintNFT(
          propsMintNFT
        )
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
                        marginBottom: 16,
                    },
                ]}
                onPress={pickImage}
            >
                <Text>Pick an Image</Text>
            </Pressable>
            <Pressable
                style={({ pressed }) => [
                {
                    backgroundColor: pressed ? '#3b82f6' : '#2563eb',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                },
                ]}
                onPress={testMintNFT}
            >
                <Text>Mint NFT52</Text>
            </Pressable>
            {image && (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: image }}
                        style={styles.image}
                    />
                    <Text style={styles.imageText}>Selected Image</Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginBottom: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    imageContainer: {
        marginVertical: 16,
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    imageText: {
        fontSize: 16,
        color: '#333',
    },
});