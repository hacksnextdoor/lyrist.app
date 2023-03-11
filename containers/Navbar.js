import Link from "next/link";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import StyleSheet from "react-native-media-query";

export function Navbar() {
  const [line1, setLine1] = useState(false);
  const [line2, setLine2] = useState(false);
  const [line3, setLine3] = useState(false);
  const [line4, setLine4] = useState(false);
  const [line5, setLine5] = useState(false);
  return (
    <View style={styles.section} dataSet={{ media: ids.section }}>
      <Link
        accessibilityRole="link"
        href={"https://app.loopedin.io/lyrist"}
        style={{ textDecoration: line1 ? "underline" : "none", textDecorationColor: "black" }}
        target={"_blank"}
      >
        <Pressable
          onHoverIn={() => setLine1(true)}
          onHoverOut={() => setLine1(false)}
          style={[styles.linkView, { marginLeft: 0 }]}
          dataSet={{ media: ids.linkView }}
        >
          <Text style={styles.link}>Planned Features</Text>
        </Pressable>
      </Link>
      <Link
        accessibilityRole="link"
        href={"/faq"}
        style={{ textDecoration: line2 ? "underline" : "none", textDecorationColor: "black" }}
        target={"_blank"}
      >
        <Pressable
          onHoverIn={() => setLine2(true)}
          onHoverOut={() => setLine2(false)}
          style={styles.linkView}
          dataSet={{ media: ids.linkView }}
        >
          <Text style={styles.link}>FAQ</Text>
        </Pressable>
      </Link>
      <Link
        accessibilityRole="link"
        href={"/terms"}
        style={{ textDecoration: line3 ? "underline" : "none", textDecorationColor: "black" }}
        target={"_blank"}
      >
        <Pressable
          onHoverIn={() => setLine3(true)}
          onHoverOut={() => setLine3(false)}
          style={styles.linkView}
          dataSet={{ media: ids.linkView }}
        >
          <Text style={styles.link}>Terms of Use</Text>
        </Pressable>
      </Link>
      <Link
        accessibilityRole="link"
        href={"/privacy"}
        style={{ textDecoration: line4 ? "underline" : "none", textDecorationColor: "black" }}
        target={"_blank"}
      >
        <Pressable
          onHoverIn={() => setLine4(true)}
          onHoverOut={() => setLine4(false)}
          style={styles.linkView}
          dataSet={{ media: ids.linkView }}
        >
          <Text style={styles.link}>Privacy Policy</Text>
        </Pressable>
      </Link>
      <Link
        accessibilityRole="link"
        href={"mailto:lyrist.app@gmail.com"}
        style={{ textDecoration: line5 ? "underline" : "none", textDecorationColor: "black" }}
      >
        <Pressable
          onHoverIn={() => setLine5(true)}
          onHoverOut={() => setLine5(false)}
          style={styles.linkView}
          dataSet={{ media: ids.linkView }}
        >
          <Text style={styles.link}>Contact Us</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const { ids, styles } = StyleSheet.create({
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    "@media screen and (max-width: 1050px)": {
      flexDirection: "column",
    },
  },
  linkView: {
    marginVertical: 0,
    marginHorizontal: "1rem",
    "@media screen and (max-width: 1050px)": {
      marginVertical: "0.25rem",
      marginHorizontal: 0,
    },
  },
  link: {
    fontFamily: "Fira Sans",
  },
});
