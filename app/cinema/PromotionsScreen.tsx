import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ================= TYPES ================= */
type PromotionStatus = "active" | "upcoming" | "expired";
type PromotionType = "promotion" | "event";

type Promotion = {
  id: number;
  title: string;
  description: string;
  time: string;
  badge: "FREE" | "HOT" | "EVENT";
  image: string;
  type: PromotionType;
  status: PromotionStatus;
  saved?: boolean;
};

/* ================= CONSTANTS ================= */
const TABS = [
  { key: "all", label: "Đang diễn ra" },
  { key: "promotion", label: "Khuyến mãi" },
  { key: "event", label: "Sự kiện" },
  { key: "upcoming", label: "Sắp diễn ra" },
];

const DATA: Promotion[] = [
  {
    id: 1,
    title: "Miễn phí combo bắp nước 🍿",
    description: "Tặng combo khi mua vé từ thứ 2 – thứ 5",
    time: "01/10 – 31/10",
    badge: "FREE",
    image: "https://images.unsplash.com/photo-1585647347384-2593bc35786b",
    type: "promotion",
    status: "active",
  },
  {
    id: 2,
    title: "Giảm 30% vé bom tấn 🔥",
    description: "Áp dụng cho thành viên Gold",
    time: "05/10 – 20/10",
    badge: "HOT",
    image:
      "https://medfit.vn/wp-content/uploads/2025/04/Banner-30-04-Giam-30.jpg",
    type: "promotion",
    status: "active",
  },
  {
    id: 3,
    title: "Suất chiếu IMAX đặc biệt 🎬",
    description: "Trải nghiệm điện ảnh đỉnh cao",
    time: "15/10",
    badge: "EVENT",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
    type: "event",
    status: "upcoming",
  },
];

/* ================= SCREEN ================= */
export default function PromotionsScreen() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [list, setList] = useState<Promotion[]>(DATA);

  const toggleSave = (id: number) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, saved: !item.saved } : item
      )
    );
  };

  const filteredData = useMemo(() => {
    return list.filter((item) => {
      const matchTab =
        activeTab === "all"
          ? item.status === "active"
          : activeTab === "upcoming"
            ? item.status === "upcoming"
            : item.type === activeTab;

      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      return matchTab && matchSearch;
    });
  }, [activeTab, search, list]);

  const savedPromos = list.filter((p) => p.saved);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>🎉 Sự kiện & Khuyến mãi</Text>
        <Text style={styles.subtitle}>Ưu đãi độc quyền dành cho bạn</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* SEARCH */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
          placeholder="Tìm khuyến mãi, sự kiện..."
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* MY PROMOS */}
      {savedPromos.length > 0 && (
        <View style={styles.myPromo}>
          <Text style={styles.sectionTitle}>🎟️ Khuyến mãi của tôi</Text>
          {savedPromos.map((item) => (
            <View key={item.id} style={styles.savedCard}>
              <Text style={styles.savedTitle}>{item.title}</Text>
              <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
            </View>
          ))}
        </View>
      )}

      {/* TABS */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LIST */}
      {filteredData.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="sad-outline" size={48} color={colors.muted} />
          <Text style={styles.emptyText}>Không có khuyến mãi phù hợp</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(i) => i.id.toString()}
          renderItem={({ item }) => (
            <PromotionCard data={item} onSave={() => toggleSave(item.id)} />
          )}
          scrollEnabled={false}
        />
      )}
      </ScrollView>
    </View>
  );
}

/* ================= CARD ================= */
function PromotionCard({
  data,
  onSave,
}: {
  data: Promotion;
  onSave: () => void;
}) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: data.image }} style={styles.image} />

      {/* SAVE */}
      <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
        <Ionicons
          name={data.saved ? "heart" : "heart-outline"}
          size={18}
          color={data.saved ? "#EF4444" : "#fff"}
        />
      </TouchableOpacity>

      {/* BADGE */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{data.badge}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.cardTitle}>{data.title}</Text>
        <Text style={styles.desc}>{data.description}</Text>

        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={14} color={colors.primary} />
          <Text style={styles.time}>{data.time}</Text>
        </View>

        <TouchableOpacity
          disabled={data.status === "expired"}
          style={[
            styles.button,
            data.status === "expired" && { backgroundColor: "#475569" },
          ]}
        >
          <Text style={styles.buttonText}>
            {data.status === "active"
              ? "Nhận ngay"
              : data.status === "upcoming"
                ? "Nhắc tôi"
                : "Hết hạn"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
  },
  header: {
    paddingBottom: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    color: "#CBD5E1",
    marginTop: 4,
  },

  searchBox: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    marginVertical: 12,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#fff",
  },

  myPromo: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
  },
  savedCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  savedTitle: { color: "#CBD5E1" },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 10,
    marginBottom: 12,
  },
  activeTab: { backgroundColor: colors.primary },
  tabText: { color: "#CBD5E1" },
  activeTabText: { color: "#fff", fontWeight: "600" },

  card: {
    backgroundColor: "#020617",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  image: { height: 170, width: "100%" },
  saveBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
    borderRadius: 20,
  },
  badge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { color: "#fff", fontSize: 12 },

  body: { padding: 12 },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  desc: { color: "#CBD5E1", marginVertical: 6 },
  timeRow: { flexDirection: "row", alignItems: "center" },
  time: { marginLeft: 6, color: colors.primary },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },

  empty: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: { color: colors.muted, marginTop: 8 },
});
