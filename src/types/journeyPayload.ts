/**
 * User journey tracking data structures
 */

export interface Payload {
  userId: string;
  sessionId: string;
  journeySteps: JourneyStep[];
  userData: Record<string, any>;
  systemData: SystemData;
  totalJourneyTime: number;
}

export interface SystemData {
  userId: string;
  sessionId: string;
  recordedAt: string;
  browserInfo: BrowserInfo;
  deviceInfo: DeviceInfo;
  hardwareInfo: HardwareInfo;
  screenInfo: ScreenInfo;
  networkInfo: NetworkInfo;
  storageInfo: StorageInfo;
  fingerprintInfo: FingerprintInfo;
}

export interface BrowserInfo {
  name: string;
  version: string;
  userAgent: string;
  language: string;
  cookiesEnabled: boolean;
  doNotTrack: boolean;
  platform: string;
}

export interface DeviceInfo {
  type: string;
  os: string;
  osVersion: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  vendor: string;
  timezone: string;
}

export interface HardwareInfo {
  cpuCores: string;
  memory: string;
  architecture: string;
  touchSupport: boolean;
  maxTouchPoints: number;
}

export interface ScreenInfo {
  resolution: string;
  colorDepth: string;
  pixelRatio: string;
  viewport: string;
  orientation: string;
  availableResolution: string;
}

export interface NetworkInfo {
  timezone: string;
  onlineStatus: boolean;
  effectiveType?: string;
  downlink?: string;
  rtt?: string;
  saveData?: boolean;
  ipAddress: string;
}

export interface StorageInfo {
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  cookiesEnabled: boolean;
  quota: string;
}

export interface FingerprintInfo {
  available: boolean;
  canvasHash?: string;
  webGL?: {
    supported: boolean;
    vendor?: string;
    renderer?: string;
  };
  fonts?: string[];
}

export interface JourneyStep {
  stepName: string;
  recordedAt: string;
  sessionId: string;
  userId: string;
  currentUrl: string;
  currentPath: string;
  [key: string]: any;
}
