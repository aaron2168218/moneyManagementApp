import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";

export const categoryColors = {
  Food: "#FF5733",
  Transport: "#C70039",
  Utilities: "#900C3F",
  Entertainment: "#581845",
  Other: "#FFC300",
};

export default function HomeScreen() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Food", value: "Food" },
    { label: "Transport", value: "Transport" },
    { label: "Utilities", value: "Utilities" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Other", value: "Other" },
  ]);
  const navigation = useNavigation();

  const handleAmountChange = (input) => {
    let formattedInput = input.replace(/[^0-9.]/g, "");
    const parts = formattedInput.split(".");

    if (parts.length > 1 && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
      formattedInput = parts.join(".");
    }

    setAmount(formattedInput);
  };

  const handleSubmit = () => {
    const now = new Date();
    const dateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    setExpenses((prevExpenses) => [
      ...prevExpenses,
      { id: Date.now().toString(), amount: `£${amount}`, category, dateTime },
    ]);
    setAmount("");
    setCategory(null);
  };

  const deleteExpense = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  };

  const calculateTotal = () => {
    return expenses
      .reduce((acc, curr) => acc + parseFloat(curr.amount.replace("£", "")), 0)
      .toFixed(2);
  };

  const navigateToDataScreen = () => {
    navigation.navigate("Data", { expenses });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Log New Expenditure</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={handleAmountChange}
        value={amount}
        placeholder="£0.00"
        keyboardType="numeric"
      />
      <DropDownPicker
        open={open}
        value={category}
        items={items}
        setOpen={setOpen}
        setValue={setCategory}
        setItems={setItems}
        zIndex={3000}
        zIndexInverse={1000}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownBox}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={!amount || !category}
      >
        <Text style={styles.buttonText}>Log Expense</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToDataScreen}>
        <Text style={styles.buttonText}>View Data</Text>
      </TouchableOpacity>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text style={styles.expenseText}>
              {item.category}: {item.amount} - {item.dateTime}
            </Text>
            <TouchableOpacity onPress={() => deleteExpense(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        style={styles.list}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.total}>Total: £{calculateTotal()}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  dropdownContainer: {
    marginBottom: 10,
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
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#e8eaf6",
    borderRadius: 5,
  },
  expenseText: {
    fontSize: 14,
    color: "#333",
  },
  deleteButton: {
    color: "#ff0000",
    fontWeight: "bold",
  },
  totalContainer: {
    marginTop: 20,
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  list: {
    flex: 1,
  },
});
