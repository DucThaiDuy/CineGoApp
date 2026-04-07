import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SubHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

export default function SubHeader({ title, subtitle, showBack = true }: SubHeaderProps) {
  const insets = useSafeAreaInsets();
  const headerTop = Math.max(insets.top, 20);

  return (
    <View style={[styles.container, { paddingTop: headerTop + 10 }]}>
      <View style={styles.row}>
        {showBack && (
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <View style={styles.titleWrapper}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: colors.bg,
    zIndex: 100,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  titleWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
    fontWeight: "500",
  },
});
