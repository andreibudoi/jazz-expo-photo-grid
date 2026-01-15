import { faker } from "@faker-js/faker";
import { File, Paths } from "expo-file-system";
import type { Account, Group } from "jazz-tools";
import { createImage } from "jazz-tools/media";

import type { AppAccountLoaded } from "./schema";
import { AppAccount, Entry, Folder, FolderDeeplyResolved } from "./schema";

export const onAnonymousAccountDiscarded = async (
  anonymousAccount: AppAccountLoaded
) => {
  // Load the anonymous account's data
  const loadedAnonymousAccount = await anonymousAccount.$jazz.ensureLoaded({
    resolve: {
      root: {
        folders: {
          $each: FolderDeeplyResolved.resolveQuery,
        },
      },
    },
  });

  const { root: anonymousRoot } = loadedAnonymousAccount;

  // Get the current authenticated account
  const me = await AppAccount.getMe().$jazz.ensureLoaded({
    resolve: {
      root: {
        folders: true,
      },
    },
  });

  // This shouldn't be needed
  if (me.$jazz.id === loadedAnonymousAccount.$jazz.id) {
    return;
  }

  // Migrate each folder from anonymous account
  for (const folder of anonymousRoot.folders.values()) {
    if (folder.isDeleted) continue;

    // Get the folder's owner group
    const folderGroup = folder.$jazz.owner;

    // Give the authenticated user admin access to the folder
    folderGroup.addMember(me, "admin");

    // Also give access to all photos in the folder
    const { entries } = await folder.$jazz.ensureLoaded({
      resolve: {
        entries: {
          $each: {
            image: true,
          },
        },
      },
    });

    for (const entry of entries.values()) {
      if (entry.isDeleted) continue;
      const photoGroup = entry.$jazz.owner;
      photoGroup.addMember(me, "admin");

      // Also give access to the image itself if it exists
      const imageGroup = entry.image?.$jazz.owner;
      if (imageGroup) {
        imageGroup.addMember(me, "admin");
      }
    }

    // Add the folder to the authenticated account's folders
    me.root.folders.$jazz.push(folder);
  }
};

async function createRandomEntry(owner: Group | Account) {
  // Generate a portrait image URL (3:4 aspect ratio - 600x800)
  const imageUrl = faker.image.urlPicsumPhotos({
    width: 600,
    height: 800,
    blur: 0,
  });

  // Generate a unique filename to avoid conflicts on Android
  const uniqueFilename = `temp-image-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.jpg`;
  const destinationFile = new File(Paths.cache, uniqueFilename);

  // Download the image to a temporary file in cache directory
  // Use idempotent option to allow overwriting if file somehow already exists
  const downloadedFile = await File.downloadFileAsync(imageUrl, destinationFile, {
    idempotent: true,
  });

  // Create the Jazz image from the file path
  const image = await createImage(downloadedFile.uri, {
    owner,
    progressive: true,
    placeholder: "blur",
  });

  // Clean up the temporary file
  downloadedFile.delete();

  return Entry.create({
    image,
    isDeleted: false,
  });
}

export async function generateFakeFolderWithPhotos(
  photoCount: number
): Promise<void> {
  if (!Number.isFinite(photoCount) || photoCount <= 0) return;

  const me = await AppAccount.getMe().$jazz.ensureLoaded({
    resolve: {
      root: {
        folders: true,
      },
    },
  });

  // Create a new folder
  const folder = Folder.create({
    name: faker.commerce.department(),
    entries: [],
    isDeleted: false,
  });

  // Generate photos for the folder
  for (let i = 0; i < photoCount; i++) {
    const photo = await createRandomEntry(folder.$jazz.owner);
    folder.entries.$jazz.push(photo);
  }

  // Add the folder to the account's folders
  me.root.folders.$jazz.push(folder);
}
