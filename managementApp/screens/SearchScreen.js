import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useUser } from '../data/UserContext';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';


const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');
  const { user } = useUser();
  const [date, setDate] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);

const onDateChange = (event, selectedDate) => {
  const currentDate = selectedDate || date;
  setShowDatePicker(Platform.OS === 'ios');
  setDate(currentDate);
  setDateQuery(format(currentDate, 'yyyy-MM-dd'));
};

  const filteredExpenses = user?.expenditures.filter((expense) => {
    const matchesCategoryOrAmount =
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.amount.toString().includes(searchQuery);

    let matchesDate = true;
    if (dateQuery) {
      const expenseDate = format(new Date(expense.dateTime), 'yyyy-MM-dd');
      matchesDate = expenseDate.includes(dateQuery);
    }

    return matchesCategoryOrAmount && matchesDate;
  });

  const renderItem = ({ item }) => (
    <View style={[styles.expenseItem, { backgroundColor: "#f5f5f5" }]}>
      <View style={styles.expenseDetails}>
        <Text style={styles.expenseText}>{`${item.category}: ${item.amount}`}</Text>
        <Text style={styles.expenseDate}>{format(new Date(item.dateTime), "Pp")}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Expense Search</Text>
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setSearchQuery}
        value={searchQuery}
        placeholder="Search by category or amount"
        keyboardType="default"
        placeholderTextColor="#666"
      />
 
{showDatePicker && (
  <DateTimePicker
    testID="dateTimePicker"
    value={date}
    mode="date"
    display="default"
    onChange={onDateChange}
  />
)}
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
    margin: 20,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
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
    shadowOffset: { width: 0, height: 2 },
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
  editButtonContainer: {
    justifyContent: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "orange",
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
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
});

export default SearchScreen;
