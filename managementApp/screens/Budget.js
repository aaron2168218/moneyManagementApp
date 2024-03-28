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
  Alert,
  TouchableOpacity,
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
    const newValue = value.trim() === "" ? "" : value;
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

    Alert.alert("Budget Saved", "Your budget has been saved successfully.");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Enter your budget in GBP</Text>
        {Object.keys(budget).map((category) => (
          <View key={category} style={styles.inputGroup}>
            <Text style={{ fontWeight: "bold" }}>{category}</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleChange(category, value)}
              value={budget[category]}
              keyboardType="numeric"
              placeholder="£"
            />
          </View>
        ))}
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 5,
    fontSize: 16,
    color: "#333",
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "#4e9caf",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Budget;
