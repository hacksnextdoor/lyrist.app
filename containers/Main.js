import { FaCheck, FaRegClock } from "react-icons/fa";
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
  const { xsmall, medium } = useScale();
  return (
    <View style={styles.section}>
      <View style={[styles.subSection, medium && { flexDirection: "column" }]}>
        <View
          style={[
            styles.leftContent,
            medium && { width: "100%", alignItems: "center" },
            xsmall && { gap: 24 },
          ]}
        >
          <Text style={[styles.title, xsmall && { fontSize: 32, textAlign: "left" }]}>
            Find <Text style={{ color: "#007AFF" }}>audio</Text> from anywhere, then{" "}
            <Text style={{ color: "#007AFF" }}>write.</Text>
          </Text>
          <Text style={[styles.subtitle, xsmall && { fontSize: 16, textAlign: "left" }]}>
            Select from the world's largest platforms to write songs, make poetry, and take notes
            all on one screen!
          </Text>
          <View
            style={{ alignSelf: "flex-start", flexDirection: "row", gap: 16, flexWrap: "wrap" }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <FaCheck size={16} />
              <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>YouTube</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <FaCheck size={16} />
              <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>SoundCloud</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <FaRegClock size={16} />
              <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>Spotify</Text>
            </View>
          </View>
          <Badges />
        </View>
        <View
          style={[
            styles.rightContent,
            medium && { width: 300, alignSelf: "center", marginTop: 48 },
            xsmall && { marginTop: 24 },
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
