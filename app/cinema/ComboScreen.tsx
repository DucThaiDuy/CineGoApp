// import { LinearGradient } from "expo-linear-gradient";
import BookingHeader from "@/components/BookingHeader";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


type SelectedCombo = {
  id: number;
  qty: number;
  price: number;
};
type ComboItemProps = {
  id: number;
  title: string;
  desc: string;
  price: string;
  oldPrice: string;
  onChange: (qty: number, price: number) => void;
};
const freeCombo = {
  id: 0,
  title: "Nước ngọt miễn phí",
  desc: "1 Nước ngọt (M) · Tặng kèm vé",
  price: "35.000 đ",
  isFree: true,
};

const combos = [
  {
    id: 1,
    title: "Combo Couple",
    desc: "2 Bắp rang bơ · 2 Nước ngọt (L)",
    price: "150.000đ",
    oldPrice: "180.000đ",
    image: "https://e.khoahoc.tv/photos/image/2020/11/26/bong-ngo-3.jpg", // hình local
  },
  {
    id: 2,
    title: "Combo Solo",
    desc: "1 Bắp rang bơ · 1 Nước ngọt (M)",
    price: "75.000đ",
    oldPrice: "90.000đ",
    image: "https://e.khoahoc.tv/photos/image/2020/11/26/bong-ngo-3.jpg",
  },
];

const singleItems = [
  {
    id: 100,
    title: "Nước ngọt (M)",
    price: 20000,
    image: "https://e.khoahoc.tv/photos/image/2020/11/26/bong-ngo-3.jpg",
  },
  {
    id: 101,
    title: "Bắp rang bơ (L)",
    price: 35000,
    image: "https://e.khoahoc.tv/photos/image/2020/11/26/bong-ngo-3.jpg",
  },
  {
    id: 102,
    title: "Nước ngọt (M)",
    price: 20000,
    image: "https://e.khoahoc.tv/photos/image/2020/11/26/bong-ngo-3.jpg",
  },
  {
    id: 103,
    title: "Bắp rang bơ (L)",
    price: 35000,
    image: "https://e.khoahoc.tv/photos/image/2020/11/26/bong-ngo-3.jpg",
  },
];

export default function ComboScreen() {
  const [comboList, setComboList] = useState<typeof combos>([]);
  const [selectedCombos, setSelectedCombos] = useState<SelectedCombo[]>([]);

  const totalQty = useMemo(
    () => selectedCombos.reduce((sum, c) => sum + c.qty, 0),
    [selectedCombos]
  );

  const totalPrice = useMemo(
    () => selectedCombos.reduce((sum, c) => sum + c.qty * c.price, 0),
    [selectedCombos]
  );

  const handleQtyChange = (id: number, delta: number, price: number) => {
    setSelectedCombos((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (!existing && delta > 0) return [...prev, { id, qty: 1, price }];
      if (existing) {
        const newQty = Math.max(existing.qty + delta, 0);
        return newQty === 0
          ? prev.filter((c) => c.id !== id)
          : prev.map((c) => (c.id === id ? { ...c, qty: newQty } : c));
      }
      return prev;
    });
  };

  useEffect(() => {
    setComboList(combos);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header with Progress */}
      <ImageBackground
        source={{ uri: "https://image.tmdb.org/t/p/original/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" }}
        style={styles.headerImageBackground}
      >
        <LinearGradient 
          colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.4)", "rgba(15,15,18,1)"]} 
          style={StyleSheet.absoluteFill} 
        />
        <BookingHeader 
           title="Chọn Combo"
           subtitle="Oppenheimer • Thưởng thức đồ ăn xem phim"
           currentStep={3}
        />
      </ImageBackground>


      <ScrollView contentContainerStyle={styles.content}>
        {/* FREE COMBO */}
        <Text style={styles.sectionTitle}>
          <Text>
            <Ionicons name="pricetag-outline" size={24} />
          </Text>
          <Text> Miễn phí cho bạn</Text>
        </Text>
        {freeCombo && (
          <View style={styles.freeCard}>
            <Text style={styles.comboName}>{freeCombo.title}</Text>
            <Text style={styles.comboDesc}>{freeCombo.desc}</Text>

            <View style={styles.freeRow}>
              <Text style={styles.freePrice}>
                {freeCombo.isFree ? freeCombo.price : freeCombo.price}
              </Text>
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>MIỄN PHÍ</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.freeBtn}
              onPress={() => {
                setSelectedCombos((prev) => {
                  const exists = prev.find((c) => c.id === freeCombo.id);
                  if (exists) return prev; // tránh nhận nhiều lần
                  return [...prev, { id: freeCombo.id, qty: 1, price: 0 }];
                });
              }}
            >
              <Text style={styles.freeBtnText}>
                {selectedCombos.some((c) => c.id === freeCombo.id)
                  ? "Đã nhận (1)"
                  : "Nhận miễn phí"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* COMBO TIẾT KIỆM */}
        <Text style={styles.sectionTitle}>
          <Text>
            <Ionicons name="flame-outline" size={24} />
          </Text>
          <Text> Combo tiết kiệm</Text>
        </Text>

        {comboList.map((item) => (
          <ComboItem
            key={item.id}
            id={item.id}
            title={item.title}
            desc={item.desc}
            price={item.price}
            oldPrice={item.oldPrice}
            onChange={(qty: number, price: number) => {
              setSelectedCombos((prev: SelectedCombo[]) => {
                const filtered = prev.filter((c) => c.id !== item.id);
                if (qty === 0) return filtered;
                return [...filtered, { id: item.id, qty, price }];
              });
            }}
            // bạn cần thêm dòng này:
            image={item.image}
          />
        ))}

        <Text style={styles.sectionTitle}>
          <Text>
            <Ionicons name="fast-food-outline" size={24} />
          </Text>
          <Text> Món lẻ</Text>
        </Text>

        <View style={styles.singleItemsContainer}>
          {singleItems.map((item) => (
            <View key={item.id} style={styles.singleItemCard}>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                />
              )}
              <Text style={styles.comboName}>{item.title}</Text>
              <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>

              <View style={styles.qtyBox}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => handleQtyChange(item.id, -1, item.price)}
                >
                  <Text>-</Text>
                </TouchableOpacity>

                <Text style={styles.qty}>
                  {selectedCombos.find((c) => c.id === item.id)?.qty || 0}
                </Text>

                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => handleQtyChange(item.id, 1, item.price)}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerText}>Combo đã chọn ({totalQty})</Text>

          <Text style={styles.footerPrice}>
            {totalQty > 0 ? `${totalPrice.toLocaleString()}đ` : "0đ"}
          </Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <TouchableOpacity
            disabled={totalQty === 0}
            activeOpacity={totalQty === 0 ? 1 : 0.8}
            onPress={
              () =>
                router.push({
                  pathname: "/cinema/CheckoutScreen",
                  params: { seats: selectedCombos.join(",") },
                })

              // console.log("Tiếp tục")
            }
            style={[
              styles.continueBtn,
              totalQty === 0 && styles.continueDisabled,
            ]}
          >
            <Text
              style={[
                styles.continueText,
                totalQty === 0 && styles.continueTextDisabled,
              ]}
            >
              TIẾP TỤC
            </Text>
          </TouchableOpacity>
          {/* 
          <TouchableOpacity>
            <Text style={styles.skipText}>Bỏ qua, không mua Combo</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
}

import { Image } from "react-native";

function ComboItem({ title, desc, price, oldPrice, image, onChange }: any) {
  const [qty, setQty] = useState(0);
  const priceNumber = Number(price.replace(/\D/g, ""));

  const increase = () => {
    const newQty = qty + 1;
    setQty(newQty);
    onChange(newQty, priceNumber);
  };
  const decrease = () => {
    if (qty === 0) return;
    const newQty = qty - 1;
    setQty(newQty);
    onChange(newQty, priceNumber);
  };

  return (
    <View style={styles.comboCard}>
      {image && <Image source={{ uri: image }} style={styles.comboImage} />}
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.comboName}>{title}</Text>
        <Text style={styles.comboDesc}>{desc}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.oldPrice}>{oldPrice}</Text>
        </View>
      </View>

      <View style={styles.qtyBox}>
        <TouchableOpacity style={styles.qtyBtn} onPress={decrease}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={styles.qty}>{qty}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={increase}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F12",
  },

  headerImageBackground: {
    paddingBottom: 10,
    overflow: "hidden",
  },

  content: { padding: 16, paddingBottom: 80 },
  comboImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    resizeMode: "cover",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#FFFFFF",
  },

  /* FREE COMBO */
  freeCard: {
    backgroundColor: "#1C1C21",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.sub,
  },

  comboName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  comboDesc: {
    fontSize: 13,
    color: "#B0B0B5",
    marginTop: 4,
  },

  freeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  freePrice: {
    color: colors.sub,
    fontWeight: "600",
    textDecorationLine: "line-through",
  },

  freeBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  freeBadgeText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "700",
  },

  freeBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },

  freeBtnText: {
    color: colors.sub,
    fontWeight: "700",
  },

  /* COMBO CARD */
  comboCard: {
    flexDirection: "row",
    backgroundColor: "#1C1C21",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A30",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  price: {
    color: colors.primary,
    fontWeight: "800",
    marginRight: 8,
  },

  oldPrice: {
    color: "#6B6B75",
    textDecorationLine: "line-through",
    fontSize: 12,
  },

  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.sub,
    alignItems: "center",
    justifyContent: "center",
  },

  qty: {
    marginHorizontal: 8,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // món lẻ
  singleItemsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  singleItemCard: {
    width: "48%", // mỗi item chiếm gần nửa màn hình, để 2 cột
    backgroundColor: "#1C1C21",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.sub,
    alignItems: "center",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#0F0F12",
    borderTopWidth: 1,
    borderColor: "#2A2A30",
  },

  footerText: {
    color: "#B0B0B5",
    fontSize: 13,
  },

  footerPrice: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },

  continueBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },

  continueText: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 14,
  },

  continueDisabled: {
    backgroundColor: "#3A3A3F",
    opacity: 0.6,
  },

  continueTextDisabled: {
    color: "#9A9AA0",
  },
  // skipText: {
  //   marginTop: 6,
  //   fontSize: 12,
  //   color: "#9A9AA0",
  //   textDecorationLine: "underline",
  // },
});
