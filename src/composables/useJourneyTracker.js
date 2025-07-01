import { ref, reactive } from "vue";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const currentUserId = ref(null);
const currentSessionId = ref(null);
const journeyStepsData = ref([]);
const collectedUserData = reactive({});
const deviceSystemData = reactive({});
const trackerInitialized = ref(false);

export function useJourneyTracker() {
  const generateUserIdentifiers = async () => {
    try {
      const fingerprintProcessor = await FingerprintJS.load();
      const fingerprintResult = await fingerprintProcessor.get();
      currentUserId.value = fingerprintResult.visitorId;
      currentSessionId.value = `${fingerprintResult.visitorId}-${Date.now()}`;
    } catch (error) {
      console.warn("FingerprintJS failed, using fallback ID:", error);
      currentUserId.value = `user-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      currentSessionId.value = `session-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    }
  };

  const collectDeviceAndBrowserData = async () => {
    const deviceInfo = {
      // 🧠 1. System Information
      systemInformation: {
        architecture: navigator.platform,
        cpuCores: navigator.hardwareConcurrency || "unknown",
        deviceMemory: navigator.deviceMemory || "unknown",
        userAgent: navigator.userAgent,
        vendor: navigator.vendor || "unknown",
        operatingSystem: getOperatingSystem(),
        deviceType: getDeviceType(),
        virtualization: detectVirtualization(),
        clockSkew: getClockSkew(),
      },

      // 🌐 2. Browser Information
      browserInformation: {
        browserName: getBrowserName(),
        browserVersion: getBrowserVersion(),
        vendor: navigator.vendor || "unknown",
        webdriver: navigator.webdriver || false,
        cookiesEnabled: navigator.cookieEnabled,
        plugins: Array.from(navigator.plugins).map((plugin) => ({
          name: plugin.name,
          description: plugin.description,
          filename: plugin.filename,
          mimeTypes: Array.from(plugin).map((mime) => mime.type),
        })),
        mimeTypes: Array.from(navigator.mimeTypes).map((mime) => ({
          type: mime.type,
          description: mime.description,
          suffixes: mime.suffixes,
        })),
        storageAvailability: {
          localStorage: isStorageAvailable("localStorage"),
          sessionStorage: isStorageAvailable("sessionStorage"),
          indexedDB: "indexedDB" in window,
          cookies: navigator.cookieEnabled,
        },
        apiSupport: getAPISupport(),
      },

      // 📱 3. Display & Input
      displayAndInput: {
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
        },
        touchSupport: {
          maxTouchPoints: navigator.maxTouchPoints || 0,
          touchEvent: "ontouchstart" in window,
          isTouch: navigator.maxTouchPoints > 0 || "ontouchstart" in window,
        },
        inputCapabilities: getInputCapabilities(),
        mediaQueries: getMediaQuerySupport(),
      },

      // 🌍 4. Locale & Language
      localeAndLanguage: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        language: navigator.language,
        languages: navigator.languages || [navigator.language],
        dateTime: {
          locale: new Date().toLocaleString(),
          dateString: new Date().toDateString(),
          timeString: new Date().toTimeString(),
        },
      },

      // 🔐 5. Security & Privacy Indicators
      securityAndPrivacy: {
        webdriver: navigator.webdriver || false,
        incognitoMode: await detectIncognitoMode(),
        adBlocker: await detectAdBlocker(),
        permissions: await getPermissionsStatus(),
        doNotTrack: navigator.doNotTrack || "unknown",
      },

      // 🧪 6. Rendering & Behavioral Fingerprints
      renderingAndBehavior: {
        canvas: getCanvasFingerprint(),
        webGL: await getWebGLFingerprint(),
        audioFingerprint: await getAudioFingerprint(),
        fontFingerprint: await getFontFingerprint(),
        cssSupport: getCSSSupport(),
        webAssembly: await getWebAssemblyFingerprint(),
        timing: getTimingFingerprint(),
        geolocation: await getGeolocationFingerprint(),
      },

      // Session metadata
      sessionMetadata: {
        sessionStartTime: new Date().toISOString(),
        referrerUrl: document.referrer,
        currentUrl: window.location.href,
      },
    };

    // Add network connection info if available
    if ("connection" in navigator && navigator.connection) {
      deviceInfo.networkConnection = {
        connectionType: navigator.connection.effectiveType,
        downloadSpeed: navigator.connection.downlink,
        roundTripTime: navigator.connection.rtt,
        saveData: navigator.connection.saveData,
      };
    }

    Object.assign(deviceSystemData, deviceInfo);
  };

  // Helper functions for fingerprinting
  const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edge")) return "Chrome";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
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
      return `Windows ${version ? version[1] : 'Unknown'}`;
    }
    if (/Mac OS X/i.test(userAgent)) {
      const version = userAgent.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
      return `macOS ${version ? version[1].replace(/_/g, '.') : 'Unknown'}`;
    }
    if (/Linux/i.test(userAgent)) return 'Linux';
    if (/Android/i.test(userAgent)) {
      const version = userAgent.match(/Android (\d+\.\d+)/);
      return `Android ${version ? version[1] : 'Unknown'}`;
    }
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      const version = userAgent.match(/OS (\d+_\d+)/);
      return `iOS ${version ? version[1].replace(/_/g, '.') : 'Unknown'}`;
    }
    return navigator.platform || 'Unknown';
  };

  const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    if (/Mobi|Android/i.test(userAgent) && !/Tablet|iPad/i.test(userAgent)) return 'mobile';
    if (/Tablet|iPad/i.test(userAgent)) return 'tablet';
    return 'desktop';
  };

  const detectVirtualization = () => {
    const userAgent = navigator.userAgent;
    const vendor = navigator.vendor || '';
    
    const vmIndicators = [
      'VMware', 'VirtualBox', 'Parallels', 'QEMU', 'Xen',
      'Microsoft Corporation', 'innotek', 'Oracle Corporation'
    ];
    
    return vmIndicators.some(indicator => 
      userAgent.includes(indicator) || vendor.includes(indicator)
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
      fetch: "fetch" in window,
      xhr: "XMLHttpRequest" in window,
      websocket: "WebSocket" in window,
      webWorker: "Worker" in window,
      serviceWorker: "serviceWorker" in navigator,
      broadcastChannel: "BroadcastChannel" in window,
      messageChannel: "MessageChannel" in window,
      notification: "Notification" in window,
      geolocation: "geolocation" in navigator,
      bluetooth: "bluetooth" in navigator,
      usb: "usb" in navigator,
      serial: "serial" in navigator,
      hid: "hid" in navigator,
      wakeLock: "wakeLock" in navigator,
      scheduler: "scheduler" in window && "postTask" in window.scheduler,
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
      prefersColorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
      prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      prefersHighContrast: window.matchMedia("(prefers-contrast: high)").matches,
      forcedColors: window.matchMedia("(forced-colors: active)").matches,
      hoverCapability: window.matchMedia("(hover: hover)").matches,
      pointerAccuracy: window.matchMedia("(pointer: fine)").matches ? "fine" : "coarse",
      dynamicRange: window.matchMedia("(dynamic-range: high)").matches ? "high" : "standard",
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
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) return { error: "WebGL not supported" };

      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");

      return {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        unmaskedVendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : "unknown",
        unmaskedRenderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "unknown",
        extensions: gl.getSupportedExtensions() || [],
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
      };
    } catch (error) {
      return { error: "WebGL fingerprinting failed" };
    }
  };

  const getAudioFingerprint = async () => {
    try {
      if (!("AudioContext" in window) && !("webkitAudioContext" in window)) {
        return { error: "AudioContext not supported" };
      }

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();

      const oscillator = context.createOscillator();
      const analyser = context.createAnalyser();
      const gainNode = context.createGain();
      const scriptProcessor = context.createScriptProcessor(4096, 1, 1);

      oscillator.type = "triangle";
      oscillator.frequency.value = 10000;
      gainNode.gain.value = 0;

      oscillator.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start(0);

      return new Promise((resolve) => {
        scriptProcessor.onaudioprocess = function (event) {
          const output = event.outputBuffer.getChannelData(0);
          const hash = Array.from(output.slice(0, 50)).reduce((a, b) => a + b, 0);

          oscillator.stop();
          context.close();

          resolve({
            sampleRate: context.sampleRate,
            fingerprint: hash.toString(),
          });
        };
      });
    } catch (error) {
      return { error: "Audio fingerprinting failed" };
    }
  };

  const getFontFingerprint = async () => {
    try {
      const fonts = [
        "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
        "Trebuchet MS", "Arial Black", "Impact", "Comic Sans MS",
        "Tahoma", "Lucida Grande", "Palatino", "Garamond",
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

      // Fallback test
      try {
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");
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
      if (!("permissions" in navigator)) return { error: "Permissions API not supported" };

      const permissions = {};
      const permissionNames = ["geolocation", "notifications", "camera", "microphone"];

      for (const permission of permissionNames) {
        try {
          const result = await navigator.permissions.query({ name: permission });
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
        "grid", "flexbox", "backdrop-filter", "css-variables",
        "transforms", "transitions", "animations", "filter",
      ];

      testFeatures.forEach((feature) => {
        features[feature] = CSS.supports ? CSS.supports(feature, "initial") : false;
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
      };
    } catch (error) {
      return { error: "Timing fingerprint failed" };
    }
  };

  const getGeolocationFingerprint = async () => {
    try {
      if (!("geolocation" in navigator)) {
        return { supported: false };
      }

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve({
            supported: true,
            permission: "timeout",
            accuracy: null,
          });
        }, 1000);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeout);
            resolve({
              supported: true,
              permission: "granted",
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            });
          },
          (error) => {
            clearTimeout(timeout);
            resolve({
              supported: true,
              permission: "denied",
              error: error.code,
            });
          },
          { timeout: 500, enableHighAccuracy: false }
        );
      });
    } catch (error) {
      return { error: "Geolocation fingerprint failed" };
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

  const initializeJourneyTracker = async () => {
    if (trackerInitialized.value) return;

    await generateUserIdentifiers();
    await collectDeviceAndBrowserData();

    trackerInitialized.value = true;
    recordJourneyStep("journey_started");
  };

  const recordJourneyStep = (stepName, additionalStepData = {}) => {
    const stepRecord = {
      stepName: stepName,
      recordedAt: new Date().toISOString(),
      sessionId: currentSessionId.value,
      userId: currentUserId.value,
      currentUrl: window.location.href,
      currentPath: window.location.pathname,
      ...additionalStepData,
    };

    journeyStepsData.value.push(stepRecord);
    localStorage.setItem("journey_steps", JSON.stringify(journeyStepsData.value));
    console.log("Journey Step:", stepRecord);
  };

  const saveUserInformation = (userInfo) => {
    Object.assign(collectedUserData, userInfo);
    localStorage.setItem("user_data", JSON.stringify(collectedUserData));
    recordJourneyStep("user_information_saved", {
      dataFields: Object.keys(userInfo),
    });
  };

  const getCompleteJourneyData = () => ({
    userId: currentUserId.value,
    sessionId: currentSessionId.value,
    journeySteps: journeyStepsData.value,
    userData: { ...collectedUserData },
    systemData: { ...deviceSystemData },
    totalJourneyTime:
      journeyStepsData.value.length > 0
        ? new Date().getTime() - new Date(journeyStepsData.value[0].recordedAt).getTime()
        : 0,
  });

  const clearAllJourneyData = () => {
    journeyStepsData.value = [];
    Object.keys(collectedUserData).forEach((key) => delete collectedUserData[key]);
    localStorage.removeItem("journey_steps");
    localStorage.removeItem("user_data");
  };

  const loadPreviousJourneySession = () => {
    try {
      const savedJourneySteps = localStorage.getItem("journey_steps");
      const savedUserInformation = localStorage.getItem("user_data");

      if (savedJourneySteps) {
        journeyStepsData.value = JSON.parse(savedJourneySteps);
      }

      if (savedUserInformation) {
        Object.assign(collectedUserData, JSON.parse(savedUserInformation));
      }
    } catch (error) {
      console.warn("Failed to load previous journey session:", error);
    }
  };

  const exportJourneyData = () => {
    const completeJourneyData = getCompleteJourneyData();
    const dataBlob = new Blob([JSON.stringify(completeJourneyData, null, 2)], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(dataBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = `journey-data-${currentSessionId.value}.json`;
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
    loadPreviousJourneySession,
    exportJourneyData,
  };
}
