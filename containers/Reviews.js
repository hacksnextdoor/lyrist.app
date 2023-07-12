import { StyleSheet, Text, View } from "react-native";
import { FaRegStar, FaStar } from "react-icons/fa";
import reviews from "../reviews.json";
import { useScale } from "../hooks";

export function Reviews() {
  const { small, medium } = useScale();
  return (
    <div id={"reviews"} style={{ alignSelf: "center" }}>
      <View style={styles.section}>
        <View style={styles.reviews}>
          {reviews.map(({ id, content, name, stars }) => (
            <View
              key={id}
              style={[
                styles.card,
                styles.cardShadow,
                small ? { width: "100%" } : medium ? { width: "49%" } : { width: "24%" },
              ]}
            >
              <View style={styles.stars}>
                {Array.from(Array(stars), (_, k) => (
                  <FaStar key={k} color="#FEBB43" style={{ marginRight: 2 }} />
                ))}
                {Array.from(Array(5 - stars), (_, k) => (
                  <FaRegStar key={k} color="#FEBB43" style={{ marginRight: 2 }} />
                ))}
              </View>
              <Text style={styles.content}>"{content}"</Text>
              <Text style={styles.name}>{name}</Text>
            </View>
          ))}
        </View>
      </View>
    </div>
  );
}

const styles = StyleSheet.create({
  section: {
    maxWidth: 1200,
  },
  reviews: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  card: {
    maxWidth: 500,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    gap: 8,
    padding: 16,
  },
  cardShadow: {
    shadowColor: "#171717",
    shadowOffset: { width: 0.3, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  name: {
    fontFamily: "Fira Sans",
    fontSize: 16,
    fontWeight: "600",
  },
  stars: {
    flexDirection: "row",
  },
  content: {
    fontFamily: "Fira Sans",
    fontSize: 16,
  },
});
