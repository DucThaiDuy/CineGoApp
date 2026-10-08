import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("vi");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const languages = [
    { code: "vi", label: "Tiếng Việt", flag: "https://flagcdn.com/w20/vn.png" },
    { code: "en", label: "English", flag: "https://flagcdn.com/w20/gb.png" },
  ];

  // Menu items grouped
  const accountMenu = [
    { key: "ticket", title: "Vé của tôi", icon: "ticket-outline" },
    { key: "favorite", title: "Phim yêu thích", icon: "heart-outline" },
    { key: "payment", title: "Thanh toán", icon: "card-outline" },
  ];

  const appMenu = [
    { key: "notification", title: "Thông báo", icon: "notifications-outline" },
    { key: "settings", title: "Cài đặt", icon: "settings-outline" },
    { key: "help", title: "Hỗ trợ", icon: "help-circle-outline" },
  ];

  const handleLogout = async () => {
    try {
      setConfirmVisible(false);
      // Xóa sạch dấu vết đăng nhập
      await AsyncStorage.multiRemove(["@user_token", "@user_info"]);
      router.replace("/auth/login" as any);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={["rgba(229, 9, 20, 0.3)", "transparent"]}
        style={styles.headerGlow}
      />
      <View style={[styles.titleRow, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.pageTitle}>Tài khoản</Text>
        <TouchableOpacity 
           style={styles.editBtn}
           onPress={() => router.push("/profile/EditProfile")}
        >
          <Ionicons name="create-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            style={styles.avatar}
          />
          <View style={styles.vipBadgeSmall}>
            <Ionicons name="star" size={10} color="#000" />
          </View>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.name}>Thái Đức</Text>
          <Text style={styles.email}>ducdev@gmail.com</Text>
        </View>
      </View>

      {/* Account Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Vé đã mua</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>Yêu thích</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>850</Text>
          <Text style={styles.statLabel}>Điểm sen</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        data={[]}
        renderItem={null}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={colors.primary} 
            colors={[colors.primary]}
            progressViewOffset={Platform.OS === "android" ? 20 : 0}
          />
        }
        ListFooterComponent={
          <View style={styles.menuContainer}>
            {/* Account Section */}
            <Text style={styles.sectionHeading}>Tài khoản</Text>
            <View style={styles.menuCard}>
              {accountMenu.map((item, index) => (
                <MenuItem
                  key={item.key}
                  icon={item.icon}
                  title={item.title}
                  showBorder={index !== accountMenu.length - 1}
                  onPress={() => {
                    if (item.key === "ticket") router.push("/ticket");
                    else if (item.key === "favorite") router.push("/movie/FavoriteMovies");
                    else if (item.key === "payment") router.push("/profile/PaymentScreen");
                    else console.log(item.title);
                  }}
                />
              ))}
            </View>

            {/* App Settings Section */}
            <Text style={styles.sectionHeading}>Cài đặt ứng dụng</Text>
            <View style={styles.menuCard}>
              {/* Dark Mode Switch */}
              <View style={styles.menuRow}>
                <View style={styles.rowLeft}>
                  <View style={[styles.iconBox, { backgroundColor: "rgba(139, 92, 246, 0.1)" }]}>
                    <Ionicons name="moon" size={18} color="#8B5CF6" />
                  </View>
                  <Text style={styles.menuText}>Chế độ tối</Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  thumbColor={darkMode ? colors.primary : "#9CA3AF"}
                  trackColor={{ false: "#374151", true: "rgba(229, 9, 20, 0.3)" }}
                />
              </View>
              <View style={styles.menuDivider} />

              {/* Language Selector */}
              <View style={styles.menuRow}>
                <View style={styles.rowLeft}>
                  <View style={[styles.iconBox, { backgroundColor: "rgba(16, 185, 129, 0.1)" }]}>
                    <Ionicons name="language" size={18} color="#10B981" />
                  </View>
                  <Text style={styles.menuText}>Ngôn ngữ</Text>
                </View>
                <View style={styles.langSelector}>
                  {languages.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      onPress={() => setSelectedLanguage(lang.code)}
                      style={[
                        styles.langPill,
                        selectedLanguage === lang.code && styles.langPillActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.langText,
                          selectedLanguage === lang.code && styles.langTextActive,
                        ]}
                      >
                        {lang.code.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.menuDivider} />

              {appMenu.map((item, index) => (
                <MenuItem
                  key={item.key}
                  icon={item.icon}
                  title={item.title}
                  showBorder={index !== appMenu.length - 1}
                  onPress={() => {
                    if (item.key === "notification") router.push("/notification");
                    else if (item.key === "settings") router.push("/profile/SettingsScreen");
                    else if (item.key === "help") router.push("/profile/SupportScreen");
                    else console.log(item.title);
                  }}
                />
              ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => setConfirmVisible(true)}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.primary} />
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>

            <Text style={styles.version}>Phiên bản 1.0.4 (Build 12)</Text>
          </View>
        }
      />

      {/* Confirm Logout Modal */}
      <Modal transparent visible={confirmVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIcon}>
              <Ionicons name="log-out" size={32} color={colors.primary} />
            </View>
            <Text style={styles.modalTitle}>Đăng xuất</Text>
            <Text style={styles.modalMessage}>Bạn có chắc chắn muốn đăng xuất không? Mọi thông tin sẽ được bảo mật.</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelAction} onPress={() => setConfirmVisible(false)}>
                <Text style={styles.cancelActionText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmAction} onPress={handleLogout}>
                <Text style={styles.confirmActionText}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function MenuItem({
  icon,
  title,
  showBorder,
  onPress,
}: {
  icon: any;
  title: string;
  showBorder?: boolean;
  onPress?: () => void;
}) {
  return (
    <>
      <TouchableOpacity style={styles.menuRow} onPress={onPress}>
        <View style={styles.rowLeft}>
          <View style={styles.iconBox}>
            <Ionicons name={icon} size={18} color={colors.text} />
          </View>
          <Text style={styles.menuText}>{title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.muted} />
      </TouchableOpacity>
      {showBorder && <View style={styles.menuDivider} />}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  vipBadgeSmall: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  userDetails: {
    marginLeft: 16,
  },
  name: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  email: {
    color: colors.sub,
    fontSize: 14,
    marginTop: 2,
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    color: colors.sub,
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: "60%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignSelf: "center",
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  sectionHeading: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 24,
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginLeft: 64,
  },
  langSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 10,
    padding: 2,
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  langPillActive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  langText: {
    color: colors.sub,
    fontSize: 12,
    fontWeight: "600",
  },
  langTextActive: {
    color: colors.text,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(229, 9, 20, 0.1)",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 32,
    borderWidth: 1,
    borderColor: "rgba(229, 9, 20, 0.2)",
  },
  logoutText: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 8,
  },
  version: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 12,
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(229, 9, 20, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  modalMessage: {
    color: colors.sub,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  cancelAction: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
  },
  cancelActionText: {
    color: colors.text,
    fontWeight: "600",
  },
  confirmAction: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
  },
  confirmActionText: {
    color: "#fff",
    fontWeight: "700",
  },
});
