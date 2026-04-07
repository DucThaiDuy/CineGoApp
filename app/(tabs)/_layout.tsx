import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom - 5 : 10,
          borderTopWidth: 1,
          borderTopColor: "rgba(255, 255, 255, 0.05)",
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#E50914",
        tabBarInactiveTintColor: "#9CA3AF",
      }}

    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="ticket"
        options={{
          title: "Vé của tôi",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Tìm kiếm",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="notification"
        options={{
          title: "Thông báo",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Tài khoản",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
