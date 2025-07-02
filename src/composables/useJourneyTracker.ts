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

      console.log("🔐 User Identifiers Generated:", {
        userId: currentUserId.value,
        sessionId: currentSessionId.value,
        fingerprintData: fingerprintResult,
      });
    } catch (error) {
      console.warn("FingerprintJS failed, using fallback ID:", error);
      currentUserId.value = `user-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      currentSessionId.value = `session-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      console.log("🔐 Fallback User Identifiers Generated:", {
        userId: currentUserId.value,
        sessionId: currentSessionId.value,
      });
    }
  };

  const collectDeviceAndBrowserData = async () => {
    const deviceInfo = {
      // 🌐 1. Client IP & Network Information
      clientNetwork: await getClientIPAndNetwork(),

      // 🧠 2. System Information
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
        virtualization: detectVirtualization(),
        clockSkew: getClockSkew(),
        hardwareInfo: getHardwareInfo(),
      },

      // 🌐 3. Browser Information (Enhanced)
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
        plugins: getBrowserPlugins(),
        mimeTypes: getBrowserMimeTypes(),
        storageAvailability: {
          sessionStorage: isStorageAvailable("sessionStorage"),
          indexedDB: "indexedDB" in window,
          cookies: navigator.cookieEnabled,
          webSQL: "openDatabase" in window,
        },
        apiSupport: getAPISupport(),
        browserFeatures: getBrowserFeatures(),
      },

      // 📱 4. Display & Device Information (Enhanced)
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
        inputCapabilities: getInputCapabilities(),
        mediaQueries: getMediaQuerySupport(),
        displayFeatures: getDisplayFeatures(),
      },

      // 🌍 5. Locale & Time Information
      localeAndTime: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        language: navigator.language,
        languages: navigator.languages || [navigator.language],
        dateTimeFormat: getDateTimeFormats(),
        numberFormat: getNumberFormats(),
        currencyFormat: getCurrencyFormats(),
      },

      // 🔐 6. Security & Privacy Indicators
      securityAndPrivacy: {
        webdriver: navigator.webdriver || false,
        incognitoMode: await detectIncognitoMode(),
        adBlocker: await detectAdBlocker(),
        permissions: await getPermissionsStatus(),
        doNotTrack: navigator.doNotTrack || "unknown",
        secureContext: window.isSecureContext,
        crossOriginIsolated: window.crossOriginIsolated,
      },

      // 🧪 7. Rendering & Behavioral Fingerprints (Audio removed)
      renderingAndBehavior: {
        canvas: getCanvasFingerprint(),
        webGL: await getWebGLFingerprint(),
        fontFingerprint: await getFontFingerprint(),
        cssSupport: getCSSSupport(),
        webAssembly: await getWebAssemblyFingerprint(),
        timing: getTimingFingerprint(),
      },

      // 📊 8. Performance & Memory Information
      performanceInfo: getPerformanceInfo(),

      // 🌐 9. Network Connection Details
      networkConnection: getNetworkConnectionInfo(),

      // 📄 10. Session Metadata
      sessionMetadata: {
        sessionStartTime: new Date().toISOString(),
        referrerUrl: document.referrer,
        currentUrl: window.location.href,
        documentTitle: document.title,
        documentCharset: document.characterSet,
        documentReadyState: document.readyState,
      },
    };

    Object.assign(deviceSystemData, deviceInfo);
  };

  // Enhanced helper functions for comprehensive data collection

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
      colorGamut: getColorGamut(),
      hdrSupport: getHDRSupport(),
      refreshRate: getRefreshRate(),
    };
  };

  const getColorGamut = () => {
    if (window.matchMedia("(color-gamut: rec2020)").matches) return "rec2020";
    if (window.matchMedia("(color-gamut: p3)").matches) return "p3";
    if (window.matchMedia("(color-gamut: srgb)").matches) return "srgb";
    return "unknown";
  };

  const getHDRSupport = () => {
    return {
      hdr10: window.matchMedia("(dynamic-range: high)").matches,
      dolbyVision: window.matchMedia(
        "(color-gamut: rec2020) and (dynamic-range: high)"
      ).matches,
    };
  };

  const getRefreshRate = () => {
    return new Promise((resolve) => {
      let startTime = performance.now();
      let frameCount = 0;

      const countFrames = () => {
        frameCount++;
        if (frameCount < 60) {
          requestAnimationFrame(countFrames);
        } else {
          const endTime = performance.now();
          const refreshRate = Math.round(
            (1000 * frameCount) / (endTime - startTime)
          );
          resolve(refreshRate);
        }
      };

      requestAnimationFrame(countFrames);
    });
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

  const getBrowserPlugins = () => {
    try {
      return Array.from(navigator.plugins).map((plugin) => ({
        name: plugin.name,
        description: plugin.description,
        filename: plugin.filename,
        length: plugin.length,
        mimeTypes: Array.from(plugin).map((mime) => mime.type),
      }));
    } catch (error) {
      return [];
    }
  };

  const getBrowserMimeTypes = () => {
    try {
      return Array.from(navigator.mimeTypes).map((mime) => ({
        type: mime.type,
        description: mime.description,
        suffixes: mime.suffixes,
        enabledPlugin: mime.enabledPlugin?.name || null,
      }));
    } catch (error) {
      return [];
    }
  };

  const getBrowserFeatures = () => {
    return {
      serviceWorker: "serviceWorker" in navigator,
      pushNotifications: "PushManager" in window,
      webGL: !!getWebGLContext(),
      webGL2: !!getWebGL2Context(),
      webAssembly: "WebAssembly" in window,
      webRTC: "RTCPeerConnection" in window,
      webSpeech:
        "SpeechRecognition" in window || "webkitSpeechRecognition" in window,
      fullscreen: "requestFullscreen" in document.documentElement,
      pictureInPicture: "pictureInPictureEnabled" in document,
      clipboardAPI: "clipboard" in navigator,
      credentialsAPI: "credentials" in navigator,
      paymentRequest: "PaymentRequest" in window,
      webShare: "share" in navigator,
      battery: "getBattery" in navigator,
      gamepad: "getGamepads" in navigator,
      vibration: "vibrate" in navigator,
      wakeLock: "wakeLock" in navigator,
    };
  };

  const getWebGLContext = () => {
    try {
      const canvas = document.createElement("canvas");
      return (
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      );
    } catch (e) {
      return null;
    }
  };

  const getWebGL2Context = () => {
    try {
      const canvas = document.createElement("canvas");
      return canvas.getContext("webgl2");
    } catch (e) {
      return null;
    }
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

  const getDisplayFeatures = () => {
    return {
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      colorGamut: getColorGamut(),
      hdrCapable: window.matchMedia("(dynamic-range: high)").matches,
      highContrast: window.matchMedia("(prefers-contrast: high)").matches,
      forcedColors: window.matchMedia("(forced-colors: active)").matches,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
      colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
    };
  };

  const getDateTimeFormats = () => {
    const now = new Date();
    return {
      locale: now.toLocaleString(),
      dateString: now.toDateString(),
      timeString: now.toTimeString(),
      isoString: now.toISOString(),
      utcString: now.toUTCString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: now.getTimezoneOffset(),
    };
  };

  const getNumberFormats = () => {
    try {
      const number = 1234567.89;
      return {
        standard: number.toLocaleString(),
        currency: number.toLocaleString(undefined, {
          style: "currency",
          currency: "USD",
        }),
        percent: (0.1234).toLocaleString(undefined, { style: "percent" }),
        scientific: number.toExponential(),
      };
    } catch (error) {
      return { error: "Number formatting not supported" };
    }
  };

  const getCurrencyFormats = () => {
    try {
      const amount = 1234.56;
      const currencies = ["USD", "EUR", "GBP", "JPY"];
      const formats = {};

      currencies.forEach((currency) => {
        try {
          formats[currency] = amount.toLocaleString(undefined, {
            style: "currency",
            currency: currency,
          });
        } catch (e) {
          formats[currency] = "Not supported";
        }
      });

      return formats;
    } catch (error) {
      return { error: "Currency formatting not supported" };
    }
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

  const detectVirtualization = () => {
    const userAgent = navigator.userAgent;
    const vendor = navigator.vendor || "";

    const vmIndicators = [
      "VMware",
      "VirtualBox",
      "Parallels",
      "QEMU",
      "Xen",
      "Microsoft Corporation",
      "innotek",
      "Oracle Corporation",
    ];

    return vmIndicators.some(
      (indicator) => userAgent.includes(indicator) || vendor.includes(indicator)
    );
  };

  const getClockSkew = () => {
    const start = Date.now();
    const perfStart = performance.now();

    // Small delay to measure consistency
    for (let i = 0; i < 1000; i++) {
      Math.random();
    }

    const end = Date.now();
    const perfEnd = performance.now();

    const dateTimeDiff = end - start;
    const perfTimeDiff = perfEnd - perfStart;

    return Math.abs(dateTimeDiff - perfTimeDiff);
  };

  const getAPISupport = () => {
    return {
      // Core APIs
      fetch: "fetch" in window,
      xhr: "XMLHttpRequest" in window,
      websocket: "WebSocket" in window,
      webWorker: "Worker" in window,
      serviceWorker: "serviceWorker" in navigator,
      sharedWorker: "SharedWorker" in window,

      // Communication APIs
      broadcastChannel: "BroadcastChannel" in window,
      messageChannel: "MessageChannel" in window,
      postMessage: "postMessage" in window,

      // Notification & Engagement
      notification: "Notification" in window,
      pushManager: "PushManager" in window,
      badging: "setAppBadge" in navigator,

      // Device APIs (non-location/audio)
      bluetooth: "bluetooth" in navigator,
      usb: "usb" in navigator,
      serial: "serial" in navigator,
      hid: "hid" in navigator,

      // System APIs
      wakeLock: "wakeLock" in navigator,
      scheduler: "scheduler" in window && "postTask" in window.scheduler,
      idleDetection: "IdleDetector" in window,

      // Storage APIs
      indexedDB: "indexedDB" in window,
      sessionStorage: "sessionStorage" in window,
      caches: "caches" in window,

      // Graphics & Media
      webGL: !!getWebGLContext(),
      webGL2: !!getWebGL2Context(),
      canvas: "HTMLCanvasElement" in window,
      webRTC: "RTCPeerConnection" in window,
      webAssembly: "WebAssembly" in window,

      // Security & Credentials
      credentials: "credentials" in navigator,
      publicKeyCredential: "PublicKeyCredential" in window,

      // Payment & Commerce
      paymentRequest: "PaymentRequest" in window,

      // File System
      fileSystemAccess: "showOpenFilePicker" in window,

      // Clipboard
      clipboard: "clipboard" in navigator,

      // Sharing
      webShare: "share" in navigator,

      // Performance
      performanceObserver: "PerformanceObserver" in window,
      intersectionObserver: "IntersectionObserver" in window,
      mutationObserver: "MutationObserver" in window,
      resizeObserver: "ResizeObserver" in window,

      // Gaming
      gamepad: "getGamepads" in navigator,

      // Misc
      vibration: "vibrate" in navigator,
      fullscreen: "requestFullscreen" in document.documentElement,
      pictureInPicture: "pictureInPictureEnabled" in document,
      screenOrientation: "orientation" in screen,
      visualViewport: "visualViewport" in window,
    };
  };

  const getInputCapabilities = () => {
    return {
      keyboard: "KeyboardEvent" in window,
      mouse: "MouseEvent" in window,
      pointer: "PointerEvent" in window,
      wheel: "WheelEvent" in window,
      gamepad: "Gamepad" in window,
      deviceMotion: "DeviceMotionEvent" in window,
      deviceOrientation: "DeviceOrientationEvent" in window,
    };
  };

  const getMediaQuerySupport = () => {
    return {
      prefersColorScheme: window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light",
      prefersReducedMotion: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches,
      prefersHighContrast: window.matchMedia("(prefers-contrast: high)")
        .matches,
      forcedColors: window.matchMedia("(forced-colors: active)").matches,
      hoverCapability: window.matchMedia("(hover: hover)").matches,
      pointerAccuracy: window.matchMedia("(pointer: fine)").matches
        ? "fine"
        : "coarse",
      dynamicRange: window.matchMedia("(dynamic-range: high)").matches
        ? "high"
        : "standard",
    };
  };

  const getCanvasFingerprint = () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 280;
      canvas.height = 60;

      // Test text rendering
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("Hello, World! 🌍", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("Hello, World! 🌍", 4, 17);

      // Test geometry rendering
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgb(255,0,255)";
      ctx.beginPath();
      ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();

      const dataURL = canvas.toDataURL();
      return {
        dataURL,
        hash: btoa(dataURL).slice(0, 16),
      };
    } catch (error) {
      return { error: "Canvas not supported" };
    }
  };

  const getWebGLFingerprint = async () => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) return { error: "WebGL not supported" };

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

      return {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        unmaskedVendor: debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
          : "unknown",
        unmaskedRenderer: debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          : "unknown",
        extensions: gl.getSupportedExtensions() || [],
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
      };
    } catch (error) {
      return { error: "WebGL fingerprinting failed" };
    }
  };

  const getFontFingerprint = async () => {
    try {
      const fonts = [
        "Arial",
        "Helvetica",
        "Times New Roman",
        "Georgia",
        "Verdana",
        "Trebuchet MS",
        "Arial Black",
        "Impact",
        "Comic Sans MS",
        "Tahoma",
        "Lucida Grande",
        "Palatino",
        "Garamond",
        "Calibri",
        "Cambria",
        "Century Gothic",
        "Franklin Gothic Medium",
        "Segoe UI",
        "Roboto",
        "Open Sans",
        "Lato",
        "Montserrat",
        "Source Sans Pro",
        "Ubuntu",
        "Nunito",
        "Poppins",
        "Inter",
      ];

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const testString = "mmmmmmmmmmlli";
      const baseFonts = ["monospace", "sans-serif", "serif"];

      const defaultWidths = {};

      // Get baseline measurements
      baseFonts.forEach((baseFont) => {
        ctx.font = "72px " + baseFont;
        defaultWidths[baseFont] = ctx.measureText(testString).width;
      });

      const detectedFonts = [];

      fonts.forEach((font) => {
        baseFonts.forEach((baseFont) => {
          ctx.font = "72px " + font + ", " + baseFont;
          const width = ctx.measureText(testString).width;
          if (width !== defaultWidths[baseFont]) {
            detectedFonts.push(font);
          }
        });
      });

      return {
        availableFonts: [...new Set(detectedFonts)],
        fontCount: detectedFonts.length,
        systemFonts: detectedFonts.filter((font) =>
          [
            "Arial",
            "Helvetica",
            "Times New Roman",
            "Georgia",
            "Verdana",
          ].includes(font)
        ),
        webFonts: detectedFonts.filter((font) =>
          ["Roboto", "Open Sans", "Lato", "Montserrat", "Inter"].includes(font)
        ),
      };
    } catch (error) {
      return { error: "Font detection failed" };
    }
  };

  const detectIncognitoMode = async () => {
    try {
      // Test storage quota (modern approach)
      if ("storage" in navigator && "estimate" in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return estimate.quota < 120000000; // Incognito typically has lower quota
      }

      // Fallback: check if sessionStorage behaves differently
      try {
        sessionStorage.setItem("test", "test");
        sessionStorage.removeItem("test");
        return false;
      } catch (e) {
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  const detectAdBlocker = async () => {
    try {
      // Create a fake ad element
      const adElement = document.createElement("div");
      adElement.innerHTML = "&nbsp;";
      adElement.className = "adsbox";
      adElement.style.position = "absolute";
      adElement.style.left = "-10000px";
      document.body.appendChild(adElement);

      const isBlocked = adElement.offsetHeight === 0;
      document.body.removeChild(adElement);

      return isBlocked;
    } catch (error) {
      return false;
    }
  };

  const getPermissionsStatus = async () => {
    try {
      if (!("permissions" in navigator))
        return { error: "Permissions API not supported" };

      const permissions = {};
      const permissionNames = [
        "geolocation",
        "notifications",
        "camera",
        "microphone",
      ];

      for (const permission of permissionNames) {
        try {
          const result = await navigator.permissions.query({
            name: permission,
          });
          permissions[permission] = result.state;
        } catch (e) {
          permissions[permission] = "not-supported";
        }
      }

      return permissions;
    } catch (error) {
      return { error: "Permissions check failed" };
    }
  };

  const getCSSSupport = () => {
    try {
      const features = {};

      // Test CSS features
      const testFeatures = [
        "grid",
        "flexbox",
        "backdrop-filter",
        "css-variables",
        "transforms",
        "transitions",
        "animations",
        "filter",
      ];

      testFeatures.forEach((feature) => {
        features[feature] = CSS.supports
          ? CSS.supports(feature, "initial")
          : false;
      });

      return features;
    } catch (error) {
      return { error: "CSS support detection failed" };
    }
  };

  const getWebAssemblyFingerprint = async () => {
    try {
      if (!("WebAssembly" in window)) {
        return { supported: false };
      }

      // Test basic WebAssembly support
      const wasmSupported = typeof WebAssembly === "object";

      // Test WASM compilation with a minimal module
      const simpleWasm = new Uint8Array([
        0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
      ]);

      let compileSupported = false;
      try {
        await WebAssembly.compile(simpleWasm);
        compileSupported = true;
      } catch (e) {
        compileSupported = false;
      }

      return {
        supported: wasmSupported,
        compile: compileSupported,
        instantiate: "instantiate" in WebAssembly,
        streaming: "compileStreaming" in WebAssembly,
      };
    } catch (error) {
      return { error: "WebAssembly fingerprint failed" };
    }
  };

  const getTimingFingerprint = () => {
    try {
      const timing = performance.timing || {};
      const navigation = performance.navigation || {};

      return {
        navigationStart: timing.navigationStart,
        domLoading: timing.domLoading,
        domInteractive: timing.domInteractive,
        domContentLoaded: timing.domContentLoadedEventEnd,
        loadComplete: timing.loadEventEnd,
        navigationType: navigation.type,
        redirectCount: navigation.redirectCount,
        performanceObserver: "PerformanceObserver" in window,
        performanceNow: "performance" in window && "now" in performance,
        resourceTiming: "getEntriesByType" in performance,
        userTiming: "mark" in performance && "measure" in performance,
        navigationTiming: "getEntriesByType" in performance,
      };
    } catch (error) {
      return { error: "Timing fingerprint failed" };
    }
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

  const initializeJourneyTracker = async (options = { resetData: true }) => {
    if (trackerInitialized.value) return;

    console.log("🚀 Initializing Journey Tracker...");

    if (options.resetData) {
      // Reset all stored data for new journey
      console.log("🗑️ Resetting stored data for new journey...");

      // Clear previous journey data
      journeyStepsData.value = [];
      Object.keys(collectedUserData).forEach(
        (key) => delete collectedUserData[key]
      );
      Object.keys(deviceSystemData).forEach(
        (key) => delete deviceSystemData[key]
      );

      console.log("✅ Previous data cleared, starting fresh journey");
    } else {
      console.log("🔄 Continuing with existing data (if any)...");
    }

    await generateUserIdentifiers();
    await collectDeviceAndBrowserData();

    trackerInitialized.value = true;
    recordJourneyStep("journey_started");

    console.log("✅ Journey Tracker Initialized Successfully!");
    console.log("📋 Current Status:", {
      initialized: trackerInitialized.value,
      userId: currentUserId.value,
      sessionId: currentSessionId.value,
      totalSteps: journeyStepsData.value.length,
      resetData: options.resetData,
    });
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

    console.log(`📍 Journey Step Recorded: "${stepName}"`, {
      step: stepRecord,
      totalSteps: journeyStepsData.value.length,
      allSteps: journeyStepsData.value,
    });
  };

  const saveUserInformation = (userInfo) => {
    Object.assign(collectedUserData, userInfo);
    recordJourneyStep("user_information_saved", {
      dataFields: Object.keys(userInfo),
    });

    console.log("💾 User Information Saved:", {
      newData: userInfo,
      allUserData: { ...collectedUserData },
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

    console.log("📋 Complete Journey Data Retrieved:");
    console.log("👤 User ID:", completeData.userId);
    console.log("🔗 Session ID:", completeData.sessionId);
    console.log(
      "📍 Journey Steps (" + completeData.journeySteps.length + "):",
      completeData.journeySteps
    );
    console.log("👤 User Data:", completeData.userData);
    console.log("🖥️ System Data:", completeData.systemData);
    console.log("⏱️ Total Journey Time:", completeData.totalJourneyTime + "ms");
    console.log("📦 Full Payload:", completeData);

    return completeData;
  };

  const clearAllJourneyData = () => {
    console.log("🗑️ Clearing All Journey Data...");
    console.log("📊 Data before clearing:", {
      steps: journeyStepsData.value.length,
      userData: Object.keys(collectedUserData).length,
      systemData: Object.keys(deviceSystemData).length,
    });

    journeyStepsData.value = [];
    Object.keys(collectedUserData).forEach(
      (key) => delete collectedUserData[key]
    );

    console.log("✅ All Journey Data Cleared Successfully!");
  };

  const exportJourneyData = () => {
    console.log("📤 Exporting Journey Data...");

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

    console.log("✅ Journey Data Exported Successfully as:", filename);
    console.log("📊 Export Summary:", {
      filename: filename,
      dataSize: dataBlob.size + " bytes",
      stepsCount: completeJourneyData.journeySteps.length,
      totalJourneyTime: completeJourneyData.totalJourneyTime + "ms",
    });
  };

  // Console logging utility function
  const printAllData = () => {
    console.log("=".repeat(80));
    console.log("📊 COMPLETE JOURNEY TRACKER DATA SUMMARY");
    console.log("=".repeat(80));

    console.log("🔐 IDENTIFIERS:");
    console.log("   User ID:", currentUserId.value);
    console.log("   Session ID:", currentSessionId.value);
    console.log("   Initialized:", trackerInitialized.value);

    console.log(
      "\n📍 JOURNEY STEPS (" + journeyStepsData.value.length + " total):"
    );
    journeyStepsData.value.forEach((step, index) => {
      console.log(`   ${index + 1}. ${step.stepName} - ${step.recordedAt}`);
      console.log(`      URL: ${step.currentUrl}`);
      if (Object.keys(step).length > 6) {
        console.log(
          "      Additional Data:",
          Object.fromEntries(
            Object.entries(step).filter(
              ([key]) =>
                ![
                  "stepName",
                  "recordedAt",
                  "sessionId",
                  "userId",
                  "currentUrl",
                  "currentPath",
                ].includes(key)
            )
          )
        );
      }
    });

    console.log("\n👤 USER DATA:");
    if (Object.keys(collectedUserData).length > 0) {
      console.log(collectedUserData);
    } else {
      console.log("   No user data collected yet");
    }

    console.log("\n🖥️ SYSTEM DATA:");
    Object.entries(deviceSystemData).forEach(([section, data]) => {
      console.log(`   ${section}:`, data);
    });

    if (journeyStepsData.value.length > 0) {
      const totalTime =
        new Date().getTime() -
        new Date(journeyStepsData.value[0].recordedAt).getTime();
      console.log("\n⏱️ TIMING:");
      console.log("   Journey Started:", journeyStepsData.value[0].recordedAt);
      console.log("   Current Time:", new Date().toISOString());
      console.log(
        "   Total Duration:",
        totalTime + "ms (" + Math.round(totalTime / 1000) + "s)"
      );
    }

    console.log("=".repeat(80));

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
