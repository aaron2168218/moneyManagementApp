import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useUser } from './UserContext'; // Adjust the path as necessary

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, findUserByUsernameAndPassword } = useUser();

  const handleLogin = async () => {
    try {
      const user = await findUserByUsernameAndPassword(username, password);
      if (user) {
        setUser(user);
        navigation.replace('Main');
      } else {
        Alert.alert('Login Failed', 'Invalid username or password');
      }
    } catch (error) {
      Alert.alert('Login Error', 'An error occurred during login');
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('AsyncStorage Cleared', 'Data has been cleared successfully.');
    } catch (error) {
      Alert.alert('Clearing AsyncStorage Failed', 'An error occurred while clearing data.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to My Budget App</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.createAccountButton}>
        <Text style={styles.createAccountButtonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Button to clear AsyncStorage */}
      <TouchableOpacity onPress={clearStorage} style={styles.clearStorageButton}>
        <Text style={styles.clearStorageButtonText}>Clear AsyncStorage</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4e9caf',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10, 
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  createAccountButton: {
    marginTop: 10, 
  },
  createAccountButtonText: {
    color: '#4e9caf',
    fontSize: 16,
  },
  clearStorageButton: {
    marginTop: 10,
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  clearStorageButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LoginScreen;
