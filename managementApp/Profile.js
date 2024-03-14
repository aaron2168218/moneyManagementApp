import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const ProfileScreen = () => {
  const userInfo = {
    name: "Rohan Patel",
    email: "rohanpatel@example.com",
    avatarUrl:
      "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg",
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: userInfo.avatarUrl }} style={styles.avatar} />
      <Text style={styles.name}>{userInfo.name}</Text>
      <Text style={styles.email}>{userInfo.email}</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4e9caf",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
