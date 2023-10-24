import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import { theme } from "../theme";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    flexDirection: "row",
  },
});

export default function Loading() {
  return (
    <View style={[styles.container, { width, height }]}>
      <Progress.CircleSnail
        thickness={12}
        size={160}
        color={theme.background}
      />
    </View>
  );
}
