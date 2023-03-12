import { Text, View } from "react-native";
import StyleSheet from "react-native-media-query";
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
  return (
    <View style={styles.section} dataSet={{ media: ids.section }}>
      <View style={styles.leftContent} dataSet={{ media: ids.leftContent }}>
        <Text style={styles.title} dataSet={{ media: ids.title }}>
          Enhance your{" "}
          <Text style={{ color: "#007AFF" }} dataSet={{ media: ids.title }}>
            writing
          </Text>{" "}
          while listening to{" "}
          <Text style={{ color: "#007AFF" }} dataSet={{ media: ids.title }}>
            audio
          </Text>
        </Text>
        <Text style={styles.subtitle} dataSet={{ media: ids.subtitle }}>
          Write lyrics to beats you find or take notes for your online lectures, boosting your
          productivity along the way.
        </Text>
        <View style={styles.badges} dataSet={{ media: ids.badges }}>
          <View>
            <a href={"https://lyrist.app/ios"}>
              <img src="/app-store-badge.svg" alt="app-store-badge" />
            </a>
          </View>
          <View>
            <a href={"https://lyrist.app/android"}>
              <img
                src="/google-play-badge.png"
                width={153.425}
                height={59.375}
                alt="google-play-badge"
              />
            </a>
          </View>
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
            alignSelf: "center",
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
    fontSize: 20,
    fontWeight: "300",
    width: "100%",
    width: 600,
    marginTop: 30,
    "@media screen and (max-width: 1050px)": {
      width: "100%",
      fontSize: 18,
    },
    "@media screen and (max-width: 490px)": {
      width: "100%",
      fontSize: 14,
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
