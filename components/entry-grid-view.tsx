import { LegendList, type LegendListRenderItemProps } from "@legendapp/list";
import * as React from "react";

import type { EntryWithImageLoaded } from "@/jazz/schema";
import { Dimensions } from "react-native";
import { EntryCard } from "./entry-card";

const COLUMNS = 3;
const width = Dimensions.get("window").width;
const cardWidth = Math.floor(width / COLUMNS);

interface EntryGridViewProps {
  entries: EntryWithImageLoaded[];
  recycleItems?: boolean;
}

export const EntryGridView = ({
  entries,
  recycleItems = false,
}: EntryGridViewProps) => {
  const displayedPhotos = React.useMemo(
    () => entries.filter((entry) => !entry.isDeleted),
    [entries]
  );

  const keyExtractor = React.useCallback(
    (item: unknown) => (item as EntryWithImageLoaded).$jazz.id,
    []
  );

  const renderItem = React.useCallback(
    ({ item: entry }: LegendListRenderItemProps<EntryWithImageLoaded>) => {
      return (
        <EntryCard entry={entry} width={cardWidth} recycleItem={recycleItems} />
      );
    },
    [recycleItems]
  );

  return (
    <LegendList
      data={displayedPhotos}
      numColumns={COLUMNS}
      recycleItems={recycleItems}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getFixedItemSize={() => cardWidth}
      maintainScrollAtEnd
      maintainVisibleContentPosition
      maintainScrollAtEndThreshold={0.5}
      showsVerticalScrollIndicator={true}
      style={[{ flex: 1 }]}
    />
  );
};
