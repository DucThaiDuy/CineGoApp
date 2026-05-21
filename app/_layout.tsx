import { theme } from "@/constants/colors";
import { DefaultTheme, DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "react-native-reanimated";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ToastConfig";

export const unstable_settings = {
  anchor: "(tabs)",
};

import { useEffect, useState } from "react";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

function RootContent() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("@user_token");
      const inAuthGroup = segments[0] === "auth";

      if (!token && !inAuthGroup) {
        // Nếu không có token và không ở trang auth thì chuyển về login
        router.replace("/auth/login");
      } else if (token && inAuthGroup) {
        // Nếu đã có token mà lỡ vào trang auth thì đẩy vào home
        router.replace("/(tabs)");
      }
      setIsReady(true);
    };

    checkAuth();
  }, [segments]);

  // Luôn luôn là chế độ tối (Theo yêu cầu người dùng)
  const isDark = true;

  if (!isReady) return null; // Tránh nhấp nháy giao diện khi đang check auth

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? theme.dark.bg : theme.light.bg }}>
      {/* StatusBar duy nhất */}
      <StatusBar style={isDark ? "light" : "dark"} translucent />

      {/* Nội dung chính */}
      <View style={{ flex: 1, backgroundColor: isDark ? theme.dark.bg : theme.light.bg }}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="auth/login" /> 
          <Stack.Screen name="auth/Register" />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
      </View>
      <Toast config={toastConfig} />
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <RootContent />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
