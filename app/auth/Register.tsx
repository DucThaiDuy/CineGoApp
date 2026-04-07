import FloatingBackButton from "@/components/FloatingBackButton";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    Alert.alert("Thành công", "Đăng ký tài khoản thành công", [
      {
        text: "Đăng nhập",
        onPress: () => router.replace("/auth/login"),
      },
    ]);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <FloatingBackButton />
          
          <View style={styles.logoContainer}>
            <Ionicons name="film-outline" size={60} color="#E50914" />
            <Text style={styles.appName}>CineGo</Text>
            <Text style={styles.subTitle}>Tạo tài khoản mới</Text>
          </View>

          <View>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Họ và tên"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Mật khẩu"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Xác nhận mật khẩu"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirm}
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons
                  name={showConfirm ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={handleRegister}>
              <LinearGradient
                colors={["#E50914", "#B20710"]}
                style={styles.registerBtn}
              >
                <Text style={styles.registerText}>Đăng ký</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={{ color: "#9CA3AF" }}>Đã có tài khoản?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}> Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 36,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#E50914",
    marginTop: 8,
  },
  subTitle: {
    color: "#9CA3AF",
    marginTop: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 52,
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  registerBtn: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginLink: {
    color: "#E50914",
    fontWeight: "600",
  },
});
