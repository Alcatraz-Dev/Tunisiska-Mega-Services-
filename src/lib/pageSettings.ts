export type LocalizedPageCopy = Record<string, unknown>;

export type ManagedSection = {
  visible?: boolean;
  content?: Record<string, Record<string, unknown>>;
  [key: string]: unknown;
};

export type PublicSiteSettings = {
  sections?: Record<string, ManagedSection>;
  mockups?: Record<string, unknown>;
};

export type ManagedMockup = {
  image?: string;
  title?: string;
  alt?: string;
  type?: "image" | "icon";
  icon?: string;
  color?: string;
  style?: string;
};

export type ManagedGalleryItem = ManagedMockup;

function siteSettings(settings: unknown): PublicSiteSettings {
  return settings && typeof settings === "object"
    ? (settings as PublicSiteSettings)
    : {};
}

export function isSectionVisible(settings: unknown, sectionId: string) {
  return siteSettings(settings).sections?.[sectionId]?.visible !== false;
}

export function getSectionContent<T extends LocalizedPageCopy>(
  settings: unknown,
  sectionId: string,
  language: string,
  fallback: T,
): T {
  const section = siteSettings(settings).sections?.[sectionId];
  const content = section?.content || {};
  const english = content.en || {};
  const localized = content[language] || {};
  return { ...fallback, ...english, ...localized } as T;
}

export function getMockup(settings: unknown, mockupId: string): ManagedMockup | undefined {
  const mockups = siteSettings(settings).mockups || {};
  const mockup = mockups[mockupId];
  const globalStyle = typeof mockups.style === "string" ? mockups.style : undefined;
  if (!mockup || typeof mockup !== "object") {
    return globalStyle ? { style: globalStyle } : undefined;
  }
  const value = mockup as Record<string, unknown>;
  return {
    image: typeof value.image === "string" ? value.image : undefined,
    title: typeof value.title === "string" ? value.title : undefined,
    alt: typeof value.alt === "string" ? value.alt : undefined,
    type: value.type === "icon" ? "icon" : value.type === "image" ? "image" : undefined,
    icon: typeof value.icon === "string" ? value.icon : undefined,
    color: typeof value.color === "string" ? value.color : undefined,
    style: typeof value.style === "string" ? value.style : globalStyle,
  };
}

export function getMockupImage(settings: unknown, mockupId: string) {
  const mockup = getMockup(settings, mockupId);
  return mockup?.type !== "icon" && mockup?.image ? mockup.image : undefined;
}

export function getManagedGallery(settings: unknown): ManagedGalleryItem[] {
  const mockups = siteSettings(settings).mockups || {};
  const gallery = mockups.gallery;
  const globalStyle = typeof mockups.style === "string" ? mockups.style : undefined;
  if (!Array.isArray(gallery)) return [];
  return gallery.flatMap((item): ManagedGalleryItem[] => {
    if (!item || typeof item !== "object") return [];
    const value = item as Record<string, unknown>;
    return [{
      image: typeof value.image === "string" ? value.image : undefined,
      title: typeof value.title === "string" ? value.title : undefined,
      alt: typeof value.alt === "string" ? value.alt : undefined,
      type: value.type === "icon" ? "icon" : value.type === "image" ? "image" : undefined,
      icon: typeof value.icon === "string" ? value.icon : undefined,
      color: typeof value.color === "string" ? value.color : undefined,
      style: typeof value.style === "string" ? value.style : globalStyle,
    }];
  });
}
