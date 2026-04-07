import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FloatingBackButton() {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={[styles.btn, { top: insets.top || 20 }]}
      onPress={() => router.back()}
      activeOpacity={0.7}
    >
      <Ionicons name="chevron-back" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: "absolute",
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // Đảm bảo luôn nằm trên cùng khi cuộn
  },
});
