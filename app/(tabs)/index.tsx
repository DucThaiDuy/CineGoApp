import HeroBanner from "@/components/HeroBanner";
import HighlightSection from "@/components/HighlightSection";
import HomeHeader from "@/components/HomeHeader";
import MovieCard from "@/components/MovieCard";
import Section from "@/components/Section";
import EventCard from "@/components/EventCard";
import SnackCard from "@/components/SnackCard";
import { theme } from "@/constants/colors";
import { useAppColors } from "@/hooks/use-app-colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, Dimensions, RefreshControl, Platform } from "react-native";
import api from "@/utils/api";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function Home() {
  const colors = useAppColors();

  const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: colors.bg,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    blurBlob1: {
      position: "absolute",
      top: 50,
      right: -100,
      width: 300,
      height: 300,
      borderRadius: 150,
      backgroundColor: colors.primary,
      opacity: 0.08,
    },
    blurBlob2: {
      position: "absolute",
      top: 400,
      left: -150,
      width: 400,
      height: 400,
      borderRadius: 200,
      backgroundColor: "#1E40AF",
      opacity: 0.05,
    },
    heroWrapper: {
      marginTop: 0,
      zIndex: 1,
    },
    mainContent: {
      marginTop: -10,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      backgroundColor: colors.bg,
      paddingTop: 10,
    },
    contentDivider: {
      height: 32,
    },
    placeholderRow: {
      width: width - 40,
      height: 120,
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.05)",
      borderStyle: "dashed",
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.02)",
    },
    placeholderText: {
      color: colors.muted,
      fontSize: 14,
    },
  });

  const [moviesNow, setMoviesNow] = useState<any[]>([]);

  const [moviesComing, setMoviesComing] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMovies = async () => {
    try {
      const response = await api.get("/movies", {
        params: { page: 0, size: 20 },
      });
      
      let moviesList: any[] = [];
      if (response.data && response.data.data && Array.isArray(response.data.data.items)) {
        moviesList = response.data.data.items;
      } else if (response.data && Array.isArray(response.data.items)) {
        moviesList = response.data.items;
      } else if (response.data && Array.isArray(response.data.data)) {
        moviesList = response.data.data;
      } else if (Array.isArray(response.data)) {
        moviesList = response.data;
      }

      if (moviesList.length > 0) {
        const nowShowing = moviesList
          .filter((m: any) => m.status === "NOW_SHOWING")
          .map((m: any) => ({
            id: m.id,
            title: m.title,
            poster: m.posterUrl,
          }));
        const comingSoon = moviesList
          .filter((m: any) => m.status === "COMING_SOON")
          .map((m: any) => ({
            id: m.id,
            title: m.title,
            poster: m.posterUrl,
          }));

        if (nowShowing.length > 0) setMoviesNow(nowShowing);
        if (comingSoon.length > 0) setMoviesComing(comingSoon);
      }
    } catch (error) {
      console.error("Fetch movies error:", error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchMovies().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <View style={styles.container}>
      
      {/* Background Decorative Blurs */}

      <View style={styles.blurBlob1} />
      <View style={styles.blurBlob2} />

      <HomeHeader />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressViewOffset={Platform.OS === "android" ? 20 : 0}
          />
        }
      >
        <View style={styles.heroWrapper}>
          <HeroBanner />
        </View>

        <View style={styles.mainContent}>
          <Section
            title="Đang chiếu"
            icon={<Ionicons name="flash" size={20} color={colors.primary} />}
            onViewAll={() => router.push("/movie/NowShowing")}
          >
            {moviesNow.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </Section>

          <View style={styles.contentDivider} />

          <Section
            title="Sắp chiếu"
            icon={<Ionicons name="time" size={20} color={colors.accent} />}
          >
            {moviesComing.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </Section>

          <View style={styles.contentDivider} />

          {/* Restored Bắp & Nước */}
          <Section
            title="Bắp & Nước"
            icon={<Ionicons name="fast-food" size={20} color="#F59E0B" />}
            onViewAll={() => router.push("/cinema/FoodManagement")}
          >
            {[
              { title: "Bắp phô mai", image: "https://img.lovepik.com/bg/20240509/Vibrant-3D-Glasses-Popcorn-Bucket-and-Clapperboard-A-Colorful-Cinema_10838279_wh1200.jpg" },
              { title: "Nước ngọt", image: "https://tse1.mm.bing.net/th/id/OIP.eG-iUUzVqat54rvWBTSGiwHaEJ?pid=Api&P=0&h=220" },
              { title: "Combo Snack", image: "https://i.pinimg.com/originals/55/63/20/556320555025f64d26fcc4dd384f9a1f.jpg" },
            ].map((snack, idx) => (
              <SnackCard key={idx} {...snack} />
            ))}
          </Section>

          <View style={styles.contentDivider} />

          <HighlightSection
            title="Cộng đồng CineGo"
            onViewAll={() => router.push("/movie/ReviewList")}
            bigItem={{
              id: 99,
              title: "Oppenheimer",
              image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
            }}
            smallItems={[
              {
                id: 100,
                title: "Dune: Part Two",
                image: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
              },
              {
                id: 101,
                title: "Avengers: Endgame",
                image: "https://revelogue.com/wp-content/uploads/2020/01/Poster-chinh-thuc-cho-Endgame-e1578281933829.jpg",
              },
            ]}
          />

          <View style={styles.contentDivider} />

          <Section
            title="Sự kiện HOT"
            icon={<Ionicons name="flame" size={20} color={colors.primary} />}
            onViewAll={() => router.push("/cinema/PromotionsScreen")}
          >
            <View style={styles.placeholderRow}>
               <Text style={styles.placeholderText}>Đang cập nhật sự kiện mới nhất...</Text>
            </View>
          </Section>
        </View>
      </ScrollView>
    </View>
  );
}
