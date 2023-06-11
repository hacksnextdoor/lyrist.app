import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useScale } from "../hooks";

export function Navbar() {
  const { medium } = useScale();
  const [line0, setLine0] = useState(false);
  const [line1, setLine1] = useState(false);
  const [line2, setLine2] = useState(false);
  const [line3, setLine3] = useState(false);
  const [line4, setLine4] = useState(false);
  const [line5, setLine5] = useState(false);
  return (
    <View style={styles.section}>
      <View
        style={[
          styles.subSection,
          medium && { flexDirection: "column", alignItems: "flex-start", gap: 20 },
        ]}
      >
        <View style={styles.social}>
          <Link
            accessibilityrole="link"
            href={"https://instagram.com/lyrist.app"}
            target={"_blank"}
          >
            <Image alt={"instagram"} src={"/instagram.png"} width={24} height={24} />
          </Link>
          <Link accessibilityrole="link" href={"https://tiktok.com/@lyrist.app"} target={"_blank"}>
            <Image alt={"tiktok"} src={"/tiktok.png"} width={24} height={24} />
          </Link>
          <Link accessibilityrole="link" href={"https://twitter.com/lyristapp"} target={"_blank"}>
            <Image alt={"twitter"} src={"/twitter.png"} width={24} height={24} />
          </Link>
        </View>
        <View style={[styles.navigation, medium && { flexDirection: "column" }]}>
          {/* <Link
            href={"/pricing"}
            style={{ textDecoration: line0 ? "underline" : "none", textDecorationColor: "black" }}
            target={"_blank"}
          >
            <Pressable onHoverIn={() => setLine0(true)} onHoverOut={() => setLine0(false)}>
              <Text style={styles.link}>Pricing</Text>
            </Pressable>
          </Link> */}
          <Link
            href={"https://app.loopedin.io/lyrist"}
            style={{ textDecoration: line1 ? "underline" : "none", textDecorationColor: "black" }}
            target={"_blank"}
          >
            <Pressable onHoverIn={() => setLine1(true)} onHoverOut={() => setLine1(false)}>
              <Text style={styles.link}>Roadmap</Text>
            </Pressable>
          </Link>
          <Link
            href={"/faq"}
            style={{ textDecoration: line2 ? "underline" : "none", textDecorationColor: "black" }}
            target={"_blank"}
          >
            <Pressable onHoverIn={() => setLine2(true)} onHoverOut={() => setLine2(false)}>
              <Text style={styles.link}>FAQ</Text>
            </Pressable>
          </Link>
          <Link
            href={"/terms"}
            style={{ textDecoration: line3 ? "underline" : "none", textDecorationColor: "black" }}
            target={"_blank"}
          >
            <Pressable onHoverIn={() => setLine3(true)} onHoverOut={() => setLine3(false)}>
              <Text style={styles.link}>Terms of Use</Text>
            </Pressable>
          </Link>
          <Link
            href={"/privacy"}
            style={{ textDecoration: line4 ? "underline" : "none", textDecorationColor: "black" }}
            target={"_blank"}
          >
            <Pressable onHoverIn={() => setLine4(true)} onHoverOut={() => setLine4(false)}>
              <Text style={styles.link}>Privacy Policy</Text>
            </Pressable>
          </Link>
          <Link
            href={"mailto:lyrist.app@gmail.com"}
            style={{ textDecoration: line5 ? "underline" : "none", textDecorationColor: "black" }}
          >
            <Pressable onHoverIn={() => setLine5(true)} onHoverOut={() => setLine5(false)}>
              <Text style={styles.link}>Contact Us</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    alignSelf: "center",
    maxWidth: 1000,
    width: "100%",
  },
  subSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navigation: {
    flexDirection: "row",
    gap: 20,
  },
  social: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 120,
  },
  link: {
    fontFamily: "Fira Sans",
    fontSize: 16,
  },
});
