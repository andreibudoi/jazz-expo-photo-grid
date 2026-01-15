import type { LegendListRef } from "@legendapp/list";
import { LegendList } from "@legendapp/list";
import { useMemo, useRef } from "react";
import { Text, View } from "react-native";

import { useAccountSelector } from "@/jazz/account-provider";
import { FolderCard } from "./folder-card";

export function FolderList() {
  const me = useAccountSelector();
  const listRef = useRef<LegendListRef>(null);

  const sortedFolders = useMemo(
    () => me.root.folders.filter((folder) => !folder.isDeleted),
    [me.root.folders]
  );

  return (
    <View style={{ flex: 1 }}>
      {sortedFolders.length === 0 ? (
        <View>
          <Text>No folders yet</Text>
        </View>
      ) : (
        <LegendList
          maintainVisibleContentPosition={false}
          ref={listRef}
          data={sortedFolders}
          keyExtractor={(item) => item.$jazz.id}
          recycleItems
          style={{ flex: 1 }}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item }) => <FolderCard folder={item} />}
        />
      )}
    </View>
  );
}
