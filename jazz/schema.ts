import { co, z } from "jazz-tools";

const SCHEMA_VERSION = "1";

// SINGLE ENTRY
export const Entry = co.map({
  image: co.image(),
  isDeleted: z.boolean(),
});
export type EntryLoaded = co.loaded<typeof Entry>;

// DEEPLY LOADED ENTRY
export const EntryWithImage = Entry.resolved({
  image: true,
});
export type EntryWithImageLoaded = co.loaded<typeof EntryWithImage>;

// LIST OF ENTRIES
export const Entries = co.list(Entry);
export type EntriesShallowLoaded = co.loaded<typeof Entries>;

// SINGLE FOLDER
export const Folder = co.map({
  name: z.string(),
  entries: Entries,
  isDeleted: z.boolean(),
});
export type FolderLoaded = co.loaded<typeof Folder>;

// SHALLOW LOADED FOLDER
export const FolderWithEntriesShallow = Folder.resolved({ entries: true });
export type FolderWithEntriesShallowLoaded = co.loaded<
  typeof FolderWithEntriesShallow
>;

// DEEPLY LOADED FOLDER
export const FolderDeeplyResolved = Folder.resolved({
  entries: {
    $each: EntryWithImage.resolveQuery,
  },
});
export type FolderDeeplyLoaded = co.loaded<typeof FolderDeeplyResolved>;

// APP ROOT SCHEMA TO STORE ALL FOLDERS
export const AppRoot = co.map({
  schemaVersion: z.string(),
  folders: co.list(Folder),
});

// Account schema with migration to initialize the root
export const AppAccount = co
  .account({
    root: AppRoot,
    profile: co.profile(),
  })
  .withMigration((account) => {
    if (!account.$jazz.has("root")) {
      account.$jazz.set("root", {
        folders: [],
        schemaVersion: SCHEMA_VERSION,
      });
    }
  });

export type AppAccountLoaded = co.loaded<typeof AppAccount>;

export const appAccountRootDeepResolveQuery = {
  root: {
    folders: {
      $each: {
        entries: {
          $each: {
            image: true,
          },
        },
      },
    },
  },
} as const;
