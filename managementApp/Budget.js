import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, Button, Alert } from "react-native";
import { useBudget } from "./BudgetContext";

const Budget = () => {
  const { budgets, updateBudget } = useBudget();
  const [tempBudgets, setTempBudgets] = useState(budgets);

  const handleSaveBudgets = () => {
    Object.keys(tempBudgets).forEach((category) => {
      updateBudget(category, tempBudgets[category]);
    });
    Alert.alert("Budgets Updated", "Your budgets have been successfully updated.");
  };

  return (
    <View style={styles.container}>
      {Object.keys(tempBudgets).map((category) => (
        <View key={category} style={styles.budgetItem}>
          <Text style={styles.category}>{category}</Text>
          <TextInput
            style={styles.input}
            value={tempBudgets[category]}
            onChangeText={(text) =>
              setTempBudgets((prevBudgets) => ({
                ...prevBudgets,
                [category]: text,
              }))
            }
            keyboardType="numeric"
            placeholder="Set budget"
          />
        </View>
      ))}
      <Button title="Save Budgets" onPress={handleSaveBudgets} />
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
    marginBottom: 20,
  },
  category: {
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    width: 100,
    borderRadius: 5,
  },
});

export default Budget;
