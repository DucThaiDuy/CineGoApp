import React from "react";
import { colors } from "@/constants/colors";
import { Image as ExpoImage } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SnackCardProps {
  title: string;
  image: string;
}

export default function SnackCard({ title, image }: SnackCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <View style={styles.imageWrapper}>
        <ExpoImage source={{ uri: image }} style={styles.image} contentFit="cover" transition={500} />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 100,
    marginRight: 20,
    alignItems: "center",
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    overflow: "hidden",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
