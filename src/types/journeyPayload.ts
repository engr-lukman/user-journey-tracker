/**
 * Core data structures for user journey tracking
 */

export interface Payload {
  userId: string; // Fingerprint-based user ID
  sessionId: string; // Session identifier
  journeySteps: JourneyStep[];
  userData: Record<string, any>;
  totalJourneyTime: number;

  systemData: {
    // Browser Information
    browserInfo: {
      name: string;
      version: string;
      userAgent: string;
      language: string;
      cookiesEnabled: boolean;
      doNotTrack?: boolean;
      webdriver: boolean; // Helps detect automated browsers
      plugins?: string[];
    };

    // Device & OS Information
    deviceInfo: {
      deviceType: "mobile" | "tablet" | "desktop";
      operatingSystem: string;
      osVersion: string;
      isMobile: boolean;
      isTablet: boolean;
      isDesktop: boolean;
      vendor: string;
      model?: string;
    };

    // Hardware Information
    hardwareInfo: {
      cpuCores: number | string;
      architecture?: number; // 32 or 64 bit
      deviceMemory?: number; // In GB
      hardwareConcurrency?: number;
      platform: string;
      touchSupport: {
        maxTouchPoints: number;
        touchEvent: boolean;
        isTouch: boolean;
      };
    };

    // Display Information
    displayInfo: {
      screenResolution: {
        width: number;
        height: number;
      };
      colorDepth: number;
      pixelRatio: number;
      viewport: {
        width: number;
        height: number;
      };
      orientation: string;
      isHDR?: boolean;
    };

    // Network Information
    networkInfo: {
      ipAddress?: string;
      country?: string;
      countryCode?: string;
      city?: string;
      timezone: string;
      connectionType?: string; // wifi, cellular, etc.
      effectiveType?: string; // 4g, 3g, etc.
      downlink?: number; // In Mbps
      rtt?: number; // Round trip time
    };

    // Storage Information
    storageInfo: {
      localStorage: boolean;
      sessionStorage: boolean;
      indexedDB: boolean;
      cookiesEnabled: boolean;
    };

    // Fingerprinting for bot detection
    fingerprintInfo?: {
      canvas?: {
        winding: boolean;
        geometry: string; // Base64 rendering
        text: string; // Base64 text rendering
      };
      webGL?: {
        vendor: string;
        renderer: string;
        supported: boolean;
      };
    };

    // Session metadata
    sessionMetadata: {
      startTime: string;
      referrerUrl: string;
      loadTime?: number; // In ms
      domInteractive?: number; // In ms
    };
  };
}

export interface JourneyStep {
  stepName: string; // e.g., "page_view", "form_submit"
  recordedAt: string; // ISO timestamp
  sessionId: string;
  userId: string;
  currentUrl: string;
  currentPath: string;
  [key: string]: any; // Additional step data
}

// Type exports
export type BrowserInfo = Payload["systemData"]["browserInfo"];
export type DeviceInfo = Payload["systemData"]["deviceInfo"];
export type HardwareInfo = Payload["systemData"]["hardwareInfo"];
export type DisplayInfo = Payload["systemData"]["displayInfo"];
export type NetworkInfo = Payload["systemData"]["networkInfo"];
export type StorageInfo = Payload["systemData"]["storageInfo"];
export type SessionMetadata = Payload["systemData"]["sessionMetadata"];
