import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert // Import Alert for displaying popup messages
} from "react-native";
import { useUser } from "../data/UserContext";

const Budget = () => {
  const { user, updateBudget } = useUser();
  const [budget, setBudget] = useState({
    Food: "",
    Transport: "",
    Utilities: "",
    Entertainment: "",
    Other: "",
  });

  useEffect(() => {
    // Load the current user's budget when the component mounts
    if (user && user.budgets) {
      setBudget(user.budgets);
    }
  }, [user]);

  const handleChange = (name, value) => {
    // If the value is empty, set it to "1000000000000000000"
    const newValue = value.trim() === "" ? "1000000000000000000" : value;
    setBudget((prevBudget) => ({
      ...prevBudget,
      [name]: newValue,
    }));
  };

  const handleSubmit = async () => {
    // Update each category in the database
    for (const [category, amount] of Object.entries(budget)) {
      if (user) {
        await updateBudget(user.id, category, amount);
      }
    }
    console.log("Budget saved:", budget);

    // Display a popup message indicating that the budget has been saved
    Alert.alert("Budget Saved", "Your budget has been saved successfully.");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Enter your budget</Text>
        {Object.keys(budget).map((category) => (
          <View key={category} style={styles.inputGroup}>
            <Text>{category}</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleChange(category, value)}
              value={budget[category]}
              keyboardType="numeric"
              placeholder="£"
            />
          </View>
        ))}
        <Button title="Save" onPress={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default Budget;
