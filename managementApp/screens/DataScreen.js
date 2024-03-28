import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useUser } from "../data/UserContext";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const DataScreen = () => {
  const { user } = useUser();
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    if (user?.expenditures) {
      const expensesByCategory = user.expenditures.reduce((acc, expense) => {
        const amountAsString = String(expense.amount);
        const amount = parseFloat(amountAsString.replace("£", ""));
        if (acc[expense.category]) {
          acc[expense.category] += amount;
        } else {
          acc[expense.category] = amount;
        }
        return acc;
      }, {});
  
      const chartData = Object.entries(expensesByCategory).map(
        ([category, amount]) => ({
          name: category,
          population: amount,
          color: getColorForCategory(category),
          legendFontColor: "#7F7F7F",
          legendFontSize: 15,
        })
      );
  
      setPieChartData(chartData);
    }
  }, [user?.expenditures]);


  const getColorForCategory = (category) => {
    const categoryColors = {
      Food: "#FF5733",
      Transport: "#C70039",
      Utilities: "#900C3F",
      Entertainment: "#581845",
      Other: "#FFC300",
    };
    const color = categoryColors[category] || "#999999";
    console.log(`Color for ${category}: ${color}`); // Add this line for debugging
    return color;
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Expenses Overview</Text>
      </View>
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
});

export default DataScreen;
