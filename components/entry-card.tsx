import { Image as JazzExpoImage } from "@/components/jazz-expo-image";
import type { EntryWithImageLoaded } from "@/jazz/schema";
import { Image as JazzRNImage } from "jazz-tools/expo";

interface EntryCardProps {
  entry: EntryWithImageLoaded;
  recycleItem?: boolean;
  width: number;
}

export function EntryCard({
  entry,
  width,
  recycleItem = false,
}: EntryCardProps) {
  return recycleItem ? (
    <JazzExpoImage
      imageId={entry.image.$jazz.id ?? ""}
      style={{
        width: width,
        height: width,
        backgroundColor: "red",
      }}
      contentFit="cover"
      width={width}
      height="original"
      decodeFormat="rgb"
      recyclingKey={entry.image.$jazz.id ?? ""}
    />
  ) : (
    <JazzRNImage
      imageId={entry.image?.$jazz.id ?? ""}
      style={{
        width: width,
        height: width,
      }}
      resizeMode="cover"
      width={width}
      height="original"
    />
  );
}
