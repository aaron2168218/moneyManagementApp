import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, Modal, TouchableOpacity, FlatList } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function HomeScreen() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Food', value: 'Food'},
    {label: 'Transport', value: 'Transport'},
    {label: 'Utilities', value: 'Utilities'},
    {label: 'Entertainment', value: 'Entertainment'},
    {label: 'Other', value: 'Other'}
  ]);

  const handleAmountChange = (input) => {
    let formattedInput = input.replace(/[^0-9.]/g, '');
    const parts = formattedInput.split('.');
  
    if (parts.length > 1 && parts[1].length > 2) {
      parts[1] = parts[1].substring(0, 2);
      formattedInput = parts.join('.');
    }

    setAmount(formattedInput);
  };

  const handleSubmit = () => {
    const now = new Date(); 
    const dateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    setExpenses(prevExpenses => [
      ...prevExpenses,
      { id: Date.now().toString(), amount: `£${amount}`, category, dateTime } 
    ]);
    setAmount('');
    setCategory(null);
  };

  const deleteExpense = (id) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };

  const calculateTotal = () => {
    return expenses.reduce((acc, curr) => acc + parseFloat(curr.amount.replace('£', '')), 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Log New Expenditure</Text>
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
      />
      <Button title="Log Expense" onPress={handleSubmit} disabled={!amount || !category} />
      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text>{item.category}: {item.amount} - {item.dateTime}</Text>
            <TouchableOpacity onPress={() => deleteExpense(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.total}>Total: £{calculateTotal()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#fff',

    paddingLeft: 24,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    backgroundColor: '#4e9caf',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    width: '100%',
    backgroundColor: '#e8eaf6',
    borderRadius: 5,
  },
  deleteButton: {
    color: '#ff0000',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  totalContainer: {
    marginTop: 20,
  },
});
