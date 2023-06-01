import Image from "next/image";
import Link from "next/link";
import { Text, View } from "react-native";
import StyleSheet from "react-native-media-query";
import { useWindowDimensions } from "react-native-web";
import YouTube from "react-youtube";

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
  const { width } = useWindowDimensions();
  return (
    <View style={styles.section} dataSet={{ media: ids.section }}>
      <View style={styles.leftContent} dataSet={{ media: ids.leftContent }}>
        <Text style={styles.title} dataSet={{ media: ids.title }}>
          Musical exploration{" "}
          <Text style={{ color: "#007AFF" }} dataSet={{ media: ids.title }}>
            meets{" "}
          </Text>
          lyrical creation
        </Text>
        <Text style={styles.subtitle} dataSet={{ media: ids.subtitle }}>
          Select audio from the world's largest platforms then write a song, make poetry, take
          notes, and more!
        </Text>
        <View style={styles.badges} dataSet={{ media: ids.badges }}>
          <Link accessibilityrole="link" href={"https://lyrist.app/ios"} target={"_blank"}>
            <Image
              alt={"app-store-badge"}
              src={"/app-store.png"}
              height={width >= 550 ? 60 : 40}
              width={width >= 550 ? 180 : 120}
            />
          </Link>
          <Link
            accessibilityrole="link"
            href={"https://lyrist.app/android"}
            style={{ marginLeft: 8 }}
            target={"_blank"}
          >
            <Image
              alt={"google-play-badge"}
              src={"/google-play.png"}
              height={width >= 550 ? 60 : 40}
              width={width >= 550 ? 202.5 : 135}
            />
          </Link>
        </View>
      </View>
      <View style={styles.rightContent} dataSet={{ media: ids.rightContent }}>
        <YouTube
          accessibilityRole="youtube"
          videoId="NUhlzDv9m9g"
          opts={opts}
          onReady={onPlayerReady}
          style={{
            height: 600,
            width: "100%",
          }}
        />
      </View>
    </View>
  );
}

const { ids, styles } = StyleSheet.create({
  section: {
    flexDirection: "row",
    "@media screen and (max-width: 1050px)": {
      flexDirection: "column",
    },
    "@media screen and (max-width: 550px)": {
      flexDirection: "column",
    },
    flexWrap: "wrap",
  },
  leftContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    marginRight: "5rem",
    paddingHorizontal: "16rem",
    "@media screen and (max-width: 737px)": {
      paddingHorizontal: "4rem",
      marginRight: 0,
    },
    "@media screen and (max-width: 550px)": {
      paddingHorizontal: "2rem",
      marginRight: 0,
    },
  },
  title: {
    fontFamily: "Fira Sans",
    fontSize: 64,
    fontWeight: "600",
    width: 600,
    "@media screen and (max-width: 1050px)": {
      width: "100%",
      fontSize: 48,
    },
    "@media screen and (max-width: 490px)": {
      width: "100%",
      fontSize: 32,
    },
  },
  subtitle: {
    fontFamily: "Fira Sans",
    fontSize: 28,
    fontWeight: "300",
    width: "100%",
    width: 600,
    marginTop: 30,
    "@media screen and (max-width: 1050px)": {
      width: "100%",
      fontSize: 22,
    },
    "@media screen and (max-width: 490px)": {
      width: "100%",
      fontSize: 16,
      // marginTop: 20,
    },
  },
  badges: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    "@media screen and (max-width: 490px)": {
      // marginTop: 20,
    },
  },
  rightContent: {
    alignItems: "center",
    paddingHorizontal: "16rem",
    "@media screen and (max-width: 1403px)": {
      marginTop: 30,
    },
    "@media screen and (max-width: 737px)": {
      paddingHorizontal: "4rem",
    },
    "@media screen and (max-width: 550px)": {
      paddingHorizontal: "2rem",
    },
  },
});
