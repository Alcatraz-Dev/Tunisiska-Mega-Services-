export type AppStoreType = "appStore" | "googlePlay";
export type StoreSettings = {
  links?: {
    appStore?: string;
    googlePlay?: string;
    appStoreEnabled?: boolean;
    googlePlayEnabled?: boolean;
  };
};

export const appStoreFallbacks: Record<AppStoreType, string> = {
  appStore: "https://apps.apple.com/tn/app/tunsiska-mega-services/id6765942795",
  googlePlay: "https://play.google.com/store/apps/details?id=com.alcatrazdev.tunisiskaservices",
};

export function resolveStoreUrl(settings: StoreSettings | null | undefined, store: AppStoreType) {
  const configuredUrl = settings?.links?.[store];
  const isEnabled = settings?.links?.[`${store}Enabled`] !== false;
  return isEnabled && configuredUrl ? configuredUrl : appStoreFallbacks[store];
}
