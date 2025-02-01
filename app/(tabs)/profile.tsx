import ConnectWalletComponent from "@/components/tabs/ConnectWallet";
import { useWalletContext } from "@/context/PhantomWalletContext";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { usePathname } from "expo-router";

export default function Profile() {
  const router = useRouter();

  const navigateToRoot = () => {
    router.push("/");
  };

  const pathname = usePathname();
  console.log(pathname, "HERE");

  const { phantomWalletPublicKey } = useWalletContext();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>798144ww</Text>
      {phantomWalletPublicKey ? (
        <>
          <Text style={styles.text}>
            Wallet: {phantomWalletPublicKey?.toBase58()}
          </Text>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#3b82f6" : "#2563eb",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              },
            ]}
            onPress={navigateToRoot}
          >
            <Text>Back to Index</Text>
          </Pressable>
        </>
      ) : null}
      <ConnectWalletComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
