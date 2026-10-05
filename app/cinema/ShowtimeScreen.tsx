import BookingHeader from "@/components/BookingHeader";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ShowtimeScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState("Hôm nay");
  const [selectedFormat, setSelectedFormat] = useState("2D");
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);

  const dates = ["Hôm nay", "T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const formats = ["2D", "3D", "IMAX"];
  const showtimes = [
    { time: "09:30", status: "available" },
    { time: "11:45", status: "almost" },
    { time: "14:00", status: "available" },
    { time: "16:20", status: "sold" },
    { time: "18:45", status: "available" },
    { time: "21:10", status: "available" },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Progress */}
      <ImageBackground
        source={{ uri: "https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" }}
        style={styles.headerImageBackground}
      >
        <LinearGradient 
          colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]} 
          style={StyleSheet.absoluteFill} 
        />
        <BookingHeader 
           title="Chọn suất chiếu"
           subtitle="Oppenheimer • CineGo Hà Nội"
           currentStep={1}
        />
      </ImageBackground>

      <View style={styles.cinemaInfo}>
        <Ionicons name="location-outline" size={18} color={colors.primary} />
        <View style={{ marginLeft: 8 }}>
          <Text style={styles.cinemaName}>CineGo Cinema Hà Nội</Text>
          <Text style={styles.cinemaAddress}>Tầng 5, TTTM Vincom, Ba Đình</Text>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.body}>
          {/* Date */}
          <Text style={styles.sectionTitle}>Chọn ngày</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dates.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.datePill,
                  selectedDate === d && styles.datePillActive,
                ]}
                onPress={() => setSelectedDate(d)}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === d && styles.dateTextActive,
                  ]}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Format */}
          <Text style={styles.sectionTitle}>Định dạng</Text>
          <View style={styles.formatRow}>
            {formats.map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.formatBtn,
                  selectedFormat === f && styles.formatBtnActive,
                ]}
                onPress={() => setSelectedFormat(f)}
              >
                <Text
                  style={[
                    styles.formatText,
                    selectedFormat === f && styles.formatTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Showtime */}
          <Text style={styles.sectionTitle}>Suất chiếu</Text>
          <View style={styles.showtimeGrid}>
            {showtimes.map((s) => {
              const disabled = s.status === "sold";

              return (
                <TouchableOpacity
                  key={s.time}
                  disabled={disabled}
                  onPress={() => setSelectedShowtime(s.time)}
                  style={[
                    styles.showtimeBtn,
                    s.status === "almost" && styles.showtimeAlmost,
                    disabled && styles.showtimeSold,
                    selectedShowtime === s.time && styles.showtimeSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.showtimeText,
                      disabled && styles.textDisabled,
                      selectedShowtime === s.time && styles.textSelected,
                    ]}
                  >
                    {s.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom ? insets.bottom + 12 : 16 }]}>
        <TouchableOpacity
          style={[styles.nextBtn, !selectedShowtime && styles.nextBtnDisabled]}
          disabled={!selectedShowtime}
          onPress={() =>
            router.push({
              pathname: "/cinema/SeatScreen",
              params: {
                showtimeId: selectedShowtime!,
              },
            })
          }
        >
          <Text style={styles.nextText}>CHỌN GHẾ</Text>
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
  headerImageBackground: {
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  cinemaInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    marginHorizontal: 16,
    marginTop: -20,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#1F2937",
    zIndex: 10,
  },
  cinemaName: {
    color: "#F9FAFB",
    fontSize: 14,
    fontWeight: "700",
  },
  cinemaAddress: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    color: "#F9FAFB",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  body: {
    padding: 16,
    paddingTop: 30,
  },
  datePill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#1F2937",
    marginRight: 8,
    marginBottom: 25,
  },
  datePillActive: {
    backgroundColor: colors.primary,
  },
  dateText: {
    color: "#9CA3AF",
    fontWeight: "600",
  },
  dateTextActive: {
    color: "#fff",
  },
  formatRow: {
    flexDirection: "row",
    gap: 10,
  },
  formatBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1F2937",
    alignItems: "center",
    marginBottom: 25,
  },
  formatBtnActive: {
    backgroundColor: colors.primary,
  },
  formatText: {
    color: "#D1D5DB",
    fontWeight: "700",
  },
  formatTextActive: {
    color: "#fff",
  },
  showtimeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  showtimeBtn: {
    width: "30%",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    alignItems: "center",
  },
  showtimeSelected: {
    borderColor: colors.primary,
    backgroundColor: "#0F172A",
  },
  showtimeAlmost: {
    borderColor: "#F59E0B",
  },
  showtimeSold: {
    backgroundColor: "#020617",
    borderColor: "#020617",
  },
  showtimeText: {
    color: "#F9FAFB",
    fontWeight: "700",
  },
  textDisabled: {
    color: "#4B5563",
  },
  textSelected: {
    color: colors.primary,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    backgroundColor: colors.bg,
  },
  nextBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  nextBtnDisabled: {
    backgroundColor: "#374151",
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
