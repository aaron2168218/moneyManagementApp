import React, { useState } from "react";
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
import { LogExpense } from "./LogExpense";
import { format } from "date-fns";

const HomeScreen = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const items = [
    { label: "Food", value: "Food" },
    { label: "Transport", value: "Transport" },
    { label: "Utilities", value: "Utilities" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Other", value: "Other" },
  ];
  const navigation = useNavigation();
  const { expenses, addExpense, deleteExpense } = LogExpense();

  const handleAmountChange = (input) => {
    const formattedInput = input.replace(/[^0-9.]/g, "").slice(0, 6);
    setAmount(formattedInput);
  };

  const handleSubmit = () => {
    addExpense({
      amount: `£${amount}`,
      category,
      dateTime: new Date().toISOString(),
    });
    setAmount("");
    setCategory(null);
  };

  const handleDeleteExpense = (id) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel" },
        { text: "Delete", onPress: () => deleteExpense(id) },
      ],
      { cancelable: false }
    );
  };

  const calculateTotalExpenses = () => {
    const validExpenses = expenses || [];
    return validExpenses
      .reduce(
        (total, expense) => total + parseFloat(expense.amount.replace("£", "")),
        0
      )
      .toFixed(2);
  };

  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseDetails}>
        <Text
          style={styles.expenseText}
        >{`${item.category}: ${item.amount}`}</Text>
        <Text style={styles.expenseDate}>
          {format(new Date(item.dateTime), "Pp")}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteExpense(item.id)}
        style={styles.deleteButtonContainer}
      >
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
      />
      <DropDownPicker
        open={open}
        value={category}
        items={items}
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
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.expensesList}
      />
      <View style={styles.totalExpensesContainer}>
        <Text style={styles.totalExpensesText}>
          Total Spent: £{calculateTotalExpenses()}
        </Text>
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
