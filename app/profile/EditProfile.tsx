import SubHeader from "@/components/SubHeader";
import { colors } from "@/constants/colors";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("Thái Đức");
  const [email, setEmail] = useState("ducdev@gmail.com");
  const [phone, setPhone] = useState("0987 654 321");
  const [birthday, setBirthday] = useState("01/01/2000");

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    icon, 
    placeholder, 
    keyboardType = "default" 
  }: any) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Ionicons name={icon} size={20} color={colors.primary} style={styles.inputIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType={keyboardType}
          style={styles.input}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Ambient Background Glows */}
      <View style={styles.blurBlobTop} />
      <View style={styles.blurBlobBottom} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
           showsVerticalScrollIndicator={false}
           contentContainerStyle={{ paddingBottom: 100 }}
        >
          <SubHeader 
            title="Chỉnh sửa hồ sơ"
            subtitle="Cập nhật thông tin cá nhân của bạn"
          />

          <View style={{ height: 20 }} />

          {/* Avatar Edit Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image 
                source={{ uri: "https://i.pravatar.cc/150?img=12" }} 
                style={styles.avatar} 
              />
              <TouchableOpacity style={styles.cameraBtn}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.changeAvatarText}>Đổi ảnh đại diện</Text>
          </View>

          {/* Forms Section */}
          <View style={styles.formSection}>
             <InputField 
                label="Họ và tên"
                value={name}
                onChangeText={setName}
                icon="person-outline"
                placeholder="Nhập họ tên..."
             />
             
             <InputField 
                label="Email"
                value={email}
                onChangeText={setEmail}
                icon="mail-outline"
                placeholder="Nhập email..."
                keyboardType="email-address"
             />

             <InputField 
                label="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                icon="call-outline"
                placeholder="Nhập số điện thoại..."
                keyboardType="phone-pad"
             />

             <InputField 
                label="Ngày sinh"
                value={birthday}
                onChangeText={setBirthday}
                icon="calendar-outline"
                placeholder="00/00/0000"
             />
          </View>

          {/* Security / Additional Links */}
          <View style={styles.securitySection}>
            <TouchableOpacity style={styles.securityRow}>
              <View style={styles.securityLeft}>
                <View style={styles.securityIconBox}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={colors.success} />
                </View>
                <Text style={styles.securityText}>Thay đổi mật khẩu</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </TouchableOpacity>
            
            <View style={styles.divider} />

            <TouchableOpacity style={styles.securityRow}>
              <View style={styles.securityLeft}>
                <View style={styles.securityIconBox}>
                  <Ionicons name="link-outline" size={18} color={colors.info} />
                </View>
                <Text style={styles.securityText}>Liên kết mạng xã hội</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {/* Save Action */}
          <TouchableOpacity 
             style={styles.saveBtn}
             onPress={() => router.back()}
          >
            <LinearGradient
               colors={[colors.primary, "#8B1014"]}
               style={styles.saveGradient}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 0 }}
            >
               <Text style={styles.saveText}>Lưu thay đổi</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  blurBlobTop: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  blurBlobBottom: {
    position: "absolute",
    bottom: 200,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "#1E40AF",
    opacity: 0.05,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
  },
  headerSubtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarWrapper: {
    position: "relative",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  changeAvatarText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 16,
  },
  formSection: {
    paddingHorizontal: 24,
    gap: 20,
    marginBottom: 32,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  securitySection: {
    marginHorizontal: 24,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  securityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  securityIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  securityText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginVertical: 4,
  },
  saveBtn: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveGradient: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
});
