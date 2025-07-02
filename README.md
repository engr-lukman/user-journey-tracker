# Enhanced User Journey Tracker

## Overview

The Enhanced User Journey Tracker is a comprehensive client-side data collection system that captures detailed user behavior, device characteristics, and system information while maintaining privacy and avoiding deprecated APIs.

## Key Features

### 🔐 Unique User Identification

- **Fingerprint-based User ID**: Uses FingerprintJS for reliable user identification
- **Session Management**: Unique session IDs for journey tracking
- **Cross-session Persistence**: Maintains user identity across sessions

### 🌐 Network & IP Information

- **Client IP Detection**: Multiple fallback services for IP detection
- **WebRTC Local IPs**: Captures local network addresses
- **Connection Details**: Network type, speed, latency information
- **ISP & Location**: Country, region, ISP details (via IP)

### 🧠 System Information

- **Operating System**: Detailed OS detection with version
- **Hardware Details**: CPU cores, memory, architecture
- **Device Classification**: Mobile, tablet, desktop detection
- **Virtualization Detection**: Identifies virtual machines
- **Performance Metrics**: Clock skew, timing information

### 🌐 Browser Information

- **Browser Detection**: Name, version, engine identification
- **Plugin Enumeration**: Detailed browser plugins and MIME types
- **API Support**: Comprehensive API availability testing
- **Feature Detection**: Modern browser features and capabilities
- **Storage Availability**: All storage types testing

### 📱 Display & Device

- **Screen Information**: Resolution, color depth, pixel ratio
- **Viewport Details**: Window dimensions and orientation
- **Touch Capabilities**: Multi-touch support detection
- **Input Methods**: Keyboard, mouse, pointer capabilities
- **Media Queries**: Accessibility preferences, color schemes
- **HDR & Color Gamut**: Advanced display capabilities

### 🌍 Locale & Time

- **Timezone Detection**: Accurate timezone and offset
- **Language Preferences**: Primary and secondary languages
- **Number Formatting**: Locale-specific number formats
- **Currency Support**: Multi-currency formatting
- **Date Formatting**: Various date/time representations

### 🔐 Security & Privacy

- **Incognito Detection**: Private browsing mode identification
- **Ad Blocker Detection**: Ad blocking software presence
- **Permission Status**: Browser permission states
- **Security Context**: HTTPS, origin isolation status
- **WebDriver Detection**: Automated browser detection

### 🧪 Rendering & Fingerprinting

- **Canvas Fingerprinting**: Unique rendering characteristics
- **WebGL Information**: Graphics capabilities and vendor
- **Font Detection**: Available system and web fonts
- **CSS Feature Support**: Modern CSS capabilities
- **WebAssembly Support**: WASM compilation abilities

### 📊 Performance Monitoring

- **Memory Usage**: JavaScript heap information
- **Load Timing**: Navigation and rendering performance
- **Resource Timing**: Network performance metrics
- **User Timing**: Custom performance marks

## Data Structure

The complete payload follows this structure:

```typescript
interface JourneyTrackerPayload {
  userId: string;              // Unique fingerprint-based ID
  sessionId: string;           // Session identifier
  journeySteps: JourneyStep[]; // User journey events
  userData: Record<string, any>; // Custom user data
  totalJourneyTime: number;    // Total journey duration
  systemData: {
    clientNetwork: { ... };     // IP and network info
    systemInformation: { ... }; // OS and hardware
    browserInformation: { ... }; // Browser details
    displayAndDevice: { ... };  // Screen and device info
    localeAndTime: { ... };     // Timezone and locale

    performanceInfo: { ... };   // Performance metrics
    networkConnection: { ... }; // Connection details
    sessionMetadata: { ... };   // Session information
  };
}
```

## Privacy Considerations

### ✅ What We Collect

- **Browser & Device Information**: Technical specifications only
- **Network Information**: Connection details and public IP
- **System Information**: OS, hardware, performance data
- **Rendering Capabilities**: Graphics and display features
- **User Journey**: Navigation and interaction patterns

### ❌ What We DON'T Collect

- **Location Data**: No geolocation or GPS coordinates
- **Audio Data**: No microphone or audio fingerprinting
- **Personal Information**: No PII unless explicitly provided
- **File System**: No access to user files or directories
- **Keystroke Logging**: No input monitoring or recording

## Usage

### Basic Implementation

```typescript
import { useJourneyTracker } from "./composables/useJourneyTracker";

// Initialize the tracker
const {
  initializeJourneyTracker,
  recordJourneyStep,
  saveUserInformation,
  getCompleteJourneyData,
  exportJourneyData,
} = useJourneyTracker();

// Start tracking
await initializeJourneyTracker();

// Record journey steps
recordJourneyStep("page_view", { page: "homepage" });
recordJourneyStep("form_start", { formType: "registration" });

// Save user data
saveUserInformation({
  email: "user@example.com",
  preferences: { theme: "dark" },
});

// Get complete data
const journeyData = getCompleteJourneyData();
```

### Advanced Usage

```typescript
// Record custom events with metadata
recordJourneyStep("button_click", {
  buttonId: "submit-form",
  timestamp: Date.now(),
  elementPosition: { x: 100, y: 200 },
});

// Export data for analysis
exportJourneyData(); // Downloads JSON file
```

## Data Security

### Client-Side Processing

- All data processing happens in the browser
- No server-side dependencies for data collection
- User controls data export and transmission

### Storage

- Local storage for persistence
- Session storage for temporary data
- Configurable data retention policies

### Transmission

- HTTPS-only for external IP services
- Configurable endpoints for data submission
- Optional data encryption before transmission

## Browser Compatibility

### Modern Browsers (Full Support)

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Legacy Browsers (Partial Support)

- Chrome 60-79
- Firefox 60-74
- Safari 11-12
- Edge Legacy

### Feature Detection

- Graceful degradation for unsupported features
- Fallback mechanisms for legacy browsers
- Progressive enhancement approach

## Performance Impact

### Memory Usage

- ~2-5MB additional memory usage
- Efficient data structures and cleanup
- Configurable collection frequency

### Network Impact

- Minimal network requests (IP detection only)
- Cached results to reduce redundant calls
- Configurable timeout settings

### CPU Impact

- Lightweight fingerprinting algorithms
- Async processing for heavy operations
- Debounced collection to reduce overhead

## Configuration Options

```typescript
const config = {
  enableIPDetection: true,
  enableCanvasFingerprinting: true,
  enableWebGLFingerprinting: true,
  enableFontDetection: true,
  ipDetectionTimeout: 5000,
  storageKey: "journey_tracker_data",
  autoExport: false,
  exportFormat: "json",
};
```

## Integration Examples

### Vue.js

```vue
<template>
  <div>
    <button @click="trackAction">Track Action</button>
  </div>
</template>

<script setup>
import { useJourneyTracker } from "./composables/useJourneyTracker";

const { recordJourneyStep } = useJourneyTracker();

const trackAction = () => {
  recordJourneyStep("user_action", { action: "button_click" });
};
</script>
```

### React Integration

```jsx
import { useEffect } from "react";
import { useJourneyTracker } from "./composables/useJourneyTracker";

function App() {
  const { initializeJourneyTracker, recordJourneyStep } = useJourneyTracker();

  useEffect(() => {
    initializeJourneyTracker();
  }, []);

  const handleClick = () => {
    recordJourneyStep("react_action", { component: "App" });
  };

  return <button onClick={handleClick}>Track Action</button>;
}
```

## Analytics & Insights

### User Behavior Analysis

- Journey completion rates
- Drop-off points identification
- User flow optimization
- Conversion funnel analysis

### Device & Browser Insights

- Browser compatibility issues
- Performance bottlenecks
- Feature adoption rates
- Device-specific behaviors

### Security Monitoring

- Bot detection and prevention
- Suspicious activity identification
- Privacy compliance monitoring
- Fraud prevention signals

## Compliance & Privacy

### GDPR Compliance

- User consent management
- Data minimization principles
- Right to erasure support
- Transparent data processing

### CCPA Compliance

- Consumer rights protection
- Data sharing transparency
- Opt-out mechanisms
- Sensitive data handling

### General Privacy

- No PII collection by default
- Anonymization options
- Configurable data retention
- User control over data

## Troubleshooting

### Common Issues

1. **IP Detection Fails**

   - Check network connectivity
   - Verify CORS settings
   - Use fallback detection methods

2. **Fingerprinting Blocked**

   - Respect user privacy settings
   - Implement graceful degradation
   - Use alternative identification methods

3. **Performance Issues**
   - Reduce collection frequency
   - Optimize fingerprinting algorithms
   - Use Web Workers for heavy processing

### Debug Mode

```typescript
const { initializeJourneyTracker } = useJourneyTracker();

// Initialize the journey tracker
await initializeJourneyTracker();
```

## Contributing

### Development Setup

```bash
npm install
npm run dev
```

### Testing

```bash
npm run test
npm run test:coverage
```

### Building

```bash
npm run build
npm run type-check
```

## License

MIT License - see LICENSE file for details.

## Support

For issues, questions, or contributions, please open an issue on the project repository.
