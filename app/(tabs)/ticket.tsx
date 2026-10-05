import { colors } from "@/constants/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Animated, { FadeInDown, FadeInRight, Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getOfflineTickets, saveTicketsOffline } from "../../utils/storage";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/utils/api";


const { width } = Dimensions.get("window");

interface TicketType {
  id: string;
  orderId: string;
  title: string;
  poster: string;
  cinema: string;
  location: string;
  date: string;
  time: string;
  hall: string;
  seat: string[];
  price: number;
  runtime: string;
  status: "upcoming" | "used";
  bookingDate: string;
}


const TicketTab = ({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tabItem, active && styles.activeTabItem]}
  >
    <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{label}</Text>
    {active && (
      <Animated.View
        layout={Layout.springify()}
        style={styles.activeTabIndicator}
      />
    )}
  </TouchableOpacity>
);

export default function MyTicket() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [isQRZoomed, setIsQRZoomed] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"upcoming" | "used">("upcoming");
  const [searchText, setSearchText] = useState("");
  const insets = useSafeAreaInsets();

  // Load and sync tickets
  React.useEffect(() => {
    const loadTickets = async () => {
      // 1. Try to load from offline first
      const offlineData = await getOfflineTickets();
      if (offlineData.length > 0) {
        setTickets(offlineData);
      }

      // 2. Gọi API thực tế
      try {
        const token = await AsyncStorage.getItem("@user_token");
        if (!token) {
          setIsOffline(true);
          return;
        }

        // Thay vì gọi /api/admin/... (dành cho admin), ta sẽ gọi API dành riêng cho user
        // Chú ý: Cần tạo UserBookingController ở Backend nhé (mình hướng dẫn bên dưới)
        const response = await api.get(`/bookings/my-tickets`);
        const apiData = response.data.data;

        // Map dữ liệu từ backend về format của TicketType trên App
        const mappedTickets: TicketType[] = apiData.map((item: any) => ({
          id: item.id.toString(),
          orderId: item.bookingCode,
          title: item.movieName || "Movie", // Tuỳ thuộc backend trả về
          poster: item.poster || "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", 
          cinema: "CineGo",
          location: "Rạp chiếu",
          date: item.createdAt.substring(0, 10),
          time: item.createdAt.substring(11, 16),
          hall: "Sảnh",
          seat: item.seats?.map((s: any) => s.seatCode) || [],
          price: item.totalAmount,
          runtime: "N/A",
          status: item.status === "USED" ? "used" : "upcoming",
          bookingDate: item.createdAt,
        }));

        setTickets(mappedTickets);
        await saveTicketsOffline(mappedTickets);
        setIsOffline(false);
      } catch (error) {
        console.error("Fetch tickets error:", error);
        console.log("Offline mode: Using cached tickets.");
        setIsOffline(true);
        console.log("Offline mode: Using cached tickets.");
        setIsOffline(true);
        Toast.show({
          type: "info",
          text1: "Chế độ ngoại tuyến",
          text2: "Bạn đang xem vé đã được lưu trong máy.",
          position: "bottom",
        });
      }
    };

    loadTickets();
  }, []);



  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchText.toLowerCase()) ||
        ticket.cinema.toLowerCase().includes(searchText.toLowerCase());
      const matchesFilter = ticket.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [tickets, searchText, filterStatus]);

  const renderTicketItem = ({ item, index }: { item: TicketType; index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(500)}
      style={styles.ticketWrapper}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setSelectedTicket(item)}
        style={styles.ticketCard}
      >
        <View style={styles.ticketMain}>
          <View style={styles.ticketHeaderContent}>
            <Text style={styles.movieTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.cinemaRow}>
              <Ionicons name="location-sharp" size={14} color={colors.primary} />
              <Text style={styles.cinemaName}>{item.cinema}</Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>NGÀY</Text>
              <Text style={styles.detailValue}>{item.date}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>GIỜ CHIẾU</Text>
              <Text style={styles.detailValue}>{item.time}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>GHẾ</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {item.seat.join(", ")}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>PHÒNG</Text>
              <Text style={styles.detailValue}>{item.hall}</Text>
            </View>
          </View>

          {/* Punch holes effect */}
          <View style={styles.punchHoleLeft} />
          <View style={styles.punchHoleRight} />
          <View style={styles.dashLine} />
        </View>

        <View style={styles.ticketPortion}>
          <ExpoImage
            source={{ uri: item.poster }}
            style={styles.ticketPoster}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.posterOverlay}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={24} color="#fff" />
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        style={styles.headerGradient}
      />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View>
          <Text style={styles.titleText}>Vé của bạn</Text>
          {isOffline && (
            <View style={styles.offlineBadge}>
              <Ionicons name="cloud-offline-outline" size={12} color="#fff" />
              <Text style={styles.offlineText}>Ngoại tuyến</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color={colors.muted} style={styles.searchIcon} />
        <TextInput
          placeholder="Tìm phim, rạp chiếu..."
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.tabsContainer}>
        <TicketTab
          label="Sắp diễn ra"
          active={filterStatus === "upcoming"}
          onPress={() => setFilterStatus("upcoming")}
        />
        <TicketTab
          label="Đã xem"
          active={filterStatus === "used"}
          onPress={() => setFilterStatus("used")}
        />
      </View>

      {filteredTickets.length > 0 ? (
        <FlatList
          data={filteredTickets}
          keyExtractor={(item) => item.id}
          renderItem={renderTicketItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Animated.View entering={FadeInDown} style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <MaterialCommunityIcons
              name="ticket-confirmation-outline"
              size={100}
              color={colors.muted}
            />
          </View>
          <Text style={styles.emptyTitle}>Chưa có vé nào</Text>
          <Text style={styles.emptySubtitle}>
            Hãy chọn một bộ phim yêu thích và đặt vé ngay nhé!
          </Text>
          <TouchableOpacity style={styles.bookNowBtn}>
            <Text style={styles.bookNowBtnText}>Đặt vé ngay</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Detail Modal */}
      {selectedTicket && (
        <Modal
          visible={!!selectedTicket}
          transparent
          animationType="fade"
          onRequestClose={() => {
            setSelectedTicket(null);
            setIsQRZoomed(false);
          }}
        >
          <View style={styles.modalBackdrop}>
            <TouchableOpacity
              activeOpacity={1}
              style={StyleSheet.absoluteFill}
              onPress={() => {
                setSelectedTicket(null);
                setIsQRZoomed(false);
              }}
            />
            
            {isQRZoomed ? (
              <Animated.View entering={FadeInDown} style={styles.zoomedQRContainer}>
                <TouchableOpacity 
                   activeOpacity={1}
                   onPress={() => setIsQRZoomed(false)}
                   style={styles.zoomedQRContent}
                >
                  <View style={styles.zoomedQRWrapper}>
                    <QRCode
                      value={selectedTicket.orderId}
                      size={width * 0.7}
                      color="#000"
                    />
                    <Text style={styles.zoomedOrderIdText}>{selectedTicket.orderId}</Text>
                  </View>
                  <Text style={styles.tapToCloseText}>Chạm để quay lại</Text>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInRight} style={styles.modalContent}>
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.modalScrollContent}
                >
                  <View style={styles.modalTicketCard}>
                    <ExpoImage
                      source={{ uri: selectedTicket.poster }}
                      style={styles.modalPoster}
                      contentFit="cover"
                    />
                    <View style={styles.modalTicketInfo}>
                      <Text style={styles.modalMovieTitle}>{selectedTicket.title}</Text>
                      <View style={styles.modalBadgeRow}>
                        <View style={styles.modalBadge}>
                          <Text style={styles.modalBadgeText}>{selectedTicket.runtime}</Text>
                        </View>
                        <View style={styles.modalBadge}>
                          <Text style={styles.modalBadgeText}>{selectedTicket.hall}</Text>
                        </View>
                      </View>

                      <View style={styles.modalDashed} />

                      <View style={styles.modalDetailsRow}>
                        <View style={styles.modalDetailBlock}>
                          <Text style={styles.modalDetailLabel}>NGÀY</Text>
                          <Text style={styles.modalDetailValue}>{selectedTicket.date}</Text>
                        </View>
                        <View style={styles.modalDetailBlock}>
                          <Text style={styles.modalDetailLabel}>GIỜ</Text>
                          <Text style={styles.modalDetailValue}>{selectedTicket.time}</Text>
                        </View>
                      </View>

                      <View style={styles.modalDetailsRow}>
                        <View style={styles.modalDetailBlock}>
                          <Text style={styles.modalDetailLabel}>CHỖ NGỒI</Text>
                          <Text style={styles.modalDetailValue}>
                            {selectedTicket.seat.join(", ")}
                          </Text>
                        </View>
                        <View style={styles.modalDetailBlock}>
                          <Text style={styles.modalDetailLabel}>RẠP CHIẾU</Text>
                          <Text style={styles.modalDetailValue} numberOfLines={2}>
                            {selectedTicket.cinema}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity 
                         activeOpacity={0.8}
                         onPress={() => setIsQRZoomed(true)}
                         style={styles.qrContainer}
                      >
                        <QRCode
                          value={selectedTicket.orderId}
                          size={140}
                          backgroundColor="transparent"
                          color="#000"
                        />
                        <Text style={styles.orderIdText}>{selectedTicket.orderId}</Text>
                      </TouchableOpacity>

                      <Text style={styles.scanNotice}>
                        Quét mã này tại cổng soát vé (Chạm để phóng to)
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => setSelectedTicket(null)}
                    style={styles.closeModalBtn}
                  >
                    <Ionicons name="close" size={28} color="#fff" />
                  </TouchableOpacity>
                </ScrollView>
              </Animated.View>
            )}
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    opacity: 0.2,
  },
  header: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    color: colors.sub,
    fontSize: 14,
  },
  titleText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: colors.card,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 50,
  },
  offlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F59E0B",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
    gap: 4,
  },
  offlineText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  tabItem: {
    paddingVertical: 12,
    marginRight: 25,
    position: "relative",
  },
  activeTabItem: {},
  tabLabel: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: "600",
  },
  activeTabLabel: {
    color: colors.primary,
  },
  activeTabIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  ticketWrapper: {
    marginBottom: 20,
  },
  ticketCard: {
    flexDirection: "row",
    height: 180,
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  ticketMain: {
    flex: 2,
    padding: 15,
    justifyContent: "space-between",
    position: "relative",
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.05)",
  },
  ticketHeaderContent: {
    marginBottom: 10,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cinemaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cinemaName: {
    color: colors.sub,
    fontSize: 13,
    marginLeft: 4,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailItem: {
    width: "50%",
    marginBottom: 8,
  },
  detailLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  detailValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  dashLine: {
    position: "absolute",
    right: -1,
    top: 20,
    bottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderStyle: "dashed",
    zIndex: 10,
  },
  punchHoleLeft: {
    position: "absolute",
    right: -10,
    top: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.bg,
    zIndex: 20,
  },
  punchHoleRight: {
    position: "absolute",
    right: -10,
    bottom: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.bg,
    zIndex: 20,
  },
  ticketPortion: {
    flex: 1,
    position: "relative",
  },
  ticketPoster: {
    width: "100%",
    height: "100%",
  },
  posterOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 50,
  },
  emptyIconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.03)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emptySubtitle: {
    color: colors.muted,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
  },
  bookNowBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 35,
    paddingVertical: 15,
    borderRadius: 30,
  },
  bookNowBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    alignItems: "center",
  },
  modalTicketCard: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 30,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  modalPoster: {
    width: "100%",
    height: 300,
  },
  modalTicketInfo: {
    padding: 25,
    alignItems: "center",
  },
  modalMovieTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  modalBadgeRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  modalBadge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  modalBadgeText: {
    color: colors.sub,
    fontSize: 12,
    fontWeight: "bold",
  },
  modalDashed: {
    width: "100%",
    height: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderStyle: "dashed",
    marginVertical: 20,
  },
  modalDetailsRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 15,
  },
  modalDetailBlock: {
    flex: 1,
  },
  modalDetailLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  modalDetailValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  qrContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
  },
  orderIdText: {
    color: "#000",
    marginTop: 10,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  scanNotice: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 20,
    textAlign: "center",
  },
  closeModalBtn: {
    marginTop: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalScrollContent: {
    paddingBottom: 40,
    alignItems: "center",
    width: width - 40,
  },
  zoomedQRContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  zoomedQRContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomedQRWrapper: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 30,
    alignItems: "center",
  },
  zoomedOrderIdText: {
    color: "#000",
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 3,
  },
  tapToCloseText: {
    color: colors.sub,
    marginTop: 40,
    fontSize: 14,
  },
});
