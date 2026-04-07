import SubHeader from "@/components/SubHeader";
import { colors } from "@/constants/colors";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";


export default function PaymentScreen() {


  const savedCards = [
    { id: "1", type: "visa", number: "**** **** **** 8899", expiry: "12/26", color: ["#6366F1", "#A855F7"] },
    { id: "2", type: "mastercard", number: "**** **** **** 1234", expiry: "08/27", color: ["#EC4899", "#E11D48"] },
  ];

  const transactions = [
    { id: "1", title: "Vé Oppenheimer", date: "20/12/2025", amount: "-120.000đ", status: "success", method: "Visa" },
    { id: "2", title: "Combo Bắp Nước", date: "20/12/2025", amount: "-85.000đ", status: "success", method: "Visa" },
    { id: "3", title: "Nạp điểm SenPay", date: "15/12/2025", amount: "+500.000đ", status: "success", method: "Momo" },
    { id: "4", title: "Vé Dune: Part Two", date: "10/12/2025", amount: "-150.000đ", status: "refunded", method: "Mastercard" },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <SubHeader title="Thanh toán" />

        <View style={styles.header}>
          <LinearGradient
            colors={[colors.primary, "#8B1014"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            <View>
              <Text style={styles.balanceLabel}>Số dư điểm SenPay</Text>
              <Text style={styles.balanceValue}>850,000 P</Text>
            </View>
            <TouchableOpacity style={styles.topUpBtn}>
              <Ionicons name="add-circle" size={24} color="#fff" />
              <Text style={styles.topUpText}>Nạp điểm</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          {/* Saved Cards Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>Phương thức đã lưu</Text>
            <TouchableOpacity>
              <Text style={styles.addBtnText}>+ Thêm mới</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsScroll}
          >
            {savedCards.map(card => (
              <LinearGradient 
                key={card.id}
                colors={card.color as [string, string, ...string[]]}
                style={styles.creditCard}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardType}>{card.type.toUpperCase()}</Text>
                  <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
                </View>
                <Text style={styles.cardNumber}>{card.number}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardHolder}>THAI DUC</Text>
                  <Text style={styles.cardExpiry}>{card.expiry}</Text>
                </View>
              </LinearGradient>
            ))}
            
            {/* Wallet Link Placeholder */}
            <TouchableOpacity style={styles.walletCard}>
              <View style={styles.walletIcon}>
                <Ionicons name="wallet-outline" size={24} color={colors.primary} />
              </View>
              <Text style={styles.walletLabel}>Liên kết ví Momo</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          </ScrollView>

          {/* Transaction History Section */}
          <Text style={[styles.sectionHeading, { marginTop: 32 }]}>Lịch sử giao dịch</Text>
          <View style={styles.transactionList}>
            {transactions.map((item, index) => (
              <View key={item.id}>
                <View style={styles.transactionItem}>
                  <View style={styles.transLeft}>
                    <View style={[styles.transIcon, { backgroundColor: item.amount.startsWith('+') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)' }]}>
                      <Ionicons 
                         name={item.amount.startsWith('+') ? "arrow-down" : "receipt-outline"} 
                         size={20} 
                         color={item.amount.startsWith('+') ? "#10B981" : "#fff"} 
                      />
                    </View>
                    <View>
                      <Text style={styles.transTitle}>{item.title}</Text>
                      <Text style={styles.transSub}>{item.date} • {item.method}</Text>
                    </View>
                  </View>
                  <View style={styles.transRight}>
                    <Text style={[styles.transAmount, item.amount.startsWith('+') && { color: "#10B981" }, item.status === 'refunded' && { textDecorationLine: 'line-through', color: colors.muted }]}>
                      {item.amount}
                    </Text>
                    <View style={[styles.statusBadge, item.status === 'refunded' && { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                      <Text style={[styles.statusText, item.status === 'refunded' && { color: colors.primary }]}>
                        {item.status === 'success' ? 'Thành công' : 'Hoàn tiền'}
                      </Text>
                    </View>
                  </View>
                </View>
                {index !== transactions.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.viewMoreBtn}>
            <Text style={styles.viewMoreText}>Xem tất cả giao dịch</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  balanceLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    fontWeight: "600",
  },
  balanceValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 4,
  },
  topUpBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
  },
  topUpText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  content: {
    paddingBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeading: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 20,
  },
  addBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  cardsScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    gap: 16,
  },
  creditCard: {
    width: 280,
    height: 160,
    borderRadius: 20,
    padding: 24,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardType: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
    fontStyle: "italic",
    letterSpacing: 1,
  },
  cardNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardHolder: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "600",
  },
  cardExpiry: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: "600",
  },
  walletCard: {
    width: 200,
    height: 160,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    gap: 12,
  },
  walletIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(229, 9, 20, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  walletLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  transactionList: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    borderRadius: 24,
    marginTop: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  transLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  transIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  transTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  transSub: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  transRight: {
    alignItems: "flex-end",
  },
  transAmount: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  statusBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  statusText: {
    color: "#10B981",
    fontSize: 10,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginHorizontal: 16,
  },
  viewMoreBtn: {
    marginTop: 20,
    alignSelf: "center",
  },
  viewMoreText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
});
