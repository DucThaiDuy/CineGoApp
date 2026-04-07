import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  onViewAll?: () => void;
  icon?: React.ReactNode;
}

export default function Section({ title, children, onViewAll, icon }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={styles.title}>{title}</Text>
        </View>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} activeOpacity={0.7} style={styles.viewAllBtn}>
            <Text style={styles.viewAll}>Xem tất cả</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 35,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAll: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginRight: 2,
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 10,
  },
});
