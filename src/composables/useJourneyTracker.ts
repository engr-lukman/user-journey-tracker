// @ts-nocheck
import { ref, reactive } from "vue";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import type {
  JourneyTrackerPayload,
  JourneyStep,
} from "@/types/journeyPayload";

const currentUserId = ref<string | null>(null);
const currentSessionId = ref<string | null>(null);
const journeyStepsData = ref<JourneyStep[]>([]);
const collectedUserData = reactive<Record<string, any>>({});
const deviceSystemData = reactive<Record<string, any>>({});
const trackerInitialized = ref<boolean>(false);

export function useJourneyTracker() {
  const generateUserIdentifiers = async () => {
    try {
      const fingerprintProcessor = await FingerprintJS.load();
      const fingerprintResult = await fingerprintProcessor.get();
      currentUserId.value = fingerprintResult.visitorId;
      currentSessionId.value = `${fingerprintResult.visitorId}-${Date.now()}`;
    } catch (error) {
      currentUserId.value = `user-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      currentSessionId.value = `session-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    } finally {
      console.info("User and session identifiers initialized:", {
        userId: currentUserId.value,
        sessionId: currentSessionId.value,
      });
    }
  };

  const collectDeviceAndBrowserData = async () => {
    const deviceInfo = {
      // Client IP & Network Information
      clientNetwork: await getClientIPAndNetwork(),

      // System Information
      systemInformation: {
        architecture: navigator.platform,
        cpuCores: navigator.hardwareConcurrency || "unknown",
        deviceMemory: navigator.deviceMemory || "unknown",
        userAgent: navigator.userAgent,
        vendor: navigator.vendor || "unknown",
        operatingSystem: getOperatingSystem(),
        osDetails: getDetailedOSInfo(),
        deviceType: getDeviceType(),
        isMobile: getDeviceType() === "mobile",
        isDesktop: getDeviceType() === "desktop",
        isTablet: getDeviceType() === "tablet",
        hardwareInfo: getHardwareInfo(),
      },

      // Browser Information
      browserInformation: {
        browserName: getBrowserName(),
        browserVersion: getBrowserVersion(),
        browserEngine: getBrowserEngine(),
        vendor: navigator.vendor || "unknown",
        webdriver: navigator.webdriver || false,
        cookiesEnabled: navigator.cookieEnabled,
        javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
        onLine: navigator.onLine,
        maxTouchPoints: navigator.maxTouchPoints || 0,
        pdfViewerEnabled: navigator.pdfViewerEnabled || false,
        storageAvailability: {
          sessionStorage: isStorageAvailable("sessionStorage"),
          indexedDB: "indexedDB" in window,
          cookies: navigator.cookieEnabled,
          webSQL: "openDatabase" in window,
        },
      },

      // Display & Device Information
      displayAndDevice: {
        screenResolution: {
          width: screen.width,
          height: screen.height,
          availWidth: screen.availWidth,
          availHeight: screen.availHeight,
        },
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        devicePixelRatio: window.devicePixelRatio || 1,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          outerWidth: window.outerWidth,
          outerHeight: window.outerHeight,
        },
        deviceDimensions: getDeviceDimensions(),
        orientation: getScreenOrientation(),
        touchSupport: {
          maxTouchPoints: navigator.maxTouchPoints || 0,
          touchEvent: "ontouchstart" in window,
          isTouch: navigator.maxTouchPoints > 0 || "ontouchstart" in window,
        },
      },

      // Locale & Time Information
      localeAndTime: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        language: navigator.language,
        languages: navigator.languages || [navigator.language],
      },

      // Performance & Memory Information
      performanceInfo: getPerformanceInfo(),

      // Network Connection Details
      networkConnection: getNetworkConnectionInfo(),

      // Session Metadata
      sessionMetadata: {
        sessionStartTime: new Date().toISOString(),
        referrerUrl: document.referrer,
        currentUrl: window.location.href,
        documentTitle: document.title,
        documentCharset: document.characterSet,
        documentReadyState: document.readyState,
      },
    };

    console.log("Collected device and browser information:", deviceInfo);

    Object.assign(deviceSystemData, deviceInfo);
  };

  const getClientIPAndNetwork = async () => {
    try {
      // Multiple IP detection services for reliability
      const ipServices = [
        { url: "https://api.ipify.org?format=json", key: "ip" },
        { url: "https://ipapi.co/json/", key: "ip" },
        { url: "https://api.my-ip.io/ip.json", key: "ip" },
      ];

      let clientIP = null;
      let ipDetails = {};

      // Try to get IP from the first available service
      for (const service of ipServices) {
        try {
          const response = await fetch(service.url, {
            method: "GET",
            timeout: 5000,
          });
          if (response.ok) {
            const data = await response.json();
            clientIP = data[service.key];
            if (service.url.includes("ipapi.co")) {
              ipDetails = {
                country: data.country_name,
                countryCode: data.country_code,
                city: data.city,
                region: data.region,
                timezone: data.timezone,
                isp: data.org,
                asn: data.asn,
                currency: data.currency,
              };
            }
            break;
          }
        } catch (e) {
          continue; // Try next service
        }
      }

      return {
        clientIP,
        ipDetails,
        webRTC: await getWebRTCLocalIPs(),
        connectionInfo: getConnectionInfo(),
      };
    } catch (error) {
      return {
        clientIP: null,
        error: "IP detection failed",
        connectionInfo: getConnectionInfo(),
      };
    }
  };

  const getWebRTCLocalIPs = async () => {
    try {
      const ips = [];
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      pc.createDataChannel("");
      await pc.createOffer().then((offer) => pc.setLocalDescription(offer));

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          pc.close();
          resolve(ips);
        }, 2000);

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const candidate = event.candidate.candidate;
            const ipMatch = candidate.match(
              /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
            );
            if (ipMatch && !ips.includes(ipMatch[1])) {
              ips.push(ipMatch[1]);
            }
          }
        };

        pc.onicegatheringstatechange = () => {
          if (pc.iceGatheringState === "complete") {
            clearTimeout(timeout);
            pc.close();
            resolve(ips);
          }
        };
      });
    } catch (error) {
      return [];
    }
  };

  const getConnectionInfo = () => {
    if ("connection" in navigator && navigator.connection) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData,
        type: navigator.connection.type,
      };
    }
    return null;
  };

  const getDetailedOSInfo = () => {
    const userAgent = navigator.userAgent;
    let osInfo = {
      name: "Unknown",
      version: "Unknown",
      architecture: "Unknown",
    };

    // Windows detection
    if (/Windows NT/i.test(userAgent)) {
      const versionMatch = userAgent.match(/Windows NT (\d+\.\d+)/);
      const version = versionMatch ? versionMatch[1] : "Unknown";
      const versionNames = {
        "10.0": "Windows 10/11",
        "6.3": "Windows 8.1",
        "6.2": "Windows 8",
        "6.1": "Windows 7",
        "6.0": "Windows Vista",
        "5.1": "Windows XP",
      };
      osInfo = {
        name: "Windows",
        version: versionNames[version] || `Windows NT ${version}`,
        architecture: /WOW64|Win64|x64/i.test(userAgent) ? "64-bit" : "32-bit",
      };
    }
    // macOS detection
    else if (/Mac OS X/i.test(userAgent)) {
      const versionMatch = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
      const version = versionMatch
        ? versionMatch[1].replace(/_/g, ".")
        : "Unknown";
      osInfo = {
        name: "macOS",
        version: version,
        architecture: /Intel|x86_64/i.test(userAgent)
          ? "Intel"
          : "Apple Silicon",
      };
    }
    // Linux detection
    else if (/Linux/i.test(userAgent)) {
      osInfo = {
        name: "Linux",
        version: /Ubuntu/i.test(userAgent) ? "Ubuntu" : "Generic Linux",
        architecture: /x86_64|amd64/i.test(userAgent) ? "64-bit" : "32-bit",
      };
    }
    // Android detection
    else if (/Android/i.test(userAgent)) {
      const versionMatch = userAgent.match(/Android (\d+\.\d+)/);
      osInfo = {
        name: "Android",
        version: versionMatch ? versionMatch[1] : "Unknown",
        architecture: /arm64|aarch64/i.test(userAgent) ? "ARM64" : "ARM",
      };
    }
    // iOS detection
    else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      const versionMatch = userAgent.match(/OS (\d+_\d+)/);
      const version = versionMatch
        ? versionMatch[1].replace(/_/g, ".")
        : "Unknown";
      osInfo = {
        name: /iPad/i.test(userAgent) ? "iPadOS" : "iOS",
        version: version,
        architecture: "ARM",
      };
    }

    return osInfo;
  };

  const getHardwareInfo = () => {
    return {
      cpuCores: navigator.hardwareConcurrency || "Unknown",
      deviceMemory: navigator.deviceMemory
        ? `${navigator.deviceMemory}GB`
        : "Unknown",
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      devicePixelRatio: window.devicePixelRatio || 1,
    };
  };

  const getBrowserEngine = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("WebKit") && userAgent.includes("Chrome"))
      return "Blink";
    if (userAgent.includes("WebKit")) return "WebKit";
    if (userAgent.includes("Gecko") && userAgent.includes("Firefox"))
      return "Gecko";
    if (userAgent.includes("Trident") || userAgent.includes("MSIE"))
      return "Trident";
    if (userAgent.includes("EdgeHTML")) return "EdgeHTML";
    return "Unknown";
  };

  const getDeviceDimensions = () => {
    return {
      screenWidth: screen.width,
      screenHeight: screen.height,
      availableWidth: screen.availWidth,
      availableHeight: screen.availHeight,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      aspectRatio: (screen.width / screen.height).toFixed(2),
    };
  };

  const getScreenOrientation = () => {
    if (screen.orientation) {
      return {
        angle: screen.orientation.angle,
        type: screen.orientation.type,
      };
    }

    // Fallback
    return {
      angle: window.orientation || 0,
      type: window.innerWidth > window.innerHeight ? "landscape" : "portrait",
    };
  };

  const getPerformanceInfo = () => {
    try {
      const memory = (performance as any).memory;
      const timing = performance.timing;

      return {
        memory: memory
          ? {
              usedJSHeapSize: memory.usedJSHeapSize,
              totalJSHeapSize: memory.totalJSHeapSize,
              jsHeapSizeLimit: memory.jsHeapSizeLimit,
            }
          : null,
        timing: timing
          ? {
              navigationStart: timing.navigationStart,
              domLoading: timing.domLoading,
              domInteractive: timing.domInteractive,
              domContentLoaded: timing.domContentLoadedEventEnd,
              loadComplete: timing.loadEventEnd,
            }
          : null,
        navigation: performance.navigation
          ? {
              type: performance.navigation.type,
              redirectCount: performance.navigation.redirectCount,
            }
          : null,
        timeOrigin: performance.timeOrigin,
        now: performance.now(),
      };
    } catch (error) {
      return { error: "Performance info not available" };
    }
  };

  const getNetworkConnectionInfo = () => {
    if ("connection" in navigator && navigator.connection) {
      return {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        downlinkMax: navigator.connection.downlinkMax,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData,
        type: navigator.connection.type,
      };
    }
    return null;
  };
  const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edge"))
      return "Chrome";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
      return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    if (userAgent.includes("Opera")) return "Opera";
    return "Unknown";
  };

  const getBrowserVersion = () => {
    const userAgent = navigator.userAgent;
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/(\d+)/);
    return match ? match[2] : "Unknown";
  };

  const getOperatingSystem = () => {
    const userAgent = navigator.userAgent;

    if (/Windows NT/i.test(userAgent)) {
      const version = userAgent.match(/Windows NT (\d+\.\d+)/);
      return `Windows ${version ? version[1] : "Unknown"}`;
    }
    if (/Mac OS X/i.test(userAgent)) {
      const version = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
      return `macOS ${version ? version[1].replace(/_/g, ".") : "Unknown"}`;
    }
    if (/Linux/i.test(userAgent)) return "Linux";
    if (/Android/i.test(userAgent)) {
      const version = userAgent.match(/Android (\d+\.\d+)/);
      return `Android ${version ? version[1] : "Unknown"}`;
    }
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      const version = userAgent.match(/OS (\d+_\d+)/);
      return `iOS ${version ? version[1].replace(/_/g, ".") : "Unknown"}`;
    }
    return navigator.platform || "Unknown";
  };

  const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    if (/Mobi|Android/i.test(userAgent) && !/Tablet|iPad/i.test(userAgent))
      return "mobile";
    if (/Tablet|iPad/i.test(userAgent)) return "tablet";
    return "desktop";
  };

  const isStorageAvailable = (type) => {
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

  const initializeJourneyTracker = async () => {
    if (trackerInitialized.value) return;

    // Always start with fresh data
    journeyStepsData.value = [];
    Object.keys(collectedUserData).forEach(
      (key) => delete collectedUserData[key]
    );
    Object.keys(deviceSystemData).forEach(
      (key) => delete deviceSystemData[key]
    );

    await generateUserIdentifiers();
    await collectDeviceAndBrowserData();

    trackerInitialized.value = true;
    recordJourneyStep("journey_started");
  };

  const recordJourneyStep = (
    stepName: string,
    additionalStepData: Record<string, any> = {}
  ) => {
    const stepRecord: JourneyStep = {
      stepName: stepName,
      recordedAt: new Date().toISOString(),
      sessionId: currentSessionId.value!,
      userId: currentUserId.value!,
      currentUrl: window.location.href,
      currentPath: window.location.pathname,
      ...additionalStepData,
    };

    journeyStepsData.value.push(stepRecord);
  };

  const saveUserInformation = (userInfo) => {
    Object.assign(collectedUserData, userInfo);
    recordJourneyStep("user_information_saved", {
      dataFields: Object.keys(userInfo),
    });
  };

  const getCompleteJourneyData = (): JourneyTrackerPayload => {
    const completeData = {
      userId: currentUserId.value!,
      sessionId: currentSessionId.value!,
      journeySteps: journeyStepsData.value,
      userData: { ...collectedUserData },
      systemData: { ...deviceSystemData },
      totalJourneyTime:
        journeyStepsData.value.length > 0
          ? new Date().getTime() -
            new Date(journeyStepsData.value[0].recordedAt).getTime()
          : 0,
    };

    return completeData;
  };

  const clearAllJourneyData = () => {
    journeyStepsData.value = [];
    Object.keys(collectedUserData).forEach(
      (key) => delete collectedUserData[key]
    );
  };

  const exportJourneyData = () => {
    const completeJourneyData = getCompleteJourneyData();
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

  const printAllData = () => {
    return getCompleteJourneyData();
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
    printAllData,
  };
}
