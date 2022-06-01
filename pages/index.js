import { ScrollView, StyleSheet, View } from "react-native";
import Image from "next/image";
import YouTube from "react-youtube";

export default function App(props) {
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <Text style={styles.link} accessibilityRole="link" href={`/alternate`}>
        A universal link
      </Text> */}

      {/* <Text accessibilityRole="header" aria-level="2" style={styles.text}> */}
      <Image src={"/logo.png"} width={140.4375} height={47.625} />
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
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            paddingTop: 40,
            transform: "translateX(-50%)",
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 40,
  },
  link: {
    color: "blue",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  badges: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
  videoView: {
    justifyContent: "center",
    width: "100%",
    height: 0,
    paddingTop: "177%",
    // overflow: "hidden",
  },
});
