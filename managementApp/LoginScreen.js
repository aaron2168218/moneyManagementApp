// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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
      {/* Add Create Account Button */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.createAccountButton}>
        <Text style={styles.createAccountButtonText}>Create Account</Text>
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
    marginBottom: 10, // Added some margin bottom for spacing
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  createAccountButton: {
    marginTop: 10, // Added some margin top for spacing
    // Optional: Adjust the styling as needed to match your design
  },
  createAccountButtonText: {
    color: '#4e9caf', // Choose a color that fits your app theme
    fontSize: 16,
  },
});

export default LoginScreen;
