"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AppWindow,
  Smartphone,
  Link as LinkIcon,
  Layout,
  Save,
  CheckCircle2,
  ChevronRight,
  Settings,
  Shield,
  Loader2,
  Mail,
  Lock,
  LogOut,
  User,
  Globe,
  Edit3,
  Eye,
  EyeOff,
  Type,
  Image as ImageIcon,
  Smartphone as PhoneIcon,
  Laptop,
  Check,
  Upload,
  Sparkles,
  Car,
  MapPin,
  Package,
  Share2,
  Plus,
  Trash2,
  BookOpen,
  Info,
  Phone,
  Users,
  Newspaper,
  LayoutGrid as Grid,
} from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa6";
import {
  getAdminSettings,
  saveSettings,
  login,
  logout,
  updateAuth,
  uploadFile,
} from "./actions";
import { useSettings } from "@/context/SettingsContext";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";

const DEVICE_STYLES = [
  // iOS - iPhone 16 series
  {
    id: "/devices/iOS/16 Pro Max/16 Pro Max - Black Titanium.png",
    label: "iPhone 16 Pro Max (Black)",
    category: "ios",
    icon: <PhoneIcon size={14} className="text-accent" />,
  },
  {
    id: "/devices/iOS/16 Pro Max/16 Pro Max - Desert Titanium.png",
    label: "iPhone 16 Pro Max (Desert)",
    category: "ios",
    icon: <PhoneIcon size={14} className="text-amber-500" />,
  },
  {
    id: "/devices/iOS/16 Pro/16 Pro - Black Titanium.png",
    label: "iPhone 16 Pro",
    category: "ios",
    icon: <PhoneIcon size={14} />,
  },
  {
    id: "/devices/iOS/16/16 - Ultramarine.png",
    label: "iPhone 16 (Teal)",
    category: "ios",
    icon: <PhoneIcon size={14} />,
  },

  // iOS - iPhone 15 series
  {
    id: "/devices/iOS/15 Pro Max/15 Pro Max - Natural Titanium.png",
    label: "iPhone 15 Pro Max",
    category: "ios",
    icon: <PhoneIcon size={14} />,
  },

  // Android Phone
  {
    id: "/devices/Android Phone/Pixel 9 Pro XL/Pixel 9 Pro XL Obsidian.png",
    label: "Pixel 9 Pro XL (Obsidian)",
    category: "android",
    icon: <Smartphone size={14} className="text-blue-400" />,
  },
  {
    id: "/devices/Android Phone/Pixel 9 Pro XL/Pixel 9 Pro XL Rose Quartz.png",
    label: "Pixel 9 Pro XL (Rose)",
    category: "android",
    icon: <Smartphone size={14} className="text-rose-400" />,
  },
  {
    id: "/devices/Android Phone/Pixel 8 Pro/Pixel 8 Pro - Black.png",
    label: "Pixel 8 Pro (Black)",
    category: "android",
    icon: <Smartphone size={14} />,
  },
  {
    id: "/devices/Android Phone/Pixel 8 Pro/Pixel 8 Pro - Silver.png",
    label: "Pixel 8 Pro (Silver)",
    category: "android",
    icon: <Smartphone size={14} />,
  },

  // Tablets
  {
    id: "/devices/iPadOS/iPad Pro/M4 & M5/13/iPad Pro 13 M4 & M5 - Portrait - Silver.png",
    label: "iPad Pro 13 (M4/M5)",
    category: "tablet",
    icon: <Layout size={14} className="text-accent" />,
  },
  {
    id: "/devices/iPadOS/iPad Air/M2 & M3/13/iPad Air 13 - M2 & M3 - Portrait - Space Gray.png",
    label: "iPad Air 13",
    category: "tablet",
    icon: <Layout size={14} />,
  },
  {
    id: "/devices/Android Tablet/Samsung Galaxy Tab S11 Ultra/Samsung Galaxy Tab S11 Ultra.png",
    label: "Galaxy Tab S11 Ultra",
    category: "tablet",
    icon: <Layout size={14} />,
  },

  // Laptops
  {
    id: "/devices/MacBook/MacBook Pro 16.png",
    label: "MacBook Pro 16",
    category: "laptop",
    icon: <Laptop size={14} className="text-accent" />,
  },
  {
    id: "/devices/MacBook/MacBook Air 15.png",
    label: "MacBook Air 15",
    category: "laptop",
    icon: <Laptop size={14} />,
  },
  {
    id: "/devices/Windows Laptop/Dell/2024 XPS 16 Platinum.png",
    label: "Dell XPS 16",
    category: "laptop",
    icon: <Laptop size={14} />,
  },
];

const DEVICE_CATEGORIES = [
  { id: "ios", label: "iOS" },
  { id: "android", label: "Android" },
  { id: "tablet", label: "Tablets" },
  { id: "laptop", label: "Laptops" },
];

export default function AdminDashboard() {
  const { refreshSettings } = useSettings();
  const { lang } = useLanguage();
  const t = translations[lang as keyof typeof translations];
  const [settings, setSettings] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockupCategory, setMockupCategory] = useState<string>("ios");
  const [activeTab, setActiveTab] = useState<"general" | "sections" | "pages">(
    "general",
  );
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<string | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 5000);
  };

  // Auth form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Credentials update state
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const loadData = async () => {
    try {
      const data = await getAdminSettings();
      if (data) {
        // Ensure backward compatibility and new structure
        const normalizedSections = { ...data.sections };
        ["hero", "features", "cta"].forEach((id) => {
          if (typeof normalizedSections[id] === "boolean") {
            normalizedSections[id] = {
              visible: normalizedSections[id],
              content: {},
            };
          }
        });

        setSettings({
          ...data,
          sections: normalizedSections,
        });
        setIsAuthenticated(true);
        setNewEmail(data.auth.email);
      }
    } catch (e) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper to get content with defaults from translations
  const getMergedSectionContent = (sectionId: string) => {
    const currentContent: any = settings.sections[sectionId]?.content || {};
    const merged: any = { ...currentContent };

    // Provide defaults from translations for empty segments
    ["en", "sv", "ar"].forEach((l) => {
      const trans = (translations as any)[l];
      if (!merged[l]) {
        if (sectionId === "gallery") {
          merged[l] = {
            headline:
              l === "ar"
                ? "اكتشف شكل التطبيق"
                : l === "sv"
                  ? "Utforska Appen"
                  : "Explore the App",
            description:
              l === "ar"
                ? "ألق نظرة على التصميم الأنيق والواجهة السلسة لخدماتنا في التطبيق."
                : l === "sv"
                  ? "Ta en titt på den eleganta designen och det smidiga gränssnittet för våra tjänster i appen."
                  : "Take a look at the elegant design and seamless interface of our services in the app.",
          };
        } else if (sectionId.startsWith("service_")) {
          const serviceId = sectionId.replace("service_", "");
          const serviceTrans = trans.serviceDetails?.[serviceId];
          if (serviceTrans) {
            merged[l] = {
              title: serviceTrans.title,
              desc: serviceTrans.desc,
              cta: serviceTrans.cta,
              features: serviceTrans.features,
              image: serviceTrans.image,
            };
          }
        } else if (sectionId === "careers") {
          const transKey = "careersPage";
          if (trans[transKey]) {
            merged[l] = trans[transKey];
          }
        } else if (sectionId === "press") {
          const transKey = "pressPage";
          if (trans[transKey]) {
            merged[l] = trans[transKey];
          }
        } else if (sectionId === "contact") {
          const transKey = "contactPage";
          if (trans[transKey]) {
            merged[l] = trans[transKey];
          }
        } else {
          // Generic fallback for other sections
          if (trans[sectionId]) {
            merged[l] = trans[sectionId];
          }
        }
      }
    });
    return merged;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await login(formData);
    if (result.success) {
      await loadData();
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setSettings(null);
  };

  const [isUploading, setIsUploading] = useState<string | null>(null);

  const handleImageUpload = async (mock: string, file: File) => {
    setIsUploading(mock);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadFile(formData);
      if (result.success && result.url) {
        if (mock.startsWith("gallery-")) {
          const index = parseInt(mock.split("-")[1], 10);
          handleGalleryChange(index, "image", result.url);
        } else if (mock.startsWith("section-")) {
          const parts = mock.split("-"); // section-sectionId-lang-field
          const sectionId = parts[1];
          const langId = parts[2];
          const fieldId = parts[3];
          handleContentChange(sectionId, langId, fieldId, result.url);
        } else {
          handleMockupChange(mock, "image", result.url);
        }
        setToast({
          show: true,
          message:
            lang === "ar"
              ? "تم رفع الصورة بنجاح"
              : "Image uploaded successfully",
          type: "success",
        });
      } else {
        setToast({
          show: true,
          message: result.error || "Upload failed",
          type: "error",
        });
      }
    } catch (error) {
      setToast({ show: true, message: "Upload failed", type: "error" });
    } finally {
      setIsUploading(null);
    }
  };

  const handleSettingChange = (
    section: string,
    key: string,
    value: string | boolean,
  ) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value,
      },
    });
  };

  const handleMockupChange = (
    mockupKey: string,
    propKey: string,
    value: string,
  ) => {
    setSettings({
      ...settings,
      mockups: {
        ...settings.mockups,
        [mockupKey]: {
          ...settings.mockups[mockupKey],
          [propKey]: value,
        },
      },
    });
  };

  const handleGalleryChange = (index: number, key: string, value: string) => {
    const newGallery = [...settings.mockups.gallery];
    newGallery[index] = { ...newGallery[index], [key]: value };
    setSettings({
      ...settings,
      mockups: {
        ...settings.mockups,
        gallery: newGallery,
      },
    });
  };

  const handleListItemChange = (
    sectionId: string,
    listKey: string,
    index: number,
    field: string,
    value: string,
  ) => {
    const newList = [...(settings.sections[sectionId][listKey] || [])];
    newList[index] = { ...newList[index], [field]: value };
    setSettings({
      ...settings,
      sections: {
        ...settings.sections,
        [sectionId]: {
          ...settings.sections[sectionId],
          [listKey]: newList,
        },
      },
    });
  };

  const handleListItemLanguageChange = (
    sectionId: string,
    listKey: string,
    index: number,
    field: string,
    lang: string,
    value: string,
  ) => {
    const newList = [...(settings.sections[sectionId][listKey] || [])];
    newList[index] = {
      ...newList[index],
      [field]: {
        ...(newList[index][field] || {}),
        [lang]: value,
      },
    };
    setSettings({
      ...settings,
      sections: {
        ...settings.sections,
        [sectionId]: {
          ...settings.sections[sectionId],
          [listKey]: newList,
        },
      },
    });
  };

  const addListItem = (sectionId: string, listKey: string) => {
    const newList = [...(settings.sections[sectionId][listKey] || [])];
    const newItem =
      sectionId === "careers"
        ? {
            id: Date.now().toString(),
            title: { en: "New Position", sv: "Ny tjänst", ar: "وظيفة جديدة" },
            department: { en: "Engineering", sv: "Teknik", ar: "الهندسة" },
            location: { en: "Remote", sv: "Distans", ar: "عن بعد" },
            type: { en: "Full-time", sv: "Heltid", ar: "دوام كامل" },
            link: "#",
          }
        : {
            id: Date.now().toString(),
            date: new Date().toISOString().split("T")[0],
            title: {
              en: "New Press Release",
              sv: "Nytt pressmeddelande",
              ar: "بيان صحفي جديد",
            },
            excerpt: {
              en: "Summary...",
              sv: "Sammanfattning...",
              ar: "مقتطف...",
            },
            link: "#",
          };

    newList.push(newItem);
    setSettings({
      ...settings,
      sections: {
        ...settings.sections,
        [sectionId]: {
          ...settings.sections[sectionId],
          [listKey]: newList,
        },
      },
    });
  };

  const removeListItem = (
    sectionId: string,
    listKey: string,
    index: number,
  ) => {
    const newList = [...(settings.sections[sectionId][listKey] || [])];
    newList.splice(index, 1);
    setSettings({
      ...settings,
      sections: {
        ...settings.sections,
        [sectionId]: {
          ...settings.sections[sectionId],
          [listKey]: newList,
        },
      },
    });
  };

  const addGalleryScreen = () => {
    setSettings({
      ...settings,
      mockups: {
        ...settings.mockups,
        gallery: [
          ...(settings.mockups.gallery || []),
          {
            style: "/devices/iOS/16 Pro Max/16 Pro Max - Black Titanium.png",
            type: "image",
            image: "",
            icon: "sparkles",
            color: "primary",
          },
        ],
      },
    });
  };

  const removeGalleryScreen = (index: number) => {
    const newGallery = [...settings.mockups.gallery];
    newGallery.splice(index, 1);
    setSettings({
      ...settings,
      mockups: {
        ...settings.mockups,
        gallery: newGallery,
      },
    });
  };

  const toggleSection = (sectionId: string) => {
    setSettings({
      ...settings,
      sections: {
        ...settings.sections,
        [sectionId]: {
          ...settings.sections[sectionId],
          visible: !settings.sections[sectionId]?.visible,
        },
      },
    });
  };

  const handleContentChange = (
    sectionId: string,
    lang: string,
    field: string,
    value: string,
  ) => {
    const currentSection = settings.sections[sectionId] || {
      visible: true,
      content: {},
    };
    const currentLangContent = currentSection.content[lang] || {};

    // If it's a service section and we are changing the image, apply to all languages
    if (sectionId.startsWith("service_") && field === "image") {
      const newContent = { ...currentSection.content };
      ["en", "sv", "ar"].forEach((l) => {
        newContent[l] = {
          ...(newContent[l] || {}),
          image: value,
        };
      });

      setSettings({
        ...settings,
        sections: {
          ...settings.sections,
          [sectionId]: {
            ...currentSection,
            content: newContent,
          },
        },
      });
      return;
    }

    setSettings({
      ...settings,
      sections: {
        ...settings.sections,
        [sectionId]: {
          ...currentSection,
          content: {
            ...currentSection.content,
            [lang]: {
              ...currentLangContent,
              [field]:
                field === "features"
                  ? value.split("\n").filter((s: string) => s.trim() !== "")
                  : value,
            },
          },
        },
      },
    });
  };

  const handleMockupStyleChange = (style: string) => {
    setSettings({
      ...settings,
      mockups: {
        ...settings.mockups,
        style,
      },
    });
  };

  const onSave = async () => {
    setSaving(true);
    const result = await saveSettings(settings);
    setSaving(false);
    if (result.success) {
      await refreshSettings();
      setSaved(true);
      showToast(
        t.admin.toasts?.success || "Settings updated successfully!",
        "success",
      );
      setTimeout(() => setSaved(false), 3000);
    } else {
      showToast(t.admin.toasts?.error || "Failed to update settings", "error");
    }
  };

  const onUpdateCredentials = async () => {
    setSaving(true);
    const result = await updateAuth({ email: newEmail, password: newPassword });
    setSaving(false);
    if (result.success) {
      setSaved(true);
      showToast(
        t.admin.toasts?.success || "Credentials updated successfully!",
        "success",
      );
      setTimeout(() => setSaved(false), 3000);
    } else {
      showToast(
        t.admin.toasts?.error || "Failed to update credentials",
        "error",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">{t.admin.login.title}</h1>
            <p className="text-gray-400">
              {t.admin.login.desc || "Sign in to manage your landing page"}
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="glass-card p-8 rounded-3xl space-y-6"
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {t.admin.login.error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {t.admin.login.email}
              </label>
              <div className="relative">
                <Mail
                  className={`absolute ${lang === "ar" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full h-12 bg-white/5 border border-white/10 rounded-xl ${lang === "ar" ? "pr-12 pl-4" : "pl-12 pr-4"} text-white focus:outline-none focus:border-primary/50 transition-colors`}
                  placeholder="admin@tunisiska.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {t.admin.login.password}
              </label>
              <div className="relative">
                <Lock
                  className={`absolute ${lang === "ar" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500`}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-12 bg-white/5 border border-white/10 rounded-xl ${lang === "ar" ? "pr-12 pl-4" : "pl-12 pr-4"} text-white focus:outline-none focus:border-primary/50 transition-colors`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full h-12 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all active:scale-95"
            >
              {loading ? t.admin.login.loading : t.admin.login.button}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background-dark pt-32 pb-20 px-6"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-full lg:px-12 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
        >
          <div className={lang === "ar" ? "text-right" : "text-left"}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-xs font-medium text-primary mb-4">
              <Shield className="w-3 h-3" />
              <span>{t.admin.title}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              {t.admin.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold bg-white/5 text-gray-400 hover:text-white transition-all border border-white/10"
            >
              <LogOut
                className={`w-4 h-4 ${lang === "ar" ? "rotate-180" : ""}`}
              />
              {t.admin.logout}
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg active:scale-95 ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saved
                ? t.admin.settingsSaved
                : saving
                  ? t.admin.saving
                  : t.admin.saveChanges}
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col gap-10">
          {/* Top Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-3 p-1.5 glass border border-white/5 rounded-4xl w-fit">
            <button
              onClick={() => setActiveTab("general")}
              className={`px-6 py-3 rounded-full transition-all flex items-center gap-2 border ${
                activeTab === "general"
                  ? "bg-primary border-primary/20 text-white shadow-lg shadow-primary/20"
                  : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Settings
                className={`w-4 h-4 ${activeTab === "general" ? "text-white" : ""}`}
              />
              <span className="font-semibold text-sm">
                {t.admin.sidebar?.general || "General Settings"}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("sections")}
              className={`px-6 py-3 rounded-full transition-all flex items-center gap-2 border ${
                activeTab === "sections"
                  ? "bg-primary border-primary/20 text-white shadow-lg shadow-primary/20"
                  : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Layout
                className={`w-4 h-4 ${activeTab === "sections" ? "text-white" : ""}`}
              />
              <span className="font-semibold text-sm">
                {t.admin.sidebar?.sections || "Page Sections"}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("pages")}
              className={`px-6 py-3 rounded-full transition-all flex items-center gap-2 border ${
                activeTab === "pages"
                  ? "bg-primary border-primary/20 text-white shadow-lg shadow-primary/20"
                  : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <BookOpen
                className={`w-4 h-4 ${activeTab === "pages" ? "text-white" : ""}`}
              />
              <span className="font-semibold text-sm">
                {t.admin.sidebar?.pages || "Pages"}
              </span>
            </button>
          </div>

          {/* Main Content - Full Width */}
          <div className="w-full space-y-12">
            <AnimatePresence mode="wait">
              {activeTab === "general" ? (
                <motion.div
                  key="general-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  {/* Store Links */}
                  <section className="glass-card rounded-4xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <LinkIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {t.admin.storeLinks.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {t.admin.storeLinks.desc}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-400">
                            {t.admin.storeLinks.appStore}
                          </label>
                          <button
                            onClick={() =>
                              handleSettingChange(
                                "links",
                                "appStoreEnabled",
                                !settings.links.appStoreEnabled,
                              )
                            }
                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${settings.links.appStoreEnabled ? "bg-primary" : "bg-white/10"}`}
                            title={t.admin.storeLinks.appStoreEnabled}
                          >
                            <span
                              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${settings.links.appStoreEnabled ? (lang === "ar" ? "right-5" : "left-5") : lang === "ar" ? "right-0.5" : "left-0.5"}`}
                            />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={settings.links.appStore}
                          onChange={(e) =>
                            handleSettingChange(
                              "links",
                              "appStore",
                              e.target.value,
                            )
                          }
                          className={`w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary/50 transition-colors ${lang === "ar" ? "text-right" : "text-left"}`}
                        />
                      </div>

                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-400">
                            {t.admin.storeLinks.googlePlay}
                          </label>
                          <button
                            onClick={() =>
                              handleSettingChange(
                                "links",
                                "googlePlayEnabled",
                                !settings.links.googlePlayEnabled,
                              )
                            }
                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${settings.links.googlePlayEnabled ? "bg-primary" : "bg-white/10"}`}
                            title={t.admin.storeLinks.googlePlayEnabled}
                          >
                            <span
                              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${settings.links.googlePlayEnabled ? (lang === "ar" ? "right-5" : "left-5") : lang === "ar" ? "right-0.5" : "left-0.5"}`}
                            />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={settings.links.googlePlay}
                          onChange={(e) =>
                            handleSettingChange(
                              "links",
                              "googlePlay",
                              e.target.value,
                            )
                          }
                          className={`w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary/50 transition-colors ${lang === "ar" ? "text-right" : "text-left"}`}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Social Links */}
                  <section className="glass-card rounded-4xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                        <Share2 size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {t.admin.socialLinks.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {t.admin.socialLinks.desc}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Facebook */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <FaFacebookF size={14} className="text-blue-400" />
                            {t.admin.socialLinks.facebook}
                          </label>
                          <button
                            onClick={() =>
                              handleSettingChange(
                                "social",
                                "facebookEnabled",
                                !settings.social.facebookEnabled,
                              )
                            }
                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${settings.social.facebookEnabled ? "bg-primary" : "bg-white/10"}`}
                            title="Toggle Facebook visibility in footer"
                          >
                            <span
                              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${settings.social.facebookEnabled ? "left-5" : "left-0.5"}`}
                            />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={settings.social.facebook}
                          onChange={(e) =>
                            handleSettingChange(
                              "social",
                              "facebook",
                              e.target.value,
                            )
                          }
                          className={`w-full h-10 bg-black/20 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors ${lang === "ar" ? "text-right" : "text-left"}`}
                          placeholder="https://facebook.com/..."
                        />
                      </div>

                      {/* Instagram */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <FaInstagram size={14} className="text-pink-400" />
                            {t.admin.socialLinks.instagram}
                          </label>
                          <button
                            onClick={() =>
                              handleSettingChange(
                                "social",
                                "instagramEnabled",
                                !settings.social.instagramEnabled,
                              )
                            }
                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${settings.social.instagramEnabled ? "bg-primary" : "bg-white/10"}`}
                            title="Toggle Instagram visibility in footer"
                          >
                            <span
                              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${settings.social.instagramEnabled ? "left-5" : "left-0.5"}`}
                            />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={settings.social.instagram}
                          onChange={(e) =>
                            handleSettingChange(
                              "social",
                              "instagram",
                              e.target.value,
                            )
                          }
                          className={`w-full h-10 bg-black/20 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors ${lang === "ar" ? "text-right" : "text-left"}`}
                          placeholder="https://instagram.com/..."
                        />
                      </div>

                      {/* YouTube */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <FaYoutube size={14} className="text-red-500" />
                            YouTube
                          </label>
                          <button
                            onClick={() =>
                              handleSettingChange(
                                "social",
                                "youtubeEnabled",
                                !settings.social.youtubeEnabled,
                              )
                            }
                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${settings.social.youtubeEnabled ? "bg-primary" : "bg-white/10"}`}
                            title="Toggle YouTube visibility in footer"
                          >
                            <span
                              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${settings.social.youtubeEnabled ? "left-5" : "left-0.5"}`}
                            />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={settings.social.youtube || ""}
                          onChange={(e) =>
                            handleSettingChange(
                              "social",
                              "youtube",
                              e.target.value,
                            )
                          }
                          className={`w-full h-10 bg-black/20 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors ${lang === "ar" ? "text-right" : "text-left"}`}
                          placeholder="https://youtube.com/@..."
                        />
                      </div>

                      {/* TikTok */}
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <FaTiktok size={14} className="text-gray-200" />
                            TikTok
                          </label>
                          <button
                            onClick={() =>
                              handleSettingChange(
                                "social",
                                "tiktokEnabled",
                                !settings.social.tiktokEnabled,
                              )
                            }
                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${settings.social.tiktokEnabled ? "bg-primary" : "bg-white/10"}`}
                            title="Toggle TikTok visibility in footer"
                          >
                            <span
                              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${settings.social.tiktokEnabled ? "left-5" : "left-0.5"}`}
                            />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={settings.social.tiktok || ""}
                          onChange={(e) =>
                            handleSettingChange(
                              "social",
                              "tiktok",
                              e.target.value,
                            )
                          }
                          className={`w-full h-10 bg-black/20 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors ${lang === "ar" ? "text-right" : "text-left"}`}
                          placeholder="https://tiktok.com/@..."
                        />
                      </div>
                    </div>
                  </section>

                  {/* Hero Mockups & Preview */}
                  <section className="glass-card rounded-4xl p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <PhoneIcon size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {t.admin.heroMockups.title}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {t.admin.heroMockups.desc}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                      <div className="space-y-8">
                        {["heroLeft", "heroCenter", "heroRight"].map((mock) => (
                          <div
                            key={mock}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm hover:border-white/20 transition-all"
                          >
                            <div className="flex flex-col gap-6">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold capitalize flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                                  {t.admin.heroMockups[
                                    mock === "heroLeft"
                                      ? "mockup1"
                                      : mock === "heroCenter"
                                        ? "mockup2"
                                        : "mockup3"
                                  ] || mock.replace("hero", "")}
                                </span>

                                <div className="flex bg-linear-to-b from-black/40 to-black/20 p-1 rounded-lg border border-white/5">
                                  {["icon", "image"].map((type) => (
                                    <button
                                      key={type}
                                      onClick={() =>
                                        handleMockupChange(mock, "type", type)
                                      }
                                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                                        settings.mockups[mock].type === type
                                          ? "bg-white/10 text-white shadow-sm"
                                          : "text-gray-500 hover:text-gray-400"
                                      }`}
                                    >
                                      {t.admin.heroMockups[
                                        type as keyof typeof t.admin.heroMockups
                                      ] || type}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Categorized Device Selection */}
                              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                                <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
                                  {DEVICE_CATEGORIES.map((cat) => (
                                    <button
                                      key={cat.id}
                                      onClick={() => setMockupCategory(cat.id)}
                                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                                        mockupCategory === cat.id
                                          ? "bg-primary/20 text-primary border border-primary/20"
                                          : "text-gray-500 hover:text-gray-300 border border-transparent"
                                      }`}
                                    >
                                      {cat.label}
                                    </button>
                                  ))}
                                </div>
                                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                  {DEVICE_STYLES.filter(
                                    (s) => s.category === mockupCategory,
                                  ).map((s) => (
                                    <button
                                      key={s.id}
                                      onClick={() =>
                                        handleMockupChange(mock, "style", s.id)
                                      }
                                      title={s.label}
                                      className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                                        settings.mockups[mock].style === s.id
                                          ? "bg-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] scale-110"
                                          : "bg-black/20 text-gray-500 hover:text-gray-300 hover:bg-black/30"
                                      }`}
                                    >
                                      {s.icon}
                                    </button>
                                  ))}
                                </div>
                                <div className="pt-2">
                                  <p className="text-[10px] text-gray-500 font-medium">
                                    Selected:{" "}
                                    <span className="text-gray-300 font-bold uppercase tracking-tight ml-1">
                                      {DEVICE_STYLES.find(
                                        (s) =>
                                          s.id === settings.mockups[mock].style,
                                      )?.label || "iPhone 16 Pro Max"}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {settings.mockups[mock].type === "icon" ? (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                                      {t.admin.heroMockups.icon}
                                    </label>
                                    <select
                                      value={settings.mockups[mock].icon}
                                      onChange={(e) =>
                                        handleMockupChange(
                                          mock,
                                          "icon",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full h-11 bg-black/20 border border-white/5 rounded-xl px-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    >
                                      <option value="package">Package</option>
                                      <option value="sparkles">Sparkles</option>
                                      <option value="car">Car</option>
                                      <option value="map-pin">Map Pin</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                                      {t.admin.heroMockups.color}
                                    </label>
                                    <select
                                      value={settings.mockups[mock].color}
                                      onChange={(e) =>
                                        handleMockupChange(
                                          mock,
                                          "color",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full h-11 bg-black/20 border border-white/5 rounded-xl px-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    >
                                      <option value="primary">
                                        Brand Primary
                                      </option>
                                      <option value="purple">
                                        Brand Purple
                                      </option>
                                      <option value="accent">
                                        Brand Accent
                                      </option>
                                    </select>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                                    Image Asset
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      placeholder="/custom-mockup.png"
                                      value={settings.mockups[mock].image || ""}
                                      onChange={(e) =>
                                        handleMockupChange(
                                          mock,
                                          "image",
                                          e.target.value,
                                        )
                                      }
                                      className="flex-1 h-11 bg-black/20 border border-white/5 rounded-xl px-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                                    />
                                    <label className="cursor-pointer">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file)
                                            handleImageUpload(mock, file);
                                        }}
                                      />
                                      <div className="h-11 w-11 flex items-center justify-center bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all text-gray-400 hover:text-white">
                                        {isUploading === mock ? (
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                          <Upload className="w-4 h-4" />
                                        )}
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="sticky top-8 glass-card border border-white/10 rounded-4xl p-8 bg-black/20 h-fit">
                        <div className="flex items-center gap-3 mb-8 text-primary">
                          <Eye className="w-5 h-5" />
                          <h4 className="text-sm font-bold uppercase tracking-widest">
                            Live Visual Preview
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 gap-12 max-w-[240px] mx-auto">
                          {["heroLeft", "heroCenter", "heroRight"].map(
                            (mock) => (
                              <DevicePreview
                                key={mock}
                                config={settings.mockups[mock]}
                                title={
                                  mock === "heroLeft"
                                    ? "Left Position"
                                    : mock === "heroCenter"
                                      ? "Center Position"
                                      : "Right Position"
                                }
                                deviceStyle={settings.mockups[mock].style}
                              />
                            ),
                          )}
                        </div>
                        <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                            These previews reflect exactly how the mockups will
                            appear in the Hero section, respecting device aspect
                            ratios and alignment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* CTA Mockups */}
                  <section className="glass-card rounded-4xl p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                          <ImageIcon size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {t.admin.ctaMockups.title}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {t.admin.ctaMockups.desc}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                      <div className="space-y-8">
                        {["ctaLeft", "ctaCenter", "ctaRight"].map((mock) => (
                          <div
                            key={mock}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm hover:border-white/20 transition-all"
                          >
                            <div className="flex flex-col gap-6">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold capitalize flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                  {mock === "ctaLeft"
                                    ? "Mockup 1 (Left)"
                                    : mock === "ctaCenter"
                                      ? "Mockup 2 (Center)"
                                      : "Mockup 3 (Right)"}
                                </span>

                                <div className="flex bg-linear-to-b from-black/40 to-black/20 p-1 rounded-lg border border-white/5">
                                  {["icon", "image"].map((type) => (
                                    <button
                                      key={type}
                                      onClick={() =>
                                        handleMockupChange(mock, "type", type)
                                      }
                                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                                        settings.mockups[mock].type === type
                                          ? "bg-white/10 text-white shadow-sm"
                                          : "text-gray-500 hover:text-gray-400"
                                      }`}
                                    >
                                      {t.admin.heroMockups[
                                        type as keyof typeof t.admin.heroMockups
                                      ] || type}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Categorized Device Selection */}
                              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                                <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
                                  {DEVICE_CATEGORIES.map((cat) => (
                                    <button
                                      key={cat.id}
                                      onClick={() => setMockupCategory(cat.id)}
                                      className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                                        mockupCategory === cat.id
                                          ? "bg-accent/20 text-accent border border-accent/20"
                                          : "text-gray-500 hover:text-gray-300 border border-transparent"
                                      }`}
                                    >
                                      {cat.label}
                                    </button>
                                  ))}
                                </div>
                                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-6 lg:grid-cols-8 gap-3">
                                  {DEVICE_STYLES.filter(
                                    (s) => s.category === mockupCategory,
                                  ).map((s) => (
                                    <button
                                      key={s.id}
                                      onClick={() =>
                                        handleMockupChange(mock, "style", s.id)
                                      }
                                      title={s.label}
                                      className={`p-2.5 rounded-xl transition-all flex items-center justify-center ${
                                        settings.mockups[mock].style === s.id
                                          ? "bg-accent text-white shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-110"
                                          : "bg-black/20 text-gray-500 hover:text-gray-300 hover:bg-black/30"
                                      }`}
                                    >
                                      {s.icon}
                                    </button>
                                  ))}
                                </div>
                                <div className="pt-2">
                                  <p className="text-[10px] text-gray-500 font-medium">
                                    Selected:{" "}
                                    <span className="text-gray-300 font-bold uppercase tracking-tight ml-1">
                                      {DEVICE_STYLES.find(
                                        (s) =>
                                          s.id === settings.mockups[mock].style,
                                      )?.label || "iPhone 16 Pro Max"}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {settings.mockups[mock].type === "icon" ? (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                                      {t.admin.heroMockups.icon}
                                    </label>
                                    <select
                                      value={settings.mockups[mock].icon}
                                      onChange={(e) =>
                                        handleMockupChange(
                                          mock,
                                          "icon",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full h-11 bg-black/20 border border-white/5 rounded-xl px-4 text-sm focus:outline-none focus:border-accent/50 transition-all font-medium"
                                    >
                                      <option value="package">Package</option>
                                      <option value="sparkles">Sparkles</option>
                                      <option value="car">Car</option>
                                      <option value="map-pin">Map Pin</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                                      {t.admin.heroMockups.color}
                                    </label>
                                    <select
                                      value={settings.mockups[mock].color}
                                      onChange={(e) =>
                                        handleMockupChange(
                                          mock,
                                          "color",
                                          e.target.value,
                                        )
                                      }
                                      className="w-full h-11 bg-black/20 border border-white/5 rounded-xl px-4 text-sm focus:outline-none focus:border-accent/50 transition-all font-medium"
                                    >
                                      <option value="primary">
                                        Brand Primary
                                      </option>
                                      <option value="purple">
                                        Brand Purple
                                      </option>
                                      <option value="accent">
                                        Brand Accent
                                      </option>
                                    </select>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                                    Image Asset
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      placeholder="/custom-mockup.png"
                                      value={settings.mockups[mock].image || ""}
                                      onChange={(e) =>
                                        handleMockupChange(
                                          mock,
                                          "image",
                                          e.target.value,
                                        )
                                      }
                                      className="flex-1 h-11 bg-black/20 border border-white/5 rounded-xl px-4 text-sm focus:outline-none focus:border-accent/50 transition-all font-medium"
                                    />
                                    <label className="cursor-pointer">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file)
                                            handleImageUpload(mock, file);
                                        }}
                                      />
                                      <div className="h-11 w-11 flex items-center justify-center bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all text-gray-400 hover:text-white">
                                        {isUploading === mock ? (
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                          <Upload className="w-4 h-4" />
                                        )}
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="sticky top-8 glass-card border border-white/10 rounded-4xl p-8 bg-black/20 h-fit">
                        <div className="flex items-center gap-3 mb-8 text-accent">
                          <Eye className="w-5 h-5" />
                          <h4 className="text-sm font-bold uppercase tracking-widest">
                            Live Visual Preview
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 gap-12 max-w-[240px] mx-auto">
                          {["ctaLeft", "ctaCenter", "ctaRight"].map((mock) => (
                            <DevicePreview
                              key={mock}
                              config={settings.mockups[mock]}
                              title={
                                mock === "ctaLeft"
                                  ? "Left CTA"
                                  : mock === "ctaCenter"
                                    ? "Center CTA"
                                    : "Right CTA"
                              }
                              deviceStyle={settings.mockups[mock].style}
                            />
                          ))}
                        </div>
                        <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5">
                          <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                            These previews reflect exactly how the mockups will
                            appear in the CTA section.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Gallery Mockups */}
                  <section className="glass-card rounded-4xl p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex flex-col gap-1">
                        <h4 className="text-lg font-semibold">
                          {t.admin.galleryMockups?.title ||
                            "App Screens Gallery"}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {t.admin.galleryMockups?.desc ||
                            "Manage the app screens displayed in the gallery before the footer."}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                          <label className="text-sm font-medium text-gray-200">
                            Enable Section
                          </label>
                          <button
                            onClick={() => toggleSection("gallery")}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${settings.sections.gallery?.visible ? "bg-primary" : "bg-white/10"}`}
                          >
                            <span
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${settings.sections.gallery?.visible ? "left-7" : "left-1"}`}
                            />
                          </button>
                        </div>
                        <button
                          onClick={addGalleryScreen}
                          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/10"
                        >
                          <Plus size={16} />
                          Add Screen
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-start">
                      {settings.mockups.gallery?.map(
                        (mock: any, index: number) => (
                          <div
                            key={index}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm flex flex-col gap-6 hover:border-white/20 transition-all relative"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm font-semibold capitalize">
                                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                                {t.admin.galleryMockups?.device || "Device"}{" "}
                                {index + 1}
                              </div>
                              <button
                                onClick={() => removeGalleryScreen(index)}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                                title="Delete Screen"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            {/* Live Preview */}
                            <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/10 overflow-hidden relative group min-h-[220px]">
                              <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              <div className="w-[140px] md:w-[160px] relative z-10 transform group-hover:translate-y-[-4px] transition-transform duration-500">
                                <DevicePreview
                                  config={mock}
                                  title={`Screen ${index + 1}`}
                                  deviceStyle={mock.style}
                                />
                              </div>
                            </div>

                            {/* Device & Upload Controls */}
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col gap-2">
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  Device Model
                                </label>
                                <select
                                  value={mock.style}
                                  onChange={(e) =>
                                    handleGalleryChange(
                                      index,
                                      "style",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-200 outline-none focus:border-primary transition-colors appearance-none"
                                >
                                  {["ios", "android", "tablet", "laptop"].map(
                                    (cat) => {
                                      const devCat = DEVICE_STYLES.filter(
                                        (s) => s.category === cat,
                                      );
                                      if (devCat.length === 0) return null;
                                      return (
                                        <optgroup
                                          key={cat}
                                          label={cat.toUpperCase()}
                                          className="bg-slate-900 text-gray-400 font-semibold p-2"
                                        >
                                          {devCat.map((s) => (
                                            <option
                                              key={s.id}
                                              value={s.id}
                                              className="text-gray-200"
                                            >
                                              {s.label}
                                            </option>
                                          ))}
                                        </optgroup>
                                      );
                                    },
                                  )}
                                </select>
                              </div>

                              <div>
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                                  {t.admin.heroMockups.image || "Screen Image"}
                                </label>
                                <div className="relative group">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file)
                                        handleImageUpload(
                                          `gallery-${index}`,
                                          file,
                                        );
                                    }}
                                    className="hidden"
                                    id={`gallery-upload-${index}`}
                                    disabled={
                                      isUploading === `gallery-${index}`
                                    }
                                  />
                                  <label
                                    htmlFor={`gallery-upload-${index}`}
                                    className="flex items-center justify-center w-full h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 cursor-pointer transition-all"
                                  >
                                    {isUploading === `gallery-${index}` ? (
                                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    ) : (
                                      <div className="flex items-center gap-2 text-gray-300 group-hover:text-primary transition-colors text-sm font-medium">
                                        <Upload className="w-4 h-4" />
                                        {mock.image
                                          ? "Change Image"
                                          : "Upload Image"}
                                      </div>
                                    )}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </section>

                  {/* Admin Credentials */}
                  <section className="glass-card rounded-4xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {t.admin.adminAuth.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {t.admin.adminAuth.desc}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-3">
                            {t.admin.adminAuth.email}
                          </label>
                          <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-3">
                            {t.admin.adminAuth.password}
                          </label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <button
                        onClick={onUpdateCredentials}
                        className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-medium border border-white/10"
                      >
                        {saving ? t.admin.saving : t.admin.saveChanges}
                      </button>
                    </div>
                  </section>
                </motion.div>
              ) : activeTab === "sections" ? (
                <motion.div
                  key="sections-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="glass-card rounded-4xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Layout className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {t.admin.sections_tab.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {t.admin.sections_tab.desc}
                        </p>
                      </div>
                    </div>

                    <div className="divide-y divide-white/5">
                      {[
                        {
                          id: "hero",
                          title: t.admin.sections_tab.hero,
                          icon: <Smartphone className="w-5 h-5" />,
                        },
                        {
                          id: "features",
                          title: t.admin.sections_tab.features,
                          icon: <Layout className="w-5 h-5" />,
                        },
                        {
                          id: "cta",
                          title: t.admin.sections_tab.cta,
                          icon: <CheckCircle2 className="w-5 h-5" />,
                        },
                        {
                          id: "gallery",
                          title:
                            t.admin.galleryMockups?.title ||
                            "App screens Gallery",
                          icon: <Grid className="w-5 h-5" />,
                        },
                      ].map((section) => (
                        <div key={section.id} className="py-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                                {section.icon}
                              </div>
                              <div>
                                <p className="font-semibold">{section.title}</p>
                                <div className="flex items-center gap-3 mt-1">
                                  <p className="text-xs text-gray-500">
                                    {settings.sections[section.id]?.visible
                                      ? t.admin.sections_tab.show
                                      : t.admin.sections_tab.hide}
                                  </p>
                                  <button
                                    onClick={() =>
                                      setEditingSection(
                                        editingSection === section.id
                                          ? null
                                          : section.id,
                                      )
                                    }
                                    className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                      editingSection === section.id
                                        ? "text-primary"
                                        : "text-gray-400 hover:text-white"
                                    }`}
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    {editingSection === section.id
                                      ? t.admin.sectionEditor.closeEditor
                                      : t.admin.sectionEditor.editContent}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => toggleSection(section.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                settings.sections[section.id]?.visible
                                  ? "bg-primary"
                                  : "bg-white/10"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings.sections[section.id]?.visible
                                    ? lang === "ar"
                                      ? "-translate-x-6"
                                      : "translate-x-6"
                                    : lang === "ar"
                                      ? "-translate-x-1"
                                      : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          <AnimatePresence>
                            {editingSection === section.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <SectionContentEditor
                                  sectionId={section.id}
                                  content={getMergedSectionContent(section.id)}
                                  onContentChange={handleContentChange}
                                  onImageUpload={handleImageUpload}
                                  lang={lang}
                                  t={t}
                                />
                                {section.id === "gallery" && (
                                  <div className="mt-8 border-t border-white/5 pt-8">
                                    <div className="flex items-center justify-between mb-6">
                                      <h5 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                                        Gallery Screens
                                      </h5>
                                      <button
                                        onClick={addGalleryScreen}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-colors border border-white/10"
                                      >
                                        <Plus size={14} />
                                        Add Screen
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                      {settings.mockups.gallery?.map(
                                        (mock: any, index: number) => (
                                          <div
                                            key={index}
                                            className="p-4 rounded-xl bg-white/5 border border-white/5 relative"
                                          >
                                            <div className="flex items-center justify-between mb-4">
                                              <span className="text-xs font-semibold text-gray-500">
                                                Screen {index + 1}
                                              </span>
                                              <button
                                                onClick={() =>
                                                  removeGalleryScreen(index)
                                                }
                                                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                              >
                                                <Trash2 size={14} />
                                              </button>
                                            </div>

                                            <div className="flex flex-col gap-2 mb-4">
                                              <select
                                                value={mock.style}
                                                onChange={(e) =>
                                                  handleGalleryChange(
                                                    index,
                                                    "style",
                                                    e.target.value,
                                                  )
                                                }
                                                className="w-full bg-black/40 border border-white/5 rounded-lg px-2 py-1.5 text-xs text-gray-300 outline-none focus:border-primary transition-colors appearance-none"
                                              >
                                                {[
                                                  "ios",
                                                  "android",
                                                  "tablet",
                                                  "laptop",
                                                ].map((cat) => {
                                                  const devCat =
                                                    DEVICE_STYLES.filter(
                                                      (s) => s.category === cat,
                                                    );
                                                  if (devCat.length === 0)
                                                    return null;
                                                  return (
                                                    <optgroup
                                                      key={cat}
                                                      label={cat.toUpperCase()}
                                                      className="bg-slate-900 border-none"
                                                    >
                                                      {devCat.map((s) => (
                                                        <option
                                                          key={s.id}
                                                          value={s.id}
                                                        >
                                                          {s.label}
                                                        </option>
                                                      ))}
                                                    </optgroup>
                                                  );
                                                })}
                                              </select>
                                            </div>

                                            <div className="relative group aspect-9/19 rounded-xl overflow-hidden bg-black/20 border border-white/5">
                                              {mock.image ? (
                                                <img
                                                  src={mock.image}
                                                  alt="Preview"
                                                  className="w-full h-full object-cover"
                                                />
                                              ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                                                  <Upload size={20} />
                                                  <span className="text-[10px]">
                                                    Upload
                                                  </span>
                                                </div>
                                              )}
                                              <input
                                                type="file"
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                  const file =
                                                    e.target.files?.[0];
                                                  if (file)
                                                    handleImageUpload(
                                                      `gallery-${index}`,
                                                      file,
                                                    );
                                                }}
                                              />
                                              {isUploading ===
                                                `gallery-${index}` && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="pages-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="glass-card rounded-4xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {t.admin.pages_tab.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {t.admin.pages_tab.desc}
                        </p>
                      </div>
                    </div>

                    <div className="divide-y divide-white/5">
                      {[
                        {
                          id: "about",
                          title: t.admin.pages_tab.about,
                          icon: <Info className="w-5 h-5" />,
                        },
                        {
                          id: "services",
                          title: t.admin.pages_tab.services,
                          icon: <Package className="w-5 h-5" />,
                        },
                        {
                          id: "contact",
                          title: t.admin.pages_tab.contact,
                          icon: <Phone className="w-5 h-5" />,
                        },
                        {
                          id: "careers",
                          title: t.admin.pages_tab.careers,
                          icon: <Users className="w-5 h-5" />,
                        },
                        {
                          id: "press",
                          title: t.admin.pages_tab.press,
                          icon: <Newspaper className="w-5 h-5" />,
                        },
                        {
                          id: "service_divider",
                          isDivider: true,
                          title:
                            lang === "ar"
                              ? "تفاصيل الخدمات"
                              : lang === "sv"
                                ? "Tjänstdetaljer"
                                : "Service Details",
                        },
                        {
                          id: "service_shipping",
                          title: t.admin.pages_tab.service_shipping,
                          icon: <Package className="w-5 h-5 text-primary" />,
                        },
                        {
                          id: "service_taxi",
                          title: t.admin.pages_tab.service_taxi,
                          icon: <Car className="w-5 h-5 text-purple-400" />,
                        },
                        {
                          id: "service_cleaning",
                          title: t.admin.pages_tab.service_cleaning,
                          icon: <Sparkles className="w-5 h-5 text-accent" />,
                        },
                        {
                          id: "service_containerShipping",
                          title: t.admin.pages_tab.service_containerShipping,
                          icon: <Package className="w-5 h-5 text-blue-400" />,
                        },
                      ].map((section: any) =>
                        section.isDivider ? (
                          <div
                            key={section.id}
                            className="pt-8 pb-4 border-b border-white/5"
                          >
                            <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-primary" />
                              {section.title}
                            </h5>
                          </div>
                        ) : (
                          <div key={section.id} className="py-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                                  {section.icon}
                                </div>
                                <div>
                                  <p className="font-semibold">
                                    {section.title}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <p className="text-xs text-gray-500">
                                      {settings.sections[section.id]?.visible
                                        ? t.admin.pages_tab.show
                                        : t.admin.pages_tab.hide}
                                    </p>
                                    <button
                                      onClick={() =>
                                        setEditingPage(
                                          editingPage === section.id
                                            ? null
                                            : section.id,
                                        )
                                      }
                                      className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                        editingPage === section.id
                                          ? "text-primary"
                                          : "text-gray-400 hover:text-white"
                                      }`}
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      {editingPage === section.id
                                        ? t.admin.sectionEditor.closeEditor
                                        : t.admin.sectionEditor.editContent}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => toggleSection(section.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                  settings.sections[section.id]?.visible
                                    ? "bg-primary"
                                    : "bg-white/10"
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    settings.sections[section.id]?.visible
                                      ? lang === "ar"
                                        ? "-translate-x-6"
                                        : "translate-x-6"
                                      : lang === "ar"
                                        ? "-translate-x-1"
                                        : "translate-x-1"
                                  }`}
                                />
                              </button>
                            </div>

                            <AnimatePresence>
                              {editingPage === section.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <SectionContentEditor
                                    sectionId={section.id}
                                    content={getMergedSectionContent(
                                      section.id,
                                    )}
                                    sectionData={settings.sections[section.id]}
                                    onContentChange={handleContentChange}
                                    onImageUpload={handleImageUpload}
                                    onListItemChange={handleListItemChange}
                                    onListItemLanguageChange={
                                      handleListItemLanguageChange
                                    }
                                    onAddListItem={addListItem}
                                    onRemoveListItem={removeListItem}
                                    lang={lang}
                                    t={t}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-gray-600">
          {t.admin.footer}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {toast.show && (
          <motion.div
            key="admin-toast"
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.9,
              x: lang === "ar" ? 20 : -20,
            }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.9,
              transition: { duration: 0.2 },
            }}
            className={`fixed bottom-8 ${lang === "ar" ? "left-8" : "right-8"} z-50 flex items-center gap-3 px-6 py-4 rounded-2xl glass-card border ${
              toast.type === "success"
                ? "border-green-500/20 text-green-500"
                : "border-red-500/20 text-red-500"
            } shadow-2xl min-w-[300px]`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                toast.type === "success" ? "bg-green-500/10" : "bg-red-500/10"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Shield className="w-5 h-5" />
              )}
            </div>
            <div className={lang === "ar" ? "text-right" : "text-left"}>
              <p className="font-bold text-sm tracking-tight">
                {toast.type === "success"
                  ? lang === "ar"
                    ? "نجاح"
                    : "Success"
                  : lang === "ar"
                    ? "خطأ"
                    : "Error"}
              </p>
              <p className="text-xs opacity-80">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
              className="ml-auto opacity-40 hover:opacity-100 transition-opacity"
            >
              <Loader2 className="w-4 h-4 rotate-45" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionContentEditor({
  sectionId,
  content,
  sectionData,
  onContentChange,
  onImageUpload,
  onListItemChange,
  onListItemLanguageChange,
  onAddListItem,
  onRemoveListItem,
  lang,
  t,
}: any) {
  let fields: string[] = [];

  switch (sectionId) {
    case "hero":
      fields = ["tag", "title1", "title2", "desc"];
      break;
    case "features":
      fields = ["title1", "title2", "desc"];
      break;
    case "cta":
      fields = ["title", "desc", "button"];
      break;
    case "gallery":
      fields = ["headline", "description"];
      break;
    case "about":
      fields = [
        "title",
        "subtitle",
        "missionTitle",
        "missionDesc",
        "visionTitle",
        "visionDesc",
      ];
      break;
    case "services":
      fields = ["title", "subtitle", "allServices"];
      break;
    case "contact":
      fields = [
        "title",
        "subtitle",
        "formName",
        "formEmail",
        "formSubject",
        "formMessage",
        "formSubmit",
        "addressTitle",
        "addressSweden",
        "addressTunisia",
        "emailTitle",
        "phoneTitle",
      ];
      break;
    case "careers":
      fields = [
        "title",
        "subtitle",
        "openPositions",
        "noPositions",
        "sendResume",
      ];
      break;
    case "press":
      fields = [
        "title",
        "subtitle",
        "pressReleases",
        "noReleases",
        "mediaContact",
      ];
      break;
    case "service_shipping":
    case "service_taxi":
    case "service_cleaning":
    case "service_containerShipping":
      fields = ["title", "desc", "cta", "features", "image"];
      break;
    default:
      fields = ["title", "desc"];
  }

  const getFieldLabel = (field: string) => {
    const key = `field${field.charAt(0).toUpperCase() + field.slice(1)}`;
    switch (key) {
      case "fieldImage":
        return t.admin.sectionEditor.fieldImage;
      case "fieldHeadline":
        return t.admin.sectionEditor.fieldHeadline;
      case "fieldDescription":
        return t.admin.sectionEditor.fieldDescription;
      case "fieldFeatures":
        return t.admin.sectionEditor.fieldFeatures;
      case "fieldCta":
        return t.admin.sectionEditor.fieldCta;
      default:
        return field.charAt(0).toUpperCase() + field.slice(1);
    }
  };

  return (
    <div className="mt-6 p-6 rounded-2xl bg-black/40 border border-white/5 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Globe className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
          {t.admin.sectionEditor.editLanguages}
        </span>
      </div>

      {sectionId.startsWith("service_") && (
        <div className="space-y-4 mb-8 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Service Image (Shared across all languages)
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex gap-4 items-start">
              <div className="relative group w-48 aspect-video bg-white/5 border border-white/10 rounded-lg overflow-hidden shrink-0">
                {content?.en?.image ? (
                  <img
                    src={content?.en?.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <ImageIcon size={24} />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && onImageUpload) {
                      onImageUpload(`section-${sectionId}-en-image`, file);
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={content?.en?.image || ""}
                  placeholder="/path/to/image.png"
                  onChange={(e) =>
                    onContentChange(sectionId, "en", "image", e.target.value)
                  }
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-primary/50"
                />
                <p className="text-[10px] text-gray-500 italic">
                  Click to upload or enter image path manually. This image will
                  be used for all languages.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {["en", "sv", "ar"].map((l) => (
        <div key={l} className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-gray-400 uppercase">
              {l}
            </span>
          </div>
          <div className="space-y-4">
            {fields
              .filter(
                (field) =>
                  !sectionId.startsWith("service_") || field !== "image",
              )
              .map((field) => (
                <div key={field}>
                  <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                    {getFieldLabel(field)}
                  </label>
                  {field === "desc" ||
                  field === "description" ||
                  field === "features" ? (
                    <textarea
                      value={
                        field === "features"
                          ? Array.isArray(content?.[l]?.[field])
                            ? content?.[l]?.[field].join("\n")
                            : content?.[l]?.[field] || ""
                          : content?.[l]?.[field] || ""
                      }
                      placeholder={
                        field === "features"
                          ? "Feature 1\nFeature 2\nFeature 3"
                          : ""
                      }
                      onChange={(e) =>
                        onContentChange(sectionId, l, field, e.target.value)
                      }
                      className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary/50"
                    />
                  ) : field === "image" ? (
                    <div className="space-y-3">
                      <div className="flex gap-4 items-start">
                        <div className="relative group w-32 aspect-video bg-white/5 border border-white/10 rounded-lg overflow-hidden shrink-0">
                          {content?.[l]?.[field] ? (
                            <img
                              src={content?.[l]?.[field]}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <ImageIcon size={20} />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file && onImageUpload) {
                                onImageUpload(
                                  `section-${sectionId}-${l}-${field}`,
                                  file,
                                );
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <Upload className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={content?.[l]?.[field] || ""}
                            placeholder="/path/to/image.png"
                            onChange={(e) =>
                              onContentChange(
                                sectionId,
                                l,
                                field,
                                e.target.value,
                              )
                            }
                            className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-primary/50"
                          />
                          <p className="text-[10px] text-gray-500 italic">
                            Click to upload or enter image path manually
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={content?.[l]?.[field] || ""}
                      onChange={(e) =>
                        onContentChange(sectionId, l, field, e.target.value)
                      }
                      className="w-full h-10 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-primary/50"
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Specialized List Editors */}
      {sectionId === "careers" && (
        <div className="pt-8 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">
                Manage Positions
              </span>
            </div>
            <button
              onClick={() => onAddListItem("careers", "positions")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-bold hover:bg-primary/30 transition-colors"
            >
              <Plus size={14} />
              Add Position
            </button>
          </div>

          <div className="space-y-4">
            {(sectionData?.positions || []).map((job: any, index: number) => (
              <div
                key={job.id}
                className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold text-gray-600">
                    POSITION #{index + 1}
                  </span>
                  <button
                    onClick={() =>
                      onRemoveListItem("careers", "positions", index)
                    }
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {["en", "sv", "ar"].map((l) => (
                    <div key={l} className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">
                        Title ({l})
                      </label>
                      <input
                        type="text"
                        value={job.title[l] || ""}
                        onChange={(e) =>
                          onListItemLanguageChange(
                            "careers",
                            "positions",
                            index,
                            "title",
                            l,
                            e.target.value,
                          )
                        }
                        className="w-full h-9 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Application Link
                    </label>
                    <input
                      type="text"
                      value={job.link || ""}
                      onChange={(e) =>
                        onListItemChange(
                          "careers",
                          "positions",
                          index,
                          "link",
                          e.target.value,
                        )
                      }
                      className="w-full h-9 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {["department", "location", "type"].map((field) => (
                    <div key={field} className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">
                        {field} (EN)
                      </label>
                      <input
                        type="text"
                        value={job[field]?.en || ""}
                        onChange={(e) =>
                          onListItemLanguageChange(
                            "careers",
                            "positions",
                            index,
                            field,
                            "en",
                            e.target.value,
                          )
                        }
                        className="w-full h-9 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sectionId === "press" && (
        <div className="pt-8 border-t border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-white">
                Manage Press Releases
              </span>
            </div>
            <button
              onClick={() => onAddListItem("press", "pressList")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-bold hover:bg-primary/30 transition-colors"
            >
              <Plus size={14} />
              Add Release
            </button>
          </div>

          <div className="space-y-4">
            {(sectionData?.pressList || []).map((item: any, index: number) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold text-gray-600">
                    RELEASE #{index + 1}
                  </span>
                  <button
                    onClick={() =>
                      onRemoveListItem("press", "pressList", index)
                    }
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Date
                    </label>
                    <input
                      type="date"
                      value={item.date || ""}
                      onChange={(e) =>
                        onListItemChange(
                          "press",
                          "pressList",
                          index,
                          "date",
                          e.target.value,
                        )
                      }
                      className="w-full h-9 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">
                      Link
                    </label>
                    <input
                      type="text"
                      value={item.link || ""}
                      onChange={(e) =>
                        onListItemChange(
                          "press",
                          "pressList",
                          index,
                          "link",
                          e.target.value,
                        )
                      }
                      className="w-full h-9 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                {["en", "sv", "ar"].map((l) => (
                  <div key={l} className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">
                        Title ({l})
                      </label>
                      <input
                        type="text"
                        value={item.title[l] || ""}
                        onChange={(e) =>
                          onListItemLanguageChange(
                            "press",
                            "pressList",
                            index,
                            "title",
                            l,
                            e.target.value,
                          )
                        }
                        className="w-full h-9 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">
                        Excerpt ({l})
                      </label>
                      <input
                        type="text"
                        value={item.excerpt[l] || ""}
                        onChange={(e) =>
                          onListItemLanguageChange(
                            "press",
                            "pressList",
                            index,
                            "excerpt",
                            l,
                            e.target.value,
                          )
                        }
                        className="w-full h-9 bg-white/5 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DevicePreview({
  config,
  title,
  deviceStyle = "iphone-15",
}: {
  config: any;
  title: string;
  deviceStyle?: string;
}) {
  const isImageMockup = deviceStyle.startsWith("/devices/");

  // Helper to get icon component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "sparkles":
        return Sparkles;
      case "car":
        return Car;
      case "map-pin":
        return MapPin;
      default:
        return Package;
    }
  };

  const Icon = getIcon(config?.icon || "package");
  const currentDeviceStyle = isImageMockup
    ? deviceStyle
    : "/devices/iOS/16 Pro Max/16 Pro Max - Black Titanium.png";
  const device = DEVICE_STYLES.find((s) => s.id === currentDeviceStyle);
  const deviceLabel = device?.label || currentDeviceStyle;

  // ── Pixel-exact bezel measurements ──────────────────────────────────────
  // Derived by scanning actual PNG alpha channels to locate the transparent screen hole.
  // Format: [left%, top%, right%, bottom%]  (used to set inline padding)
  const BEZEL_MAP: Record<string, [number, number, number, number]> = {
    // iOS phones
    "/devices/iOS/16 Pro Max/16 Pro Max - Black Titanium.png": [
      7.5, 5.5, 7.5, 4.5,
    ],
    "/devices/iOS/16 Pro Max/16 Pro Max - Desert Titanium.png": [
      7.5, 5.5, 7.5, 4.5,
    ],
    "/devices/iOS/16 Pro/16 Pro - Black Titanium.png": [7.5, 5.5, 7.5, 4.5],
    "/devices/iOS/16/16 - Ultramarine.png": [7.5, 5.5, 7.5, 4.5],
    "/devices/iOS/15 Pro Max/15 Pro Max - Natural Titanium.png": [
      7.5, 5.5, 7.5, 4.5,
    ],
    // Android phones
    "/devices/Android Phone/Pixel 9 Pro XL/Pixel 9 Pro XL Obsidian.png": [
      10.5, 6.0, 10.5, 5.0,
    ],
    "/devices/Android Phone/Pixel 9 Pro XL/Pixel 9 Pro XL Rose Quartz.png": [
      10.5, 6.0, 10.5, 5.0,
    ],
    "/devices/Android Phone/Pixel 9 Pro XL/Pixel 9 Pro XL Hazel.png": [
      10.5, 6.0, 10.5, 5.0,
    ],
    "/devices/Android Phone/Pixel 8 Pro/Pixel 8 Pro - Black.png": [
      11.5, 7.0, 11.5, 6.0,
    ],
    "/devices/Android Phone/Pixel 8 Pro/Pixel 8 Pro - Silver.png": [
      11.5, 7.0, 11.5, 6.0,
    ],
    "/devices/Android Phone/Pixel 8 Pro/Pixel 8 Pro - Blue.png": [
      11.5, 7.0, 11.5, 6.0,
    ],
    "/devices/Android Phone/Pixel 9 Pro/Pixel 9 Pro - Obsidian.png": [
      10.5, 6.0, 10.5, 5.0,
    ],
    "/devices/Android Phone/Pixel 9 Pro/Pixel 9 Pro - Hazel.png": [
      10.5, 6.0, 10.5, 5.0,
    ],
    "/devices/Android Phone/Pixel 9 Pro/Pixel 9 Pro - Rose Quartz.png": [
      10.5, 6.0, 10.5, 5.0,
    ],
    "/devices/Android Phone/Pixel 8/Pixel 8 - Hazel.png": [
      11.5, 7.0, 11.5, 6.0,
    ],
    // Tablets - iPadOS
    "/devices/iPadOS/iPad Pro/M4 & M5/13/iPad Pro 13 M4 & M5 - Portrait - Silver.png":
      [4.42, 3.39, 4.46, 3.42],
    "/devices/iPadOS/iPad Air/M2 & M3/13/iPad Air 13 - M2 & M3 - Portrait - Space Gray.png":
      [4.45, 3.41, 4.49, 3.44],
    // Tablets - Android
    "/devices/Android Tablet/Samsung Galaxy Tab S11 Ultra/Samsung Galaxy Tab S11 Ultra.png":
      [5.95, 8.85, 5.98, 8.85],
    "/devices/Android Tablet/Pixel Tablet/Pixel Tablet - Hazel.png": [
      6.36, 9.41, 6.39, 9.43,
    ],
    "/devices/Android Tablet/Pixel Tablet/Pixel Tablet - Porcelain.png": [
      6.36, 9.41, 6.39, 9.43,
    ],
    // Laptops
    "/devices/MacBook/MacBook Pro 16.png": [10.2, 11.0, 10.2, 11.0],
    "/devices/MacBook/MacBook Air 15.png": [9.8, 10.6, 9.8, 10.6],
    "/devices/Windows Laptop/Dell/2024 XPS 16 Platinum.png": [
      11.0, 8.3, 11.0, 8.3,
    ],
  };

  const bezel = BEZEL_MAP[currentDeviceStyle] ?? [7.5, 5.0, 7.5, 5.0]; // default iPhone 16 Pro Max
  const [l, t, r, b] = bezel;

  let rounding = "8%";
  if (
    (currentDeviceStyle || "").toLowerCase().includes("laptop") ||
    (currentDeviceStyle || "").toLowerCase().includes("macbook")
  ) {
    rounding = "0.4%";
  } else if (
    (currentDeviceStyle || "").toLowerCase().includes("ipad") ||
    (currentDeviceStyle || "").toLowerCase().includes("tablet")
  ) {
    rounding = "5%";
  } else if ((currentDeviceStyle || "").toLowerCase().includes("pixel")) {
    rounding = "8%";
  } else if (
    (currentDeviceStyle || "").toLowerCase().includes("iphone") ||
    (currentDeviceStyle || "").toLowerCase().includes("ios")
  ) {
    rounding = "8%";
  }

  // Encode URL with proper segment-level encoding (handles & and spaces)
  const frameSrc = currentDeviceStyle
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  const paddingStyle = {
    paddingLeft: `${l}%`,
    paddingRight: `${r}%`,
    paddingTop: `${t}%`,
    paddingBottom: `${b}%`,
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full drop-shadow-2xl group transition-all duration-500 hover:scale-[1.02]">
        <img
          src={frameSrc}
          alt="Device Frame"
          className="w-full h-auto block relative z-20 pointer-events-none drop-shadow-lg"
        />
        <div
          className="absolute inset-0 z-10 overflow-hidden select-none touch-none"
          style={{ ...paddingStyle, borderRadius: rounding }}
        >
          <div
            className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center bg-slate-950/20 backdrop-blur-sm"
            style={{ borderRadius: rounding }}
          >
            <div className="relative z-10 w-full h-full translate-y-[1mm] overflow-hidden">
              {config?.type === "image" && config?.image ? (
                <img
                  src={config.image}
                  alt="Preview"
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center mb-3 shadow-[0_10px_20px_rgba(0,0,0,0.3)] ring-2 ring-white/10">
                    <Icon size={18} className="text-white drop-shadow-md" />
                  </div>
                  <div className="w-16 h-2 bg-white/10 rounded-full mb-1.5" />
                  <div className="w-10 h-1.5 bg-white/5 rounded-full" />
                </div>
              )}
            </div>

            {/* Subtle gloss effect overlay */}
            <div className="absolute inset-0 bg-linear-to-tr from-white/5 via-transparent to-transparent pointer-events-none z-30" />
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center text-center gap-1.5 px-4">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-none">
          {title}
        </span>
        <span className="text-[10px] font-medium text-accent bg-accent/5 px-2 py-0.5 rounded-full border border-accent/10 truncate max-w-[180px]">
          {deviceLabel}
        </span>
      </div>
    </div>
  );
}
