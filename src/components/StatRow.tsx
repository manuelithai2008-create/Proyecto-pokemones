import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatRowProps {
  label: string;
  value: string | number;
}

export const StatRow = ({ label, value }: StatRowProps) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  label: {
    color: "#475569",
    fontSize: 14,
    textTransform: "capitalize",
    fontWeight: "600",
  },
  value: {
    color: "#0f172a",
    fontWeight: "700",
    fontSize: 14,
  },
});
