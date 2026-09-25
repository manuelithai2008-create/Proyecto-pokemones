import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  message: string;
}

export const EmptyState = ({ title, message }: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#eef2ff",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    lineHeight: 24,
  },
});
