import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast, { BaseToastProps } from "react-native-toast-message";

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <View style={[styles.toastContainer, styles.successBorder]}>
      <View style={[styles.iconBox, { backgroundColor: "rgba(16, 185, 129, 0.15)" }]}>
        <Ionicons name="checkmark-circle" size={24} color="#10B981" />
      </View>
      <View style={styles.content}>
        <Text style={styles.text1}>{props.text1}</Text>
        {props.text2 && <Text style={styles.text2}>{props.text2}</Text>}
      </View>
      <TouchableOpacity onPress={() => Toast.hide()} style={styles.closeBtn}>
        <Ionicons name="close" size={18} color="#6B7280" />
      </TouchableOpacity>
    </View>
  ),

  error: (props: BaseToastProps) => (
    <View style={[styles.toastContainer, styles.errorBorder]}>
      <View style={[styles.iconBox, { backgroundColor: "rgba(239, 68, 68, 0.15)" }]}>
        <Ionicons name="alert-circle" size={24} color="#EF4444" />
      </View>
      <View style={styles.content}>
        <Text style={styles.text1}>{props.text1}</Text>
        {props.text2 && <Text style={styles.text2}>{props.text2}</Text>}
      </View>
      <TouchableOpacity onPress={() => Toast.hide()} style={styles.closeBtn}>
        <Ionicons name="close" size={18} color="#6B7280" />
      </TouchableOpacity>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    height: 70,
    width: "90%",
    backgroundColor: "#1F1F23",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  successBorder: {
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  errorBorder: {
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  text1: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  text2: {
    color: "#A1A1AA",
    fontSize: 13,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
});
