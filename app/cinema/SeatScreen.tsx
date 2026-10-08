import BookingHeader from "@/components/BookingHeader";
import { useLocalSearchParams, useRouter } from "expo-router";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Animated,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "../../constants/colors";
import api from "@/utils/api";

type SeatItem = {
  id: number;
  rowName: string;
  seatNumber: number;
  seatCode: string;
  seatType: string;
  basePrice: number;
  isBooked: boolean;
  booked?: boolean;
};

export default function SeatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showtimeId, movieId, cinemaName, cinemaAddress, date, time } = useLocalSearchParams<{
    showtimeId: string;
    movieId: string;
    cinemaName: string;
    cinemaAddress: string;
    date: string;
    time: string;
  }>();

  const [movie, setMovie] = useState<any>(null);
  const [seats, setSeats] = useState<SeatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeatCodes, setSelectedSeatCodes] = useState<string[]>([]);

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (movieId) {
          try {
            const mRes = await api.get(`/movies/${movieId}`);
            if (mRes.data?.data) {
              setMovie(mRes.data.data);
            }
          } catch (mErr) {
            console.warn("Lỗi tải thông tin phim:", mErr);
          }
        }

        if (showtimeId) {
          try {
            const sRes = await api.get(`/showtimes/${showtimeId}/seats`);
            const seatList: SeatItem[] = sRes.data?.data || [];
            setSeats(seatList);
          } catch (sErr) {
            console.warn("Lỗi tải danh sách ghế:", sErr);
            setSeats([]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showtimeId, movieId]);

  // Nhóm ghế theo hàng
  const groupedSeats = useMemo(() => {
    const rowsMap: Record<string, SeatItem[]> = {};
    seats.forEach((seat) => {
      const r = seat.rowName;
      if (!rowsMap[r]) rowsMap[r] = [];
      rowsMap[r].push(seat);
    });
    // Sắp xếp các ghế trong hàng theo seatNumber
    Object.keys(rowsMap).forEach((r) => {
      rowsMap[r].sort((a, b) => a.seatNumber - b.seatNumber);
    });
    return rowsMap;
  }, [seats]);

  const rowNames = useMemo(() => {
    return Object.keys(groupedSeats).sort();
  }, [groupedSeats]);

  const seatMapByCode = useMemo(() => {
    const map = new Map<string, SeatItem>();
    seats.forEach((s) => map.set(s.seatCode, s));
    return map;
  }, [seats]);

  const toggleSeat = (seat: SeatItem) => {
    if (seat.isBooked || seat.booked) return;

    setSelectedSeatCodes((prev) =>
      prev.includes(seat.seatCode)
        ? prev.filter((s) => s !== seat.seatCode)
        : [...prev, seat.seatCode]
    );
  };

  const totalPrice = useMemo(() => {
    return selectedSeatCodes.reduce((sum, code) => {
      const seat = seatMapByCode.get(code);
      return sum + (seat ? Number(seat.basePrice) : 80000);
    }, 0);
  }, [selectedSeatCodes, seatMapByCode]);

  return (
    <View style={styles.container}>
      {/* Header with Progress & Banner */}
      <ImageBackground
        source={{
          uri:
            movie?.posterUrl ||
            "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
        }}
        style={styles.headerImageBackground}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.85)", "rgba(0,0,0,0.6)", "rgba(10, 10, 10, 1)"]}
          style={StyleSheet.absoluteFill}
        />
        <BookingHeader
          title="Chọn ghế"
          subtitle={`${movie?.title || "Phim"} • ${cinemaName || "CineGo"}`}
          currentStep={2}
        />
      </ImageBackground>

      {/* Screen */}
      <View style={styles.screenWrap}>
        <View style={styles.screen} />
        <Text style={styles.screenText}>MÀN HÌNH</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.muted, marginTop: 12 }}>Đang tải sơ đồ phòng chiếu...</Text>
        </View>
      ) : seats.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <Text style={{ color: colors.muted, fontSize: 15, textAlign: "center" }}>
            Không tìm thấy thông tin ghế cho suất chiếu này.
          </Text>
        </View>
      ) : (
        <View style={styles.seatWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 12 }}>
              {rowNames.map((rowName) => (
                <View key={rowName} style={styles.row}>
                  <Text style={styles.rowLabelText}>{rowName}</Text>
                  {groupedSeats[rowName].map((seat) => {
                    const isSold = seat.isBooked || seat.booked;
                    const isVip = seat.seatType === "VIP";
                    const isSelected = selectedSeatCodes.includes(seat.seatCode);

                    return (
                      <TouchableOpacity
                        key={seat.seatCode}
                        disabled={isSold}
                        onPress={() => toggleSeat(seat)}
                        style={[
                          styles.seat,
                          isVip && styles.seatVip,
                          isSold && styles.seatSold,
                          isSelected && styles.seatSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.seatLabel,
                            isSold && styles.seatLabelDisabled,
                            isSelected && { color: "#fff", fontWeight: "bold" },
                          ]}
                        >
                          {seat.seatCode}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <Text style={styles.rowLabelText}>{rowName}</Text>
                </View>
              ))}
            </ScrollView>
          </ScrollView>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <LegendItem color="#374151" label="Thường" />
        <LegendItem color="#F59E0B" label="VIP" />
        <LegendItem color={colors.primary} label="Đang chọn" />
        <LegendItem color="#7C2D12" label="Đã bán" />
      </View>

      {/* Bottom */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom ? insets.bottom + 12 : 16 }]}>
        <Text style={styles.seatText}>
          Ghế: {selectedSeatCodes.length ? selectedSeatCodes.join(", ") : "Chưa chọn"}
        </Text>
        <Text style={styles.total}>
          Tổng tiền: {totalPrice.toLocaleString("vi-VN")}đ
        </Text>
        <TouchableOpacity
          style={[styles.payBtn, !selectedSeatCodes.length && styles.payDisabled]}
          disabled={!selectedSeatCodes.length}
          onPress={() =>
            router.push({
              pathname: "/cinema/ComboScreen",
              params: {
                seats: selectedSeatCodes.join(","),
                showtimeId: showtimeId || "",
                movieId: movieId || "",
                cinemaName: cinemaName || "",
                totalSeatPrice: String(totalPrice),
                date: date || "",
                time: time || "",
              },
            })
          }
        >
          <Text style={styles.payText}>TIẾP TỤC</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function LegendItem({ color, label }: any) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  headerImageBackground: {
    paddingBottom: 10,
    overflow: "hidden",
  },

  headerContainer: {
    flexDirection: "row",
    height: 36,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
    backgroundColor: "#020617",
    paddingRight: 8,
  },

  seatText: {
    color: "#D1D5DB",
    fontSize: 14,
    marginBottom: 4,
  },

  screenWrap: {
    alignItems: "center",
    marginVertical: 16,
  },
  screen: {
    width: "80%",
    height: 6,
    backgroundColor: "#9CA3AF",
    borderRadius: 4,
  },
  screenText: {
    marginTop: 6,
    color: "#9CA3AF",
    fontSize: 12,
  },
  seatLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#E5E7EB",
    textAlign: "center",
  },

  seatLabelDisabled: {
    color: "#9CA3AF",
  },
  seatArea: {
    paddingHorizontal: 16,
    paddingBottom: 140,
  },

  //   row: {
  //     flexDirection: "row",
  //     alignItems: "center",
  //     marginBottom: 10,
  //     justifyContent: "center",
  //   },
  rowLabel: {
    width: 20,
    color: "#9CA3AF",
    fontWeight: "700",
  },
  rowLabelText: {
    width: 24,
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 28,
  },
  seatWrapper: {
    flexDirection: "row",
    height: 380, // 🔥 BẮT BUỘC – nếu không sẽ không cuộn
  },

  verticalScroll: {
    flex: 1,
  },

  rowLabelColumn: {
    width: 28,
    alignItems: "center",
  },

  fixedRowLabel: {
    height: 36,
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textAlignVertical: "center",
  },

  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  seat: {
    width: 28,
    height: 28,
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: "#374151",

    alignItems: "center", // 👈 ngang
    justifyContent: "center", // 👈 dọc
  },

  //   seatVip: {
  //     backgroundColor: "#F59E0B",
  //   },

  //   seatSold: {
  //     backgroundColor: "#6B7280",
  //   },

  //   seatSelected: {
  //     backgroundColor: "#22C55E",
  //   },

  //   seat: {
  //     width: 28,
  //     height: 28,
  //     borderRadius: 6,
  //     backgroundColor: "#374151",
  //     marginHorizontal: 4,
  //   },
  seatContainer: {
    flexDirection: "row",
  },

  leftColumn: {
    width: 32,
    alignItems: "center",
  },

  fixedSeatNumber: {
    height: 36,
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    textAlignVertical: "center",
  },

  headerRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  headerLetter: {
    width: 36,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
  },

  corner: {
    height: 28,
  },

  // rowLabel: {
  //   height: 36,
  //   marginBottom: 8,
  //   fontSize: 12,
  //   color: "#9CA3AF",
  //   fontWeight: "600",
  // },

  seatNumberRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  seatNumber: {
    width: 28,
    marginHorizontal: 4,
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },

  seatRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  // seat: {
  //   width: 28,
  //   height: 28,
  //   marginHorizontal: 4,
  //   borderRadius: 6,
  //   backgroundColor: "#374151",
  // },

  seatSelected: {
    backgroundColor: colors.primary,
  },
  seatSold: {
    backgroundColor: "#7C2D12",
  },
  seatVip: {
    backgroundColor: "#F59E0B",
  },

  way: {
    backgroundColor: colors.bg,
  },

  legend: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    color: "#9CA3AF",
    fontSize: 12,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
  },
  total: {
    color: "#F9FAFB",
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "700",
  },
  payBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  payDisabled: {
    backgroundColor: "#374151",
  },
  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
