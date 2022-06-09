import Image from "next/image";
import { StyleSheet, Text, View } from "react-native";

export default function Footer({ style }) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.social}>
        <View accessibilityRole="link" style={styles.view}>
          <a href={"https://instagram.com/lyrist.app"} target={"_blank"}>
            <Image src={"/instagram.png"} width={24} height={24} />
          </a>
        </View>
        <View accessibilityRole="link" style={styles.view}>
          <a href={"https://tiktok.com/@lyrist.app"} target={"_blank"}>
            <Image src={"/tiktok.png"} width={24} height={24} />
          </a>
        </View>
        <View accessibilityRole="link" style={styles.view}>
          <a href={`https://twitter.com/lyristapp`} target={"_blank"}>
            <Image src={"/twitter.png"} width={24} height={24} />
          </a>
        </View>
      </View>
      <View style={styles.links}>
        <View style={styles.view}>
          <a href={"/terms"} target={"_blank"}>
            <Text
              accessibilityRole="link"
              style={[styles.text, { textDecorationLine: "underline" }]}
            >
              Terms of Use
            </Text>
          </a>
        </View>
        <View style={styles.view}>
          <a href={"/privacy"} target={"_blank"}>
            <Text
              accessibilityRole="link"
              style={[styles.text, { textDecorationLine: "underline" }]}
            >
              Privacy Policy
            </Text>
          </a>
        </View>
        <View style={styles.view}>
          <a href={"mailto:lyrist.app@gmail.com"}>
            <Text
              accessibilityRole="link"
              href={"mailto:lyrist.app@gmail.com"}
              style={[styles.text, { textDecorationLine: "underline" }]}
            >
              Contact Us
            </Text>
          </a>
        </View>
      </View>
      <Text style={styles.footerText}>ⓒ 2022 Lyrist LLC</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  social: { flexDirection: "row" },
  links: { flexDirection: "row" },
  view: { padding: 12 },
  text: { fontFamily: "Fira Sans" },
  footerText: {
    fontFamily: "Fira Sans",
    padding: 12,
  },
});
