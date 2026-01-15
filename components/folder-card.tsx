import { useRouter } from "expo-router";
import { Image } from "jazz-tools/expo";
import { Dimensions, Pressable, Text, View } from "react-native";

import type { FolderDeeplyLoaded } from "@/jazz/schema";

interface FolderCardProps {
  folder: FolderDeeplyLoaded;
}

const width = Dimensions.get("window").width;

export function FolderCard({ folder }: FolderCardProps) {
  const router = useRouter();
  const latestEntryImage = folder.entries.at(-1)?.image;

  return (
    <Pressable onPress={() => router.push(`/${folder.$jazz.id}`)}>
      <View
        style={{
          aspectRatio: 1,
        }}
      >
        {latestEntryImage ? (
          <Image
            imageId={latestEntryImage.$jazz.id}
            resizeMode="cover"
            width={width}
            height="original"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <View className="bg-surface absolute inset-0">
            <Text className="font-manrope-medium text-muted text-sm">
              No entries yet
            </Text>
          </View>
        )}
        <Text
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            backgroundColor: "black",
            color: "white",
            fontSize: 20,
          }}
        >
          {folder.name}
        </Text>
      </View>
    </Pressable>
  );
}
