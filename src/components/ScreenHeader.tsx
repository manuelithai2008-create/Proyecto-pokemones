import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const ScreenHeader = ({
  title,
  subtitle,
  action,
}: ScreenHeaderProps) => {
  return (
    <View style={styles.headerWrap}>
      <View style={styles.textWrap}>
        <Text style={styles.eyebrow}>Pokédex</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action ? <View style={styles.actionWrap}>{action}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: "#f59e0b",
    borderBottomWidth: 1,
    borderBottomColor: "#fbbf24",
    shadowColor: "#b45309",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  textWrap: {
    flex: 1,
  },
  eyebrow: {
    color: "#7c2d12",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff7ed",
    letterSpacing: -0.8,
  },
  subtitle: {
    color: "#fff7ed",
    fontSize: 13,
    marginTop: 4,
  },
  actionWrap: {
    marginLeft: 12,
  },
});
