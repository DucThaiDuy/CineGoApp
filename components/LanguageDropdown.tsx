import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function LanguageDropdown({
  languages,
  selected,
  onSelect,
}: {
  languages: { code: string; label: string; flag: string }[];
  selected: string;
  onSelect: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      {/* Menu chính */}
      <TouchableOpacity style={styles.menuItem} onPress={() => setOpen(!open)}>
        {/* <Ionicons name="language-outline" size={22} color="#fff" /> */}

        <Text style={[styles.menuText, { fontWeight: "600" }]}>Ngôn ngữ</Text>
        <View style={styles.right}>
          <Image
            source={{ uri: languages.find((l) => l.code === selected)?.flag }}
            style={styles.flag}
          />
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={18}
            color="#E50914"
          />
        </View>
      </TouchableOpacity>

      {/* Dropdown */}
      {open && (
        <View style={styles.dropdown}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(lang.code);
                setOpen(false); // đóng dropdown
              }}
            >
              <View style={styles.dropdownRow}>
                <Image source={{ uri: lang.flag }} style={styles.flag} />
                <Text
                  style={[
                    styles.menuText,
                    selected === lang.code && {
                      color: "#E50914",
                      fontWeight: "700",
                    },
                  ]}
                >
                  {lang.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F1F",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: "#1F1F1F",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flag: {
    width: 24,
    height: 16,
    resizeMode: "cover",
    borderRadius: 2,
  },
});

export default LanguageDropdown;
