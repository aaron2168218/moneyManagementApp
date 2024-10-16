import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useUser } from "../data/UserContext";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const { user } = useUser();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
    setDateQuery(format(currentDate, "yyyy-MM-dd"));
  };

  const filteredExpenses = user?.expenditures.filter((expense) => {
    const matchesCategoryOrAmount =
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.amount.toString().includes(searchQuery);

    let matchesDate = true;
    if (dateQuery) {
      const expenseDate = format(new Date(expense.dateTime), "yyyy-MM-dd");
      matchesDate = expenseDate.includes(dateQuery);
    }

    return matchesCategoryOrAmount && matchesDate;
  });

  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <Text
        style={styles.expenseText}
      >{`${item.category}: ${item.amount}`}</Text>
      <Text style={styles.expenseDate}>
        {format(new Date(item.dateTime), "Pp")}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Expense Search</Text>
        <TextInput
          style={styles.input}
          onChangeText={setSearchQuery}
          value={searchQuery}
          placeholder="Search by category or amount"
          placeholderTextColor="#666"
        />
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.datePickerButtonText}>Select Date</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>
      <FlatList
        data={filteredExpenses || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.expensesList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#4e9caf",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  datePickerButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: "#4e9caf",
    marginBottom: 20,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  expensesList: {
    marginTop: 10,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  expenseText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  expenseDate: {
    color: "#666",
    fontSize: 14,
  },
});

export default SearchScreen;
