import { FaCheck, FaPlus, FaRegClock } from "react-icons/fa";
import { StyleSheet, Text, View } from "react-native";
import { useScale } from "../hooks";

export function Pricing() {
  const { small } = useScale();
  const getFromRevCatMonthly = 9;
  const getFromRevCatYearly = 72;
  const getFromRevCatLifetime = 295;
  return (
    <div id="pricing">
      <View style={styles.section}>
        <Text style={[styles.title, small && { fontSize: 32 }]}>
          Unlock unlimited pages with Lyrist<Text style={{ color: "#1abc9c" }}>+</Text>
        </Text>
        <View style={[styles.pricing, small && { flexDirection: "column" }]}>
          <View style={[styles.box, small && { width: "100%" }]}>
            <Text style={[styles.tier, small && { fontSize: 24 }]}>Basic</Text>
            <Text style={[styles.price, small && { fontSize: 24 }]}>Free</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <FaCheck size={16} />
              <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>
                Sync across multiple devices
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <FaCheck size={16} />
              <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>Encrypted page content</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <FaCheck size={16} />
              <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>Word Finder</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <FaCheck size={16} />
              <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>Writer's Block</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <FaRegClock size={16} />
              <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>Lyrist on the Web</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <FaRegClock size={16} />
              <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>Audio imports</Text>
            </View>
          </View>
          <View style={[styles.box, { backgroundColor: "#1abc9c22" }, small && { width: "100%" }]}>
            <Text style={[styles.tier, small && { fontSize: 24 }]}>Plus</Text>
            <Text style={[styles.price, small && { fontSize: 24 }]}>
              ${getFromRevCatMonthly} per month or ${getFromRevCatYearly} per year
            </Text>
            <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>Everything in Basic</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <FaPlus size={16} />
              <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>Unlimited pages</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <FaRegClock size={16} />
              <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>Color themes</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <FaRegClock size={16} />
              <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>Sync text with audio</Text>
            </View>
          </View>
          <View style={[styles.box, { backgroundColor: "#f1c40f22" }, small && { width: "100%" }]}>
            <Text style={[styles.tier, small && { fontSize: 24 }]}>Lyrist for life</Text>
            <Text style={[styles.price, small && { fontSize: 24 }]}>
              ${getFromRevCatLifetime} once
            </Text>
            <Text style={{ fontFamily: "Fira Sans", fontSize: 16 }}>
              Get upgrades for the app's lifetime
            </Text>
          </View>
        </View>
      </View>
    </div>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    gap: 24,
    padding: 24,
  },
  pricing: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 1000,
    gap: 8,
  },
  title: {
    fontSize: 64,
    fontFamily: "Fira Sans",
    fontWeight: "600",
    textAlign: "center",
  },
  box: {
    gap: 8,
    maxWidth: 500,
    width: "32%",
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#171717",
    shadowOffset: { width: 0.3, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tier: {
    fontFamily: "Fira Sans",
    fontWeight: "600",
    fontSize: 32,
  },
  price: {
    fontFamily: "Fira Sans",
    fontSize: 32,
  },
});
