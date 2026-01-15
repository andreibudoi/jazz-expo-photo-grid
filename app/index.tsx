import { StyleSheet, Text } from "react-native";

import { FakeFolderGeneratorForm } from "@/components/fake-folder-generator-form";
import { FolderList } from "@/components/folder-list";
import { useAccountSelector } from "@/jazz/account-provider";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const account = useAccountSelector();
  return (
    <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
      <Text style={styles.header}>{account.$jazz.id}</Text>
      <FakeFolderGeneratorForm />
      <FolderList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    gap: 16,
  },
});
