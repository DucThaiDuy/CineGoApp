import { colors } from "@/constants/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const { width } = Dimensions.get("window");

const trendingMovies = [
  { id: 1, title: "Dune: Part Two", poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", rating: "4.9" },
  { id: 2, title: "Oppenheimer", poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", rating: "4.8" },
  { id: 3, title: "Deadpool 3", poster: "https://image.tmdb.org/t/p/w500/qW4crfED8mpNDadSmMdi7ZDzhXF.jpg", rating: "4.7" },
  { id: 4, title: "Avengers", poster: "https://revelogue.com/wp-content/uploads/2020/01/Poster-chinh-thuc-cho-Endgame-e1578281933829.jpg", rating: "4.9" },
];

const categories = [
  { id: "action", title: "Hành động", icon: "sword-cross", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400" },
  { id: "comedy", title: "Hài hước", icon: "emoticon-happy-outline", image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=400" },
  { id: "horror", title: "Kinh dị", icon: "ghost", image: "https://images.unsplash.com/photo-1505634459002-94ad3833a24f?w=400" },
  { id: "romance", title: "Lãng mạn", icon: "heart-outline", image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400" },
];

const recentSearches = ["Godzilla x Kong", "Lật Mặt 7", "Bố Già", "Rạp CGV"];

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const popularTags = ["IMAX", "3D", "Phim Việt", "Hoạt hình", "Netflix"];

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Header with Search Bar */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Tìm kiếm</Text>
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search" size={20} color={colors.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Phim, diễn viên, rạp..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={20} color={colors.sub} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Trending Section */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Xu hướng</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trendingScroll}>
            {trendingMovies.map((movie) => (
              <TouchableOpacity key={movie.id} style={styles.trendingCard} activeOpacity={0.8}>
                <ExpoImage source={{ uri: movie.poster }} style={styles.trendingPoster} contentFit="cover" />
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={10} color={colors.accent} />
                  <Text style={styles.ratingText}>{movie.rating}</Text>
                </View>
                <Text style={styles.movieTitle} numberOfLines={1}>{movie.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Categories Grid */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Thể loại</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryCard} activeOpacity={0.8}>
                <ExpoImage source={{ uri: cat.image }} style={styles.categoryImage} contentFit="cover" />
                <LinearGradient colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]} style={styles.categoryOverlay}>
                  <MaterialCommunityIcons name={cat.icon as any} size={24} color="#fff" />
                  <Text style={styles.categoryTitle}>{cat.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Popular Tags */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Từ khóa phổ biến</Text>
          <View style={styles.tagWrapper}>
            {popularTags.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.tagBtn}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Recent Searches */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
            <TouchableOpacity>
              <Text style={styles.clearText}>Xóa</Text>
            </TouchableOpacity>
          </View>
          {recentSearches.map((item, index) => (
            <TouchableOpacity key={index} style={styles.recentItem}>
              <View style={styles.recentLeft}>
                <Ionicons name="time-outline" size={18} color={colors.muted} />
                <Text style={styles.recentText}>{item}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    backgroundColor: colors.bg,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchBarWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 54,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  trendingScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  trendingCard: {
    width: 130,
    marginRight: 15,
  },
  trendingPoster: {
    width: "100%",
    aspectRatio: 2/3,
    borderRadius: 18,
    backgroundColor: colors.card,
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 3,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 14,
    marginTop: 10,
    fontWeight: "600",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: (width - 52) / 2,
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 6,
  },
  tagWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  tagBtn: {
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  tagText: {
    color: colors.sub,
    fontSize: 13,
    fontWeight: "600",
  },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  recentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentText: {
    color: colors.sub,
    marginLeft: 12,
    fontSize: 15,
  },
  clearText: {
    color: colors.muted,
    fontSize: 14,
  },
});
