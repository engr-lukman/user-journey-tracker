// Journey Tracker Data Collection Payload Structure
// This file defines the complete data structure that will be collected

export interface JourneyTrackerPayload {
  // Unique identifiers
  userId: string; // Unique fingerprint-based user ID
  sessionId: string; // Unique session identifier

  // Journey tracking
  journeySteps: JourneyStep[];
  userData: Record<string, any>; // User-provided data
  totalJourneyTime: number; // Total time spent in journey (ms)

  // Comprehensive system data
  systemData: {
    // 🌐 1. Client IP & Network Information
    clientNetwork: {
      clientIP: string | null;
      ipDetails: {
        country?: string;
        countryCode?: string;
        city?: string;
        region?: string;
        timezone?: string;
        isp?: string;
        asn?: string;
        currency?: string;
      };
      webRTC: string[]; // Local IP addresses via WebRTC
      connectionInfo: {
        effectiveType: string;
        downlink: number;
        rtt: number;
        saveData: boolean;
        type: string;
      } | null;
    };

    // 🧠 2. System Information
    systemInformation: {
      architecture: string;
      cpuCores: number | string;
      deviceMemory: number | string;
      userAgent: string;
      vendor: string;
      operatingSystem: string;
      osDetails: {
        name: string;
        version: string;
        architecture: string;
      };
      deviceType: "mobile" | "tablet" | "desktop";
      isMobile: boolean;
      isDesktop: boolean;
      isTablet: boolean;

      hardwareInfo: {
        cpuCores: number | string;
        deviceMemory: string;
        platform: string;
        maxTouchPoints: number;
        devicePixelRatio: number;
      };
    };

    // 🌐 3. Browser Information (Enhanced)
    browserInformation: {
      browserName: string;
      browserVersion: string;
      browserEngine: string;
      vendor: string;
      webdriver: boolean;
      cookiesEnabled: boolean;
      javaEnabled: boolean;
      onLine: boolean;
      maxTouchPoints: number;
      pdfViewerEnabled: boolean;

      storageAvailability: {
        localStorage: boolean;
        sessionStorage: boolean;
        indexedDB: boolean;
        cookies: boolean;
        webSQL: boolean;
      };

    };

    // 📱 4. Display & Device Information (Enhanced)
    displayAndDevice: {
      screenResolution: {
        width: number;
        height: number;
        availWidth: number;
        availHeight: number;
      };
      colorDepth: number;
      pixelDepth: number;
      devicePixelRatio: number;
      viewport: {
        width: number;
        height: number;
        outerWidth: number;
        outerHeight: number;
      };
      deviceDimensions: {
        screenWidth: number;
        screenHeight: number;
        availableWidth: number;
        availableHeight: number;
        innerWidth: number;
        innerHeight: number;
        outerWidth: number;
        outerHeight: number;
        devicePixelRatio: number;
        aspectRatio: string;
      };
      orientation: {
        angle: number;
        type: string;
      };
      touchSupport: {
        maxTouchPoints: number;
        touchEvent: boolean;
        isTouch: boolean;
      };
    };

    // 🌍 5. Locale & Time Information
    localeAndTime: {
      timezone: string;
      timezoneOffset: number;
      language: string;
      languages: string[];

    };

    // 📊 8. Performance & Memory Information
    performanceInfo: {
      memory?: {
        usedJSHeapSize: number;
        totalJSHeapSize: number;
        jsHeapSizeLimit: number;
      } | null;
      timing?: {
        navigationStart: number;
        domLoading: number;
        domInteractive: number;
        domContentLoaded: number;
        loadComplete: number;
      } | null;
      navigation?: {
        type: number;
        redirectCount: number;
      } | null;
      timeOrigin: number;
      now: number;
    };

    // 🌐 9. Network Connection Details
    networkConnection: {
      effectiveType: string;
      downlink: number;
      downlinkMax: number;
      rtt: number;
      saveData: boolean;
      type: string;
    } | null;

    // 📄 10. Session Metadata
    sessionMetadata: {
      sessionStartTime: string;
      referrerUrl: string;
      currentUrl: string;
      documentTitle: string;
      documentCharset: string;
      documentReadyState: string;
    };
  };
}

export interface JourneyStep {
  stepName: string;
  recordedAt: string; // ISO timestamp
  sessionId: string;
  userId: string;
  currentUrl: string;
  currentPath: string;
  [key: string]: any; // Additional step data
}

// Export types for individual data sections
export type ClientNetworkInfo =
  JourneyTrackerPayload["systemData"]["clientNetwork"];
export type SystemInfo =
  JourneyTrackerPayload["systemData"]["systemInformation"];
export type BrowserInfo =
  JourneyTrackerPayload["systemData"]["browserInformation"];
export type DisplayInfo =
  JourneyTrackerPayload["systemData"]["displayAndDevice"];
export type LocaleInfo = JourneyTrackerPayload["systemData"]["localeAndTime"];

export type PerformanceInfo =
  JourneyTrackerPayload["systemData"]["performanceInfo"];
export type NetworkInfo =
  JourneyTrackerPayload["systemData"]["networkConnection"];
export type SessionInfo =
  JourneyTrackerPayload["systemData"]["sessionMetadata"];
