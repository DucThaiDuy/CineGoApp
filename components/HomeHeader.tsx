import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function HomeHeader() {
  const insets = useSafeAreaInsets();
  const headerPaddingTop = Math.max(insets.top, 40); 
  
  return (
    <View style={[styles.container, { paddingTop: headerPaddingTop + 8 }]}>

      <LinearGradient 
        colors={["rgba(229, 9, 20, 0.15)", "transparent"]}
        style={styles.headerGlow}
      />
      
      <View style={styles.contentRow}>
        <View style={styles.leftSection}>
          <Text style={styles.brandText}>Cine<Text style={{ color: colors.primary }}>Go</Text></Text>
          <TouchableOpacity style={styles.locationContainer}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={styles.locationText}>Hồ Chí Minh</Text>
            <Ionicons name="chevron-down" size={12} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity 
            style={styles.iconBtn} 
            onPress={() => router.push("/(tabs)/search")}
          >
            <Ionicons name="search-outline" size={22} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
             style={styles.avatarWrapper}
             onPress={() => router.push("/(tabs)/profile")}
          >
            <Image 
              source={{ uri: "https://i.pravatar.cc/150?img=12" }} 
              style={styles.avatar} 
            />
            <View style={styles.onlineDot} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: colors.bg,
    paddingBottom: 20,
    position: "relative",
    zIndex: 100,
  },
  headerGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  contentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    gap: 4,
  },
  brandText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1.5,
    textShadowColor: "rgba(229, 9, 20, 0.4)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    gap: 4,
  },
  locationText: {
    color: colors.sub,
    fontSize: 12,
    fontWeight: "600",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  onlineDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.bg,
  },
});
