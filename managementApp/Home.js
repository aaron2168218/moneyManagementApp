import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "./UserContext"; // Ensure this is correctly imported
import { format } from "date-fns";

const HomeScreen = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const { user, addExpenditureForUser } = useUser(); // Use addExpenditureForUser from UserContext

  // Since budgets are now part of the user data, there's no need to fetch them from useBudget

  const handleAmountChange = (input) => {
    if (input.match(/^\d*\.?\d{0,2}$/)) {
      setAmount(input);
    }
  };

  const handleSubmit = async () => {
    if (!amount || !category) {
      Alert.alert("Missing Information", "Please select a category and enter an amount.");
      return;
    }

    const newExpenditure = {
      id: Date.now().toString(),
      amount: `£${amount}`,
      category,
      dateTime: new Date().toISOString(),
    };

    await addExpenditureForUser(newExpenditure);
    
    setAmount("");
    setCategory(null);
    setOpen(false);
  };

  // This function can remain unchanged if it uses a local state
  const handleDeleteExpense = async (id) => {
    // Implement deletion logic, potentially updating it in the UserContext
  };

  const calculateTotalExpenses = () => {
    return user?.expenditures?.reduce((total, expense) => total + parseFloat(expense.amount.replace("£", "")), 0).toFixed(2) || '0';
  };

  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseText}>{`${item.category}: ${item.amount}`}</Text>
        <Text style={styles.expenseDate}>{format(new Date(item.dateTime), "Pp")}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteExpense(item.id)} style={styles.deleteButtonContainer}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Log New Expenditure</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={handleAmountChange}
        value={amount}
        placeholder="Enter amount (£)"
        keyboardType="numeric"
        placeholderTextColor="#666"
        accessibilityLabel="Amount Input"
        returnKeyType="done"
      />
      <DropDownPicker
        open={open}
        value={category}
        items={[
          { label: "Food", value: "Food" },
          { label: "Transport", value: "Transport" },
          { label: "Utilities", value: "Utilities" },
          { label: "Entertainment", value: "Entertainment" },
          { label: "Other", value: "Other" },
        ]}
        setOpen={setOpen}
        setValue={setCategory}
        setItems={() => {}}
        zIndex={3000}
        zIndexInverse={1000}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownBox}
        placeholder="Select Category"
        placeholderStyle={{ color: "#666" }}
        accessibilityLabel="Category Dropdown"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={!amount || !category}
      >
        <Text style={styles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.viewDataButton}
        onPress={() => navigation.navigate("Data")}
      >
        <Text style={styles.viewDataButtonText}>View Data</Text>
      </TouchableOpacity>
      <FlatList
        data={user?.expenditures || []} // Use user's expenditures directly
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.expensesList}
      />
      <View style={styles.totalExpensesContainer}>
        <Text style={styles.totalExpensesText}>Total Spent: £{calculateTotalExpenses()}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: "#4e9caf",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
  },
  dropdownBox: {
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#4e9caf",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewDataButton: {
    backgroundColor: "#4e9caf",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  viewDataButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  expensesList: {
    flex: 1,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseText: {
    color: "#333",
    fontSize: 16,
  },
  expenseDate: {
    fontSize: 14,
    color: "#666",
  },
  deleteButtonContainer: {
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#ff6b6b",
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  totalExpensesContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  totalExpensesText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default HomeScreen;
