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
} from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import {
  getAdminSettings,
  saveSettings,
  login,
  logout,
  updateAuth,
} from "./actions";
import { useSettings } from "@/context/SettingsContext";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";

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
  const [activeTab, setActiveTab] = useState<"general" | "sections">("general");
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

  const handleSettingChange = (section: string, key: string, value: string) => {
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

  const toggleSection = (sectionId: string) => {
    setSettings({
      ...settings,
      sections: {
        ...settings.sections,
        [sectionId]: {
          ...settings.sections[sectionId],
          visible: !settings.sections[sectionId].visible,
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
    setSettings({
      ...settings,
      sections: {
        ...settings.sections,
        [sectionId]: {
          ...settings.sections[sectionId],
          content: {
            ...settings.sections[sectionId].content,
            [lang]: {
              ...settings.sections[sectionId].content[lang],
              [field]: value,
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
                  placeholder="admin@tunsiska.com"
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

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("general")}
              className={`w-full p-4 rounded-2xl transition-all flex items-center gap-3 border ${
                activeTab === "general"
                  ? "bg-white/5 border-white/10 text-primary"
                  : "border-transparent text-gray-400 hover:bg-white/5"
              }`}
            >
              <Settings
                className={`w-5 h-5 ${activeTab === "general" ? "text-primary" : ""}`}
              />
              <span className="font-medium">
                {t.admin.sidebar?.general || "General Settings"}
              </span>
              {activeTab === "general" && (
                <ChevronRight
                  className={`w-4 h-4 ml-auto ${lang === "ar" ? "rotate-180" : ""}`}
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("sections")}
              className={`w-full p-4 rounded-2xl transition-all flex items-center gap-3 border ${
                activeTab === "sections"
                  ? "bg-white/5 border-white/10 text-primary"
                  : "border-transparent text-gray-400 hover:bg-white/5"
              }`}
            >
              <Layout
                className={`w-5 h-5 ${activeTab === "sections" ? "text-primary" : ""}`}
              />
              <span className="font-medium">
                {t.admin.sidebar?.sections || "Page Sections"}
              </span>
              {activeTab === "sections" && (
                <ChevronRight
                  className={`w-4 h-4 ml-auto ${lang === "ar" ? "rotate-180" : ""}`}
                />
              )}
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 lg:col-span-3 space-y-8">
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
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                          {t.admin.storeLinks.appStore}
                        </label>
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
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                          {t.admin.storeLinks.googlePlay}
                        </label>
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
                        <FaFacebookF size={20} />
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

                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                          <FaFacebookF
                            size={14}
                            className={lang === "ar" ? "ml-1" : "mr-1"}
                          />{" "}
                          {t.admin.socialLinks.facebook}
                        </label>
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
                          className={`w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary/50 transition-colors ${lang === "ar" ? "text-right" : "text-left"}`}
                          placeholder="https://facebook.com/..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                          <FaInstagram
                            size={14}
                            className={lang === "ar" ? "ml-1" : "mr-1"}
                          />{" "}
                          {t.admin.socialLinks.instagram}
                        </label>
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
                          className={`w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary/50 transition-colors ${lang === "ar" ? "text-right" : "text-left"}`}
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                    </div>
                  </section>

                  {/* Hero Mockups & Preview */}
                  <section className="glass-card rounded-4xl p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                          <AppWindow className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">
                            {t.admin.heroMockups.title}
                          </h4>
                          <p className="text-xs text-gray-400">
                            {t.admin.heroMockups.desc}
                          </p>
                        </div>
                      </div>

                      {/* Style Selector */}
                      <div className="mb-10 p-4 rounded-2xl bg-white/5 border border-white/10">
                        <label className="block text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest px-2">
                          Device Style
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            {
                              id: "iphone-15",
                              label: "iPhone",
                              icon: <PhoneIcon className="w-4 h-4" />,
                            },
                            {
                              id: "pixel",
                              label: "Pixel",
                              icon: <Smartphone className="w-4 h-4" />,
                            },
                            {
                              id: "minimal",
                              label: "Minimal",
                              icon: <Layout className="w-4 h-4" />,
                            },
                            {
                              id: "laptop",
                              label: "Laptop",
                              icon: <Laptop className="w-4 h-4" />,
                            },
                          ].map((style) => (
                            <button
                              key={style.id}
                              onClick={() => handleMockupStyleChange(style.id)}
                              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all border ${
                                settings.mockups.style === style.id
                                  ? "bg-primary/20 border-primary/40 text-primary"
                                  : "bg-black/20 border-white/5 text-gray-500 hover:text-gray-300"
                              }`}
                            >
                              {style.icon}
                              <span className="text-[10px] font-bold">
                                {style.label}
                              </span>
                            </button>
                          ))}
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
                                  className="w-full h-10 bg-black/20 border border-white/5 rounded-lg px-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
                                />
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
                          <DevicePreview
                            config={settings.mockups.heroCenter}
                            title="Mockup Preview"
                            deviceStyle={settings.mockups.style}
                          />
                        </div>
                        <p className="mt-6 text-[10px] text-gray-500 text-center leading-relaxed">
                          Visualizing{" "}
                          <span className="text-primary font-bold uppercase">
                            {settings.mockups.style || "iphone-15"}
                          </span>{" "}
                          frame with current settings.
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

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                      <div className="space-y-8">
                        {["ctaLeft", "ctaCenter", "ctaRight"].map((mock) => (
                          <div
                            key={mock}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm hover:border-white/20 transition-all"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <span className="text-sm font-semibold capitalize flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                {t.admin.ctaMockups[
                                  mock === "ctaLeft"
                                    ? "mockup1"
                                    : mock === "ctaCenter"
                                      ? "mockup2"
                                      : "mockup3"
                                ] || mock.replace("cta", "")}
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
                                    {t.admin.ctaMockups[
                                      type as keyof typeof t.admin.ctaMockups
                                    ] ||
                                      type ||
                                      (type === "image"
                                        ? t.admin.heroMockups.image
                                        : t.admin.heroMockups.icon)}
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
                                  className="w-full h-10 bg-black/20 border border-white/5 rounded-lg px-3 text-sm focus:outline-none focus:border-accent/50 transition-all"
                                />
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
                          <DevicePreview
                            config={settings.mockups.ctaCenter}
                            title="Mockup Preview"
                            deviceStyle={settings.mockups.style}
                          />
                        </div>
                        <p className="mt-6 text-[10px] text-gray-500 text-center leading-relaxed">
                          Visualizing{" "}
                          <span className="text-accent font-bold uppercase">
                            {settings.mockups.style || "iphone-15"}
                          </span>{" "}
                          frame with current settings.
                        </p>
                      </div>
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
              ) : (
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
                                  content={
                                    settings.sections[section.id].content
                                  }
                                  onContentChange={handleContentChange}
                                  lang={lang}
                                  t={t}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
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
  onContentChange,
  lang,
  t,
}: any) {
  const fields =
    sectionId === "hero"
      ? ["tag", "title1", "title2", "desc"]
      : sectionId === "features"
        ? ["title1", "title2", "desc"]
        : ["title", "desc", "button"]; // cta has title, desc, button

  const getFieldLabel = (field: string) => {
    const key = `field${field.charAt(0).toUpperCase() + field.slice(1)}`;
    return (
      t.admin.sectionEditor[key as keyof typeof t.admin.sectionEditor] || field
    );
  };

  return (
    <div className="mt-6 p-6 rounded-2xl bg-black/40 border border-white/5 space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Globe className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
          {t.admin.sectionEditor.editLanguages}
        </span>
      </div>

      {["en", "sv", "ar"].map((l) => (
        <div key={l} className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-gray-400 uppercase">
              {l}
            </span>
          </div>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field}>
                <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                  {getFieldLabel(field)}
                </label>
                {field === "desc" ? (
                  <textarea
                    value={content?.[l]?.[field] || ""}
                    onChange={(e) =>
                      onContentChange(sectionId, l, field, e.target.value)
                    }
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary/50"
                  />
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

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative w-full ${isLaptop ? "aspect-16/10" : "aspect-9/19"} bg-black rounded-lg border-2 border-white/10 overflow-hidden shadow-2xl transition-all duration-500`}
      >
        {/* Device Markers */}
        {deviceStyle === "iphone-15" && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-black rounded-full z-20 border border-white/20" />
        )}
        {deviceStyle === "pixel" && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full z-20 border border-white/20" />
        )}
        {deviceStyle === "minimal" && (
          <div className="absolute top-0 inset-x-0 h-1 bg-primary/20 z-20" />
        )}

        <div
          className={`absolute inset-0 bg-linear-to-b from-gray-900 to-black flex items-center justify-center ${isLaptop ? "p-8" : "p-4"}`}
        >
          {config?.type === "icon" ? (
            <div
              className={`${isLaptop ? "w-24 h-24" : "w-16 h-16"} rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 transition-all ${
                config.color === "primary"
                  ? "bg-primary"
                  : config.color === "purple"
                    ? "bg-purple-600"
                    : "bg-blue-600"
              }`}
            >
              {config.icon === "package" && (
                <div
                  className={`${isLaptop ? "w-12 h-12" : "w-8 h-8"} border-2 border-white rounded-md`}
                />
              )}
              {config.icon === "sparkles" && (
                <div
                  className={`${isLaptop ? "w-12 h-12" : "w-8 h-8"} rounded-full bg-white/20 blur-sm`}
                />
              )}
              {config.icon === "car" && (
                <div
                  className={`${isLaptop ? "w-12 h-4" : "w-8 h-2"} bg-white rounded-full`}
                />
              )}
              {config.icon === "map-pin" && (
                <div
                  className={`${isLaptop ? "w-8 h-8" : "w-4 h-4"} rounded-full border-2 border-white`}
                />
              )}
            </div>
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
                  No image
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Laptop Base */}
      {isLaptop && (
        <div className="w-[120%] h-2 bg-gray-800 rounded-b-xl -mt-0.5 border-t border-white/10" />
      )}

      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        {title}
      </span>
    </div>
  );
}
