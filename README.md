# User Journey Tracker

A simple client-side tracking system that captures user behavior and device information for analytics purposes.

## What It Does

This tracker collects two main types of data:

- **Device Information**: Browser, hardware, and system details for fingerprinting
- **User Journey Data**: How users navigate through your application

## What Data Is Collected

### Core Journey Information

| Item Name    | Parameter Name     | Type   | Description                           | Example                                    |
| ------------ | ------------------ | ------ | ------------------------------------- | ------------------------------------------ |
| User ID      | `userId`           | string | Fingerprint-based unique identifier   | `"43f9d3e7a84dc312f8a96523"`               |
| Session ID   | `sessionId`        | string | Current session identifier            | `"43f9d3e7a84dc312f8a96523-1720072584321"` |
| Step Name    | `stepName`         | string | Action or page name                   | `"welcome_page_viewed"`                    |
| Timestamp    | `recordedAt`       | string | When the action occurred (ISO format) | `"2025-07-08T10:23:04.321Z"`               |
| Current URL  | `currentUrl`       | string | Complete page URL                     | `"https://example.com/user-info"`          |
| Current Path | `currentPath`      | string | URL path only                         | `"/user-info"`                             |
| Journey Time | `totalJourneyTime` | number | Total session duration (milliseconds) | `32450`                                    |

### Browser Detection

| Item Name         | Parameter Name   | Type    | Description                          | Example                                                |
| ----------------- | ---------------- | ------- | ------------------------------------ | ------------------------------------------------------ |
| Browser Name      | `name`           | string  | Browser identifier                   | `"Chrome"`                                             |
| Browser Version   | `version`        | string  | Version number                       | `"115.0"`                                              |
| User Agent        | `userAgent`      | string  | Complete user agent string           | `"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)..."` |
| Language Settings | `language`       | string  | Primary browser language             | `"en-US"`                                              |
| Cookies Enabled   | `cookiesEnabled` | boolean | Cookie support status                | `true`                                                 |
| Do Not Track      | `doNotTrack`     | boolean | DNT header status                    | `false`                                                |
| Webdriver         | `webdriver`      | boolean | Automation detection (bot detection) | `false`                                                |
| Platform          | `platform`       | string  | Operating platform                   | `"MacIntel"`                                           |

### Device Information

| Item Name        | Parameter Name | Type    | Description         | Example                               |
| ---------------- | -------------- | ------- | ------------------- | ------------------------------------- |
| Device Type      | `type`         | string  | Device category     | `"desktop"` / `"mobile"` / `"tablet"` |
| Operating System | `os`           | string  | OS name             | `"macOS"` / `"Windows"` / `"Android"` |
| OS Version       | `osVersion`    | string  | OS version number   | `"10.15.7"`                           |
| Is Mobile        | `isMobile`     | boolean | Mobile device flag  | `false`                               |
| Is Tablet        | `isTablet`     | boolean | Tablet device flag  | `false`                               |
| Is Desktop       | `isDesktop`    | boolean | Desktop device flag | `true`                                |
| Vendor Name      | `vendor`       | string  | Device manufacturer | `"Apple"`                             |
| Timezone         | `timezone`     | string  | User's timezone     | `"Asia/Dhaka"`                        |

### Hardware Specifications

| Item Name            | Parameter Name        | Type   | Description                   | Example                                                          |
| -------------------- | --------------------- | ------ | ----------------------------- | ---------------------------------------------------------------- |
| CPU Cores            | `cpuCores`            | string | Number of processor cores     | `"8 cores"`                                                      |
| Device Memory        | `memory`              | string | Available RAM                 | `"16 GB RAM"`                                                    |
| Device Architecture  | `architecture`        | string | CPU architecture (x86/x86-64) | `"64-bit"`                                                       |
| Hardware Concurrency | `hardwareConcurrency` | number | Logical processors available  | `8`                                                              |
| Touch Support        | `touchSupport`        | object | Touch capability detection    | `{ "maxTouchPoints": 0, "touchEvent": false, "isTouch": false }` |
| Max Touch Points     | `maxTouchPoints`      | number | Multi-touch support level     | `0`                                                              |

### Display Properties

| Item Name                 | Parameter Name        | Type    | Description            | Example       |
| ------------------------- | --------------------- | ------- | ---------------------- | ------------- |
| Screen Resolution         | `resolution`          | string  | Display dimensions     | `"2560x1600"` |
| Device Screen Color Depth | `colorDepth`          | string  | Color bit depth        | `"24-bit"`    |
| Pixel Ratio               | `pixelRatio`          | string  | Device pixel ratio     | `"2x"`        |
| Viewport                  | `viewport`            | string  | Browser window size    | `"1280x800"`  |
| Orientation               | `orientation`         | string  | Screen orientation     | `"landscape"` |
| Checks HDR Settings       | `isHDR`               | boolean | HDR display capability | `false`       |
| Available Resolution      | `availableResolution` | string  | Usable screen area     | `"2560x1580"` |

### Network & Connectivity

| Item Name       | Parameter Name  | Type    | Description            | Example           |
| --------------- | --------------- | ------- | ---------------------- | ----------------- |
| IP Address      | `ipAddress`     | string  | User's IP address      | `"203.0.113.195"` |
| Timezone        | `timezone`      | string  | Network timezone       | `"Asia/Dhaka"`    |
| Online Status   | `onlineStatus`  | boolean | Internet connectivity  | `true`            |
| Connection Type | `effectiveType` | string  | Network speed class    | `"4g"`            |
| Download Speed  | `downlink`      | string  | Connection speed       | `"10.2 Mbps"`     |
| Round Trip Time | `rtt`           | string  | Network latency        | `"50 ms"`         |
| Save Data Mode  | `saveData`      | boolean | Data saving preference | `false`           |

### Storage Capabilities

| Item Name       | Parameter Name   | Type    | Description                  | Example    |
| --------------- | ---------------- | ------- | ---------------------------- | ---------- |
| Local Storage   | `localStorage`   | boolean | Local storage availability   | `true`     |
| Session Storage | `sessionStorage` | boolean | Session storage availability | `true`     |
| IndexedDB       | `indexedDB`      | boolean | IndexedDB support            | `true`     |
| Cookies Enabled | `cookiesEnabled` | boolean | Cookie support               | `true`     |
| Storage Quota   | `quota`          | string  | Available storage space      | `"5.2 GB"` |

### Advanced Fingerprinting

| Item Name         | Parameter Name     | Type   | Description                       | Example                                                                     |
| ----------------- | ------------------ | ------ | --------------------------------- | --------------------------------------------------------------------------- |
| Canvas Capability | `canvas`           | object | Canvas rendering fingerprint      | `{ "winding": true, "geometry": "data:image...", "text": "data:image..." }` |
| Canvas Hash       | `canvasHash`       | string | Canvas rendering signature        | `"AbC123XyZ789..."`                                                         |
| WebGL             | `webGL`            | object | WebGL capabilities and extensions | `{ "supported": true, "vendor": "ANGLE", "renderer": "OpenGL 4.1" }`        |
| WebGL Vendor      | `webGL.vendor`     | string | Graphics vendor                   | `"ANGLE (Apple, Apple M1)"`                                                 |
| WebGL Renderer    | `webGL.renderer`   | string | Graphics renderer                 | `"ANGLE (Apple, Apple M1, OpenGL 4.1)"`                                     |
| WebGL Extensions  | `webGL.extensions` | array  | Supported WebGL extensions        | `["ANGLE_instanced_arrays", "EXT_blend_minmax", ...]`                       |
| Available Fonts   | `fonts`            | array  | Detected system fonts             | `["Arial", "Helvetica", "Times"]`                                           |

## Available Pages

The demo application includes these journey steps:

- **Home**: Starting point with introduction
- **Terms**: Legal terms acceptance
- **User Info**: Personal information form
- **Wallet**: Mobile wallet setup
- **OTP**: Verification code input
- **Verification**: Journey completion
- **Device Data**: View collected information

## Payload

```json
{
  "userId": "43f9d3e7a84dc312f8a96523",
  "sessionId": "43f9d3e7a84dc312f8a96523-1720072584321",
  "totalJourneyTime": 32450,
  "systemData": {
    "userId": "43f9d3e7a84dc312f8a96523",
    "sessionId": "43f9d3e7a84dc312f8a96523-1720072584321",
    "recordedAt": "2025-07-08T10:23:04.321Z",
    "browserInfo": {
      "name": "Chrome",
      "version": "115.0",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "language": "en-US",
      "cookiesEnabled": true,
      "doNotTrack": false,
      "platform": "MacIntel"
    },
    "deviceInfo": {
      "type": "desktop",
      "os": "macOS",
      "osVersion": "10.15.7",
      "isMobile": false,
      "isTablet": false,
      "isDesktop": true,
      "vendor": "Apple",
      "timezone": "Asia/Dhaka"
    },
    "hardwareInfo": {
      "cpuCores": "8 cores",
      "memory": "16 GB RAM",
      "architecture": "64-bit",
      "touchSupport": false,
      "maxTouchPoints": 0
    },
    "screenInfo": {
      "resolution": "2560x1600",
      "colorDepth": "24-bit",
      "pixelRatio": "2x",
      "viewport": "1280x800",
      "orientation": "landscape",
      "availableResolution": "2560x1580"
    },
    "networkInfo": {
      "timezone": "Asia/Dhaka",
      "onlineStatus": true,
      "effectiveType": "4g",
      "downlink": "10.2 Mbps",
      "rtt": "50 ms",
      "saveData": false,
      "ipAddress": "203.0.113.195"
    },
    "storageInfo": {
      "localStorage": true,
      "sessionStorage": true,
      "indexedDB": true,
      "cookiesEnabled": true,
      "quota": "5.2 GB"
    },
    "fingerprintInfo": {
      "available": true,
      "canvasHash": "AbC123XyZ789...",
      "webGL": {
        "supported": true,
        "vendor": "ANGLE (Apple, Apple M1)",
        "renderer": "ANGLE (Apple, Apple M1, OpenGL 4.1)",
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
          "VIEWPORT=0,0,300,150",
          "MAX_TEXTURE_SIZE=16384",
          "MAX_VERTEX_ATTRIBS=16"
        ],
        "extensions": [
          "ANGLE_instanced_arrays",
          "EXT_blend_minmax",
          "EXT_color_buffer_half_float",
          "EXT_frag_depth",
          "EXT_shader_texture_lod",
          "EXT_texture_filter_anisotropic",
          "OES_element_index_uint",
          "OES_standard_derivatives",
          "OES_texture_float",
          "OES_vertex_array_object",
          "WEBGL_compressed_texture_s3tc",
          "WEBGL_debug_renderer_info",
          "WEBGL_depth_texture",
          "WEBGL_lose_context"
        ]
      },
      "fonts": ["Arial", "Helvetica", "Times", "Courier", "Verdana"]
    }
  },
  "journeySteps": [
    {
      "stepName": "journey_started",
      "recordedAt": "2025-07-08T10:23:04.321Z",
      "sessionId": "43f9d3e7a84dc312f8a96523-1720072584321",
      "userId": "43f9d3e7a84dc312f8a96523",
      "currentUrl": "https://example.com/",
      "currentPath": "/"
    },
    {
      "stepName": "welcome_page_viewed",
      "recordedAt": "2025-07-08T10:23:04.450Z",
      "sessionId": "43f9d3e7a84dc312f8a96523-1720072584321",
      "userId": "43f9d3e7a84dc312f8a96523",
      "currentUrl": "https://example.com/",
      "currentPath": "/"
    }
  ],
  "userData": {
    "personalInformation": {
      "fullName": "John Doe",
      "email": "john.doe@example.com"
    }
  }
}
```
