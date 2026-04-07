import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { MOVIES } from "../../constants/movies";

const { width } = Dimensions.get("window");

const GENRES = ["All", "Action", "Sci-Fi", "Adventure", "Animation", "Comedy"];
const PERIODS = [
  { key: "week", label: "Tuần này" },
  { key: "month", label: "Tháng này" },
  { key: "all", label: "Tất cả" },
];

export default function ReviewList() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [period, setPeriod] = useState<string>("week");

  const filteredMovies = useMemo(() => {
    let list = [...MOVIES];
    if (search.trim()) {
      list = list.filter((m) =>
        m.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (genre !== "All") {
      list = list.filter((m) => m.genre === genre);
    }
    if (period !== "all") {
      list = list.filter((m) => m.period === period);
    }
    return list.sort((a, b) => b.rating - a.rating);
  }, [search, genre, period]);

  const trendingMovie = MOVIES[0];

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.sub} />
        <TextInput
          placeholder="Tìm phim bạn quan tâm..."
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Hero Section */}
      {!search && (
        <View style={styles.heroSection}>
          <Text style={styles.sectionHeading}>🔥 Đang thịnh hành</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.heroCard}
            onPress={() => router.push("/movie/ReviewDetail")}
          >
            <Image source={{ uri: trendingMovie.banner || trendingMovie.poster }} style={styles.heroImage} />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.9)"]}
              style={styles.heroOverlay}
            >
              <View style={styles.heroInfo}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>TOP REVIEWS</Text>
                </View>
                <Text style={styles.heroTitle}>{trendingMovie.title}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color={colors.accent} />
                  <Text style={styles.heroRating}>{trendingMovie.rating}</Text>
                  <Text style={styles.heroReviews}>({trendingMovie.reviews} đánh giá)</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.sectionHeading}>Khám phá</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
          {GENRES.map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setGenre(g)}
              style={[styles.pill, genre === g && styles.pillActive]}
            >
              <Text style={[styles.pillText, genre === g && styles.pillTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p.key}
              onPress={() => setPeriod(p.key)}
              style={[styles.periodBtn, period === p.key && styles.periodActive]}
            >
              <Text style={[styles.periodText, period === p.key && styles.periodTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1A1A1D", colors.bg]} style={styles.background} />

      {/* Custom Title Bar */}
      <View style={styles.titleBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Cộng đồng Review</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredMovies}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieCard}
            onPress={() => router.push("/movie/ReviewDetail")}
            activeOpacity={0.8}
          >
            <View>
              <Image source={{ uri: item.poster }} style={styles.cardPoster} />
              {item.tag && (
                <View style={[styles.tagBadge, item.tag === 'HOT' && { backgroundColor: colors.primary }]}>
                  <Text style={styles.tagBadgeText}>{item.tag}</Text>
                </View>
              )}
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
                <View style={styles.cardRating}>
                  <Ionicons name="star" size={12} color={colors.accent} />
                  <Text style={styles.cardRatingText}>{item.rating}</Text>
                </View>
              </View>

              <Text style={styles.movieGenre}>{item.genre}</Text>

              <View style={styles.cardStats}>
                <View style={styles.statItem}>
                  <Ionicons name="chatbubbles-outline" size={14} color={colors.sub} />
                  <Text style={styles.statText}>{item.reviews}</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="eye-outline" size={14} color={colors.sub} />
                  <Text style={styles.statText}>2.4k</Text>
                </View>
              </View>

              {/* Progress visual for rating */}
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${(item.rating / 5) * 100}%` }]} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "rgba(10, 10, 10, 0.8)",
  },
  titleText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 100,
  },
  headerContent: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: colors.text,
    fontSize: 15,
  },
  sectionHeading: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  heroSection: {
    marginBottom: 32,
  },
  heroCard: {
    height: 200,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: colors.card,
    elevation: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 20,
  },
  heroInfo: {},
  heroBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  heroBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroRating: {
    color: colors.accent,
    fontWeight: "700",
    fontSize: 16,
  },
  heroReviews: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
  },
  filtersSection: {
    marginBottom: 24,
  },
  pillsScroll: {
    marginBottom: 20,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    color: colors.sub,
    fontWeight: "600",
  },
  pillTextActive: {
    color: "#fff",
  },
  periodRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 4,
    borderRadius: 14,
    gap: 4,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  periodActive: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  periodText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  periodTextActive: {
    color: colors.text,
  },
  movieCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardPoster: {
    width: 90,
    height: 120,
    borderRadius: 16,
    backgroundColor: colors.card,
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  movieTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
    marginRight: 8,
  },
  cardRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  cardRatingText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
  },
  movieGenre: {
    color: colors.sub,
    fontSize: 13,
    marginBottom: 12,
  },
  cardStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    color: colors.sub,
    fontSize: 12,
    fontWeight: "500",
  },
  progressContainer: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  tagBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 10,
    elevation: 4,
  },
  tagBadgeText: {
    color: "#000",
    fontSize: 9,
    fontWeight: "900",
  },
});
