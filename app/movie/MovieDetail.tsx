import { colors } from "@/constants/colors";

import { MOVIES } from "@/constants/movies";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import CinemaSelector from "../../components/CinemaSelector";

const { width } = Dimensions.get("window");

export default function MovieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cinemas, setCinemas] = useState<any[]>([]);
  const [selectedCinema, setSelectedCinema] = useState("1");
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMovie = React.useCallback(async () => {
    try {
      // Gọi API public để lấy chi tiết phim
        const { default: api } = await import("@/utils/api");
        const response = await api.get('/movies/' + id);
        if (response.data && response.data.data) {
          const m = response.data.data;
          setMovie({
            id: m.id,
            title: m.title,
            originalTitle: m.originalTitle,
            poster: m.posterUrl,
            rating: m.rating ? Number(m.rating).toFixed(1) : "N/A",
            duration: m.durationMinutes ? `${m.durationMinutes} phút` : "Chưa rõ",
            genre: m.genre || m.category || "Phim chiếu rạp",
            tag: m.country || "Quốc tế",
            description: m.description || m.seoDescription || (m.originalTitle ? `${m.title} (${m.originalTitle}) do ${m.distributor || 'hãng phim'} phát hành.` : "Nội dung phim đang được cập nhật."),
            ageRating: m.ageRating || "T18",
            status: m.status || "NOW_SHOWING",
          });
        }

        // Lấy suất chiếu của phim này từ API
        let showtimeItems: any[] = [];
        try {
          const stRes = await api.get('/showtimes/movie/' + id);
          showtimeItems = stRes.data?.data?.items || [];
        } catch (stErr: any) {
          // Phim chưa có lịch chiếu
          showtimeItems = [];
        }

        // Đếm số suất chiếu thật theo từng rạp
        const showtimesByCinema: Record<string, number> = {};
        showtimeItems.forEach((s: any) => {
          if (s.cinemaId) {
            const cId = String(s.cinemaId);
            showtimesByCinema[cId] = (showtimesByCinema[cId] || 0) + 1;
          }
        });
        const activeCinemaIds = new Set(Object.keys(showtimesByCinema));

        // Lấy danh sách rạp từ API (luôn hiển thị các rạp thực tế của CineGo từ database)
        try {
          const cinemaRes = await api.get('/cinemas');
          const allCinemas = cinemaRes.data?.data?.items || cinemaRes.data?.items || [];
          
          if (allCinemas.length > 0) {
            const fetchedCinemas = allCinemas
              .map((c: any) => {
                const count = showtimesByCinema[String(c.id)] || 0;
                return {
                  id: String(c.id),
                  name: c.name,
                  address: c.address || `${c.district || ''}, ${c.city || ''}`,
                  distance: count > 0 ? `${count} suất chiếu` : "Chưa có suất",
                  hasShowtime: count > 0,
                  count: count,
                };
              })
              .sort((a: any, b: any) => b.count - a.count);

            setCinemas(fetchedCinemas);
            if (fetchedCinemas.length > 0) {
              const firstActive = fetchedCinemas.find((c: any) => c.hasShowtime);
              setSelectedCinema(firstActive ? firstActive.id : fetchedCinemas[0].id);
            }
          } else {
            setCinemas([]);
          }
        } catch (cinErr) {
          console.warn("Lỗi tải rạp:", cinErr);
          setCinemas([]);
        }
    } catch (error: any) {
      console.error("Fetch data error:", error?.response?.data || error?.message || error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchMovie().finally(() => setRefreshing(false));
  }, [fetchMovie]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#fff" }}>Đang tải thông tin phim...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#fff" }}>Không tìm thấy thông tin phim.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Header Actions (Back & Like Buttons) */}
      <View style={[styles.headerHUD, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.hudCircle}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.hudCircle, liked && styles.hudCircleLiked]}
          onPress={() => setLiked(!liked)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={liked ? "heart" : "heart-outline"} 
            size={22} 
            color={liked ? colors.primary : "#fff"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressViewOffset={Platform.OS === 'android' ? insets.top + 30 : 0}
          />
        }
      >
        {/* Banner Section */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: movie.poster || "https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" }} 
            style={styles.bannerImage} 
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(10,10,10,0.8)", colors.bg]}
            style={styles.bannerGradient}
          />
          
          <View style={styles.bannerContent}>
            <View style={styles.tagRow}>
              <View style={styles.tagBadge}><Text style={styles.tagText}>{movie.tag || "Mỹ"}</Text></View>
              <View style={[styles.tagBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Text style={styles.tagText}>2D / IMAX</Text>
              </View>
            </View>
            
            <Text style={styles.title}>{movie.title}</Text>
            
            <View style={styles.metaRow}>
              <View style={styles.ratingBox}>
                <Ionicons name="star" size={14} color={colors.accent} />
                <Text style={styles.ratingText}>{movie.rating}</Text>
              </View>
              <View style={styles.metaDivider} />
              <Text style={styles.metaText}>{movie.duration}</Text>
              <View style={styles.metaDivider} />
              <Text style={styles.metaText}>{movie.genre}</Text>
            </View>
          </View>
        </View>

        {/* Storyline Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>Nội dung phim</Text>
          </View>
          <Text 
            style={styles.description}
            numberOfLines={expanded ? undefined : 3}
          >
            {movie.description}
          </Text>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.readMoreText}>
              {expanded ? "Thu gọn" : "Xem thêm"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Movie Metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{movie.ageRating || "T18"}</Text>
            <Text style={styles.metricLabel}>Độ tuổi</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>Việt / Sub</Text>
            <Text style={styles.metricLabel}>Ngôn ngữ</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{movie.rating !== "N/A" ? `${movie.rating}/10` : "Chưa có"}</Text>
            <Text style={styles.metricLabel}>CineScore</Text>
          </View>
        </View>

        {/* Cinema Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>Rạp đang chiếu phim này</Text>
          </View>
          
          <CinemaSelector
              cinemas={cinemas}
              selectedCinema={selectedCinema}
              movieId={id}
              onSelect={setSelectedCinema}
            />
        </View>
      </ScrollView>

      {/* Booking Bar */}
      <View style={[styles.bookingBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.bookBtn, cinemas.length === 0 && { opacity: 0.6 }]}
          disabled={cinemas.length === 0}
          onPress={() => {
            const c = cinemas.find((x) => x.id === selectedCinema) || cinemas[0];
            if (!c) return;
            router.push({ 
              pathname: "/cinema/ShowtimeScreen", 
              params: { 
                id: movie.id, 
                cinemaId: c.id,
                cinemaName: c.name,
                cinemaAddress: c.address
              } 
            });
          }}
        >
          <LinearGradient
            colors={cinemas.length > 0 ? [colors.primary, "#B91C1C"] : ["#374151", "#1F2937"]}
            style={styles.btnGradient}
          >
            <Text style={styles.bookBtnText}>
              {cinemas.length > 0 ? "ĐẶT VÉ NGAY" : "CHƯA CÓ LỊCH CHIẾU"}
            </Text>
            {cinemas.length > 0 && <Ionicons name="ticket-outline" size={20} color="#fff" />}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  bannerContainer: {
    height: 480,
    width: "100%",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  bannerContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  tagBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 14,
  },
  metaText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "500",
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  headerHUD: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
    zIndex: 99,
  },
  hudCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  hudCircleLiked: {
    borderColor: colors.primary,
    backgroundColor: "rgba(229, 9, 20, 0.3)",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  sectionIndicator: {
    width: 4,
    height: 24,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  description: {
    color: colors.sub,
    fontSize: 15,
    lineHeight: 24,
  },
  readMoreText: {
    color: colors.primary,
    marginTop: 8,
    fontWeight: "700",
  },
  metricsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  metricDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignSelf: "center",
  },
  bookingBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(10, 10, 10, 0.9)",
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  bookBtn: {
    borderRadius: 18,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  btnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 12,
  },
  bookBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
  },
});