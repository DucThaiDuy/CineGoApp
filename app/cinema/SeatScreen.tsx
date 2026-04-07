import BookingHeader from "@/components/BookingHeader";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "../../constants/colors";
import { MOVIES } from "../../constants/movies";

const rows = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
];
const seatsPerRow = 15;

const soldSeats = ["A5", "B6", "C2"];
const vipSeats = [
  "C5", "C6", "C7", "C8", "C9", "C11", "C12", "C13", "C14", "C15",
  "D5", "D6", "D7", "D8", "D9", "D11", "D12", "D13", "D14", "D15",
];
const ways = [
  "A10", "B10", "C10", "D10", "E10", "F10", "G10", "H10", "I10", "J10", "K10", "L10", "M10", "N10", "O10",
  "H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H11", "H12", "H13", "H14", "H15",
];

export default function SeatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const movie = MOVIES.find((m) => m.id === id) || MOVIES[0];

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  const toggleSeat = (seatId: string) => {
    if (soldSeats.includes(seatId)) return;
    if (ways.includes(seatId)) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Progress & Banner */}
      <ImageBackground
        source={{ uri: movie.poster.includes('original') ? movie.poster : movie.poster.replace('w500', 'original') }}
        style={styles.headerImageBackground}
      >
        <LinearGradient 
          colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.5)", "rgba(10, 10, 10, 1)"]} 
          style={StyleSheet.absoluteFill} 
        />
        <BookingHeader 
           title="Chọn ghế"
           subtitle={`${movie.title} • CineGo Hà Nội`}
           currentStep={2}
        />
      </ImageBackground>



      {/* Screen */}
      <View style={styles.screenWrap}>
        <View style={styles.screen} />
        <Text style={styles.screenText}>MÀN HÌNH</Text>
      </View>

      <View style={styles.seatWrapper}>
        {/* CỘT SỐ GHẾ CỐ ĐỊNH */}
        {/* <View style={styles.leftColumn}>
          <View style={styles.leftColumn}>
            <Animated.View
              style={{
                transform: [{ translateY: Animated.multiply(scrollY, -1) }],
              }}
            >
              {Array.from({ length: seatsPerRow }).map((_, i) => (
                <Text key={i} style={styles.fixedSeatNumber}>
                  {i + 1}
                </Text>
              ))}
            </Animated.View>
          </View>
        </View> */}

        {/* KHU CUỘN */}
        <View style={{ flex: 1 }}>
          {/* HEADER CHỮ HÀNG */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* chữ cuộn ngang theo*/}
            <View style={styles.headerContainer}>
              <Animated.View
                style={{
                  transform: [{ translateX: Animated.multiply(scrollX, -1) }],
                }}
              >
                <View style={styles.headerRow}>
                  {rows.map((row) => (
                    <Text key={row} style={styles.headerLetter}>
                      {row}
                    </Text>
                  ))}
                </View>
              </Animated.View>
            </View>
          </ScrollView>

          {/* GHẾ */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                {Array.from({ length: seatsPerRow }).map((_, seatIndex) => (
                  <View key={seatIndex} style={styles.row}>
                    {rows.map((row) => {
                      const seatId = `${row}${seatIndex + 1}`;
                      const sold = soldSeats.includes(seatId);
                      const vip = vipSeats.includes(seatId);
                      const way = ways.includes(seatId);
                      const selected = selectedSeats.includes(seatId);

                      return (
                        <TouchableOpacity
                          key={seatId}
                          onPress={() => toggleSeat(seatId)}
                          style={[
                            styles.seat,
                            vip && styles.seatVip,
                            sold && styles.seatSold,
                            way && styles.way,
                            selected && styles.seatSelected,
                          ]}
                        >
                          {!way && (
                            <Text
                              style={[
                                styles.seatLabel,
                                sold && styles.seatLabelDisabled,
                              ]}
                            >
                              {seatId}
                            </Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollView>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <LegendItem color="#0c0c0eff" label="Lối đi" />
        <LegendItem color="#374151" label="Trống (20)" />
        <LegendItem color={colors.primary} label="Đã chọn" />
        <LegendItem color="#7C2D12" label="Đã bán" />
        <LegendItem color="#F59E0B" label="VIP" />
      </View>

      {/* Bottom */}
      <View style={styles.bottomBar}>
        {/* Ghế đã chọn */}
        <Text style={styles.seatText}>
          Ghế: {selectedSeats.length ? selectedSeats.join(", ") : "Chưa chọn"}
        </Text>
        <Text style={styles.total}>
          Tổng tiền: {selectedSeats.length * 90000}đ
        </Text>
        <TouchableOpacity
          style={[styles.payBtn, !selectedSeats.length && styles.payDisabled]}
          disabled={!selectedSeats.length}
          onPress={() =>
            router.push({
              pathname: "/cinema/ComboScreen",
              params: { seats: selectedSeats.join(",") },
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
