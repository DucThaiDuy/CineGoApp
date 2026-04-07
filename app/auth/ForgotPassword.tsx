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

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    }

    Alert.alert(
      "Thành công",
      "Chúng tôi đã gửi link đặt lại mật khẩu về email của bạn",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
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
            <Ionicons name="help-circle-outline" size={64} color="#E50914" />
            <Text style={styles.appName}>CineGo</Text>
            <Text style={styles.subTitle}>Quên mật khẩu</Text>
          </View>

          <View>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Nhập email đã đăng ký"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={handleSubmit}>
              <LinearGradient
                colors={["#E50914", "#B20710"]}
                style={styles.submitBtn}
              >
                <Text style={styles.submitText}>Gửi link đặt lại</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.backRow}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.backText}>← Quay lại đăng nhập</Text>
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
    color: "#E50914",
    marginTop: 8,
  },
  subTitle: {
    color: "#9CA3AF",
    marginTop: 6,
    fontSize: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 52,
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
  },
  submitBtn: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  backRow: {
    alignItems: "center",
    marginTop: 24,
  },
  backText: {
    color: "#E50914",
    fontWeight: "600",
  },
});
