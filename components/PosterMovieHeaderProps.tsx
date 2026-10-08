// components/MovieHeader.tsx
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MovieHeaderProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

const PosterMovieHeader: React.FC<MovieHeaderProps> = ({
  imageUrl,
  title,
  subtitle,
  onBack,
}) => {
  return (
    <ImageBackground
      source={{ uri: imageUrl }}
      style={styles.header}
      imageStyle={styles.headerImage}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.2)"]}
        style={styles.headerOverlay}
      />
      {/* Nút back ở góc trên */}
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <View style={styles.backBtnInner}>
            <Ionicons name="chevron-back" size={20} color="#fff" />
            <Text style={styles.back}>Quay lại</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Title + Subtitle ở góc dưới */}
      <View style={styles.bottomContent}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </ImageBackground>
  );
};

export default PosterMovieHeader;

const styles = StyleSheet.create({
  header: {
    height: 150,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 16,
  },
  headerImage: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFill,
  },
  backButton: {
    position: "absolute",
    top: 16, // cách trên 16
    left: 16, // cách trái 16
    zIndex: 2,
  },
  backBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  back: {
    color: "#E5E7EB",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 2,
  },
  bottomContent: {
    position: "absolute",
    bottom: 16, // cách dưới 16
    left: 16, // cách trái 16
    right: 16, // cách phải 16 nếu muốn
    zIndex: 2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    paddingBottom: 2,
  },
  subtitle: {
    color: "#E5E7EB",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
});
