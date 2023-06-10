import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaRegTimesCircle } from "react-icons/fa";
import { Text, View } from "react-native";
import { useScale } from "../hooks";

export function Header() {
  const { scale, small } = useScale();
  const styles = createStyles(scale);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  return (
    <View style={styles.section}>
      <View style={styles.subSection}>
        <View style={styles.logoContainer}>
          <Image alt={"logo"} src={"/logo.png"} fill sizes="" />
        </View>
        {small ? (
          <View style={styles.menu}>
            {menuIsOpen ? (
              <FaRegTimesCircle color={"#000"} onClick={() => setMenuIsOpen(false)} size={24} />
            ) : (
              <FaBars color={"#000"} onClick={() => setMenuIsOpen(true)} size={24} />
            )}
          </View>
        ) : (
          <View style={styles.links}>
            <Text style={styles.soon}>Coming soon...</Text>
            <Link href={""} style={{ cursor: "default", textDecoration: "none" }}>
              <Text style={styles.tryPlus}>Try Lyrist+</Text>
            </Link>
            <Link href={""} style={{ cursor: "default", textDecoration: "none" }}>
              <Text style={styles.signIn}>Sign in</Text>
            </Link>
          </View>
        )}
      </View>
      {menuIsOpen && (
        <View style={styles.menuLinks}>
          <Link href={""} style={{ textDecoration: "none" }}>
            <Text style={styles.tryPlus}>Try Lyrist Plus+</Text>
          </Link>
          <Link href={""} style={{ textDecoration: "none" }}>
            <Text style={styles.signIn}>Sign in</Text>
          </Link>
        </View>
      )}
    </View>
  );
}

const createStyles = (scale) => ({
  section: {
    maxWidth: 1000,
    width: "100%",
    alignSelf: "center",
  },
  subSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  links: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 140.4375 / 1.5,
    minHeight: 47.625 / 1.5,
    maxWidth: 140.4375 * 1.5,
    maxHeight: 47.625 * 1.5,
    width: scale(140.4375),
    height: scale(47.625),
  },
  tryPlus: {
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: "Fira Sans",
    fontSize: 16,
    marginVertical: 0,
    marginHorizontal: "1rem",
    paddingVertical: "0.75rem",
    paddingHorizontal: "1.5rem",
    borderColor: "gray",
    color: "gray",
  },
  signIn: {
    backgroundColor: "#007AFF",
    color: "white",
    borderRadius: 5,
    fontFamily: "Fira Sans",
    fontSize: 16,
    paddingVertical: "0.75rem",
    paddingHorizontal: "1.5rem",
    backgroundColor: "gray",
    color: "white",
  },
  menu: {
    display: "none",
    justifyContent: "center",
  },
  menuLinks: {},
  soon: { color: "gray", fontFamily: "Fira Sans", fontSize: "1rem", marginHorizontal: "1rem" },
});
