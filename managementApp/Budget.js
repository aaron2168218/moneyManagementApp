import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, Button, Alert } from "react-native";
import { useUser } from "./UserContext";

const BudgetScreen = () => {
  const { user, updateBudget } = useUser();
  // Initialize tempBudgets with the current user's budgets or default values
  const [tempBudgets, setTempBudgets] = useState(user?.budgets || {
    Food: '',
    Transport: '',
    Utilities: '',
    Entertainment: '',
    Other: '',
  });

  // Update tempBudgets to reflect any changes in the user's budgets
  useEffect(() => {
    if (user && user.budgets) {
      setTempBudgets(user.budgets);
    }
  }, [user?.budgets]); // Listen for changes specifically in user.budgets

  const handleSaveBudgets = async () => {
    await Promise.all(
      Object.keys(tempBudgets).map(category =>
        updateBudget(user.id, category, tempBudgets[category])
      )
    );
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
            onChangeText={(text) => setTempBudgets((prev) => ({
              ...prev,
              [category]: text
            }))}
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
    width: "70%",
    borderRadius: 5,
  },
});

export default BudgetScreen;
