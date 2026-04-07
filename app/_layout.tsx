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

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootContent() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  // Luôn luôn là chế độ tối (Theo yêu cầu người dùng)
  const isDark = true;

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
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          {/* Movie screens are covered by screenOptions but explicit keys can be useful */}
          {/* Auth screens */}
          {/* Cinema screens */}
        </Stack>
      </View>
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
