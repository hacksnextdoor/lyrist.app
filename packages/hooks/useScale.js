import {useWindowDimensions, Platform} from 'react-native';
import {useState, useEffect} from 'react';

// Default dimensions for SSR to prevent hydration mismatch
const SSR_WIDTH = 1024;
const SSR_HEIGHT = 768;

// Hook that returns stable dimensions during SSR, then real dimensions after hydration
function useHydratedDimensions() {
  const dimensions = useWindowDimensions();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // During SSR and initial client render, use defaults to prevent mismatch
  if (!hydrated && Platform.OS === 'web') {
    return {width: SSR_WIDTH, height: SSR_HEIGHT, scale: 1, fontScale: 1};
  }

  return dimensions;
}

// Determine if the device pixel density and size are tablet-like.
// For better accuracy, you can also use the react-native-device-info library.
function isTabletLike(windowDimensions) {
  const pixelDensity = windowDimensions.scale;
  const adjustedWidth = windowDimensions.width * pixelDensity;
  const adjustedHeight = windowDimensions.height * pixelDensity;
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else return pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920);
}

// Returns a scaling function that, given an input number, scale it to suit
// devices with different sizes and pixel densities.
export function useScale() {
  const {height, width} = useHydratedDimensions();
  let baseWidth;
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    // Fixed base width that has worked well for most of my use cases
    baseWidth = isTabletLike() ? 520 : 350;
  } else {
    // For web, macOS, or Windows builds.
    // Potentially, you can use breakpoints here for a truly responsive design.
    // Or even debounce the result to avoid stressing the CPU while the user is
    // resizing the window.
    baseWidth = 800;
  }
  const shorterWindowDimension = width > height ? height : width;

  const scale = size => (width / baseWidth) * size;
  const small = width < 640;
  const medium = width >= 640 && width < 1024;
  const large = width >= 1024;
  return {small, medium, large, scale, width, height};
}

// Export for components that need raw dimensions with hydration safety
export {useHydratedDimensions};
