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
  { id: "iphone-15", label: "iPhone (Island)", icon: <PhoneIcon size={14} /> },
  {
    id: "iphone-notch",
    label: "iPhone (Notch)",
    icon: <Smartphone size={14} />,
  },
  {
    id: "android-centered",
    label: "Android (Center)",
    icon: <Smartphone size={14} />,
  },
  {
    id: "android-left",
    label: "Android (Left)",
    icon: <Smartphone size={14} />,
  },
  { id: "ipad", label: "iPad Pro", icon: <Layout size={14} /> },
  { id: "tablet", label: "Tablet", icon: <Layout size={14} /> },
  { id: "minimal", label: "Minimal", icon: <AppWindow size={14} /> },
  { id: "laptop", label: "Laptop", icon: <Laptop size={14} /> },
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

  const removeListItem = (sectionId: string, listKey: string, index: number) => {
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
            style: "iphone-15",
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
                              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${settings.links.appStoreEnabled ? (lang === "ar" ? "right-5" : "left-5") : (lang === "ar" ? "right-0.5" : "left-0.5")}`}
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
                              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${settings.links.googlePlayEnabled ? (lang === "ar" ? "right-5" : "left-5") : (lang === "ar" ? "right-0.5" : "left-0.5")}`}
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
                      <div className="flex flex-col gap-1">
                        <h4 className="text-lg font-semibold">
                          {t.admin.heroMockups.title}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {t.admin.heroMockups.desc}
                        </p>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                      <div className="space-y-8">
                        {["heroLeft", "heroCenter", "heroRight"].map((mock) => (
                          <div
                            key={mock}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm hover:border-white/20 transition-all"
                          >
                            <div className="flex items-center justify-between mb-6">
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

                              {/* Per-Mockup Device Style Selection */}
                              <div className="flex flex-wrap gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
                                {DEVICE_STYLES.map((s) => (
                                  <button
                                    key={s.id}
                                    onClick={() =>
                                      handleMockupChange(mock, "style", s.id)
                                    }
                                    title={s.label}
                                    className={`p-1.5 rounded-lg transition-all ${
                                      settings.mockups[mock].style === s.id
                                        ? "bg-primary text-white"
                                        : "text-gray-500 hover:text-gray-300"
                                    }`}
                                  >
                                    {s.icon}
                                  </button>
                                ))}
                              </div>
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
                                    className="w-full h-10 bg-black/20 border border-white/5 rounded-lg px-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
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
                                    className="w-full h-10 bg-black/20 border border-white/5 rounded-lg px-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
                                  >
                                    <option value="primary">
                                      Brand Primary
                                    </option>
                                    <option value="purple">Brand Purple</option>
                                    <option value="accent">Brand Accent</option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                                  Image Path
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
                                    className="flex-1 h-10 bg-black/20 border border-white/5 rounded-lg px-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
                                  />
                                  <label className="cursor-pointer">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(mock, file);
                                      }}
                                    />
                                    <div className="h-10 w-10 flex items-center justify-center bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-all text-gray-400 hover:text-white">
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
                        ))}
                      </div>

                      <div className="sticky top-8 glass border border-white/5 rounded-3xl p-6 bg-white/5 h-fit">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                          <Smartphone className="w-4 h-4" />
                          <h4 className="text-sm font-bold uppercase tracking-wider">
                            {t.admin.preview_label}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 gap-8 max-w-[200px] mx-auto">
                          {["heroLeft", "heroCenter", "heroRight"].map(
                            (mock) => (
                              <DevicePreview
                                key={mock}
                                config={settings.mockups[mock]}
                                title={mock.replace("hero", "")}
                                deviceStyle={settings.mockups[mock].style}
                              />
                            ),
                          )}
                        </div>
                        <p className="mt-6 text-[10px] text-gray-500 text-center leading-relaxed">
                          Visualizing all hero mockups with current settings.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* CTA Mockups */}
                  <section className="glass-card rounded-4xl p-8">
                    <div className="flex items-center gap-3 mb-8">
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

                    <div className="grid lg:grid-cols-2 gap-8 items-start mt-8">
                      <div className="space-y-8">
                        {["ctaLeft", "ctaCenter", "ctaRight"].map((mock) => (
                          <div
                            key={mock}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm hover:border-white/20 transition-all"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <span className="text-sm font-semibold capitalize flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                {mock === "ctaLeft"
                                  ? "Mockup 1 (Left)"
                                  : mock === "ctaCenter"
                                    ? "Mockup 2 (Center)"
                                    : "Mockup 3 (Right)"}
                              </span>
                              {/* Per-Mockup Device Style Selection */}
                              <div className="flex flex-wrap gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
                                {DEVICE_STYLES.map((s) => (
                                  <button
                                    key={s.id}
                                    onClick={() =>
                                      handleMockupChange(mock, "style", s.id)
                                    }
                                    title={s.label}
                                    className={`p-1.5 rounded-lg transition-all ${
                                      settings.mockups[mock].style === s.id
                                        ? "bg-primary text-white"
                                        : "text-gray-500 hover:text-gray-300"
                                    }`}
                                  >
                                    {s.icon}
                                  </button>
                                ))}
                              </div>
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
                                    className="w-full h-10 bg-black/20 border border-white/5 rounded-lg px-3 text-sm focus:outline-none focus:border-accent/50 transition-all"
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
                                    className="w-full h-10 bg-black/20 border border-white/5 rounded-lg px-3 text-sm focus:outline-none focus:border-accent/50 transition-all"
                                  >
                                    <option value="primary">
                                      Brand Primary
                                    </option>
                                    <option value="purple">Brand Purple</option>
                                    <option value="accent">Brand Accent</option>
                                  </select>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                                  Image Path
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
                                    className="flex-1 h-10 bg-black/20 border border-white/5 rounded-lg px-3 text-sm focus:outline-none focus:border-accent/50 transition-all"
                                  />
                                  <label className="cursor-pointer">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleImageUpload(mock, file);
                                      }}
                                    />
                                    <div className="h-10 w-10 flex items-center justify-center bg-white/5 border border-white/5 rounded-lg hover:bg-white/10 transition-all text-gray-400 hover:text-white">
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
                        ))}
                      </div>

                      <div className="sticky top-8 glass border border-white/5 rounded-3xl p-6 bg-white/5 h-fit">
                        <div className="flex items-center gap-2 mb-6 text-accent">
                          <Smartphone className="w-4 h-4" />
                          <h4 className="text-sm font-bold uppercase tracking-wider">
                            {t.admin.preview_label}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 gap-8 max-w-[200px] mx-auto">
                          {["ctaLeft", "ctaCenter", "ctaRight"].map((mock) => (
                            <DevicePreview
                              key={mock}
                              config={settings.mockups[mock]}
                              title={mock.replace("cta", "")}
                              deviceStyle={settings.mockups[mock].style}
                            />
                          ))}
                        </div>
                        <p className="mt-6 text-[10px] text-gray-500 text-center leading-relaxed">
                          Visualizing all CTA mockups with current settings.
                        </p>
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
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm hover:border-white/20 transition-all relative"
                          >
                            <div className="flex items-center justify-between mb-6">
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

                            <div className="flex flex-wrap gap-1 p-1 bg-black/40 rounded-xl border border-white/5 mb-6">
                              {DEVICE_STYLES.map((s) => (
                                <button
                                  key={s.id}
                                  onClick={() =>
                                    handleGalleryChange(index, "style", s.id)
                                  }
                                  title={s.label}
                                  className={`p-1.5 rounded-lg transition-all ${
                                    mock.style === s.id
                                      ? "bg-primary text-white"
                                      : "text-gray-500 hover:text-gray-300"
                                  }`}
                                >
                                  {s.icon}
                                </button>
                              ))}
                            </div>

                            <div>
                              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                                {t.admin.heroMockups.image}
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
                                  disabled={isUploading === `gallery-${index}`}
                                />
                                <label
                                  htmlFor={`gallery-upload-${index}`}
                                  className="flex flex-col items-center justify-center w-full aspect-9/19 rounded-2xl border-2 border-dashed border-white/10 bg-black/20 hover:bg-black/40 hover:border-primary/50 cursor-pointer transition-all overflow-hidden relative group-hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                                >
                                  {mock.image ? (
                                    <>
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={mock.image}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                                        <Upload className="w-6 h-6 text-white" />
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-primary transition-colors">
                                      {isUploading === `gallery-${index}` ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                      ) : (
                                        <>
                                          <ImageIcon className="w-8 h-8 opacity-50" />
                                          <span className="text-xs font-medium">
                                            Upload Image
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </label>
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

                                            <div className="flex flex-wrap gap-1 p-1 bg-black/40 rounded-lg border border-white/5 mb-4">
                                              {DEVICE_STYLES.map((s) => (
                                                <button
                                                  key={s.id}
                                                  onClick={() =>
                                                    handleGalleryChange(
                                                      index,
                                                      "style",
                                                      s.id,
                                                    )
                                                  }
                                                  title={s.label}
                                                  className={`p-1 rounded-md transition-all ${
                                                    mock.style === s.id
                                                      ? "bg-primary text-white"
                                                      : "text-gray-500 hover:text-gray-300"
                                                  }`}
                                                >
                                                  {s.icon}
                                                </button>
                                              ))}
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
  const isLaptop = deviceStyle === "laptop";
  const isTablet = deviceStyle === "ipad" || deviceStyle === "tablet";

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

  const getAspect = () => {
    if (isLaptop) return "aspect-16/10 w-44";
    if (isTablet) return "aspect-3/4 w-32";
    return "aspect-9/19 w-28";
  };

  const renderSensors = () => {
    switch (deviceStyle) {
      case "iphone-15":
        return (
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-2.5 bg-black rounded-full z-20 border border-white/10" />
        );
      case "iphone-notch":
        return (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-black rounded-b-xl z-20" />
        );
      case "android-centered":
        return (
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full z-20 ring-1 ring-white/10" />
        );
      case "android-left":
        return (
          <div className="absolute top-1.5 left-4 w-2 h-2 bg-black rounded-full z-20 ring-1 ring-white/10" />
        );
      case "laptop":
        return (
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full z-20" />
        );
      default:
        return null;
    }
  };

  const renderButtons = () => {
    const isIphone =
      deviceStyle === "iphone-15" ||
      deviceStyle === "iphone-notch" ||
      deviceStyle === "minimal";
    const isAndroid = deviceStyle.startsWith("android");
    const isTablet = deviceStyle === "ipad" || deviceStyle === "tablet";

    if (isIphone) {
      return (
        <>
          {/* Silent/Action button */}
          <div className="absolute top-[12%] -left-[3px] w-[3px] h-[4%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-r-sm z-0" />
          {/* Volume Up */}
          <div className="absolute top-[20%] -left-[3px] w-[3px] h-[8%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-r-sm z-0" />
          {/* Volume Down */}
          <div className="absolute top-[29%] -left-[3px] w-[3px] h-[8%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-r-sm z-0" />
          {/* Power */}
          <div className="absolute top-[24%] -right-[3px] w-[3px] h-[12%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-l-sm z-0" />
        </>
      );
    }

    if (isAndroid) {
      return (
        <>
          {/* Power */}
          <div className="absolute top-[18%] -right-[3px] w-[3px] h-[10%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-l-sm z-0" />
          {/* Volume */}
          <div className="absolute top-[30%] -right-[3px] w-[3px] h-[6%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-l-sm z-0" />
        </>
      );
    }

    if (isTablet) {
      return (
        <>
          {/* Volume Up */}
          <div className="absolute top-[10%] -right-[3px] w-[3px] h-[8%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-l-sm z-0" />
          {/* Volume Down */}
          <div className="absolute top-[20%] -right-[3px] w-[3px] h-[8%] bg-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-l-sm z-0" />
        </>
      );
    }

    return null;
  };

  const rounding = isLaptop
    ? "rounded-lg"
    : isTablet
      ? "rounded-[1.25rem]"
      : "rounded-[1.5rem]";
  const innerRounding = isLaptop
    ? "rounded-md"
    : isTablet
      ? "rounded-[1rem]"
      : "rounded-[1.25rem]";
  const bezel = isLaptop ? "border-2" : "border-[4px]";

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {renderButtons()}
        <div
          className={`${getAspect()} bg-slate-950 ${rounding} shadow-2xl relative overflow-hidden ring-1 ring-white/10 scale-75 lg:scale-100 transition-transform`}
        >
          {/* Hardware Bezel Trim */}
          <div
            className={`absolute inset-0 ${rounding} ${bezel} border-slate-900 pointer-events-none z-10`}
          />

          {/* Sensors */}
          {renderSensors()}

          {/* Screen Content */}
          <div
            className={`relative w-full h-full bg-linear-to-b from-gray-900 to-black flex items-center justify-center overflow-hidden ${innerRounding} ${config?.type === "image" ? (!isLaptop && !isTablet ? "p-1.5" : "p-0") : isLaptop ? "p-4" : "p-2"}`}
          >
            {config?.type === "icon" ? (
              (() => {
                const Icon = getIcon(config.icon);
                const bgColor =
                  config.color === "primary"
                    ? "bg-primary"
                    : config.color === "purple"
                      ? "bg-purple-600"
                      : "bg-blue-600";
                return (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div
                      className={`${isLaptop ? "w-10 h-10" : "w-8 h-8"} ${bgColor} rounded-xl flex items-center justify-center shadow-lg transform rotate-12 transition-all`}
                    >
                      <Icon
                        className={`${isLaptop ? "w-5 h-5" : "w-4 h-4"} text-white`}
                      />
                    </div>
                    {isLaptop && (
                      <div className="text-center">
                        <p className="text-white font-bold text-[8px] leading-tight">
                          Tunsiska
                        </p>
                        <p className="text-gray-400 text-[6px]">
                          Mega Services
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="w-full h-full relative">
                {config?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={config.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-[10px] text-gray-500 italic">
                    Preview
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isLaptop && (
        <div className="w-[115%] h-3 bg-slate-800 rounded-b-xl -mt-0.5 border-t border-white/10 relative flex flex-col items-center shadow-lg">
          <div className="w-10 h-0.5 bg-black/20 rounded-full mt-0.5" />
        </div>
      )}

      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-4">
        {title}
      </span>
    </div>
  );
}
