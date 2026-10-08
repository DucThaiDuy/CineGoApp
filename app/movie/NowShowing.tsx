import SubHeader from "@/components/SubHeader";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "@/utils/api";

const { width } = Dimensions.get("window");

type Movie = {
  id: string;
  title: string;
  genre: string;
  poster: string;
  rating: string;
};

const genres = ["Hành động", "Lãng mạn", "Hài hước", "Viễn tưởng", "Tâm lý"];

export default function NowShowing() {
  const insets = useSafeAreaInsets();
  const [moviesData, setMoviesData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      const response = await api.get("/movies", {
        params: { page: 0, size: 50 },
      });
      const items = response.data?.data?.items || response.data?.items || [];
      if (items.length > 0) {
        const mapped = items
          .filter((m: any) => m.status === "NOW_SHOWING" || !m.status)
          .map((m: any) => ({
            id: String(m.id),
            title: m.title,
            genre: m.country || "Hành động",
            poster: m.posterUrl || "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
            rating: m.rating ? Number(m.rating).toFixed(1) : "8.8",
          }));
        setMoviesData(mapped);
      }
    } catch (err) {
      console.warn("Lỗi tải phim đang chiếu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMovies().finally(() => setRefreshing(false));
  };

  const filteredMovies = moviesData.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesGenre = selectedGenre ? movie.genre === selectedGenre : true;
    return matchesSearch && matchesGenre;
  });

  const cardWidth = (width - 48) / 2;

  const renderHeader = () => (
    <View style={styles.headerWrapper}>
      {/* Hero Banner HUD */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: "https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" }}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={["rgba(10, 10, 10, 0)", "rgba(10, 10, 10, 0.5)", colors.bg]}
          style={styles.heroGradient}
        />
        
        <View style={styles.heroContent}>
          <View style={styles.searchHUD}>
            <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.4)" />
            <TextInput
              placeholder="Tìm kiếm phim bom tấn..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
      </View>

      {/* Category Scroll HUD */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genreHUD}
      >
        <TouchableOpacity
          style={[styles.genrePill, selectedGenre === null && styles.genrePillActive]}
          onPress={() => setSelectedGenre(null)}
        >
          <Text style={[styles.genreText, selectedGenre === null && styles.genreTextActive]}>Tất cả</Text>
        </TouchableOpacity>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre}
            style={[styles.genrePill, selectedGenre === genre && styles.genrePillActive]}
            onPress={() => setSelectedGenre(genre)}
          >
            <Text style={[styles.genreText, selectedGenre === genre && styles.genreTextActive]}>{genre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background Ambient Mesh */}
      <LinearGradient 
        colors={["rgba(229, 9, 20, 0.08)", "transparent", "transparent"]} 
        style={styles.ambientMesh} 
      />

      <SubHeader title="Phim đang chiếu" />

      <FlatList
        data={filteredMovies}
        ListHeaderComponent={renderHeader}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
             style={[styles.movieCard, { width: cardWidth }]}
             activeOpacity={0.9}
             onPress={() => router.push({ pathname: "/movie/MovieDetail", params: { id: item.id } })}
          >
            <Image source={{ uri: item.poster }} style={styles.poster} />
            <LinearGradient
               colors={["transparent", "rgba(0,0,0,0.8)"]}
               style={styles.posterOverlay}
            />
            
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={colors.accent} />
              <Text style={styles.ratingValue}>{item.rating}</Text>
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.movieGenre}>{item.genre}</Text>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </View>
  );
}

// Minimal text component for fix
function 精密Text({ children, style }: any) {
    return <Text style={style}>{children}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  ambientMesh: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 600,
  },
  listContent: {
    paddingBottom: 40,
  },
  headerWrapper: {
    marginBottom: 20,
  },
  heroContainer: {
    height: 240,
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: colors.card,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  searchHUD: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    height: 54,
    borderRadius: 20,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    marginLeft: 12,
    fontSize: 15,
    fontWeight: "600",
  },
  genreHUD: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  genrePill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  genrePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genreText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "700",
  },
  genreTextActive: {
    color: "#fff",
  },
  columnWrapper: {
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  movieCard: {
    height: 260,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  posterOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
  },
  ratingBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  ratingValue: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },
  cardInfo: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  movieGenre: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600",
  },
});
