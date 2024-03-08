import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";

const Budget = ({ expenses = [] }) => {  // Default value set for expenses
  const [budgets, setBudgets] = useState({
    Food: 0,
    Transport: 0,
    Utilities: 0,
    Entertainment: 0,
    Other: 0,
  });

  const calculateExpensesForCategory = (category) => {
    return expenses
      .filter((expense) => expense.category === category)
      .reduce((acc, curr) => acc + parseFloat(curr.amount.replace("£", "")), 0);
  };

  const checkBudgets = () => {
    Object.keys(budgets).forEach((category) => {
      const spent = calculateExpensesForCategory(category);
      const budget = budgets[category];

      if (budget > 0 && spent / budget > 0.9) {  // Added check for budget > 0 to avoid division by zero
        Alert.alert("Budget Alert", `You are nearing your budget limit for ${category}.`);
      }
    });
  };

  useEffect(() => {
    checkBudgets();
  }, [expenses, budgets]);

  const updateBudget = (category, amount) => {
    setBudgets((prevBudgets) => ({
      ...prevBudgets,
      [category]: parseFloat(amount),
    }));
  };

  return (
    <View style={styles.container}>
      {Object.keys(budgets).map((category) => (
        <View key={category} style={styles.budgetItem}>
          <Text style={styles.category}>{category}:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => updateBudget(category, text)}
            value={budgets[category].toString()}
            keyboardType="numeric"
          />
        </View>
      ))}
      <Button title="Update Budgets" onPress={checkBudgets} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  budgetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  category: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    width: 100,
    textAlign: "right",
  },
});

export default Budget;
