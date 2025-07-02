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
  /**
   * Generate unique user and session identifiers using fingerprinting
   */
  const generateUserIdentifiers = async () => {
    try {
      const fingerprintProcessor = await FingerprintJS.load();
      const fingerprintResult = await fingerprintProcessor.get();
      currentUserId.value = fingerprintResult.visitorId;
      currentSessionId.value = `${fingerprintResult.visitorId}-${Date.now()}`;
    } catch (error) {
      // Fallback if fingerprinting fails
      currentUserId.value = `user-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      currentSessionId.value = `session-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
    }
  };

  /**
   * Collect essential device and browser information
   */
  const collectEssentialData = async () => {
    // Get basic device info
    const deviceInfo = {
      deviceInfo: {
        deviceType: getDeviceType(),
        operatingSystem: getOperatingSystem(),
        browserName: getBrowserName(),
        browserVersion: getBrowserVersion(),
        isMobile: getDeviceType() === "mobile",
        isTablet: getDeviceType() === "tablet",
        isDesktop: getDeviceType() === "desktop",
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        screenResolution: {
          width: screen.width,
          height: screen.height,
        },
      },

      // Get geo and connection info
      geoInfo: await getBasicGeoInfo(),

      // Session metadata
      sessionMetadata: {
        startTime: new Date().toISOString(),
        referrerUrl: document.referrer,
        language: navigator.language,
      },

      // Basic performance metrics
      performanceInfo: getBasicPerformanceInfo(),
    };

    Object.assign(deviceSystemData, deviceInfo);
  };

  /**
   * Get basic device type (mobile, tablet, or desktop)
   */
  const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    if (/Mobi|Android/i.test(userAgent) && !/Tablet|iPad/i.test(userAgent))
      return "mobile";
    if (/Tablet|iPad/i.test(userAgent)) return "tablet";
    return "desktop";
  };

  /**
   * Get browser name
   */
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

  /**
   * Get browser version
   */
  const getBrowserVersion = () => {
    const userAgent = navigator.userAgent;
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/(\d+)/);
    return match ? match[2] : "Unknown";
  };

  /**
   * Get operating system information
   */
  const getOperatingSystem = () => {
    const userAgent = navigator.userAgent;

    if (/Windows/i.test(userAgent)) return "Windows";
    if (/Mac OS X/i.test(userAgent)) return "macOS";
    if (/Linux/i.test(userAgent)) return "Linux";
    if (/Android/i.test(userAgent)) return "Android";
    if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";

    return "Unknown";
  };

  /**
   * Get basic geographic information
   */
  const getBasicGeoInfo = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/", { timeout: 3000 });
      if (response.ok) {
        const data = await response.json();
        return {
          country: data.country_name,
          countryCode: data.country_code,
          city: data.city,
          timezone: data.timezone,
          connectionType: getConnectionType(),
        };
      }
    } catch (error) {
      // Silent fail if geo info can't be retrieved
    }

    return {
      connectionType: getConnectionType(),
    };
  };

  /**
   * Get connection type if available
   */
  const getConnectionType = () => {
    if ("connection" in navigator && navigator.connection) {
      return navigator.connection.effectiveType || navigator.connection.type;
    }
    return undefined;
  };

  /**
   * Get basic performance metrics
   */
  const getBasicPerformanceInfo = () => {
    try {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domInteractive = timing.domInteractive - timing.navigationStart;

        return {
          loadTime: loadTime > 0 ? loadTime : undefined,
          domInteractive: domInteractive > 0 ? domInteractive : undefined,
        };
      }
    } catch (error) {
      // Silent fail
    }

    return {};
  };

  /**
   * Initialize the journey tracker
   */
  const initializeJourneyTracker = async () => {
    if (trackerInitialized.value) return;

    // Reset all data
    journeyStepsData.value = [];
    Object.keys(collectedUserData).forEach(
      (key) => delete collectedUserData[key]
    );
    Object.keys(deviceSystemData).forEach(
      (key) => delete deviceSystemData[key]
    );

    await generateUserIdentifiers();
    await collectEssentialData();

    trackerInitialized.value = true;
    recordJourneyStep("journey_started");
  };

  /**
   * Record a step in the user journey
   */
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

  /**
   * Save user information
   */
  const saveUserInformation = (userInfo) => {
    Object.assign(collectedUserData, userInfo);
    recordJourneyStep("user_information_saved", {
      dataFields: Object.keys(userInfo),
    });
  };

  /**
   * Get complete journey data
   */
  const getCompleteJourneyData = (): JourneyTrackerPayload => {
    return {
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
  };

  /**
   * Clear all journey data
   */
  const clearAllJourneyData = () => {
    journeyStepsData.value = [];
    Object.keys(collectedUserData).forEach(
      (key) => delete collectedUserData[key]
    );
  };

  /**
   * Export journey data as JSON file
   */
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
