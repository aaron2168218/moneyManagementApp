import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useUser } from './UserContext'; 

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { addUser, findUserByUsernameAndPassword } = useUser(); 

  const handleSignup = async () => {
    try {
      // First, check if the user already exists
      const existingUser = await findUserByUsernameAndPassword(username, password);
      if (existingUser) {
        Alert.alert('Signup Failed', 'Username already exists. Choose a different username.');
        return;
      }
      // If user doesn't exist, proceed to add the new user
      await addUser({ username, password });
      Alert.alert('Signup Successful', 'Your account has been created. Please log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      // Handle any errors that occur during the signup process
      Alert.alert('Signup Error', 'An error occurred while creating your account.');
    }
  };

  return (
    <View style={styles.container}>
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
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default SignupScreen;
