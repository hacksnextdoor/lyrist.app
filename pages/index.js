import { useEffect } from "react";
import Image from "next/image";
import { ScrollView, StyleSheet, View } from "react-native";
import YouTube from "react-youtube";
import Footer from "./Footer";

export default function App() {
  const onPlayerReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const opts = {
    height: "600",
    width: "337.5",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      cc_load_policy: 1,
    },
  };

  useEffect(() => {
    console.log("hello word");
    return () => console.log("bye");
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text accessibilityRole="header" aria-level="2" style={styles.text}> */}
      <View style={styles.logo}>
        <Image src={"/logo.png"} width={140.4375} height={47.625} />
      </View>
      <View style={styles.badges}>
        <a href={"https://lyrist.app/ios"}>
          <img src="/app-store-badge.svg" alt="app-store-badge" />
        </a>
        <a href={"https://lyrist.app/android"}>
          <img
            src="/google-play-badge.png"
            width={153.425}
            height={59.375}
            alt="google-play-badge"
          />
        </a>
      </View>
      <View style={styles.videoView}>
        <YouTube
          accessibilityRole="youtube"
          videoId="NUhlzDv9m9g"
          opts={opts}
          onReady={onPlayerReady}
        />
      </View>
      <Footer style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 40,
  },
  logo: { paddingTop: 20 },
  textContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 40,
  },
  videoView: {
    paddingTop: 40,
  },
  footer: { paddingTop: 40 },
});
