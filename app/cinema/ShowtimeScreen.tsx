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

import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ShowtimeScreen() {
  const insets = useSafeAreaInsets();
  const { id, cinemaId, cinemaName, cinemaAddress } = useLocalSearchParams<{ id: string, cinemaId: string, cinemaName: string, cinemaAddress: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [allShowtimes, setAllShowtimes] = useState<any[]>([]);
  const [availableDates, setAvailableDates] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("2D");
  const [selectedShowtime, setSelectedShowtime] = useState<any | null>(null);

  React.useEffect(() => {
    const fetchMovie = async () => {
      try {
        const { default: api } = await import("@/utils/api");
        if (id) {
          const response = await api.get(`/movies/${id}`);
          if (response.data && response.data.data) {
            setMovie(response.data.data);
          }

          let items: any[] = [];
          try {
            const stRes = await api.get(`/showtimes/movie/${id}`);
            if (stRes.data && stRes.data.data?.items) {
               items = stRes.data.data.items;
            }
          } catch (stErr: any) {
            console.log("Phim chưa có lịch chiếu:", stErr?.response?.data?.message || stErr.message);
            items = [];
          }

          if (cinemaId) {
             items = items.filter((x: any) => String(x.cinemaId) === String(cinemaId));
          }
          setAllShowtimes(items);

          // Lấy danh sách ngày độc nhất
          const uniqueDates = Array.from(new Set(items.map((x: any) => x.date)));
          
          const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
          const parsedDates = uniqueDates.map(dateStr => {
              const str = String(dateStr);
              const parts = str.split('-');
              let d: Date;
              if (parts.length === 3) {
                d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
              } else {
                d = new Date(str);
              }
              const today = new Date();
              let dayName = dayNames[d.getDay()];
              if (d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
                  dayName = "Hôm nay";
              }
              return {
                  id: dateStr as string,
                  dayName: dayName,
                  dateNum: `${d.getDate()}/${d.getMonth() + 1}`,
                  timeMs: d.getTime(),
              };
          });
          
          parsedDates.sort((a, b) => a.timeMs - b.timeMs);
          
          setAvailableDates(parsedDates);
          if (parsedDates.length > 0) setSelectedDate(parsedDates[0].id);
        }
      } catch (error) {
        console.log("Fetch movie err in Showtime:", error);
      }
    };
    fetchMovie();
  }, [id, cinemaId]);

  const formats = ["2D", "3D", "IMAX"];
  // Lọc suất chiếu theo ngày và định dạng (nếu API có định dạng)
  const currentShowtimes = allShowtimes
    .filter(x => x.date === selectedDate)
    .sort((a, b) => {
        // time format HH:mm:ss
        return a.time.localeCompare(b.time);
    });

  return (
    <View style={styles.container}>
      {/* Header with Progress */}
      <ImageBackground
        source={{ uri: movie?.posterUrl || "https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" }}
        style={styles.headerImageBackground}
      >
        <LinearGradient 
          colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]} 
          style={StyleSheet.absoluteFill} 
        />
        <BookingHeader 
           title="Chọn suất chiếu"
           subtitle={movie ? `${movie.title} • ${cinemaName || "CineGo"}` : "Đang tải..."}
           currentStep={1}
        />
      </ImageBackground>

      <View style={styles.cinemaInfo}>
        <Ionicons name="location-outline" size={18} color={colors.primary} />
        <View style={{ marginLeft: 8 }}>
          <Text style={styles.cinemaName}>{cinemaName || "CineGo Cinema"}</Text>
          <Text style={styles.cinemaAddress}>{cinemaAddress || "Đang tải địa chỉ..."}</Text>
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
            {availableDates.length > 0 ? availableDates.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={[
                  styles.datePill,
                  selectedDate === d.id && styles.datePillActive,
                ]}
                onPress={() => setSelectedDate(d.id)}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === d.id && styles.dateTextActive,
                  ]}
                >
                  {d.dayName}
                </Text>
                <Text
                  style={[
                    styles.dateNumText,
                    selectedDate === d.id && styles.dateNumTextActive,
                  ]}
                >
                  {d.dateNum}
                </Text>
              </TouchableOpacity>
            )) : <Text style={{ color: colors.muted }}>Đang tải lịch chiếu...</Text>}
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
            {currentShowtimes.length > 0 ? currentShowtimes.map((s) => {
              const disabled = s.status === "sold";
              const timeString = s.time.substring(0, 5); // 09:30:00 -> 09:30

              return (
                <TouchableOpacity
                  key={s.id}
                  disabled={disabled}
                  onPress={() => setSelectedShowtime(s)}
                  style={[
                    styles.showtimeBtn,
                    s.status === "almost" && styles.showtimeAlmost,
                    disabled && styles.showtimeSold,
                    selectedShowtime?.id === s.id && styles.showtimeSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.showtimeText,
                      disabled && styles.textDisabled,
                      selectedShowtime?.id === s.id && styles.textSelected,
                    ]}
                  >
                    {timeString}
                  </Text>
                </TouchableOpacity>
              );
            }) : (
              <View style={{ alignItems: "center", justifyContent: "center", width: "100%", paddingVertical: 30 }}>
                <Ionicons name="calendar-outline" size={40} color={colors.muted} />
                <Text style={{ color: colors.muted, width: "100%", textAlign: "center", marginTop: 10 }}>
                  Không có suất chiếu nào vào ngày này.
                </Text>
              </View>
            )}
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
                showtimeId: String(selectedShowtime!.id),
                movieId: String(id || selectedShowtime!.movieId),
                cinemaName: cinemaName || selectedShowtime!.cinema_name || "CineGo Cinema",
                cinemaAddress: cinemaAddress || "",
                date: selectedShowtime!.date,
                time: selectedShowtime!.time,
                format: selectedShowtime!.format,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#1F2937",
    marginRight: 10,
    marginBottom: 25,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
    borderWidth: 1,
    borderColor: "#374151",
  },
  datePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateText: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  dateTextActive: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  dateNumText: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "800",
  },
  dateNumTextActive: {
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
