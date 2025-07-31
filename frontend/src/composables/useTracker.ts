import { ref, reactive } from "vue";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import type { EventPayload } from "@/types/journey";

const isInitialized = ref<boolean>(false);
const userId = ref<string | null>(null);
const sessionId = ref<string | null>(null);
const systemData = reactive<Record<string, any>>({});

export const API_URL = "http://localhost:4000";

const onSaveInitialInfo = async () => {
  if (!userId.value || !sessionId.value) return;

  try {
    const resp = await fetch(`${API_URL}/users?userId=${userId.value}`);
    const userExists = await resp.json();

    if (!userExists || userExists?.length === 0) {
      await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId.value,
          recordedAt: new Date().toISOString(),
          systemData,
        }),
      });
    }
  } catch (error) {
    console.error("Failed to save initial info:", error);
  }
};

const onSaveEvent = async (data: Record<string, any> = {}) => {
  if (!userId.value || !sessionId.value) return;

  try {
    if (data) {
      await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      });
    }
  } catch (error) {
    console.log("Failed to save event:", error);
  }
};

export function useTracker() {
  // Core Functions - Priority 1: Journey Tracking

  /**
   * Generate unique identifiers
   */
  const generateUserIdentifiers = async (): Promise<void> => {
    try {
      const fingerprintProcessor = await FingerprintJS.load();
      const fingerprintResult = await fingerprintProcessor.get();
      userId.value = fingerprintResult.visitorId;
      sessionId.value = `${fingerprintResult.visitorId}-${Date.now()}`;
    } catch {
      const randomId = Math.random().toString(36).substring(2, 9);
      userId.value = `user-${Date.now()}-${randomId}`;
      sessionId.value = `session-${Date.now()}-${randomId}`;
    }
  };

  /**
   * Collect user system data in specified sequence
   */
  const collectSystemData = async (): Promise<void> => {
    const userAgent = navigator.userAgent;

    const systemInfo = {
      browserInfo: getBrowserInfo(userAgent),
      deviceInfo: getDeviceInfo(userAgent),
      hardwareInfo: getHardwareInfo(),
      screenInfo: getScreenInfo(),
      networkInfo: await getNetworkInfo(),
      storageInfo: getStorageInfo(),
      fingerprintInfo: getFingerprintInfo(),
    };

    Object.assign(systemData, systemInfo);
  };

  // Data collection functions in required sequence

  const getBrowserInfo = (userAgent: string) => ({
    name: getBrowserName(userAgent),
    version: getBrowserVersion(userAgent),
    userAgent,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack === "1" || navigator.doNotTrack === "yes",
    platform: navigator.platform,
  });

  const getDeviceInfo = (userAgent: string) => ({
    type: getDeviceType(userAgent),
    os: getOperatingSystem(userAgent),
    osVersion: getOSVersion(userAgent),
    isMobile:
      /Mobi|Android/i.test(userAgent) && !/Tablet|iPad/i.test(userAgent),
    isTablet: /Tablet|iPad/i.test(userAgent),
    isDesktop: !/Mobi|Android|Tablet|iPad/i.test(userAgent),
    vendor: navigator.vendor || "Unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const getHardwareInfo = () => ({
    cpuCores: `${navigator.hardwareConcurrency || 1} cores`,
    memory: (navigator as any).deviceMemory
      ? `${(navigator as any).deviceMemory} GB RAM`
      : "Unknown",
    architecture: getArchitecture(),
    touchSupport: navigator.maxTouchPoints > 0 || "ontouchstart" in window,
    maxTouchPoints: navigator.maxTouchPoints || 0,
  });

  const getScreenInfo = () => ({
    resolution: `${screen.width}x${screen.height}`,
    colorDepth: `${screen.colorDepth || 24}-bit`,
    pixelRatio: `${window.devicePixelRatio || 1}x`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    orientation:
      screen.orientation?.type ||
      (window.innerHeight > window.innerWidth ? "portrait" : "landscape"),
    availableResolution: `${screen.availWidth}x${screen.availHeight}`,
  });

  const getNetworkInfo = async () => {
    const info: any = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      onlineStatus: navigator.onLine,
    };

    if ("connection" in navigator && navigator.connection) {
      const conn = navigator.connection as any;
      if (conn.effectiveType) info.effectiveType = conn.effectiveType;
      if (conn.downlink) info.downlink = `${conn.downlink} Mbps`;
      if (conn.rtt) info.rtt = `${conn.rtt} ms`;
      if (conn.saveData !== undefined) info.saveData = conn.saveData;
    }

    try {
      const response = await fetch("https://api.ipify.org?format=json", {
        method: "GET",
        signal: AbortSignal.timeout(3000),
      });
      if (response.ok) {
        const data = await response.json();
        info.ipAddress = data.ip;
      }
    } catch {
      info.ipAddress = "Unknown";
    }

    return info;
  };

  const getStorageInfo = () => ({
    localStorage: isStorageAvailable("localStorage"),
    sessionStorage: isStorageAvailable("sessionStorage"),
    indexedDB: "indexedDB" in window,
    cookiesEnabled: navigator.cookieEnabled,
    quota: getStorageQuota(),
  });

  const getFingerprintInfo = () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return { available: false };

      canvas.width = 200;
      canvas.height = 50;
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillText("Fingerprint test 🔒", 2, 2);

      const canvasFingerprint = canvas.toDataURL();

      return {
        available: true,
        canvasHash: btoa(canvasFingerprint).slice(0, 32),
        webGL: getWebGLInfo(),
        fonts: getFontList(),
      };
    } catch {
      return { available: false };
    }
  };

  // Helper functions

  const getBrowserName = (userAgent: string): string => {
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edge"))
      return "Chrome";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
      return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    if (userAgent.includes("Opera")) return "Opera";
    return "Unknown";
  };

  const getBrowserVersion = (userAgent: string): string => {
    const browser = getBrowserName(userAgent);
    const patterns: Record<string, RegExp> = {
      Chrome: /Chrome\/(\d+\.\d+)/,
      Firefox: /Firefox\/(\d+\.\d+)/,
      Safari: /Version\/(\d+\.\d+)/,
      Edge: /(?:Edge|Edg)\/(\d+\.\d+)/,
      Opera: /(?:OPR|Opera)\/(\d+\.\d+)/,
    };

    const match = userAgent.match(patterns[browser]);
    return match ? match[1] : "Unknown";
  };

  const getOperatingSystem = (userAgent: string): string => {
    if (/Windows/i.test(userAgent)) return "Windows";
    if (/Mac OS X/i.test(userAgent)) return "macOS";
    if (/Linux/i.test(userAgent)) return "Linux";
    if (/Android/i.test(userAgent)) return "Android";
    if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
    return "Unknown";
  };

  const getOSVersion = (userAgent: string): string => {
    const patterns: Record<string, RegExp> = {
      Windows: /Windows NT (\d+\.\d+)/,
      macOS: /Mac OS X (\d+[._]\d+)/,
      Android: /Android (\d+\.\d+)/,
      iOS: /OS (\d+)_(\d+)/,
    };

    const os = getOperatingSystem(userAgent);
    const match = userAgent.match(patterns[os]);

    if (match) {
      if (os === "iOS") return `${match[1]}.${match[2]}`;
      if (os === "macOS") return match[1].replace(/_/g, ".");
      return match[1];
    }
    return "Unknown";
  };

  const getDeviceType = (userAgent: string): string => {
    if (/Mobi|Android/i.test(userAgent) && !/Tablet|iPad/i.test(userAgent))
      return "mobile";
    if (/Tablet|iPad/i.test(userAgent)) return "tablet";
    return "desktop";
  };

  const getArchitecture = (): string => {
    const userAgent = navigator.userAgent;
    if (/WOW64|Win64|x64|x86_64|AMD64/i.test(userAgent)) return "64-bit";
    if (/Win32|x86/i.test(userAgent)) return "32-bit";
    return "Unknown";
  };

  const isStorageAvailable = (type: string): boolean => {
    try {
      const storage = (window as any)[type];
      const test = "__storage_test__";
      storage.setItem(test, test);
      storage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  const getStorageQuota = (): string => {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        if (estimate.quota) {
          return `${
            Math.round((estimate.quota / 1024 / 1024 / 1024) * 100) / 100
          } GB`;
        }
      });
    }
    return "Unknown";
  };

  const getWebGLInfo = () => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return { supported: false };

      const webglContext = gl as WebGLRenderingContext;
      return {
        supported: true,
        vendor: webglContext.getParameter(webglContext.VENDOR),
        renderer: webglContext.getParameter(webglContext.RENDERER),
      };
    } catch {
      return { supported: false };
    }
  };

  const getFontList = (): string[] => {
    const testFonts = [
      "Arial",
      "Helvetica",
      "Times",
      "Courier",
      "Verdana",
      "Georgia",
      "Palatino",
      "Garamond",
      "Bookman",
      "Comic Sans MS",
      "Trebuchet MS",
      "Arial Black",
      "Impact",
    ];

    return testFonts.filter((font) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return false;

      ctx.font = `12px ${font}, monospace`;
      const width1 = ctx.measureText("test").width;

      ctx.font = "12px monospace";
      const width2 = ctx.measureText("test").width;

      return width1 !== width2;
    });
  };

  /**
   * Initialize tracker
   */
  const initializeTracker = async (): Promise<void> => {
    if (isInitialized.value) return;

    try {
      Object.keys(systemData).forEach((key) => delete systemData[key]);

      await generateUserIdentifiers();
      await collectSystemData();

      isInitialized.value = true;
      onSaveInitialInfo();
    } catch (error) {
      console.error("Failed to initialize tracker:", error);
      throw error;
    }
  };

  /**
   * Record journey step
   */
  const saveEventRecord = async (
    eventName: string,
    meta: Record<string, any> = {}
  ): Promise<void> => {
    if (!isInitialized.value) {
      await initializeTracker();
    }

    if (!userId.value || !sessionId.value) return;

    const payload: EventPayload = {
      eventName,
      userId: userId.value,
      sessionId: sessionId.value,
      recordedAt: new Date().toISOString(),
      ...meta,
    };

    onSaveEvent({ ...payload });
  };

  return {
    userId,
    sessionId,

    initializeTracker,
    saveEventRecord,
  };
}
