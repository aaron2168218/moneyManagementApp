import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
} from "react-native";
import { useUser } from "../data/UserContext";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useUser();
  // Use nullish coalescing operator to provide fallback values
  const [username, setUsername] = useState(user?.username ?? "");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");

  const handleSave = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Username and password cannot be empty.");
      return;
    }
    const updatedUser = { ...user, username, password, avatarUrl };
    try {
      await updateUser(updatedUser);
      Alert.alert("Success", "Profile updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update user:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const requestCameraPermissionAndUpdateAvatar = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Camera permission is required to change the avatar."
      );
      return;
    }
    takePhotoAndUpdateAvatar();
  };

  const takePhotoAndUpdateAvatar = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.cancelled) {
      setAvatarUrl(result.uri);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={requestCameraPermissionAndUpdateAvatar}
        style={styles.avatarContainer}
      >
        <Image source={{ uri: avatarUrl || undefined }} style={styles.avatar} />
        <Text style={styles.editAvatarText}>Tap to Edit</Text>
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="New Password"
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleCancel}
        style={[styles.button, styles.cancelButton]}
      >
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: Platform.OS === "android" ? 25 : 50,
    backgroundColor: "#f5f5f5",
  },
  avatarContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e1e1e1",
    marginBottom: 8,
  },
  editAvatarText: {
    fontSize: 16,
    color: "#4e9caf",
    textDecorationLine: "underline",
  },
  inputContainer: {
    width: "90%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4e9caf",
    padding: 12,
    borderRadius: 5,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#757575",
  },
});

export default EditProfileScreen;
