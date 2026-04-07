import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BookingHeaderProps {
  title: string;
  subtitle?: string;
  currentStep: number; // 1 to 4
}

export default function BookingHeader({ title, subtitle, currentStep }: BookingHeaderProps) {
  const insets = useSafeAreaInsets();
  const steps = ["Suất chiếu", "Chỗ ngồi", "Bắp nước", "Xác nhận"];

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Progress Bar HUD */}
      <View style={styles.progressContainer}>
        {steps.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.progressSegment, 
              index + 1 <= currentStep ? styles.segmentActive : styles.segmentInactive,
              index + 1 === currentStep && styles.segmentCurrent
            ]} 
          />
        ))}
      </View>

      <View style={styles.contentRow}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.titleArea}>
          <Text style={styles.stepLabel}>BƯỚC {currentStep}/4</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "transparent",
    zIndex: 100,
  },
  progressContainer: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  segmentCurrent: {
    backgroundColor: colors.primary,
    // Optional: make it glow
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  titleArea: {
    flex: 1,
  },
  stepLabel: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    marginTop: 1,
  },
});
