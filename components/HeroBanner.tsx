import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const BANNER_MOVIES = [
  {
    id: 1,
    title: "Avengers: Endgame",
    meta: "Action • Sci-Fi • 181m",
    image: "https://image.tmdb.org/t/p/w780/8pjWz2lt29KyVGoq1mXYu6Br7dE.jpg",
    rating: "4.9",
    tag: "NOW PLAYING",
  },
  {
    id: 2,
    title: "Dune: Part Two",
    meta: "Action • Sci-Fi • 166m",
    image: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    rating: "4.8",
    tag: "BEST SELLER",
  },
  {
    id: 3,
    title: "Oppenheimer",
    meta: "Drama • History • 180m",
    image: "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    rating: "4.9",
    tag: "MUST WATCH",
  },
];

export default function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= BANNER_MOVIES.length) {
        nextIndex = 0;
      }
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 30000); 

    return () => clearInterval(interval);
  }, [activeIndex]);

  const renderItem = ({ item }: { item: typeof BANNER_MOVIES[0] }) => (
    <View style={styles.bannerItem}>
      <ImageBackground source={{ uri: item.image }} style={styles.banner} resizeMode="cover">
        <LinearGradient
          colors={["rgba(10, 10, 10, 0.4)", "rgba(10, 10, 10, 0.9)", colors.bg]}
          style={styles.overlay}
        >
          <View style={styles.content}>
            <View style={styles.tagWrapper}>
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{item.tag}</Text>
              </View>
              <View style={styles.glassRating}>
                <Ionicons name="star" size={12} color={colors.accent} />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.metaText}>{item.meta}</Text>

            <TouchableOpacity style={styles.bookBtn}>
              <LinearGradient 
                colors={[colors.primary, "#8B0000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.btnGradient}
              >
                <Text style={styles.bookBtnText}>Đặt vé ngay</Text>
                <Ionicons name="ticket-outline" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={BANNER_MOVIES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        keyExtractor={(item) => item.id.toString()}
      />

      <View style={styles.pagination}>
        {BANNER_MOVIES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 480,
    width: "100%",
    position: "relative",
  },
  bannerItem: {
    width: width,
  },
  banner: {
    height: "100%",
    width: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 24,
    paddingBottom: 40,
  },
  content: {
    paddingBottom: 24,
  },
  tagWrapper: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tagBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  glassRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    gap: 4,
  },
  ratingText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },
  title: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  metaText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 15,
    marginTop: 8,
    fontWeight: "500",
  },
  bookBtn: {
    marginTop: 32,
    borderRadius: 16,
    overflow: "hidden",
    alignSelf: "flex-start",
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  btnGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 14,
    gap: 10,
  },
  bookBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 40,
    right: 24,
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 24,
    height: 6,
    borderRadius: 3,
  },
});
