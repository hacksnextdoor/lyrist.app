"use client";
import { View } from "react-native";
import { AppProviders } from "../../packages/context";
import { AppHeader } from "./AppHeader";

export default function HomeLayout({ children }) {
  return (
    <AppProviders>
      <AppHeader />
      <View style={{ alignItems: "center" }}>
        <View style={{ width: "100%", maxWidth: 500 }}>{children}</View>
      </View>
    </AppProviders>
  );
}
