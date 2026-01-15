import { StyleSheet, Text, View } from "react-native";

import { EntryGridView } from "@/components/entry-grid-view";
import { FolderDeeplyResolved } from "@/jazz/schema";
import { useLocalSearchParams } from "expo-router";
import { useCoState } from "jazz-tools/expo";

export default function FolderScreen({ folderId }: { folderId: string }) {
  const { folderid } = useLocalSearchParams<{ folderid: string }>();
  const folder = useCoState(FolderDeeplyResolved, folderid);

  if (!folder.$isLoaded) {
    let message = "Loading...";
    switch (folder.$jazz.loadingState) {
      case "loading":
        message = "Loading...";
        break;
      case "unauthorized":
        message = "Folder not accessible";
        break;
      case "unavailable":
        message = "Folder not found";
        break;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.header}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <EntryGridView entries={Array.from(folder.entries.values())} />
    </View>
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
