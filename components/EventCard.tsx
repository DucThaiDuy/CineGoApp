import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { colors } from "@/constants/colors";

interface EventCardProps {
  title: string;
  image: string;
  description: string;
}

export default function EventCard({ title, image, description }: EventCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <ExpoImage source={{ uri: image }} style={styles.image} contentFit="cover" transition={500} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 140,
  },
  info: {
    padding: 12,
  },
  title: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  description: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
});
