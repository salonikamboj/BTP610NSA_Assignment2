import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import CourierRateApp from "./CourierRateApp";

export default function App() {
  return (
    <View style={styles.container}>
      <CourierRateApp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9ffdb",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },
});
