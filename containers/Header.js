import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaRegTimesCircle } from "react-icons/fa";
import { Text, View } from "react-native";
import StyleSheet from "react-native-media-query";

export function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <View style={styles.section} dataSet={{ media: ids.section }}>
      <View style={styles.logoContainer} dataSet={{ media: ids.logoContainer }}>
        <Image alt={"logo"} src={"/logo.png"} fill sizes="" />
      </View>
      <View style={styles.links} dataSet={{ media: ids.links }}>
        <Text style={styles.soon}>Coming soon...</Text>
        <Link href={""} style={{ cursor: "default", textDecoration: "none" }}>
          <Text style={styles.tryPlus}>Try Lyrist+</Text>
        </Link>
        <Link href={""} style={{ cursor: "default", textDecoration: "none" }}>
          <Text style={styles.signIn}>Sign in</Text>
        </Link>
      </View>
      <View style={styles.menu} dataSet={{ media: ids.menu }}>
        {toggleMenu ? (
          <FaRegTimesCircle color={"#000"} onClick={() => setToggleMenu(false)} size={20} />
        ) : (
          <FaBars color={"#000"} onClick={() => setToggleMenu(true)} size={20} />
        )}
        {toggleMenu && (
          <View style={styles.menuLinks} dataSet={{ media: ids.menuLinks }}>
            <View>
              <Link href={""} style={{ textDecoration: "none" }}>
                <Text style={styles.tryPlus}>Try Lyrist Plus+</Text>
              </Link>
              <Link href={""} style={{ textDecoration: "none" }}>
                <Text style={styles.signIn}>Sign in</Text>
              </Link>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const { ids, styles } = StyleSheet.create({
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: "2rem",
    paddingHorizontal: "16rem",
    "@media screen and (max-width: 737px)": {
      paddingHorizontal: "4rem",
    },
    "@media screen and (max-width: 550px)": {
      paddingHorizontal: "2rem",
    },
  },
  app: { flexDirection: "row", alignItems: "center" },
  links: {
    flexDirection: "row",
    alignItems: "center",
    "@media screen and (max-width: 1050px)": {
      display: "none",
    },
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 140.4375,
    height: 47.625,
    "@media screen and (max-width: 550px)": {
      width: 105.328125,
      height: 35.71875,
    },
  },
  tryPlus: {
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: "Fira Sans",
    marginVertical: 0,
    marginHorizontal: "1rem",
    paddingVertical: "0.5rem",
    paddingHorizontal: "1rem",

    borderColor: "gray",
    color: "gray",
  },
  signIn: {
    backgroundColor: "#007AFF",
    color: "white",
    borderRadius: 5,
    fontFamily: "Fira Sans",
    paddingVertical: "0.5rem",
    paddingHorizontal: "1rem",

    backgroundColor: "gray",
    color: "white",
  },
  menu: { display: "none" },
  soon: { color: "gray", fontFamily: "Fira Sans", fontSize: "1rem", marginHorizontal: "1rem" },
});
