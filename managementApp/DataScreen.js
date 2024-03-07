import React from "react";
import { View, Text, Dimensions, SafeAreaView, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useRoute } from "@react-navigation/native";
import { categoryColors } from "./Home";

const screenWidth = Dimensions.get("window").width;

const DataScreen = () => {
  const route = useRoute();
  const { expenses } = route.params || { expenses: [] };

  const pieChartData = expenses.reduce((acc, expense) => {
    const existing = acc.find((item) => item.name === expense.category);
    if (existing) {
      existing.population += parseFloat(expense.amount.replace("£", ""));
    } else {
      acc.push({
        name: expense.category,
        population: parseFloat(expense.amount.replace("£", "")),
        color: categoryColors[expense.category],
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      });
    }
    return acc;
  }, []);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Adjusted for better visibility
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Same as above
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  const totalExpenses = pieChartData
    .reduce((acc, curr) => acc + curr.population, 0)
    .toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Expenses Overview</Text>
      </View>
      <View style={styles.chartContainer}>
        <PieChart
          data={pieChartData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[10, 10]}
          absolute
        />
      </View>
      <Text style={styles.summaryText}>Total Expenses: £{totalExpenses}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  chartContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
});

export default DataScreen;
