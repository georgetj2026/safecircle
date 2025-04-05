import React from "react";
import { View, Text, StyleSheet, Switch, ImageBackground, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_API_URL } from "@/services/authService"; // Import BASE_API_URL
import { useTheme } from "@/context/ThemeContext";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [useMetaApi, setUseMetaApi] = useState(true); // Toggle state for META API
  const navigation = useNavigation();
  const { isDarkMode, setIsDarkMode } = useTheme();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide the header
    const loadSettings = async () => {
      const savedMetaApiState = await AsyncStorage.getItem("useMetaApi");
      setUseMetaApi(savedMetaApiState === "true"); // Load saved state
    };
    loadSettings();
  }, [navigation]);

  const styles = createStyles(isDarkMode); // Dynamically generate styles based on darkMode

  const handleMetaApiToggle = async (value) => {
    setUseMetaApi(value);
    await AsyncStorage.setItem("useMetaApi", value.toString()); // Save state to AsyncStorage
  };

  const handleDeleteProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "You are not logged in. Please log in to delete your profile.");
        return;
      }

      const response = await fetch(`${BASE_API_URL}/auth/profile`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete profile");
      }

      Alert.alert("Success", "Your profile has been deleted successfully.", [
        {
          text: "OK",
          onPress: async () => {
            await AsyncStorage.removeItem("authToken"); // Clear token
            navigation.reset({ index: 0, routes: [{ name: "/" }] }); // Redirect to login
          },
        },
      ]);
    } catch (error) {
      console.error("Error deleting profile:", error);
      Alert.alert("Error", error.message || "Failed to delete profile.");
    }
  };

  return (
    <ImageBackground
        source={
          isDarkMode
            ? require("@/assets/images/0002.jpg")
            : require("@/assets/images/002.jpg")
        }
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Settings</Text>

          {/* Notification Toggle */}
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Enable Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>

          {/* Dark Mode Toggle */}
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
            />
          </View>

          {/* Use META API Toggle */}
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Use META API</Text>
            <Switch value={useMetaApi} onValueChange={handleMetaApiToggle} />
          </View>

          {/* Delete Profile Button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              Alert.alert(
                "Confirm Deletion",
                "Are you sure you want to delete your profile? This action cannot be undone.",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Delete", style: "destructive", onPress: handleDeleteProfile },
                ]
              )
            }
          >
            <Text style={styles.deleteButtonText}>Delete Profile</Text>
          </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

export default Settings;

const createStyles = (isDarkMode) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 20,
      color: "white",
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "80%",
      padding: 15,
      backgroundColor: isDarkMode
        ? "rgba(255, 255, 255, 0.2)"
        : "rgba(42, 105, 150, 0.51)",
      borderRadius: 10,
      elevation: 3,
      marginBottom: 15,
    },
    settingText: {
      fontSize: 18,
      color: "white",
    },
    deleteButton: {
      marginTop: 20,
      padding: 15,
      backgroundColor: "red",
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
    },
    deleteButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
  });


