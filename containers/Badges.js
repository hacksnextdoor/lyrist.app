import Image from "next/image";
import Link from "next/link";
import { StyleSheet, useWindowDimensions, View } from "react-native";

export function Badges() {
  const { width } = useWindowDimensions();
  return (
    <View style={styles.badges}>
      <Link accessibilityrole="link" href={"https://lyrist.app/ios"} target={"_blank"}>
        <Image
          alt={"app-store-badge"}
          src={"/app-store.png"}
          height={width >= 490 ? 60 : 40}
          width={width >= 490 ? 180 : 120}
        />
      </Link>
      <Link
        accessibilityrole="link"
        href={"https://lyrist.app/android"}
        style={{ marginLeft: 8 }}
        target={"_blank"}
      >
        <Image
          alt={"google-play-badge"}
          src={"/google-play.png"}
          height={width >= 490 ? 60 : 40}
          width={width >= 490 ? 202.5 : 135}
        />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
