import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import DialogScreen from "./screens/DialogScreen";

type DebugType = "alert" | "actionSheet" | "popup";

type Screen = "home" | DebugType;

const typeList: Array<{ key: DebugType; title: string }> = [
  { key: "alert", title: "Alert" },
  { key: "actionSheet", title: "ActionSheet" },
  { key: "popup", title: "Popup" },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");

  const renderHome = () => (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.header}>调试类型</Text>
      <FlatList
        data={typeList}
        keyExtractor={(item) => item.key}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => setScreen(item.key)}
          >
            <Text style={styles.listItemText}>{item.title}</Text>
            <Text style={styles.listItemArrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );

  return (
    <View style={styles.root}>
      {screen === "home" && renderHome()}
      {screen !== "home" && (
        <DialogScreen
          onBack={() => setScreen("home")}
          dialogType={screen as DebugType}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  listItemText: {
    fontSize: 16,
    color: "#333",
  },
  listItemArrow: {
    fontSize: 18,
    color: "#999",
  },
  separator: {
    height: 10,
  },
});
