// @ts-nocheck
import { ref, reactive } from "vue";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import type {
  Payload,
  JourneyStep,
  BrowserInfo,
  DeviceInfo,
  HardwareInfo,
  DisplayInfo,
  NetworkInfo,
  StorageInfo,
} from "@/types/journeyPayload";

// Module-level state for persistence across component lifecycles
const currentUserId = ref<string | null>(null);
const currentSessionId = ref<string | null>(null);
const journeyStepsData = ref<JourneyStep[]>([]);
const collectedUserData = reactive<Record<string, any>>({});
const deviceSystemData = reactive<Record<string, any>>({});
const trackerInitialized = ref<boolean>(false);
const initializationPromise = ref<Promise<void> | null>(null);

export function useJourneyTracker() {
  /**
   * Generate unique user and session identifiers using fingerprinting
   */
  const generateUserIdentifiers = async (): Promise<void> => {
    try {
      const fingerprintProcessor = await FingerprintJS.load();
      const fingerprintResult = await fingerprintProcessor.get();
      currentUserId.value = fingerprintResult.visitorId;
      currentSessionId.value = `${fingerprintResult.visitorId}-${Date.now()}`;
    } catch (error) {
      // Fallback if fingerprinting fails
      const randomId = Math.random().toString(36).substring(2, 9);
      currentUserId.value = `user-${Date.now()}-${randomId}`;
      currentSessionId.value = `session-${Date.now()}-${randomId}`;
    } finally {
      console.info(
        `Fingerprint generated successfully. with User ID: ${currentUserId.value} and Session ID: ${currentSessionId.value}`
      );
    }
  };

  /**
   * Collect all system data
   */
  const collectSystemData = async (): Promise<void> => {
    const systemInfo = {
      browserInfo: getBrowserInfo(),
      deviceInfo: getDeviceInfo(),
      hardwareInfo: getHardwareInfo(),
      displayInfo: getDisplayInfo(),
      networkInfo: await getNetworkInfo(),
      storageInfo: getStorageInfo(),
      fingerprintInfo: getFingerprintInfo(),
      sessionMetadata: {
        startTime: new Date().toISOString(),
        referrerUrl: document.referrer,
        loadTime: getPageLoadTime(),
        domInteractive: getDomInteractiveTime(),
      },
    };

    // Merge collected data with module state
    Object.assign(deviceSystemData, systemInfo);
    console.info(`System data collected successfully:`, deviceSystemData);
  };

  /**
   * Get browser information
   */
  const getBrowserInfo = (): BrowserInfo => {
    const userAgent = navigator.userAgent;
    const plugins: string[] = [];

    // Get browser plugins if available
    if (navigator.plugins && navigator.plugins.length) {
      for (let i = 0; i < navigator.plugins.length; i++) {
        plugins.push(navigator.plugins[i].name);
      }
    }

    return {
      name: getBrowserName(),
      version: getBrowserVersion(),
      userAgent,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack:
        navigator.doNotTrack === "1" || navigator.doNotTrack === "yes",
      webdriver: navigator.webdriver || false,
      plugins: plugins.length ? plugins : undefined,
    };
  };

  /**
   * Get browser name
   */
  const getBrowserName = (): string => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edge"))
      return "Chrome";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
      return "Safari";
    if (userAgent.includes("Edge") || userAgent.includes("Edg")) return "Edge";
    if (userAgent.includes("Opera") || userAgent.includes("OPR"))
      return "Opera";
    return "Unknown";
  };

  /**
   * Get browser version
   */
  const getBrowserVersion = (): string => {
    const userAgent = navigator.userAgent;
    const browser = getBrowserName();
    let versionMatch;

    switch (browser) {
      case "Chrome":
        versionMatch = userAgent.match(/Chrome\/(\d+\.\d+)/);
        break;
      case "Firefox":
        versionMatch = userAgent.match(/Firefox\/(\d+\.\d+)/);
        break;
      case "Safari":
        versionMatch = userAgent.match(/Version\/(\d+\.\d+)/);
        break;
      case "Edge":
        versionMatch =
          userAgent.match(/Edge\/(\d+\.\d+)/) ||
          userAgent.match(/Edg\/(\d+\.\d+)/);
        break;
      case "Opera":
        versionMatch =
          userAgent.match(/OPR\/(\d+\.\d+)/) ||
          userAgent.match(/Opera\/(\d+\.\d+)/);
        break;
    }

    return versionMatch ? versionMatch[1] : "Unknown";
  };

  /**
   * Get device and OS information
   */
  const getDeviceInfo = (): DeviceInfo => {
    const userAgent = navigator.userAgent;
    const deviceType = getDeviceType();
    const os = getOperatingSystem();
    const osVersion = getOSVersion();

    // Extract vendor and model if possible
    let vendor = navigator.vendor || "Unknown";
    let model = undefined;

    // For mobile, try to get more device details
    if (deviceType === "mobile" || deviceType === "tablet") {
      const matches = userAgent.match(
        /(iPhone|iPad|iPod|Android|BlackBerry).*?(;|\))/i
      );
      if (matches && matches[1]) {
        model = matches[1];
        if (model === "iPhone" || model === "iPad" || model === "iPod") {
          vendor = "Apple";
        } else if (model === "Android") {
          // Try to extract Android device manufacturer
          const vendorMatch = userAgent.match(/;\s([^;]+)\s+Build\//i);
          if (vendorMatch && vendorMatch[1]) {
            vendor = vendorMatch[1];
          }
        }
      }
    }

    return {
      deviceType,
      operatingSystem: os,
      osVersion,
      isMobile: deviceType === "mobile",
      isTablet: deviceType === "tablet",
      isDesktop: deviceType === "desktop",
      vendor,
      model,
    };
  };

  /**
   * Get basic device type
   */
  const getDeviceType = (): "mobile" | "tablet" | "desktop" => {
    const userAgent = navigator.userAgent;
    if (/Mobi|Android/i.test(userAgent) && !/Tablet|iPad/i.test(userAgent))
      return "mobile";
    if (/Tablet|iPad/i.test(userAgent)) return "tablet";
    return "desktop";
  };

  /**
   * Get operating system information
   */
  const getOperatingSystem = (): string => {
    const userAgent = navigator.userAgent;

    if (/Windows/i.test(userAgent)) return "Windows";
    if (/Mac OS X/i.test(userAgent)) return "macOS";
    if (/Linux/i.test(userAgent)) return "Linux";
    if (/Android/i.test(userAgent)) return "Android";
    if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";

    return "Unknown";
  };

  /**
   * Get OS version if available
   */
  const getOSVersion = (): string => {
    const userAgent = navigator.userAgent;
    let version = "Unknown";

    if (/Windows NT (\d+\.\d+)/i.test(userAgent)) {
      const winVersion = userAgent.match(/Windows NT (\d+\.\d+)/i)[1];
      const versions = {
        "10.0": "10/11",
        "6.3": "8.1",
        "6.2": "8",
        "6.1": "7",
        "6.0": "Vista",
        "5.1": "XP",
      };
      version = versions[winVersion] || winVersion;
    } else if (/Mac OS X (\d+[._]\d+)/i.test(userAgent)) {
      version = userAgent.match(/Mac OS X (\d+[._]\d+)/i)[1].replace(/_/g, ".");
    } else if (/Android (\d+\.\d+)/i.test(userAgent)) {
      version = userAgent.match(/Android (\d+\.\d+)/i)[1];
    } else if (/(?:iPhone|iPad|iPod).+OS (\d+)_(\d+)/i.test(userAgent)) {
      const matches = userAgent.match(/OS (\d+)_(\d+)/i);
      version = matches ? `${matches[1]}.${matches[2]}` : "Unknown";
    }

    return version;
  };

  /**
   * Get hardware information
   */
  const getHardwareInfo = (): HardwareInfo => {
    // Try to get CPU architecture
    let architecture: number | undefined;
    const userAgent = navigator.userAgent;
    if (/WOW64|Win64|x64|x86_64|AMD64/i.test(userAgent)) {
      architecture = 64;
    } else if (/Win32|x86/i.test(userAgent)) {
      architecture = 32;
    }

    // Get touch support
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    const touchEvent = "ontouchstart" in window;
    const isTouch = maxTouchPoints > 0 || touchEvent;

    return {
      cpuCores: navigator.hardwareConcurrency || "Unknown",
      architecture,
      deviceMemory: navigator.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      platform: navigator.platform || "Unknown",
      touchSupport: {
        maxTouchPoints,
        touchEvent,
        isTouch,
      },
    };
  };

  /**
   * Get display information
   */
  const getDisplayInfo = (): DisplayInfo => {
    // Get screen orientation
    let orientation = "unknown";
    if (screen.orientation) {
      orientation = screen.orientation.type;
    } else if (window.innerHeight > window.innerWidth) {
      orientation = "portrait";
    } else {
      orientation = "landscape";
    }

    // Check for HDR support if available
    let isHDR = false;
    if (
      window.matchMedia &&
      window.matchMedia("(dynamic-range: high)").matches
    ) {
      isHDR = true;
    }

    return {
      screenResolution: {
        width: screen.width,
        height: screen.height,
      },
      colorDepth: screen.colorDepth || 24,
      pixelRatio: window.devicePixelRatio || 1,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      orientation,
      isHDR,
    };
  };

  /**
   * Get network information with CORS-friendly approaches
   */
  const getNetworkInfo = async (): Promise<NetworkInfo> => {
    // Start with timezone which is always available client-side
    const result: NetworkInfo = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // Add connection details if available
    if ("connection" in navigator && navigator.connection) {
      result.connectionType = navigator.connection.type;
      result.effectiveType = navigator.connection.effectiveType;
      result.downlink = navigator.connection.downlink;
      result.rtt = navigator.connection.rtt;
    }

    try {
      // Try these CORS-friendly geo APIs in order
      const geoApis = [
        "https://api.ipify.org?format=json", // Just gets IP address
        "https://ipwho.is/", // CORS-friendly API with detailed info
        "https://ip-api.io/json/", // Another CORS-friendly alternative
        "https://api.db-ip.com/v2/free/self", // Fallback option
      ];

      for (const api of geoApis) {
        try {
          const response = await fetch(api, {
            method: "GET",
            mode: "cors",
            timeout: 2000,
          });

          if (response.ok) {
            const data = await response.json();

            // Different APIs return different data structures
            if (api.includes("ipify.org")) {
              result.ipAddress = data.ip;
            } else if (api.includes("ipwho.is")) {
              if (data.success !== false) {
                result.ipAddress = data.ip;
                result.country = data.country;
                result.countryCode = data.country_code;
                result.city = data.city;
              }
            } else if (api.includes("ip-api.io")) {
              result.ipAddress = data.ip;
              result.country = data.country_name;
              result.countryCode = data.country_code;
              result.city = data.city_name;
            } else if (api.includes("db-ip.com")) {
              result.ipAddress = data.ipAddress;
              result.country = data.countryName;
              result.countryCode = data.countryCode;
              result.city = data.city;
            }

            // If we got at least the IP address, that's enough to break
            if (result.ipAddress) break;
          }
        } catch (apiError) {
          continue; // Try next API if this one fails
        }
      }
    } catch (error) {
      // Silent fail, we'll return what we have so far
    }

    return result;
  };

  /**
   * Get storage information
   */
  const getStorageInfo = (): StorageInfo => {
    // Check for storage availability
    const isStorageAvailable = (type: string): boolean => {
      try {
        const storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
      } catch (e) {
        return false;
      }
    };

    return {
      localStorage: isStorageAvailable("localStorage"),
      sessionStorage: isStorageAvailable("sessionStorage"),
      indexedDB: "indexedDB" in window,
      cookiesEnabled: navigator.cookieEnabled,
    };
  };

  /**
   * Get fingerprint information for bot detection
   */
  const getFingerprintInfo = () => {
    // Only get this info if canvas is available
    if (!window.HTMLCanvasElement) {
      return undefined;
    }

    try {
      // Canvas fingerprinting
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 50;

      const ctx = canvas.getContext("2d");
      if (!ctx) return undefined;

      // Check winding
      const winding = ctx.getContextAttributes
        ? !!ctx.getContextAttributes().willReadFrequently
        : true;

      // Draw geometry
      ctx.fillStyle = "#f60";
      ctx.fillRect(0, 0, 100, 50);
      ctx.fillStyle = "#069";
      ctx.fillText("Fingerprint", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillRect(50, 25, 100, 25);

      // Get geometry data
      const geometryData = canvas.toDataURL();

      // Draw text
      ctx.clearRect(0, 0, 200, 50);
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.font = "16px Arial";
      ctx.fillText("Fingerprint", 2, 20);

      // Get text data
      const textData = canvas.toDataURL();

      // Get WebGL info if available
      let webGLInfo = undefined;
      try {
        const glCanvas = document.createElement("canvas");
        const gl =
          glCanvas.getContext("webgl") ||
          glCanvas.getContext("experimental-webgl");

        if (gl) {
          const vendor = gl.getParameter(gl.VENDOR);
          const renderer = gl.getParameter(gl.RENDERER);

          webGLInfo = {
            vendor,
            renderer,
            supported: true,
          };
        }
      } catch (e) {
        webGLInfo = { supported: false };
      }

      return {
        canvas: {
          winding,
          geometry: geometryData,
          text: textData,
        },
        webGL: webGLInfo,
      };
    } catch (e) {
      // Return undefined if canvas fingerprinting fails
      return undefined;
    }
  };

  /**
   * Get page load time
   */
  const getPageLoadTime = (): number | undefined => {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      return loadTime > 0 ? loadTime : undefined;
    }
    return undefined;
  };

  /**
   * Get DOM interactive time
   */
  const getDomInteractiveTime = (): number | undefined => {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const interactive = timing.domInteractive - timing.navigationStart;
      return interactive > 0 ? interactive : undefined;
    }
    return undefined;
  };

  /**
   * Initialize the journey tracker
   */
  const initializeJourneyTracker = (): Promise<void> => {
    // Return existing initialization promise if already in progress or completed
    if (initializationPromise.value) {
      return initializationPromise.value;
    }

    if (trackerInitialized.value) {
      // Already initialized, return resolved promise
      return Promise.resolve();
    }

    // Create a new initialization promise
    initializationPromise.value = (async () => {
      // Reset all data
      journeyStepsData.value = [];
      Object.keys(collectedUserData).forEach(
        (key) => delete collectedUserData[key]
      );
      Object.keys(deviceSystemData).forEach(
        (key) => delete deviceSystemData[key]
      );

      try {
        await generateUserIdentifiers();
        await collectSystemData();

        trackerInitialized.value = true;
        recordJourneyStep("journey_started");
      } catch (error) {
        console.error("Failed to initialize journey tracker:", error);
        // Clear the promise to allow retry
        initializationPromise.value = null;
        throw error;
      }
    })();

    return initializationPromise.value;
  };

  /**
   * Record a step in the user journey
   * @returns Promise that resolves when the step is recorded
   */
  const recordJourneyStep = async (
    stepName: string,
    additionalStepData: Record<string, any> = {}
  ): Promise<void> => {
    // Auto-initialize if not already initialized
    if (!trackerInitialized.value) {
      try {
        await initializeJourneyTracker();
      } catch (error) {
        console.error("Failed to auto-initialize journey tracker:", error);
        throw new Error(
          "Failed to initialize journey tracker automatically. Please try again."
        );
      }
    }

    if (!currentUserId.value || !currentSessionId.value) {
      throw new Error(
        "Journey tracker not properly initialized. User and session IDs are missing."
      );
    }

    const stepRecord: JourneyStep = {
      stepName,
      recordedAt: new Date().toISOString(),
      sessionId: currentSessionId.value,
      userId: currentUserId.value,
      currentUrl: window.location.href,
      currentPath: window.location.pathname,
      ...additionalStepData,
    };

    journeyStepsData.value.push(stepRecord);
  };

  /**
   * Save user information
   * @returns Promise that resolves when user info is saved and recorded
   */
  const saveUserInformation = async (
    userInfo: Record<string, any>
  ): Promise<void> => {
    // Auto-initialize if needed
    if (!trackerInitialized.value) {
      await initializeJourneyTracker();
    }

    Object.assign(collectedUserData, userInfo);
    await recordJourneyStep("user_information_saved", {
      dataFields: Object.keys(userInfo),
    });
  };

  /**
   * Get complete journey data
   * @returns Promise that resolves with the journey data payload
   */
  const getCompleteJourneyData = async (): Promise<Payload> => {
    // Auto-initialize if not already initialized
    if (!trackerInitialized.value) {
      try {
        await initializeJourneyTracker();
      } catch (error) {
        console.error("Failed to auto-initialize journey tracker:", error);
        throw new Error(
          "Failed to initialize journey tracker automatically. Please try again."
        );
      }
    }

    if (!currentUserId.value || !currentSessionId.value) {
      throw new Error(
        "Journey tracker not properly initialized. User and session IDs are missing."
      );
    }

    return {
      userId: currentUserId.value,
      sessionId: currentSessionId.value,
      journeySteps: journeyStepsData.value,
      userData: { ...collectedUserData },
      systemData: { ...deviceSystemData },
      totalJourneyTime:
        journeyStepsData.value.length > 0
          ? new Date().getTime() -
            new Date(journeyStepsData.value[0].recordedAt).getTime()
          : 0,
    };
  };

  /**
   * Clear all journey data
   */
  const clearAllJourneyData = (): void => {
    journeyStepsData.value = [];
    Object.keys(collectedUserData).forEach(
      (key) => delete collectedUserData[key]
    );
  };

  /**
   * Export journey data as JSON file
   * @returns Promise that resolves when the export is complete
   */
  const exportJourneyData = async (): Promise<void> => {
    const completeJourneyData = await getCompleteJourneyData();
    const dataBlob = new Blob([JSON.stringify(completeJourneyData, null, 2)], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement("a");
    const filename = `journey-data-${currentSessionId.value}.json`;

    downloadLink.href = downloadUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadUrl);
  };

  return {
    currentUserId,
    currentSessionId,
    journeyStepsData,
    collectedUserData,
    deviceSystemData,
    trackerInitialized,
    initializeJourneyTracker,
    recordJourneyStep,
    saveUserInformation,
    getCompleteJourneyData,
    clearAllJourneyData,
    exportJourneyData,
  };
}
