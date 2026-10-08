import SubHeader from "@/components/SubHeader";
import { colors } from "@/constants/colors";
import { MOVIES } from "@/constants/movies";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FavoriteMovies() {
  const insets = useSafeAreaInsets();
  // Mock favorites

  const [favorites, setFavorites] = useState(MOVIES.slice(0, 3));


  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(m => m.id !== id));
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(229, 9, 20, 0.15)", "transparent"]}
        style={styles.backgroundGlow}
      />

      <SubHeader 
        title="Phim yêu thích"
        subtitle="Danh sách phim bạn đã quan tâm"
      />
      
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 40 }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="heart-dislike-outline" size={80} color={colors.muted} />
            </View>
            <Text style={styles.emptyTitle}>Chưa có phim yêu thích</Text>
            <Text style={styles.emptySubtitle}>Hãy nhấn icon tim ở trang chi tiết phim để lưu lại nhé!</Text>
            <TouchableOpacity 
              style={styles.browseBtn} 
              onPress={() => router.push("/")}
            >
              <Text style={styles.browseBtnText}>Khám phá ngay</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.movieCard} 
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: "/movie/MovieDetail", params: { id: item.id } })}
          >
            <Image source={{ uri: item.poster }} style={styles.poster} />
            
            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
                <TouchableOpacity 
                  onPress={() => removeFavorite(item.id)}
                  style={styles.removeBtn}
                >
                  <Ionicons name="heart" size={24} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.genreRow}>
                <Text style={styles.genreText}>{item.genre}</Text>
                <View style={styles.dot} />
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>

              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color={colors.accent} />
                <Text style={styles.ratingValue}>{item.rating}</Text>
                <Text style={styles.reviewCount}>({item.reviews} đánh giá)</Text>
              </View>

              <TouchableOpacity 
                style={styles.bookBtn}
                onPress={() => router.push({ pathname: "/cinema/ShowtimeScreen", params: { id: item.id } })}
              >
                <Text style={styles.bookBtnText}>Đặt vé ngay</Text>
                <Ionicons name="chevron-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  backgroundGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.sub,
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 40,
  },
  movieCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  poster: {
    width: 100,
    height: 140,
    borderRadius: 14,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  movieTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  removeBtn: {
    padding: 4,
  },
  genreRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  genreText: {
    color: colors.sub,
    fontSize: 13,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.muted,
    marginHorizontal: 8,
  },
  durationText: {
    color: colors.sub,
    fontSize: 13,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 4,
  },
  ratingValue: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "700",
  },
  reviewCount: {
    color: colors.muted,
    fontSize: 12,
  },
  bookBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 12,
    gap: 6,
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
  },
  emptySubtitle: {
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  browseBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 14,
  },
  browseBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
