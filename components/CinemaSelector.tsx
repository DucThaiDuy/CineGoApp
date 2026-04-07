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
};

type Props = {
  cinemas: Cinema[];
  selectedCinema: string;
  onSelect: (id: string) => void;
};

export default function CinemaSelector({
  cinemas,
  selectedCinema,
  onSelect,
}: Props) {
  return (
    <View style={styles.section}>
      {cinemas.map((cinema) => (
        <TouchableOpacity
          key={cinema.id}
          style={styles.cinemaCard}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/cinema/ShowtimeScreen",
              params: { cinemaId: cinema.id },
            })
          }
        >
          {/* Header */}
          <View style={styles.cinemaHeader}>
            <Text style={styles.cinemaName}>{cinema.name}</Text>
            <Text style={styles.cinemaDistance}>{cinema.distance}</Text>
          </View>

          {/* Address */}
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color="#9CA3AF" />
            <Text style={styles.cinemaAddress}>{cinema.address}</Text>
          </View>

          {/* Action */}
          <Text style={styles.showtimeText}>Xem suất chiếu →</Text>
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
});
