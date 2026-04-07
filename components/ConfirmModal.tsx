import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ConfirmModalProps = {
  visible: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  visible,
  title = "Xác nhận",
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  message: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#ccc",
    marginRight: 10,
    alignItems: "center",
  },
  confirmBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#E50914",
    alignItems: "center",
  },
  cancelText: { color: "#333", fontWeight: "600" },
  confirmText: { color: "#fff", fontWeight: "600" },
});
