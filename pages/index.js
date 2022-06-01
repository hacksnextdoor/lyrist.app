import { StyleSheet, View } from "react-native";
import Image from "next/image";
import YouTube from "react-youtube";

export default function App(props) {
  const onPlayerReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const opts = {
    height: "844",
    width: "428",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.link} accessibilityRole="link" href={`/alternate`}>
        A universal link
      </Text> */}

      <View style={styles.textContainer}>
        {/* <Text accessibilityRole="header" aria-level="2" style={styles.text}> */}
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

        <YouTube
          accessibilityRole="youtube"
          videoId="NUhlzDv9m9g"
          opts={opts}
          onReady={onPlayerReady}
          style={{ marginTop: 20, marginBottom: 20 }}
        />
        <Image src={"/logo.png"} width={140.4375} height={47.625} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 40,
    marginTop: 20,
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
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    alignItems: "center",
    fontSize: 24,
    marginBottom: 24,
  },
});
