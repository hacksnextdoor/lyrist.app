import { Text, View } from "react-native";
import StyleSheet from "react-native-media-query";
import { FaRegStar, FaStar } from "react-icons/fa";
import reviews from "../reviews.json";

export function Reviews() {
  return (
    <View style={styles.section} dataSet={{ media: ids.section }}>
      <View style={styles.reviewsView} dataSet={{ media: ids.reviewsView }}>
        {reviews.map(({ id, content, name, stars }) => (
          <View key={id} style={[styles.card, styles.cardShadow]} dataSet={{ media: ids.card }}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.stars}>
              {Array.from(Array(stars), (_, k) => (
                <FaStar key={k} color="#FEBB43" style={{ marginRight: 2 }} />
              ))}
              {Array.from(Array(5 - stars), (_, k) => (
                <FaRegStar key={k} color="#FEBB43" style={{ marginRight: 2 }} />
              ))}
            </View>
            <Text style={styles.content}>{content}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const { ids, styles } = StyleSheet.create({
  section: {
    paddingVertical: "2rem",
    paddingHorizontal: "16rem",
    "@media screen and (max-width: 737px)": {
      paddingHorizontal: "4rem",
    },
    "@media screen and (max-width: 550px)": {
      paddingHorizontal: "2rem",
    },
    flexWrap: "wrap",
  },
  reviewsView: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    alignItems: "flex-start",
    backgroundColor: "white",
    borderRadius: "1rem",
    padding: 40,
    width: "25%",
    margin: 4,
    "@media screen and (max-width: 1537px)": {
      width: "45%",
      padding: 32,
    },
    "@media screen and (max-width: 550px)": {
      width: "100%",
      padding: 32,
    },
  },
  cardShadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -3, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  name: {
    fontFamily: "Fira Sans",
    fontSize: "1rem",
    fontWeight: "600",
  },
  stars: {
    flexDirection: "row",
    marginVertical: 8,
  },
  content: {
    fontFamily: "Fira Sans",
    fontSize: "1rem",
  },
});
