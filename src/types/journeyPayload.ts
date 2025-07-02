// Journey Tracker Data Collection Payload Structure
// This file defines the essential data structure that will be collected

export interface JourneyTrackerPayload {
  // Unique identifiers
  userId: string; // Unique fingerprint-based user ID
  sessionId: string; // Unique session identifier

  // Journey tracking
  journeySteps: JourneyStep[];
  userData: Record<string, any>; // User-provided data
  totalJourneyTime: number; // Total time spent in journey (ms)

  // Essential system data
  systemData: {
    // Device Information
    deviceInfo: {
      deviceType: "mobile" | "tablet" | "desktop";
      operatingSystem: string;
      browserName: string;
      browserVersion: string;
      isMobile: boolean;
      isTablet: boolean;
      isDesktop: boolean;
      viewport: {
        width: number;
        height: number;
      };
      screenResolution: {
        width: number;
        height: number;
      };
    };

    // Geographic & Connection Information
    geoInfo: {
      country?: string;
      countryCode?: string;
      city?: string;
      timezone?: string;
      connectionType?: string;
    };

    // Session Information
    sessionMetadata: {
      startTime: string;
      referrerUrl: string;
      language: string;
    };

    // Performance Metrics
    performanceInfo: {
      loadTime?: number;
      domInteractive?: number;
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
export type DeviceInfo = JourneyTrackerPayload["systemData"]["deviceInfo"];
export type GeoInfo = JourneyTrackerPayload["systemData"]["geoInfo"];
export type SessionInfo =
  JourneyTrackerPayload["systemData"]["sessionMetadata"];
export type PerformanceInfo =
  JourneyTrackerPayload["systemData"]["performanceInfo"];
