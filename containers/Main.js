import { StyleSheet, Text, View } from "react-native";
import YouTube from "react-youtube";
import { useScale } from "../hooks";
import { Badges } from "./Badges";

const onPlayerReady = (event) => {
  // access to player in all event handlers via event.target
  event.target.pauseVideo();
};

const opts = {
  height: "100%",
  width: "100%",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
    cc_load_policy: 1,
  },
};

export function Main() {
  const { small, medium } = useScale();
  return (
    <View style={styles.section}>
      <View style={[styles.subSection, medium && { flexDirection: "column" }]}>
        <View
          style={[
            styles.leftContent,
            medium && { width: "100%", alignItems: "center" },
            small && { gap: 24 },
          ]}
        >
          <Text style={[styles.title, small && { fontSize: 32, textAlign: "left" }]}>
            The <Text style={{ color: "#007AFF" }}>all-in-one</Text> toolkit for songwriters
          </Text>
          <Text style={[styles.subtitle, small && { fontSize: 16, textAlign: "left" }]}>
            Find audio from the world's largest platforms to write songs, make poetry, and take
            notes. Share your creations with others!
          </Text>
          <Badges />
        </View>
        <View
          style={[
            styles.rightContent,
            medium && { width: 300, alignSelf: "center", marginTop: 48 },
            small && { marginTop: 24 },
          ]}
        >
          <YouTube
            accessibilityRole="youtube"
            videoId="NUhlzDv9m9g"
            opts={opts}
            onReady={onPlayerReady}
            style={{ height: 600 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
  },
  subSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    gap: 48,
    width: "60%",
  },
  title: {
    fontFamily: "Fira Sans",
    fontSize: 64,
    fontWeight: "600",
    width: "100%",
  },
  subtitle: {
    fontFamily: "Fira Sans",
    fontSize: 32,
    fontWeight: "300",
    width: "100%",
  },
  rightContent: {},
});
