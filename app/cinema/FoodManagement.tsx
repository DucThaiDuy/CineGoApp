import SubHeader from "@/components/SubHeader";
import { colors } from "@/constants/colors";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

type Category = "Tất cả" | "Combo" | "Bắp" | "Nước" | "Snack";

const categories: Category[] = ["Tất cả", "Combo", "Bắp", "Nước", "Snack"];

const FOOD_DATA = [
  {
    id: "1",
    name: "Combo Couple - Phô mai",
    desc: "1 Bắp L + 2 Nước ngọt + 1 Snack",
    price: 99000,
    category: "Combo",
    image: "https://i.ibb.co/vzP6W6p/combo.png", // Attempting a better placeholder if possible, but keeping logic
    tag: "HOT",
  },
  {
    id: "2",
    name: "Combo Gia đình",
    desc: "2 Bắp L + 4 Nước ngọt + 2 Snack",
    price: 149000,
    category: "Combo",
    image: "https://i.ibb.co/vzP6W6p/combo.png",
    tag: "BEST",
  },
  {
    id: "3",
    name: "Bắp Phô Mai Đặc Biệt",
    desc: "Bắp rang bơ phô mai size L",
    price: 45000,
    category: "Bắp",
    image: "https://i.ibb.co/vzP6W6p/popcorn.png",
  },
  {
    id: "4",
    name: "Coca Cola - Size L",
    desc: "Nước ngọt có gas 500ml",
    price: 25000,
    category: "Nước",
    image: "https://i.ibb.co/vzP6W6p/coke.png",
  },
  {
    id: "5",
    name: "Snack Khoai Tây",
    desc: "Vị tôm cay đặc biệt",
    price: 30000,
    category: "Snack",
    image: "https://i.ibb.co/vzP6W6p/snack.png",
  },
];

export default function FoodManagement() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("Tất cả");

  const filteredData = useMemo(() => {
    return FOOD_DATA.filter((item) => {
      const matchCategory =
        selectedCategory === "Tất cả" || item.category.includes(selectedCategory.substring(0, 3));
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, selectedCategory]);

  return (
    <View style={styles.container}>
      {/* Background Decorative Blurs */}
      <View style={styles.blurBlob} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <SubHeader 
           title="Bắp & Nước"
           subtitle="Thêm vị cho buổi xem phim hoàn hảo"
        />

        <View style={{ height: 20 }} />

        {/* Search HUD */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.muted} />
          <TextInput
            placeholder="Tìm kiếm món ăn yêu thích..."
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Modern Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.catBtn, isActive && styles.catBtnActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.catText, isActive && styles.catTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Card */}
        <View style={styles.promoCard}>
          <LinearGradient
            colors={["rgba(229, 9, 20, 0.4)", "rgba(10, 10, 10, 0.8)"]}
            style={styles.promoGradient}
          >
            <View style={styles.promoContent}>
              <View style={styles.promoTag}>
                <Text style={styles.promoTagText}>ƯU ĐÃI THÁNG 4</Text>
              </View>
              <Text style={styles.promoTitle}>Combo Siêu Rẻ{"\n"}Giảm giá 30%</Text>
              <TouchableOpacity style={styles.claimBtn}>
                <Text style={styles.claimText}>Nhận ngay</Text>
              </TouchableOpacity>
            </View>
            <MaterialCommunityIcons name="corn" size={100} color="rgba(255,255,255,0.1)" style={styles.promoIcon} />
          </LinearGradient>
        </View>

        {/* Food Grid */}
        <View style={styles.gridContainer}>
          {filteredData.map((item) => (
            <TouchableOpacity 
               key={item.id} 
               style={styles.foodCard}
               activeOpacity={0.95}
            >
              <View style={styles.imgBox}>
                <Image 
                   source={{ uri: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png" }} 
                   style={styles.foodImg} 
                />
                {item.tag && (
                  <View style={[styles.tag, { backgroundColor: item.tag === 'HOT' ? colors.primary : colors.success }]}>
                    <Text style={styles.tagText}>{item.tag}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.cardInfo}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.desc} numberOfLines={1}>{item.desc}</Text>
                
                <View style={styles.priceRow}>
                  <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
                  <TouchableOpacity style={styles.addBtn}>
                    <Ionicons name="add" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Extreme Floating Cart */}
      <View style={[styles.cartWrapper, { bottom: insets.bottom + 20 }]}>
        <LinearGradient
          colors={["#1F2937", "#111827"]}
          style={styles.cartInner}
        >
          <View style={styles.cartLeft}>
            <View style={styles.cartBadgeBox}>
              <Ionicons name="cart" size={22} color={colors.primary} />
              <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.cartTotal}>124,000đ</Text>
              <Text style={styles.cartItems}>3 sản phẩm trong giỏ</Text>
            </View>
          </View>
          
          <TouchableOpacity 
             style={styles.checkoutBtn}
             onPress={() => router.push("/cinema/CheckoutScreen")}
          >
            <LinearGradient
              colors={[colors.primary, "#8B1014"]}
              style={styles.checkoutGradient}
            >
              <Text style={styles.checkoutText}>Đặt món</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}


import { ScrollView } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  blurBlob: {
    position: "absolute",
    top: 100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
  },
  subtitleText: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 54,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    marginLeft: 12,
    fontSize: 14,
  },
  categoryScroll: {
    paddingLeft: 20,
    paddingBottom: 24,
    gap: 12,
  },
  catBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  catBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  catText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  catTextActive: {
    color: "#fff",
  },
  promoCard: {
    marginHorizontal: 20,
    height: 160,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 32,
  },
  promoGradient: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  promoContent: {
    zIndex: 1,
  },
  promoTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  promoTagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  promoTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 28,
  },
  claimBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 16,
  },
  claimText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 12,
  },
  promoIcon: {
    position: "absolute",
    right: 10,
    bottom: -20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  foodCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.card,
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  imgBox: {
    height: 140,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    alignItems: "center",
    justifyContent: "center",
  },
  foodImg: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },
  tag: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  cardInfo: {
    padding: 16,
  },
  name: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  desc: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  price: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "900",
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cartWrapper: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 80,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  cartInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cartLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartBadgeBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1F2937",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  cartTotal: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  cartItems: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "600",
  },
  checkoutBtn: {
    borderRadius: 16,
    overflow: "hidden",
  },
  checkoutGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
});
