import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MovieCardProps {
  id: number | string;
  title: string;
  poster: string;
  width?: number;
  rating?: string | number;
}

export default function MovieCard({ id, title, poster, width: customWidth, rating = "4.5" }: MovieCardProps) {
  const cardWidth = customWidth || 140;
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.card, { width: cardWidth }]}
      onPress={() =>
        router.push({
          pathname: "/movie/MovieDetail",
          params: { id: String(id) },
        })
      }
    >
      <View style={styles.imageContainer}>
        <ExpoImage
          source={{ uri: poster }}
          style={styles.image}
          contentFit="cover"
          transition={500}
        />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color={colors.accent} />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.category}>Hành động</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { 
    marginRight: 16,
    marginBottom: 10,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  image: { 
    width: "100%", 
    height: 200, 
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 4,
  },
  info: {
    marginTop: 10,
  },
  title: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  category: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
});
