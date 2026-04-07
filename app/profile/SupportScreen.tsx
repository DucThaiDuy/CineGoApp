import SubHeader from "@/components/SubHeader";
import { colors } from "@/constants/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";


export default function SupportScreen() {

  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    { question: "Làm sao để đặt vé online?", answer: "Bạn có thể chọn phim, rạp chiếu, suất chiếu và thực hiện thanh toán trực tiếp trên ứng dụng." },
    { question: "Tôi có thể hủy vé và hoàn tiền không?", answer: "Theo quy định, vé đã mua không thể hoàn tiền nhưng có thể đổi suất chiếu trước 2 giờ." },
    { question: "Quyền lợi của thành viên VIP là gì?", answer: "Thành viên VIP nhận được ưu đãi giảm giá bắp nước và tích lũy điểm thưởng cao hơn." },
    { question: "Làm sao để xuất hóa đơn VAT?", answer: "Bạn có thể đăng ký xuất hóa đơn tại quầy vé trước khi suất chiếu bắt đầu." },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <SubHeader 
           title="Hỗ trợ"
           subtitle="Chúng tôi có thể giúp gì cho bạn?"
        />

        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={colors.muted} />
            <TextInput 
              placeholder="Tìm kiếm câu hỏi..." 
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.content}>
          {/* Support Channels */}
          <View style={styles.channelRow}>
            <TouchableOpacity style={styles.channelCard}>
              <View style={[styles.channelIcon, { backgroundColor: "rgba(229, 9, 20, 0.1)" }]}>
                <Ionicons name="call" size={24} color={colors.primary} />
              </View>
              <Text style={styles.channelLabel}>Hotline</Text>
              <Text style={styles.channelSub}>1900 1234</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.channelCard}>
              <View style={[styles.channelIcon, { backgroundColor: "rgba(59, 130, 246, 0.1)" }]}>
                <MaterialCommunityIcons name="facebook-messenger" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.channelLabel}>Chat</Text>
              <Text style={styles.channelSub}>Phản hồi ngay</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.channelCard}>
              <View style={[styles.channelIcon, { backgroundColor: "rgba(16, 185, 129, 0.1)" }]}>
                <Ionicons name="mail" size={24} color="#10B981" />
              </View>
              <Text style={styles.channelLabel}>Email</Text>
              <Text style={styles.channelSub}>Hỗ trợ 24/7</Text>
            </TouchableOpacity>
          </View>

          {/* FAQ Section */}
          <Text style={styles.sectionHeading}>Câu hỏi thường gặp</Text>
          <View style={styles.faqList}>
            {faqs.map((faq, index) => (
              <FaqItem 
                key={index} 
                question={faq.question} 
                answer={faq.answer} 
                showBorder={index !== faqs.length - 1} 
              />
            ))}
          </View>

          {/* Feedback Form Link */}
          <TouchableOpacity style={styles.feedbackBanner}>
            <LinearGradient
              colors={["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.02)"]}
              style={styles.feedbackGradient}
            >
              <View style={styles.feedbackLeft}>
                <Ionicons name="chatbox-ellipses-outline" size={24} color={colors.primary} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.feedbackTitle}>Gửi ý kiến phản hồi</Text>
                  <Text style={styles.feedbackSub}>Hãy cho chúng tôi biết trải nghiệm của bạn</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function FaqItem({ question, answer, showBorder }: { question: string, answer: string, showBorder: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TouchableOpacity 
        style={styles.faqItem} 
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.faqHeader}>
          <Text style={styles.faqQuestion}>{question}</Text>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={18} 
            color={colors.muted} 
          />
        </View>
        {isExpanded && (
          <Text style={styles.faqAnswer}>{answer}</Text>
        )}
      </TouchableOpacity>
      {showBorder && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  titleText: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  subtitleText: {
    color: colors.sub,
    fontSize: 14,
    marginTop: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    marginLeft: 12,
    fontSize: 15,
  },
  content: {
    paddingHorizontal: 20,
  },
  channelRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  channelCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  channelIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  channelLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  channelSub: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 4,
  },
  sectionHeading: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
  faqList: {
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 24,
  },
  faqItem: {
    padding: 16,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    paddingRight: 10,
  },
  faqAnswer: {
    color: colors.sub,
    fontSize: 14,
    marginTop: 12,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginHorizontal: 16,
  },
  feedbackBanner: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  feedbackGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  feedbackLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  feedbackTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  feedbackSub: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
});
