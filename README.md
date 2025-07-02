# Enhanced User Journey Tracker

## Overview

The Enhanced User Journey Tracker is a comprehensive client-side data collection system that captures detailed user behavior, device characteristics, and system information while maintaining privacy and avoiding deprecated APIs.

## Device Information Parameters

The following table details all device parameters collected by the tracker:

| Item Name | Parameter Name | Approach Summary |
|-----------|---------------|-----------------|
| Device Architecture | `architecture` (int) | Differentiates x86/x86-64 arch devices. Identifies the device's CPU architecture, helping in fingerprinting unique hardware specs. |
| Audio Latency | `audioLatency` | Measures device-specific audio processing latency, which can vary across browsers and systems. |
| Canvas Capability | `canvas` (object) | Contains canvas rendering capabilities:<br>• `winding`: Checks if canvas supports winding for rendering accuracy detection.<br>• `geometry`: Stores the rendering output of a specific shape, useful for fingerprinting.<br>• `text`: Captures text rendering properties, which vary across OSes and browsers.<br><br>Target is to add a layer to detect headless browser detection. |
| Device Screen Color Depth | `colorDepth` | Represents the number of bits used per color component, aiding in device profiling. |
| CPU Cores | `cpuCores` | Checks CPU core count available to the browser. |
| Date Time Locale Setting | `dateTime` | Identifies locale-specific date and time formatting preferences. |
| Device Memory | `deviceMemory` | Checks available device memory in GB. |
| Hardware Concurrency | `hardwareConcurrency` | Identifies the number of logical processors available to run threads. |
| HDR Settings | `isHDR` | Checks if the display supports High Dynamic Range. |
| Language Settings | `languages` | Identifies user's preferred languages in order of preference. |
| OS CPU | `osCPU` | Provides information about the operating system's CPU. |
| Screen Frame | `screenFrame` | Checks display frame dimensions and positioning. |
| Screen Resolution | `screenResolution` | Captures the screen resolution as [width, height]. |
| Timezone | `timezone` | Identifies the user's timezone (e.g., "Asia/Dhaka"). |
| Touch Support | `isTouch` (object) | Determines touch capabilities:<br>• `maxTouchPoints`: Maximum number of touch points supported.<br>• `touchEvent`: Whether TouchEvent API is supported.<br>• `touchStart`: Whether touchstart events are supported. |
| Vendor Name | `vendor` | Identifies the browser vendor (e.g., "Google Inc."). |
| WebGL | `webGL` (object) | Detailed WebGL capabilities:<br>• `contextAttributes`: WebGL context attributes.<br>• `parameters`: WebGL parameters and their values.<br>• `shaderPrecisions`: Precision details of shaders.<br>• `extensions`: Supported WebGL extensions.<br>• `extensionParameters`: Parameters provided by extensions. |
| Session Storage | `sessionStorage` | Checks if sessionStorage is available. |
| Local Storage | `localStorage` | Checks if localStorage is available. |
| Cookies Enabled | `cookiesEnabled` (bool) | Determines if cookies are enabled in the browser. |
| Webdriver | `webdriver` | Checks navigator.webdriver to detect automated browsers. Some bots have navigator.webdriver == true, which helps in bot detection. |
| Plugins | `plugins` | Lists installed browser plugins for fingerprinting. We expect at least one extension/plugin in use (e.g., our barta extension). |

## Sample Payload

```json
{
  "device_info": {
    "architecture": 256,
    "audioLatency": -2,
    "canvas": {
      "winding": true,
      "geometry": "data:imasdkasjdklasjdklasjdkl",
      "text": "data:image/png;asdjKASJd="
    },
    "colorDepth": 24,
    "cookies": true,
    "dateTime": "en-US",
    "deviceMemory": 8,
    "hardwareConcurrency": 8,
    "isHDR": false,
    "languages": [
      [
        "en-US"
      ]
    ],
    "localStorage": true,
    "permissions": {},
    "screenResolution": [
      1920,
      1080
    ],
    "sessionStorage": true,
    "timezone": "Asia/Dhaka",
    "isTouch": {
      "maxTouchPoints": 2,
      "touchEvent": false,
      "touchStart": false
    },
    "vendor": "Google Inc.",
    "webGL": {
      "contextAttributes": [
        "alpha=true",
        "antialias=true",
        "depth=true",
        "desynchronized=false",
        "failIfMajorPerformanceCaveat=false",
        "powerPreference=default",
        "premultipliedAlpha=true",
        "preserveDrawingBuffer=false",
        "stencil=false",
        "xrCompatible=false"
      ],
      "parameters": [
        "VIEWPORT=2978=0,0,300,150",
        "ZERO=0"
      ],
      "shaderPrecisions": [
        "FRAGMENT_SHADER.LOW_FLOAT=127,127,23",
        "FRAGMENT_SHADER.MEDIUM_FLOAT=127,127,23",
        "FRAGMENT_SHADER.HIGH_FLOAT=127,127,23",
        "FRAGMENT_SHADER.LOW_INT=31,30,0",
        "FRAGMENT_SHADER.MEDIUM_INT=31,30,0",
        "FRAGMENT_SHADER.HIGH_INT=31,30,0",
        "VERTEX_SHADER.LOW_FLOAT=127,127,23",
        "VERTEX_SHADER.MEDIUM_FLOAT=127,127,23",
        "VERTEX_SHADER.HIGH_FLOAT=127,127,23",
        "VERTEX_SHADER.LOW_INT=31,30,0",
        "VERTEX_SHADER.MEDIUM_INT=31,30,0",
        "VERTEX_SHADER.HIGH_INT=31,30,0"
      ],
      "extensions": [
        "ANGLE_instanced_arrays",
        "EXT_blend_minmax",
        "EXT_clip_control",
        "EXT_color_buffer_half_float",
        "EXT_depth_clamp",
        "EXT_disjoint_timer_query",
        "EXT_float_blend",
        "EXT_frag_depth",
        "EXT_polygon_offset_clamp",
        "EXT_shader_texture_lod",
        "EXT_texture_compression_bptc",
        "EXT_texture_compression_rgtc",
        "EXT_texture_filter_anisotropic",
        "EXT_texture_mirror_clamp_to_edge",
        "EXT_sRGB",
        "KHR_parallel_shader_compile",
        "OES_element_index_uint",
        "OES_fbo_render_mipmap",
        "OES_standard_derivatives",
        "OES_texture_float",
        "OES_texture_float_linear",
        "OES_texture_half_float",
        "OES_texture_half_float_linear",
        "OES_vertex_array_object",
        "WEBGL_blend_func_extended",
        "WEBGL_color_buffer_float",
        "WEBGL_compressed_texture_astc",
        "WEBGL_compressed_texture_etc",
        "WEBGL_compressed_texture_etc1",
        "WEBGL_compressed_texture_s3tc",
        "WEBGL_compressed_texture_s3tc_srgb",
        "WEBGL_debug_renderer_info",
        "WEBGL_debug_shaders",
        "WEBGL_depth_texture",
        "WEBGL_draw_buffers",
        "WEBGL_lose_context",
        "WEBGL_multi_draw",
        "WEBGL_polygon_mode"
      ],
      "extensionParameters": [
        "CLIP_DEPTH_MODE_EXT=37725",
        "CLIP_ORIGIN_EXT=37724"
        // Additional parameters truncated for brevity
      ]
    },
    "webdriver": false,
    "plugins": "something"
  }
}
```

## Key Features

### 🔐 Unique User Identification

- **Fingerprint-based User ID**: Uses FingerprintJS for reliable user identification
- **Session Management**: Unique session IDs for journey tracking
- **Cross-session Persistence**: Maintains user identity across sessions

### 🌐 Network & IP Information

- **Client IP Detection**: Basic IP detection with country information
- **Connection Details**: Network type and connection quality information

### 🧠 System Information

- **Operating System**: Basic OS detection
- **Hardware Details**: CPU cores, memory, architecture
- **Device Classification**: Mobile, tablet, desktop detection

### 🌐 Browser Information

- **Browser Detection**: Name, version identification
- **Plugin Enumeration**: Basic browser plugins detection
- **Storage Availability**: LocalStorage and SessionStorage testing

### 📱 Display & Device

- **Screen Information**: Resolution, color depth
- **Viewport Details**: Window dimensions
- **Touch Capabilities**: Touch support detection
- **HDR Support**: Display capability detection

### 🌍 Locale & Time

- **Timezone Detection**: User timezone identification
- **Language Preferences**: Primary language detection

### 🔐 Security & Privacy

- **Webdriver Detection**: Automated browser identification for bot detection
- **Canvas Fingerprinting**: Basic rendering characteristics analysis

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

## Performance Impact

- Minimal memory usage (~1-2MB)
- Limited network requests (only for geo-info)
- Lightweight processing with negligible CPU impact

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

- Journey completion rates
- Drop-off points identification
- User flow optimization
- Device and browser usage statistics
- Performance bottlenecks detection

## License

MIT License - see LICENSE file for details.
