# User Journey Tracker

## Overview

The User Journey Tracker is a lightweight client-side data collection system that captures essential user behavior, device characteristics, and system information while maintaining privacy and using modern web APIs. It provides a straightforward way to track user journeys through your application with efficient device fingerprinting and interaction tracking.

## Data Structure

The journey tracker collects and organizes data according to the following structure:

### Core Components

| Component | Description |
|-----------|-------------|
| `userId` | Fingerprint-based unique identifier for the user |
| `sessionId` | Unique identifier for the current session |
| `journeySteps` | Array of all recorded user interactions and page views |
| `userData` | Custom user information collected during the journey |
| `totalJourneyTime` | Total time spent in the journey (in milliseconds) |
| `systemData` | Essential device, browser, and environment information |

### System Data Categories

The tracker collects the following categories of system data:

#### Browser Information (`browserInfo`)

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Browser name (Chrome, Firefox, Safari, etc.) |
| `version` | string | Browser version |
| `userAgent` | string | Full user agent string |
| `language` | string | Primary browser language |
| `cookiesEnabled` | boolean | Whether cookies are enabled |
| `doNotTrack` | boolean | Whether Do Not Track is enabled |
| `webdriver` | boolean | Whether browser is controlled by automation |
| `plugins` | string[] | List of installed browser plugins |

#### Device Information (`deviceInfo`)

| Property | Type | Description |
|----------|------|-------------|
| `deviceType` | "mobile" \| "tablet" \| "desktop" | Type of device |
| `operatingSystem` | string | Operating system name |
| `osVersion` | string | Operating system version |
| `isMobile` | boolean | Whether device is mobile |
| `isTablet` | boolean | Whether device is tablet |
| `isDesktop` | boolean | Whether device is desktop |
| `vendor` | string | Device manufacturer |
| `model` | string | Device model if available |

#### Hardware Information (`hardwareInfo`)

| Property | Type | Description |
|----------|------|-------------|
| `cpuCores` | number \| string | Number of CPU cores |
| `architecture` | number | CPU architecture (32 or 64 bit) when available |
| `deviceMemory` | number | RAM memory in GB when available |
| `hardwareConcurrency` | number | Logical processors available |
| `platform` | string | Platform identifier |
| `touchSupport` | object | Touch capabilities including maxTouchPoints, touchEvent, and isTouch |

#### Display Information (`displayInfo`)

| Property | Type | Description |
|----------|------|-------------|
| `screenResolution` | object | Width and height of screen |
| `colorDepth` | number | Color depth in bits |
| `pixelRatio` | number | Device pixel ratio |
| `viewport` | object | Width and height of viewport |
| `orientation` | string | Screen orientation |
| `isHDR` | boolean | Whether display supports HDR when available |

#### Network Information (`networkInfo`)

| Property | Type | Description |
|----------|------|-------------|
| `ipAddress` | string | User's IP address when available |
| `country` | string | Country name based on IP when available |
| `countryCode` | string | Country code based on IP when available |
| `city` | string | City based on IP when available |
| `timezone` | string | User's timezone |
| `connectionType` | string | Type of connection (wifi, cellular, etc.) when available |
| `effectiveType` | string | Effective connection type (4g, 3g, etc.) when available |
| `downlink` | number | Connection speed in Mbps when available |
| `rtt` | number | Round trip time in ms when available |

#### Storage Information (`storageInfo`)

| Property | Type | Description |
|----------|------|-------------|
| `localStorage` | boolean | Whether localStorage is available |
| `sessionStorage` | boolean | Whether sessionStorage is available |
| `indexedDB` | boolean | Whether indexedDB is available |
| `cookiesEnabled` | boolean | Whether cookies are enabled |

#### Fingerprint Information (`fingerprintInfo`)

| Property | Type | Description |
|----------|------|-------------|
| `canvas` | object | Canvas fingerprinting data including winding support and rendering outputs |
| `webGL` | object | WebGL capabilities including vendor, renderer, and support status |

#### Session Metadata (`sessionMetadata`)

| Property | Type | Description |
|----------|------|-------------|
| `startTime` | string | ISO timestamp of session start |
| `referrerUrl` | string | URL that referred the user |
| `loadTime` | number | Page load time in milliseconds when available |
| `domInteractive` | number | Time to interactive in milliseconds when available |

## Sample Payload

```json
{
  "userId": "43f9d3e7a84dc312f8a96523",
  "sessionId": "43f9d3e7a84dc312f8a96523-1720072584321",
  "journeySteps": [
    {
      "stepName": "journey_started",
      "recordedAt": "2025-07-02T10:23:04.321Z",
      "sessionId": "43f9d3e7a84dc312f8a96523-1720072584321",
      "userId": "43f9d3e7a84dc312f8a96523",
      "currentUrl": "https://example.com/",
      "currentPath": "/"
    },
    {
      "stepName": "welcome_page_viewed",
      "recordedAt": "2025-07-02T10:23:04.450Z",
      "sessionId": "43f9d3e7a84dc312f8a96523-1720072584321",
      "userId": "43f9d3e7a84dc312f8a96523",
      "currentUrl": "https://example.com/",
      "currentPath": "/"
    }
  ],
  "userData": {
    "email": "user@example.com",
    "preferences": { 
      "theme": "dark" 
    }
  },
  "totalJourneyTime": 32450,
  "systemData": {
    "browserInfo": {
      "name": "Chrome",
      "version": "115.0",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      "language": "en-US",
      "cookiesEnabled": true,
      "doNotTrack": false,
      "webdriver": false,
      "plugins": ["Chrome PDF Plugin", "Chrome PDF Viewer"]
    },
    "deviceInfo": {
      "deviceType": "desktop",
      "operatingSystem": "macOS",
      "osVersion": "10.15.7",
      "isMobile": false,
      "isTablet": false,
      "isDesktop": true,
      "vendor": "Apple",
      "model": "MacBookPro"
    },
    "hardwareInfo": {
      "cpuCores": 8,
      "architecture": 64,
      "deviceMemory": 16,
      "hardwareConcurrency": 8,
      "platform": "MacIntel",
      "touchSupport": {
        "maxTouchPoints": 0,
        "touchEvent": false,
        "isTouch": false
      }
    },
    "displayInfo": {
      "screenResolution": {
        "width": 2560,
        "height": 1600
      },
      "colorDepth": 24,
      "pixelRatio": 2,
      "viewport": {
        "width": 1280,
        "height": 800
      },
      "orientation": "landscape",
      "isHDR": false
    },
    "networkInfo": {
      "ipAddress": "203.0.113.195",
      "timezone": "Asia/Dhaka",
      "connectionType": "wifi",
      "effectiveType": "4g",
      "downlink": 10.2,
      "rtt": 50
    },
    "storageInfo": {
      "localStorage": true,
      "sessionStorage": true,
      "indexedDB": true,
      "cookiesEnabled": true
    },
    "fingerprintInfo": {
      "canvas": {
        "winding": true,
        "geometry": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgA...",
        "text": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgA..."
      },
      "webGL": {
        "vendor": "ANGLE (Apple, Apple M1, OpenGL 4.1)",
        "renderer": "ANGLE (Apple, Apple M1, OpenGL 4.1)",
        "supported": true
      }
    },
    "sessionMetadata": {
      "startTime": "2025-07-02T10:23:04.321Z",
      "referrerUrl": "https://www.google.com/",
      "loadTime": 1250,
      "domInteractive": 850
    }
  }
}
```

### Journey Step Structure

Each step in the user journey is recorded with the following structure:

```typescript
interface JourneyStep {
  stepName: string;        // Name of the step (e.g., "page_view", "form_submit")
  recordedAt: string;      // ISO timestamp when the step was recorded
  sessionId: string;       // Current session ID
  userId: string;          // User's unique identifier
  currentUrl: string;      // Complete URL at time of recording
  currentPath: string;     // Path component of the URL
  [key: string]: any;      // Additional custom data for this step
}
```

Example journey step with custom data:

```json
{
  "stepName": "personal_information_form_submitted",
  "recordedAt": "2025-07-02T10:25:38.129Z",
  "sessionId": "43f9d3e7a84dc312f8a96523-1720072584321",
  "userId": "43f9d3e7a84dc312f8a96523",
  "currentUrl": "https://example.com/user-info",
  "currentPath": "/user-info",
  "formFields": ["name", "email", "phone"],
  "formCompletionTime": 94500,
  "validationErrors": 0
}
```

## Key Features

### 🔐 User & Session Tracking

- **Fingerprint-based User ID**: Uses FingerprintJS for reliable user identification
- **Session Management**: Creates unique session IDs for journey tracking
- **Cross-session Persistence**: Maintains user identity across sessions

### 🧠 System & Device Information

- **Browser Details**: Name, version, language, and plugin detection
- **Device Classification**: Mobile, tablet, desktop detection
- **Hardware Information**: CPU cores, memory, architecture, and touch support
- **Operating System**: OS name and version detection
- **Display Properties**: Screen resolution, color depth, and viewport dimensions

### 🌐 Network Information

- **IP Detection**: Basic IP detection with minimal external dependencies
- **Connection Details**: Network type, speed, and connection quality information
- **Geographic Data**: Timezone and region detection

### 🔐 Security & Privacy

- **Webdriver Detection**: Identifies automated browsers for bot detection
- **Canvas Fingerprinting**: Basic rendering characteristics analysis
- **Local Processing**: All data collection happens in the browser

## Usage

### Basic Usage

```typescript
import { useJourneyTracker } from "@/composables/useJourneyTracker";
import { JOURNEY } from "@/constants/journey";

// Import the tracker
const {
  initializeJourneyTracker,
  recordJourneyStep,
  saveUserInformation,
  getCompleteJourneyData,
  exportJourneyData,
  currentUserId,
  currentSessionId,
} = useJourneyTracker();

// Initialize the tracker (typically done in App.vue)
await initializeJourneyTracker();

// Record journey steps using constants from JOURNEY object
await recordJourneyStep(JOURNEY.WELCOME_PAGE.steps.PAGE_VIEWED);
await recordJourneyStep(JOURNEY.PERSONAL_INFORMATION.steps.FORM_SUBMITTED, {
  formFields: ["name", "email", "phone"]
});

// Save user data
await saveUserInformation({
  email: "user@example.com",
  preferences: { theme: "dark" }
});

// Access user and session IDs (reactive refs)
console.log("User ID:", currentUserId.value);
console.log("Session ID:", currentSessionId.value);

// Get complete journey data
const journeyData = await getCompleteJourneyData();
```

### Advanced Usage

```typescript
// Auto-initialization demonstration
await recordJourneyStep(JOURNEY.WELCOME_PAGE.steps.PAGE_VIEWED);

// Record steps with additional metadata
await recordJourneyStep(JOURNEY.WALLET_PAGE.steps.SUBMIT_CLICKED, {
  formCompletionTime: 32450,
  walletType: "mobile",
  validationErrors: 0
});

// Export journey data as downloadable JSON
await exportJourneyData();

// Navigate with journey tracking
const viewDeviceData = async () => {
  await recordJourneyStep(JOURNEY.DEVICE_DATA.steps.VIEW_DEVICE_DATA_CLICKED);
  router.push(JOURNEY.DEVICE_DATA.path);
};
```

## Data Security & Privacy

- **Client-Side Processing**: All data collection and processing happens in the browser
- **Minimal External Requests**: Single API call to ipify.org for IP detection
- **Storage Controls**: Leverages built-in browser storage mechanisms
- **HTTPS Only**: External service calls use secure connections
- **User Control**: Data export and transmission controlled by the application
- **No Server Dependencies**: Data collection does not require server-side components

## Browser Compatibility

### Full Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Chrome for Android 80+
- Safari iOS 13+

### Partial Support
- Chrome 60-79
- Firefox 60-74
- Safari 11-12
- Edge Legacy
- Internet Explorer 11 (limited functionality)

## Performance Considerations

- **Minimal Footprint**: Low memory usage (~1-2MB)
- **Limited Network Activity**: Single external request for IP geolocation
- **Efficient Processing**: Negligible CPU impact during collection
- **Asynchronous Operation**: Non-blocking data collection

## Integration Example

```vue
<template>
  <div>
    <!-- Display user ID and session ID -->
    <div class="text-xs text-gray-500">
      <p>User ID: {{ userId }}</p>
      <p>Session ID: {{ sessionId }}</p>
    </div>
    
    <button @click="trackButtonClick">Track Interaction</button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useJourneyTracker } from "@/composables/useJourneyTracker";
import { JOURNEY } from "@/constants/journey";

const { 
  recordJourneyStep, 
  currentUserId,
  currentSessionId 
} = useJourneyTracker();

// Create reactive computed properties for IDs
const userId = computed(() => currentUserId.value);
const sessionId = computed(() => currentSessionId.value);

// Track page view on component mount
onMounted(async () => {
  await recordJourneyStep(JOURNEY.WELCOME_PAGE.steps.PAGE_VIEWED);
});

// Track button interactions
const trackButtonClick = async () => {
  await recordJourneyStep(JOURNEY.WELCOME_PAGE.steps.GET_STARTED_CLICKED);
};
</script>
```

## Advanced Features

### Auto-Initialization

The tracker supports automatic initialization when needed:

1. Checks if initialization is already in progress and waits for it to complete
2. If not started, automatically initializes the tracker
3. Only after successful initialization, records the requested step

This makes integration resilient and prevents "Journey tracker not initialized" errors:

```typescript
// Pattern 1: Explicit initialization (recommended for main app components)
await initializeJourneyTracker();
await recordJourneyStep(JOURNEY.WELCOME_PAGE.steps.PAGE_VIEWED);

// Pattern 2: Auto-initialization (convenient for child components)
// Automatically initializes if needed
await recordJourneyStep(JOURNEY.WELCOME_PAGE.steps.PAGE_VIEWED);

// Pattern 3: Fire-and-forget (when you don't need to await)
recordJourneyStep(JOURNEY.WELCOME_PAGE.steps.PAGE_VIEWED).catch(console.error);
```

### Centralized Journey Constants

All journey steps are defined as constants in the `journey.ts` file:

```typescript
export const JOURNEY = {
  WELCOME_PAGE: {
    path: "/",
    name: "Home",
    steps: {
      PAGE_VIEWED: "welcome_page_viewed",
      GET_STARTED_CLICKED: "welcome_get_started_clicked",
    },
  },
  // ...more journey steps
}
```

## Device Information Explorer

The tracker includes a dedicated Device Data page that provides an interactive interface to explore all collected device information:

- **Browser Information**: Name, version, language settings, and capabilities
- **Device Information**: OS details, device type, and vendor information
- **Hardware Information**: CPU cores, memory, and touch capabilities
- **Display Information**: Screen resolution, color depth, and viewport dimensions
- **Network Information**: IP address, connection type, and timezone data
- **Storage Information**: Available storage types and permissions
- **Fingerprint Data**: Canvas and WebGL fingerprinting information

Access this page from the home page via the "View Device Information" button, which records the `VIEW_DEVICE_DATA_CLICKED` journey step.

## Analytics Capabilities

The collected data enables various analytics opportunities:

- **User Journey Analysis**: Completion rates and conversion funnels
- **Drop-off Identification**: Detect where users abandon processes
- **Device Intelligence**: Browser and hardware distribution statistics
- **Performance Monitoring**: Correlate device capabilities with user experience
- **Geographic Distribution**: User location patterns and regional behaviors
- **Form Optimization**: Track form completion time and error rates

## API Reference

### Core Functions

| Function | Description | Returns |
|----------|-------------|---------|
| `initializeJourneyTracker()` | Initializes the tracker, generates user/session IDs, and collects system data | `Promise<void>` |
| `recordJourneyStep(stepName, additionalData?)` | Records a journey step with optional custom data | `Promise<void>` |
| `saveUserInformation(userInfo)` | Saves user-specific information to the journey data | `Promise<void>` |
| `getCompleteJourneyData()` | Returns the complete journey data object | `Promise<Payload>` |
| `exportJourneyData()` | Downloads journey data as a JSON file | `Promise<void>` |
| `clearJourneyData()` | Clears all collected journey data | `void` |

### Reactive Properties

| Property | Type | Description |
|----------|------|-------------|
| `currentUserId` | `Ref<string \| null>` | Current user's fingerprint-based ID |
| `currentSessionId` | `Ref<string \| null>` | Current session ID |
| `journeyStepsData` | `Ref<JourneyStep[]>` | Array of all recorded journey steps |
| `collectedUserData` | `Ref<Record<string, any>>` | User information collected during the journey |
| `deviceSystemData` | `Ref<Record<string, any>>` | System information including browser, device, hardware details |
| `trackerInitialized` | `Ref<boolean>` | Whether the tracker has been successfully initialized |

### TypeScript Type Exports

The library exports TypeScript types for easier integration:

```typescript
// Main payload structure
export interface Payload {
  userId: string;
  sessionId: string;
  journeySteps: JourneyStep[];
  userData: Record<string, any>;
  totalJourneyTime: number;
  systemData: {
    browserInfo: BrowserInfo;
    deviceInfo: DeviceInfo;
    hardwareInfo: HardwareInfo;
    displayInfo: DisplayInfo;
    networkInfo: NetworkInfo;
    storageInfo: StorageInfo;
    fingerprintInfo?: FingerprintInfo;
    sessionMetadata: SessionMetadata;
  };
}

// Journey step structure
export interface JourneyStep {
  stepName: string;
  recordedAt: string;
  sessionId: string;
  userId: string;
  currentUrl: string;
  currentPath: string;
  [key: string]: any; // Additional step data
}

// System data category types
export type BrowserInfo = Payload["systemData"]["browserInfo"];
export type DeviceInfo = Payload["systemData"]["deviceInfo"];
export type HardwareInfo = Payload["systemData"]["hardwareInfo"];
export type DisplayInfo = Payload["systemData"]["displayInfo"];
export type NetworkInfo = Payload["systemData"]["networkInfo"];
export type StorageInfo = Payload["systemData"]["storageInfo"];
export type SessionMetadata = Payload["systemData"]["sessionMetadata"];
```

### Available Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Welcome page with journey start option and device data access |
| Terms & Conditions | `/terms` | Legal terms and conditions acceptance page |
| Personal Information | `/user-info` | User details collection form |
| Wallet Setup | `/wallet` | Mobile wallet configuration interface |
| OTP Verification | `/otp` | One-time password verification screen |
| Verification | `/verification` | Journey completion confirmation with session details |
| Device Data | `/device-data` | Interactive device and browser information explorer |

## License

MIT License - See LICENSE file for details.
