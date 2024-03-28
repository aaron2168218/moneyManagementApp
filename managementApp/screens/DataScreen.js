import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { PieChart, BarChart } from "react-native-chart-kit";
import { useUser } from "../data/UserContext";

const screenWidth = Dimensions.get("window").width;

const DataScreen = () => {
  const { user } = useUser();
  const [selectedChart, setSelectedChart] = useState("pie");
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [upperLimit, setUpperLimit] = useState(0);

  useEffect(() => {
    if (user?.expenditures) {
      const expensesByCategory = user.expenditures.reduce((acc, expense) => {
        const amount = parseFloat(expense.amount.replace("£", ""));
        acc[expense.category] = (acc[expense.category] || 0) + amount;
        return acc;
      }, {});

      const pieData = Object.keys(expensesByCategory).map((category) => ({
        name: category,
        population: expensesByCategory[category],
        color: getColorForCategory(category),
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      }));

      setPieChartData(pieData);

      const labels = Object.keys(expensesByCategory);
      const data = Object.values(expensesByCategory);
      setBarChartData({ labels, datasets: [{ data }] });

      const maxExpense = Math.max(...data);
      setUpperLimit(Math.ceil((maxExpense + 5) / 10) * 10);
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
    return categoryColors[category] || "#999999";
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(78, 156, 175, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
  };

  const toggleChart = (chartType) => {
    setSelectedChart(chartType);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Expenses Overview</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => toggleChart("pie")}
          style={[
            styles.button,
            selectedChart === "pie"
              ? styles.activeButton
              : styles.inactiveButton,
          ]}
        >
          <Text style={styles.buttonText}>Pie Chart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleChart("bar")}
          style={[
            styles.button,
            selectedChart === "bar"
              ? styles.activeButton
              : styles.inactiveButton,
          ]}
        >
          <Text style={styles.buttonText}>Bar Chart</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.chartContainer}>
        {selectedChart === "pie" && pieChartData.length > 0 ? (
          <PieChart
            data={pieChartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={""}
            center={[screenWidth / 4, 10]}
            avoidFalseZero={true}

          />
          
        ) : selectedChart === "bar" && barChartData.labels.length > 0 ? (
          <BarChart
            data={barChartData}
            width={screenWidth - 32}
            height={500}
            yAxisLabel={"£"}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero
            yAxisInterval={1}
            yLabelsOffset={10}
            yAxisRange={[0, upperLimit]}
            showValuesOnTopOfBars
          />
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    marginBottom: 10
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    margin: 5,
    minWidth: 100,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#4e9caf",
    elevation: 2,
  },
  inactiveButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  chartContainer: {
    borderRadius: 18,
    padding: 16,
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingRight: 30,
  },
  legend: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  legendText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666666",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "#999",
    marginTop: 20,
  },
});

export default DataScreen;
