import SubHeader from "@/components/SubHeader";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";


export default function SettingsScreen() {

  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(false);

  return (
    <View style={styles.container}>
      <SubHeader 
         title="Cài đặt"
         subtitle="Tùy chỉnh trải nghiệm CineGo của bạn"
      />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: 10 }} />

        <View style={styles.content}>
          {/* Account Section */}
          <Text style={styles.sectionHeading}>Tài khoản</Text>
          <View style={styles.card}>
            <SettingItem 
               icon="person-outline" 
               title="Chỉnh sửa hồ sơ" 
               showBorder 
            />
            <SettingItem 
               icon="lock-closed-outline" 
               title="Đổi mật khẩu" 
               showBorder 
            />
            <SettingItem 
               icon="shield-checkmark-outline" 
               title="Quyền riêng tư" 
            />
          </View>

          {/* Notifications Section */}
          <Text style={styles.sectionHeading}>Thông báo</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: "rgba(59, 130, 246, 0.1)" }]}>
                  <Ionicons name="notifications-outline" size={20} color="#3B82F6" />
                </View>
                <View>
                  <Text style={styles.rowTitle}>Thông báo đẩy</Text>
                  <Text style={styles.rowSub}>Nhận tin mới nhất về phim và vé</Text>
                </View>
              </View>
              <Switch 
                value={pushNotifications} 
                onValueChange={setPushNotifications}
                thumbColor={pushNotifications ? colors.primary : "#9CA3AF"}
                trackColor={{ false: "#374151", true: "rgba(229, 9, 20, 0.3)" }}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: "rgba(16, 185, 129, 0.1)" }]}>
                  <Ionicons name="mail-outline" size={20} color="#10B981" />
                </View>
                <View>
                  <Text style={styles.rowTitle}>Email thông báo</Text>
                  <Text style={styles.rowSub}>Gửi vé và hóa đơn qua email</Text>
                </View>
              </View>
              <Switch 
                value={emailNotifications} 
                onValueChange={setEmailNotifications}
                thumbColor={emailNotifications ? colors.primary : "#9CA3AF"}
                trackColor={{ false: "#374151", true: "rgba(229, 9, 20, 0.3)" }}
              />
            </View>
          </View>

          {/* App Info Section */}
          <Text style={styles.sectionHeading}>Ứng dụng</Text>
          <View style={styles.card}>
            <SettingItem 
               icon="trash-outline" 
               title="Xóa bộ nhớ đệm" 
               description="Đã dùng: 12.5 MB"
               showBorder 
            />
            <SettingItem 
               icon="help-circle-outline" 
               title="Trung tâm hỗ trợ" 
               showBorder 
            />
            <SettingItem 
               icon="document-text-outline" 
               title="Điều khoản và Chính sách" 
            />
          </View>

          {/* Danger Zone */}
          <Text style={[styles.sectionHeading, { color: colors.primary }]}>Vùng nguy hiểm</Text>
          <View style={[styles.card, { borderColor: "rgba(229, 9, 20, 0.2)" }]}>
            <SettingItem 
               icon="trash-bin-outline" 
               title="Xóa tài khoản" 
               isDanger
            />
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

function SettingItem({ 
  icon, 
  title, 
  description, 
  showBorder, 
  isDanger = false,
  onPress 
}: { 
  icon: any; 
  title: string; 
  description?: string;
  showBorder?: boolean; 
  isDanger?: boolean;
  onPress?: () => void;
}) {
  return (
    <>
      <TouchableOpacity style={styles.row} onPress={onPress}>
        <View style={styles.rowLeft}>
          <View style={[styles.iconBox, isDanger && { backgroundColor: "rgba(229, 9, 20, 0.1)" }]}>
            <Ionicons name={icon} size={20} color={isDanger ? colors.primary : "#fff"} />
          </View>
          <View>
            <Text style={[styles.rowTitle, isDanger && { color: colors.primary }]}>{title}</Text>
            {description && <Text style={styles.rowSub}>{description}</Text>}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.muted} />
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
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  content: {
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
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  rowSub: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginLeft: 68,
  },
});
