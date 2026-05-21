import BookingHeader from "@/components/BookingHeader";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type PaymentMethod = "MoMo" | "ZaloPay" | "VNPay" | "ATM/Visa";

export default function CheckoutScreen() {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("MoMo");

  // thông báo thành công
  const handlePayment = async () => {
    // 1. Giả lập gọi API Backend (Cinema-Api)
    console.log(`Đang khởi tạo thanh toán qua ${selectedPayment}...`);
    
    // Giả lập Response từ API
    const mockApiResponse = {
      status: 200,
      data: {
        bookingCode: "BK20240407-882",
        paymentUrl: selectedPayment === "MoMo" ? "https://test-payment.momo.vn/v2/gateway/api/create" : 
                    selectedPayment === "ZaloPay" ? "https://qc-gateway.zalopay.vn/open/create-order" :
                    selectedPayment === "VNPay" ? "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html" : null
      }
    };

    if (mockApiResponse.data.paymentUrl) {
      // 2. Nếu có URL thanh toán (Ví điện tử), mở trình duyệt để thanh toán
      await WebBrowser.openBrowserAsync(mockApiResponse.data.paymentUrl);
      
      Toast.show({
        type: "success",
        text1: "Đang chuyển hướng...",
        text2: `Đang mở cổng thanh toán ${selectedPayment}`,
        position: "top",
      });
    } else {
      // 3. Nếu là ATM/Visa hoặc thanh toán trực tiếp
      Toast.show({
        type: "success",
        text1: "Thành công!",
        text2: "Vui lòng kiểm tra email để nhận vé.",
        position: "top",
        visibilityTime: 3000,
      });
      
      setTimeout(() => router.push("/(tabs)/ticket"), 2000);
    }
  };

  const ticketInfo = {
    movie: "Avatar 3",
    cinema: "CienGo Hà Nội",
    time: "19:30 - T2, 18/12",
    seats: ["A5", "A6"],
    combos: [
      { name: "Bắp rang bơ", qty: 1, price: 60000 },
      { name: "Bắp rang bơ", qty: 1, price: 45000 },
      { name: "Combo Family", qty: 1, price: 220000 },
    ],
  };

  const totalPrice = ticketInfo.combos.reduce(
    (sum, c) => sum + c.qty * c.price,
    0
  );

  const paymentMethods: { id: PaymentMethod; name: string; logo: string }[] = [
    { 
      id: "MoMo", 
      name: "Ví MoMo", 
      logo: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" 
    },
    { 
      id: "ZaloPay", 
      name: "ZaloPay", 
      logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" 
    },
    { 
      id: "VNPay", 
      name: "VNPAY-QR", 
      logo: "https://vnpay.vn/wp-content/uploads/2020/07/Logo-VNPAYQR-1.png" 
    },
    { 
      id: "ATM/Visa", 
      name: "Thẻ ATM / Visa / Master", 
      logo: "https://cdn-icons-png.flaticon.com/512/349/349221.png" 
    },
  ];

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
           title="Thanh toán"
           subtitle={`${ticketInfo.movie} • Bước cuối cùng`}
           currentStep={4}
        />
      </ImageBackground>


      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 160 }}>
        {/* THÔNG TIN ĐẶT VÉ */}
        <View style={styles.ticketCard}>
          <Text style={styles.sectionTitle}>Thông tin đặt vé</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Phim</Text>
            <Text style={styles.value}>{ticketInfo.movie}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Rạp</Text>
            <Text style={styles.value}>{ticketInfo.cinema}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Suất chiếu</Text>
            <Text style={styles.value}>{ticketInfo.time}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ghế</Text>
            <Text style={styles.value}>{ticketInfo.seats.join(", ")}</Text>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
            Combo đồ ăn
          </Text>
          {ticketInfo.combos.map((c, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.label}>{`${c.name} x${c.qty}`}</Text>
              <Text style={styles.value}>{c.price.toLocaleString()}đ</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng tiền</Text>
            <Text style={styles.totalValue}>
              {totalPrice.toLocaleString()}đ
            </Text>
          </View>
        </View>

        {/* PHƯƠNG THỨC THANH TOÁN */}
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <View style={styles.paymentCard}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentRow, 
                selectedPayment === method.id && styles.paymentRowSelected
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.paymentLeft}>
                <Image source={{ uri: method.logo }} style={styles.paymentLogo} />
                <Text style={styles.paymentText}>{method.name}</Text>
              </View>
              
              <View
                style={[
                  styles.radioOuter,
                  selectedPayment === method.id && styles.radioSelected,
                ]}
              >
                {selectedPayment === method.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* NÚT XÁC NHẬN THANH TOÁN */}
      <TouchableOpacity style={{ margin: 16 }} onPress={handlePayment}>
        <LinearGradient
          colors={[colors.primary, colors.primary]}
          style={{ padding: 12, borderRadius: 8 }}
        >
          <Text
            style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}
          >
            Xác nhận thanh toán
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerImageBackground: {
    paddingBottom: 10,
    overflow: "hidden",
  },

  ticketCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 8,
    color: colors.text,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: { color: colors.sub, fontSize: 13 },
  value: { color: colors.text, fontSize: 13, fontWeight: "600" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 8,
  },
  totalLabel: { fontWeight: "700", color: colors.text, fontSize: 14 },
  totalValue: { fontWeight: "700", fontSize: 14, color: colors.primary },

  paymentCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  paymentRowSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#fff",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: { borderColor: colors.primary },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  paymentText: { fontSize: 14, color: colors.text, fontWeight: "500" },

  payBtn: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 16,
  },
  payGradient: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  payText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
