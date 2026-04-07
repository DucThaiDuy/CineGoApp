import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HighlightItem {
  id: number;
  title: string;
  image: string;
}

interface HighlightSectionProps {
  title: string;
  onViewAll?: () => void;
  bigItem: HighlightItem;
  smallItems: HighlightItem[];
}

export default function HighlightSection({
  title,
  onViewAll,
  bigItem,
  smallItems,
}: HighlightSectionProps) {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="sparkles" size={20} color={colors.accent} style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} activeOpacity={0.7} style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* LAYOUT */}
      <View style={styles.highlightLayout}>
        {/* LEFT - BIG */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.bigCard}
          onPress={() =>
            router.push({
              pathname: "/movie/MovieDetail",
              params: { id: String(bigItem.id) },
            })
          }
        >
          <ExpoImage source={{ uri: bigItem.image }} style={styles.bigImage} contentFit="cover" transition={500} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.bigOverlay}
          >
            <Text style={styles.bigTitle}>{bigItem.title}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color={colors.accent} />
              <Text style={styles.ratingText}>4.8</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* RIGHT - 2 SMALL */}
        <View style={styles.smallColumn}>
          {smallItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[styles.smallCard, index === 0 && { marginBottom: 12 }]}
              onPress={() =>
                router.push({
                  pathname: "/movie/MovieDetail",
                  params: { id: String(item.id) },
                })
              }
            >
              <ExpoImage source={{ uri: item.image }} style={styles.smallImage} contentFit="cover" transition={500} />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={styles.smallOverlay}
              >
                <Text style={styles.smallTitle} numberOfLines={1}>
                  {item.title}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginBottom: 35,
  },
  sectionHeader: {
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
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
    marginRight: 2,
  },
  highlightLayout: {
    flexDirection: "row",
    paddingHorizontal: 20,
    height: 240,
  },
  bigCard: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.card,
    marginRight: 12,
  },
  bigImage: {
    width: "100%",
    height: "100%",
  },
  bigOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    paddingTop: 40,
  },
  bigTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: {
    color: colors.sub,
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
  smallColumn: {
    width: "38%",
  },
  smallCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.card,
  },
  smallImage: {
    width: "100%",
    height: "100%",
  },
  smallOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingTop: 30,
  },
  smallTitle: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "700",
  },
});
