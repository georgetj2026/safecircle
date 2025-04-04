import { View, Text, StyleSheet, Switch, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URL } from '@/services/authService'; // Import BASE_API_URL

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide the header
  }, [navigation]);

  const styles = createStyles(darkMode); // Dynamically generate styles based on darkMode

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
      source={require('@/assets/images/innerbg.jpg')} // Path to your background image
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
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
            <Switch value={darkMode} onValueChange={setDarkMode} />
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
      </View>
    </ImageBackground>
  );
};

export default Settings;

const createStyles = (darkMode) =>
  StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover', // Ensures the image covers the entire screen
    },
    overlay: {
      flex: 1,
      backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)', // Adjust overlay based on darkMode
    },
    container: {
      flex: 1,
      justifyContent: 'center', // Center contents vertically
      alignItems: 'center', // Center contents horizontally
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 20,
      color: 'white', // Always white text color
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      padding: 15,
      backgroundColor: darkMode
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(51, 12, 120, 0.8)', // Change row background based on darkMode
      borderRadius: 10,
      elevation: 3,
      marginBottom: 15,
    },
    settingText: {
      fontSize: 18,
      color: 'white', // Always white text color
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


