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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CinemaSelector from "../../components/CinemaSelector";

const { width } = Dimensions.get("window");

export default function MovieDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const movie = MOVIES.find((m) => m.id === id) || MOVIES[0];

  const [selectedCinema, setSelectedCinema] = useState("1");
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const cinemas = [
    {
      id: "1",
      name: "CineGo Cinema Hà Nội",
      address: "Tầng 5, TTTM Vincom, Ba Đình",
      distance: "2.5 km",
    },
    {
      id: "2",
      name: "CineGo Cinema Hoàn Kiếm",
      address: "15 Tràng Thi, Hoàn Kiếm",
      distance: "3.2 km",
    },
    {
      id: "3",
      name: "CineGo Cinema Cầu Giấy",
      address: "234 Cầu Giấy, Cầu Giấy",
      distance: "4.8 km",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Banner Section */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: movie.poster }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(10, 10, 10, 0.8)", colors.bg]}
            style={styles.bannerGradient}
          />
          
          <View style={styles.bannerContent}>
            <View style={styles.tagRow}>
              {movie.tag && (
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>{movie.tag}</Text>
                </View>
              )}
              <View style={[styles.tagBadge, { backgroundColor: "rgba(255, 255, 255, 0.2)" }]}>
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

          {/* Premium Header Actions */}
          <View style={[styles.headerHUD, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity 
              style={styles.hudCircle}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.hudCircle, liked && styles.hudCircleLiked]}
              onPress={() => setLiked(!liked)}
            >
              <Ionicons 
                name={liked ? "heart" : "heart-outline"} 
                size={22} 
                color={liked ? colors.primary : "#fff"} 
              />
            </TouchableOpacity>
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

        {/* Cast/Crew placeholders (Optional highlight) */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>T18</Text>
            <Text style={styles.metricLabel}>Độ tuổi</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>Việt / Sub</Text>
            <Text style={styles.metricLabel}>Ngôn ngữ</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>4.5/5</Text>
            <Text style={styles.metricLabel}>CineScore</Text>
          </View>
        </View>

        {/* Cinema Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIndicator} />
            <Text style={styles.sectionTitle}>Chọn rạp chiếu</Text>
          </View>
          
          <CinemaSelector
            cinemas={cinemas}
            selectedCinema={selectedCinema}
            onSelect={setSelectedCinema}
          />
        </View>
      </ScrollView>

      {/* Booking Bar */}
      <View style={[styles.bookingBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => router.push({ pathname: "/cinema/ShowtimeScreen", params: { id: movie.id } })}
        >
          <LinearGradient
            colors={[colors.primary, "#B91C1C"]}
            style={styles.btnGradient}
          >
            <Text style={styles.bookBtnText}>ĐẶT VÉ NGAY</Text>
            <Ionicons name="ticket-outline" size={20} color="#fff" />
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
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  hudCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  hudCircleLiked: {
    borderColor: colors.primary,
    backgroundColor: "rgba(229, 9, 20, 0.15)",
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
