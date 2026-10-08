import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";

const REVIEWS = [
  {
    id: "1",
    user: "Nguyễn Minh",
    rating: 5,
    comment: "Phim quá đỉnh, hình ảnh mãn nhãn! Không thể tin được kỹ xảo lại chân thực đến vậy.",
    time: "2 giờ trước",
  },
  {
    id: "2",
    user: "Trần Anh",
    rating: 4,
    comment: "Nội dung ổn, nhạc hay. Rất đáng tiền ra rạp xem.",
    time: "1 ngày trước",
  },
];

export default function ReviewDetail() {
  const [myRating, setMyRating] = useState(0);
  const [comment, setComment] = useState("");

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.movieName}>Dune: Part Two</Text>
      <Text style={styles.subtext}>Bạn nghĩ sao về bộ phim này?</Text>

      {/* Rating Input */}
      <View style={styles.ratingCard}>
        <Text style={styles.cardLabel}>Đánh giá của bạn</Text>
        <View style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setMyRating(s)}
              style={styles.starBtn}
            >
              <Ionicons
                name={s <= myRating ? "star" : "star-outline"}
                size={32}
                color={s <= myRating ? colors.accent : colors.muted}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder="Viết cảm nhận của bạn về bộ phim..."
          placeholderTextColor={colors.muted}
          style={styles.input}
          multiline
          value={comment}
          onChangeText={setComment}
        />

        <TouchableOpacity
          style={[styles.submitBtn, !myRating && styles.submitDisabled]}
          disabled={!myRating}
        >
          <LinearGradient
            colors={myRating ? [colors.primary, "#B91C1C"] : [colors.card, colors.card]}
            style={styles.btnGradient}
          >
            <Text style={styles.submitText}>Gửi đánh giá ngay</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bình luận cộng đồng</Text>
        <Text style={styles.commentCount}>({REVIEWS.length})</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1A1A1D", colors.bg]} style={styles.background} />

      {/* Title Bar */}
      <View style={styles.titleBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.titleBarText}>Chi tiết Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <FlatList
          data={REVIEWS}
          ListHeaderComponent={renderHeader}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.userAvatar}>
                  <Text style={styles.avatarText}>{item.user[0]}</Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.user}>{item.user}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <View style={styles.itemRating}>
                  <Ionicons name="star" size={12} color={colors.accent} />
                  <Text style={styles.ratingText}>{item.rating}.0</Text>
                </View>
              </View>
              <Text style={styles.comment}>{item.comment}</Text>

              <View style={styles.reviewActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="heart-outline" size={18} color={colors.sub} />
                  <Text style={styles.actionText}>Hữu ích</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="share-social-outline" size={18} color={colors.sub} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  background: {
    ...StyleSheet.absoluteFill,
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "rgba(10, 10, 10, 0.8)",
  },
  titleBarText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
  },
  movieName: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtext: {
    color: colors.sub,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
  },
  ratingCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 32,
  },
  cardLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  starBtn: {
    padding: 4,
  },
  input: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
    padding: 16,
    color: colors.text,
    height: 100,
    textAlignVertical: "top",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  submitBtn: {
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  submitDisabled: {
    opacity: 0.5,
  },
  btnGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  commentCount: {
    color: colors.sub,
    fontSize: 18,
    fontWeight: "500",
  },
  reviewCard: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  user: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 15,
  },
  time: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  itemRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
  },
  comment: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    lineHeight: 22,
  },
  reviewActions: {
    flexDirection: "row",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    gap: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    color: colors.sub,
    fontSize: 12,
    fontWeight: "600",
  },
});
