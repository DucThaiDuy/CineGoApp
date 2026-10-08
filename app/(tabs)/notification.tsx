import { colors } from "@/constants/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Platform,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const { width } = Dimensions.get("window");

type NotificationType = "promo" | "system" | "booking";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  image?: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "promo",
    title: "MUA 1 TẶNG 1 BỎNG NGÔ!",
    message: "Ưu đãi duy nhất cuối tuần này tại CineGo. Đặt vé xem phim ngay!",
    time: "2 giờ trước",
    isRead: false,
    image: "https://images.unsplash.com/photo-1594462215276-80949d63f0d2?w=800",
  },
  {
    id: "2",
    type: "booking",
    title: "ĐẶT VÉ THÀNH CÔNG!",
    message: "Bạn đã đặt thành công 2 vé cho phim 'Dune: Part Two' lúc 14:30.",
    time: "Hôm qua",
    isRead: true,
    image: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
  },
  {
    id: "3",
    type: "system",
    title: "CẬP NHẬT PHIÊN BẢN MỚI",
    message: "Ứng dụng CineGo đã có phiên bản 2.0. Hãy cập nhật để trải nghiệm giao diện mới xịn hơn nhé!",
    time: "3 ngày trước",
    isRead: true,
  },
  {
    id: "4",
    type: "promo",
    title: "GIẢM GIÁ 20% COMBO NƯỚC",
    message: "Nhập mã CINEGO20 khi đặt đồ ăn để nhận ngay ưu đãi hời.",
    time: "4 ngày trước",
    isRead: true,
  },
];

export default function NotificationScreen() {
  const [filter, setFilter] = useState<"all" | NotificationType>("all");
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);


  const filteredData = useMemo(() => {
    if (filter === "all") return mockNotifications;
    return mockNotifications.filter((i) => i.type === filter);
  }, [filter]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "promo":
        return <MaterialCommunityIcons name="gift-outline" size={24} color={colors.primary} />;
      case "booking":
        return <MaterialCommunityIcons name="ticket-confirmation-outline" size={24} color={colors.success} />;
      case "system":
        return <Ionicons name="settings-outline" size={24} color={colors.info} />;
    }
  };

  const renderItem = ({ item, index }: { item: NotificationItem; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.notifCard, !item.isRead && styles.unreadCard]}
      >
        <View style={styles.iconCircle}>
          {getIcon(item.type)}
        </View>

        <View style={styles.notifInfo}>
          <View style={styles.notifHeader}>
            <Text style={styles.notifTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>
          
          <Text style={styles.notifMsg} numberOfLines={2}>
            {item.message}
          </Text>
          
          <View style={styles.notifFooter}>
            <Text style={styles.notifTime}>{item.time}</Text>
            {item.type === "promo" && (
              <View style={styles.promoTag}>
                <Text style={styles.promoTagText}>Ưu đãi</Text>
              </View>
            )}
          </View>
        </View>

        {item.image && (
          <ExpoImage
            source={{ uri: item.image }}
            style={styles.notifImage}
            contentFit="cover"
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity style={styles.markReadBtn}>
           <Ionicons name="checkmark-done" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterBar}>
        <FilterTab label="Tất cả" active={filter === "all"} onPress={() => setFilter("all")} />
        <FilterTab label="Ưu đãi" active={filter === "promo"} onPress={() => setFilter("promo")} />
        <FilterTab label="Hệ thống" active={filter === "system"} onPress={() => setFilter("system")} />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={colors.primary} 
            colors={[colors.primary]}
            progressViewOffset={Platform.OS === "android" ? 20 : 0}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bell-off-outline" size={80} color={colors.muted} />
            <Text style={styles.emptyTitle}>Chưa có thông báo nào</Text>
            <Text style={styles.emptyText}>Mọi cập nhật mới nhất sẽ xuất hiện ở đây nhé!</Text>
          </View>
        }
      />
    </View>
  );
}

function FilterTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.filterTab, active && styles.activeFilterTab]}
    >
      <Text style={[styles.filterLabel, active && styles.activeFilterLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.bg,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  markReadBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  activeFilterTab: {
    backgroundColor: colors.primary,
  },
  filterLabel: {
    color: colors.sub,
    fontSize: 14,
    fontWeight: "600",
  },
  activeFilterLabel: {
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  notifCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
  },
  unreadCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    backgroundColor: "rgba(229, 9, 20, 0.05)",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notifInfo: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notifTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 10,
  },
  notifMsg: {
    color: colors.sub,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  notifFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  notifTime: {
    color: colors.muted,
    fontSize: 11,
  },
  promoTag: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 10,
  },
  promoTagText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "bold",
  },
  notifImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginLeft: 12,
  },
  emptyState: {
    marginTop: 100,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
});
