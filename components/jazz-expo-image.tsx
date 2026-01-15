import { useRecyclingState } from "@legendapp/list";
import type { ImageProps as ExpoImageProps } from "expo-image";
import { Image as ExpoImage } from "expo-image";
import type { FileStream } from "jazz-tools";
import { ImageDefinition } from "jazz-tools";
import { useCoState } from "jazz-tools/expo";
import { highestResAvailable } from "jazz-tools/media";
import { forwardRef, memo, useEffect, useMemo } from "react";
import type { ImageStyle, StyleProp } from "react-native";

const defaultPlaceholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAgAElEQVR4Xu3dibcjRdkH4KDiiooL7ggKiru44IaIqH+2+wYKuC+gIoqMIK644K6fv/udaCaTpOt9k773Zuapc+Yc5aY6nSeV/nVXVVdfdd999/17oRAgQIAAgaLAVQKkKOblBAgQIHAiIEA0BAIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0oECBAgIEC0AQIECBBoCQiQFptKBAgQICBAtAECBAgQaAkIkBabSgQIECAgQLQBAgQIEGgJCJAWm0pVgX/961+LX/ziF4vf//73i7/85S+Lf/7zn4tnPetZi2uuuWbx8pe/fPHsZz97cpP33HPP4o9//ONFr3v605++uOuuuybregEBAocXECCHN7XFFYF///vfiwcffHBx4cKFRf73tpIwec1rXrO4/vrrF894xjMuedmTTz65uPfeey/576l3xx13MCdA4AwEBMgZoF8pb5mrjLvvvvvkiqNSXvCCFyxe/epXL17xilcscoXxpz/9aXH//fcv/va3v12ymbzuzW9+c2XzXkuAwIEEBMiBIG3mUoGERw7++5Srrrpq55XLu9/97sWLX/zi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BASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAqpGYjoAAAWPSURBVAQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLQEB0mJTiQABAgQEiDZAgAABAi0BAdJiU4kAAQIEBIg2QIAAAQItAQHSYlOJAAECBASINkCAAAECLYH/A1oGynxc0yiJAAAAAElFTkSuQmCC";

export type ImageProps = Omit<ExpoImageProps, "width" | "height" | "source"> & {
  /** The ID of the ImageDefinition to display */
  imageId: string;
  /**
   * Width of the image. Can be a number or "original" to use the original image width.
   * When set to "original", the component will calculate the appropriate height to maintain aspect ratio.
   *
   * @example
   * ```tsx
   * // Fixed width, auto-calculated height
   * <Image imageId="123" width={600} />
   *
   * // Original width
   * <Image imageId="123" width="original" />
   * ```
   */
  width?: number | "original";
  /**
   * Height of the image. Can be a number or "original" to use the original image height.
   * When set to "original", the component will calculate the appropriate width to maintain aspect ratio.
   *
   * @example
   * ```tsx
   * // Fixed height, auto-calculated width
   * <Image imageId="123" height={400} />
   *
   * // Original height
   * <Image imageId="123" height="original" />
   * ```
   */
  height?: number | "original";
  /**
   * A custom placeholder to display while an image is loading. This will
   * be passed as the src of the img tag, so a data URL works well here.
   * This will be used as a fallback if no images are ready and no placeholder
   * is available otherwise.
   */
  placeholder?: string;
};

/**
 * An Expo Image component that integrates with Jazz's ImageDefinition system.
 *
 * @example
 * ```tsx
 * import { Image } from "~/components/jazz-expo-image";
 * import { StyleSheet } from "react-native";
 *
 * function ProfilePicture({ imageId }) {
 *   return (
 *     <Image
 *       imageId={imageId}
 *       style={styles.profilePic}
 *       width={100}
 *       height={100}
 *       contentFit="cover"
 *       placeholder="/placeholder.png"
 *     />
 *   );
 * }
 *
 * const styles = StyleSheet.create({
 *   profilePic: {
 *     borderRadius: 50,
 *   }
 * });
 * ```
 */
export const Image = memo(
  forwardRef<ExpoImage, ImageProps>(function Image(
    { imageId, width, height, placeholder, ...props },
    ref,
  ) {
    const image = useCoState(ImageDefinition, imageId, {
      select: (image) => (image.$isLoaded ? image : null),
    });

    // Use recycling state to reset image when item is recycled
    const [src, setSrc] = useRecyclingState<string | undefined>(
      () => image?.placeholderDataURL ?? defaultPlaceholder,
    );

    const dimensions: { width: number | undefined; height: number | undefined } =
      useMemo(() => {
        const originalWidth = image?.originalSize[0];
        const originalHeight = image?.originalSize[1];

        // Both width and height are "original"
        if (width === "original" && height === "original") {
          return { width: originalWidth, height: originalHeight };
        }

        // Width is "original", height is a number
        if (width === "original" && typeof height === "number") {
          if (originalWidth && originalHeight) {
            return {
              width: Math.round((height * originalWidth) / originalHeight),
              height,
            };
          }
          return { width: undefined, height };
        }

        // Height is "original", width is a number
        if (height === "original" && typeof width === "number") {
          if (originalWidth && originalHeight) {
            return {
              width,
              height: Math.round((width * originalHeight) / originalWidth),
            };
          }
          return { width, height: undefined };
        }

        // In all other cases, use the property value:
        return {
          width: width === "original" ? originalWidth : width,
          height: height === "original" ? originalHeight : height,
        };
      }, [image?.originalSize, width, height]);

    useEffect(() => {
      if (!image) return;

      let lastBestImage: FileStream | string | undefined =
        image.placeholderDataURL ?? placeholder;

      const unsub = image.$jazz.subscribe({}, (update) => {
        if (lastBestImage === undefined && update.placeholderDataURL) {
          setSrc(update.placeholderDataURL);
          lastBestImage = update.placeholderDataURL;
        }

        const bestImage = highestResAvailable(
          update,
          dimensions.width ?? dimensions.height ?? 9999,
          dimensions.height ?? dimensions.width ?? 9999,
        );

        if (!bestImage) return;

        if (lastBestImage === bestImage.image) return;

        const url = bestImage.image.asBase64({ dataURL: true });

        if (url) {
          setSrc(url);
          lastBestImage = bestImage.image;
        }
      });

      return unsub;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image]);

    const style = useMemo<StyleProp<ImageStyle>>(() => {
      const dimensionStyle: ImageStyle = {};
      if (dimensions.width !== undefined) {
        dimensionStyle.width = dimensions.width;
      }
      if (dimensions.height !== undefined) {
        dimensionStyle.height = dimensions.height;
      }
      return [dimensionStyle, props.style];
    }, [dimensions.width, dimensions.height, props.style]);

    if (!src) {
      return null;
    }

    const { style: _, ...restProps } = props;

    return (
      <ExpoImage ref={ref} source={{ uri: src }} style={style} {...restProps} />
    );
  }),
);
