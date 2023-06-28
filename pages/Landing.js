import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { Footer, Features, Header, Main, Navbar, Pricing, Reviews } from "../containers";
import { StyleSheet, Text, View } from "react-native";
import { Badges } from "../containers";
import { useScale } from "../hooks";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig =
  process.env.NODE_ENV === "development"
    ? {
        apiKey: "AIzaSyD7EC8mi2lqqgOBGsBpH5sx4Fie38uju2w",
        authDomain: "lyrist-dev.firebaseapp.com",
        databaseURL: "https://lyrist-dev-default-rtdb.firebaseio.com",
        projectId: "lyrist-dev",
        storageBucket: "lyrist-dev.appspot.com",
        messagingSenderId: "751037515388",
        appId: "1:751037515388:web:3d2b5f8511bd1a5a2febf9",
        measurementId: "G-JYC42WS0X0",
      }
    : {
        apiKey: "AIzaSyARt0IiVWYb_fFlZ_gw--VUsZykPVkQrCc",
        authDomain: "rapbook-4a2f5.firebaseapp.com",
        databaseURL: "https://rapbook-4a2f5.firebaseio.com",
        projectId: "rapbook-4a2f5",
        storageBucket: "rapbook-4a2f5.appspot.com",
        messagingSenderId: "563495375201",
        appId: "1:563495375201:web:6862eb90fe8819c8c27520",
        measurementId: "G-WNDLPLKW2S",
      };

const app = initializeApp(firebaseConfig);
(async () => {
  return (await isSupported()) ? getAnalytics(app) : null;
})();

export default () => {
  const { small } = useScale();
  return (
    <View style={small ? { gap: 24, padding: 24 } : { gap: 48, padding: 48 }}>
      <Header />
      <Main />
      <Reviews />
      <Features />
      <Pricing />
      <Text
        // should probably be based on height, not width
        style={[styles.call, { alignSelf: "center", fontSize: 32 }, small && { fontSize: 16 }]}
      >
        {"Try it out for free!"}
      </Text>
      <Badges />
      <Navbar />
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  call: {
    fontFamily: "Fira Sans",
    fontSize: 16,
    fontWeight: "600",
  },
});
