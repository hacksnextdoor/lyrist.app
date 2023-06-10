import { useWindowDimensions, Platform } from "react-native";

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
  const { height, width } = useWindowDimensions();
  let baseWidth;
  if (Platform.OS === "android" || Platform.OS === "ios") {
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

  const scale = (size) => (width / baseWidth) * size;
  const xsmall = width < 491;
  const small = width < 668;
  const medium = width < 850;
  return { xsmall, small, medium, scale };
}
