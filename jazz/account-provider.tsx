import { createAccountSubscriptionContext } from "jazz-tools/react-core";

import { AppAccount, FolderDeeplyResolved } from "@/jazz/schema";

export const { Provider: AccountProvider, useSelector: useAccountSelector } =
  createAccountSubscriptionContext(AppAccount, {
    root: {
      folders: {
        $each: FolderDeeplyResolved.resolveQuery,
      },
    },
    profile: true,
  });
