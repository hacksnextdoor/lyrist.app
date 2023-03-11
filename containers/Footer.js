import Image from "next/image";
import Link from "next/link";
import { Text, View } from "react-native";
import StyleSheet from "react-native-media-query";
import { Navbar } from "./Navbar";

export function Footer() {
  return (
    <View style={styles.section} dataSet={{ media: ids.section }}>
      <View style={styles.footer} dataSet={{ media: ids.footer }}>
        <Navbar />
        <View style={styles.social} dataSet={{ media: ids.social }}>
          <Link
            accessibilityRole="link"
            href={"https://instagram.com/lyrist.app"}
            target={"_blank"}
          >
            <Image src={"/instagram.png"} width={24} height={24} style={styles.icon} />
          </Link>
          <Link accessibilityRole="link" href={"https://tiktok.com/@lyrist.app"} target={"_blank"}>
            <Image src={"/tiktok.png"} width={24} height={24} style={styles.icon} />
          </Link>
          <Link accessibilityRole="link" href={"https://twitter.com/lyristapp"} target={"_blank"}>
            <Image src={"/twitter.png"} width={24} height={24} style={styles.icon} />
          </Link>
        </View>
      </View>
      <Text style={styles.copyright}>ⓒ 2023 Lyrist LLC</Text>
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
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    "@media screen and (max-width: 667px)": {
      alignItems: "flex-start",
      flexDirection: "column",
    },
  },
  social: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 120,
    "@media screen and (max-width: 667px)": {
      justifyContent: "space-between",
      width: "100%",
      marginTop: 12,
    },
  },
  icon: { marginHorizontal: "1rem" },
  copyright: {
    color: "gray",
    fontFamily: "Fira Sans",
    marginTop: 12,
  },
});
