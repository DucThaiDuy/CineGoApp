import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../constants/colors";

type Cinema = {
  id: string;
  name: string;
  address: string;
  distance: string;
  hasShowtime?: boolean;
};

type Props = {
  cinemas: Cinema[];
  selectedCinema: string;
  movieId: string;
  onSelect: (id: string) => void;
};

export default function CinemaSelector({
  cinemas,
  selectedCinema,
  movieId,
  onSelect,
}: Props) {
  if (cinemas.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="film-outline" size={36} color={colors.muted} />
        <Text style={styles.emptyTitle}>Chưa có rạp chiếu</Text>
        <Text style={styles.emptySubtitle}>
          Đang tải danh sách cụm rạp CineGo...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      {cinemas.map((cinema) => (
        <TouchableOpacity
          key={cinema.id}
          style={[styles.cinemaCard, cinema.hasShowtime && styles.cinemaCardActive]}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/cinema/ShowtimeScreen",
              params: { 
                id: movieId,
                cinemaId: cinema.id,
                cinemaName: cinema.name,
                cinemaAddress: cinema.address
              },
            })
          }
        >
          {/* Header */}
          <View style={styles.cinemaHeader}>
            <Text style={styles.cinemaName}>{cinema.name}</Text>
            {cinema.distance ? (
              <View style={[styles.badgeWrap, cinema.hasShowtime && styles.badgeWrapActive]}>
                <Text style={[styles.cinemaDistance, cinema.hasShowtime && styles.cinemaDistanceActive]}>
                  {cinema.distance}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Address */}
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color="#9CA3AF" />
            <Text style={styles.cinemaAddress}>{cinema.address}</Text>
          </View>

          {/* Action */}
          <Text style={[styles.showtimeText, !cinema.hasShowtime && { color: colors.muted }]}>
            {cinema.hasShowtime ? "Xem suất chiếu →" : "Xem lịch rạp →"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    // padding: 16,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },

  cinemaCard: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
  },

  cinemaCardActive: {
    borderColor: colors.primary,
    backgroundColor: "#0F172A",
  },

  cinemaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cinemaName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F9FAFB",
    flex: 1,
    paddingRight: 8,
  },

  cinemaDistance: {
    fontSize: 12,
    color: colors.text,
    fontWeight: "600",
  },

  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  cinemaAddress: {
    fontSize: 13,
    color: "#9CA3AF",
    marginLeft: 4,
    flex: 1,
  },

  showtimeText: {
    marginTop: 8,
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
  badgeWrap: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  badgeWrapActive: {
    backgroundColor: "rgba(229, 9, 20, 0.2)",
    borderColor: colors.primary,
  },
  cinemaDistanceActive: {
    color: colors.primary,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: "#111827",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderStyle: "dashed",
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
  },
  emptySubtitle: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
});
