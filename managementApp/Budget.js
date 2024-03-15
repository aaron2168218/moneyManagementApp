import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useUser } from './UserContext'; // Assuming UserContext is in the same directory

const Budget = () => {
  const { user, updateBudget } = useUser();
  const [budget, setBudget] = useState({
    Food: '',
    Transport: '',
    Utilities: '',
    Entertainment: '',
    Other: ''
  });

  useEffect(() => {
    // Load the current user's budget when the component mounts
    if (user && user.budgets) {
      setBudget(user.budgets);
    }
  }, [user]);

  const handleChange = (name, value) => {
    setBudget(prevBudget => ({
      ...prevBudget,
      [name]: value
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your budget</Text>
      {Object.keys(budget).map((category) => (
        <View key={category} style={styles.inputGroup}>
          <Text>{category}</Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => handleChange(category, value)}
            value={budget[category]}
            keyboardType="numeric"
          />
        </View>
      ))}
      <Button title="Save" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default Budget;
