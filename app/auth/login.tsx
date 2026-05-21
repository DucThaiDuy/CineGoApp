import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { authService } from "@/services/authService";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập đầy đủ thông tin",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.login({ 
        email: email.trim(), 
        password: password.trim() 
      });

      // authService returns directly the data
      const { token, fullName, role, email: userEmail } = data;
      
      await AsyncStorage.setItem("@user_token", token);
      await AsyncStorage.setItem("@user_info", JSON.stringify({ 
        fullName, 
        role, 
        email: userEmail 
      }));

      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: `Chào mừng ${fullName} trở lại!`,
      });

      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Login Error:", error);
      
      let errorMessage = "Đăng nhập thất bại";
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Không thể kết nối tới máy chủ. Vui lòng kiểm tra IP API.";
      } else {
        errorMessage = error.message;
      }

      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: errorMessage,
        position: "top",
        topOffset: 60,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Chức năng sẽ được tích hợp sau");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {/* đẩy giao diện lên khi mở bàn phím */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Ionicons name="film-outline" size={64} color="#E50914" />
            <Text style={styles.appName}>CineGo</Text>
            <Text style={styles.subTitle}>Đặt vé – Xem phim – Giải trí</Text>
          </View>

          {/* Form */}
          <View>
            {/* Email */}
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

            {/* Password */}
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

            {/* Login Button */}
            <TouchableOpacity activeOpacity={0.85} onPress={handleLogin}>
              <LinearGradient
                colors={["#E50914", "#B20710"]}
                style={styles.loginBtn}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginText}>Đăng nhập</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Forgot */}
            <TouchableOpacity
              onPress={() => router.push("/auth/ForgotPassword")}
            >
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.orText}>HOẶC</Text>
              <View style={styles.line} />
            </View>

            {/* Google Login */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.googleBtn}
              onPress={handleGoogleLogin}
            >
              <Image
                source={{
                  uri: "https://toppng.com/uploads/preview/google-logo-transparent-png-11659866441wanynck5pd.png",
                }}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>Đăng nhập bằng Google</Text>
            </TouchableOpacity>

            {/* Register */}
            <View style={styles.registerRow}>
              <Text style={{ color: "#9CA3AF" }}>Chưa có tài khoản?</Text>
              <TouchableOpacity onPress={() => router.push("/auth/Register")}>
                <Text style={styles.registerText}> Đăng ký</Text>
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
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#E50914", // CineGo đỏ
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

  loginBtn: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  forgotText: {
    color: "#E50914",
    textAlign: "right",
    marginTop: 12,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#2D2D2D",
  },
  orText: {
    color: "#9CA3AF",
    marginHorizontal: 12,
  },

  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "600",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: "#E50914",
    fontWeight: "600",
  },
});
