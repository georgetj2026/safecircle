import React, { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Appearance,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  View,
  Text,
  Animated,
  ImageBackground,
  StatusBar,
  Linking,
  Vibration,
  Switch,
} from "react-native";
import Toast from "react-native-toast-message";
import { useTheme } from "@/context/ThemeContext";

import EditEmergencyOption from "./edit-emergency-option";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { BASE_API_URL } from "@/services/authService"; // Import BASE_API_URL



const defaultOptions = [
  { name: "Threat", contacts: [], procedure: "" },
  { name: "Accident", contacts: [], procedure: "" },
  { name: "Medical Emergency", contacts: [], procedure: "" },
  { name: "Fire", contacts: [], procedure: "" },
  { name: "Natural Disaster", contacts: [], procedure: "" },
];

export default function EmergencyOptions() {
  const navigation = useNavigation(); // Initialize navigation
  const { isDarkMode } = useTheme(); // Access dark mode state
  const styles = createStyles(isDarkMode); // Pass isDarkMode to createStyles
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [options, setOptions] = useState(defaultOptions);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCallMode, setIsCallMode] = useState(false); // Toggle state for call or message

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide the header
    StatusBar.setHidden(true); // Hide the status bar
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const fetchEmergencyOptions = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await fetch(`${BASE_API_URL}/contact/report-options`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch emergency options");
        }

        const data = await response.json();
        console.log("Fetched Emergency Options:", data);

        // If the backend returns an empty array, use the default options
        if (data.length === 0) {
          setOptions(defaultOptions);
        } else {
          setOptions(data);
        }
      } catch (error) {
        console.error("Error fetching emergency options:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to fetch emergency options.",
          position: "center",
        });
      }
    };

    fetchEmergencyOptions();
  }, []);

  const handleSendAlert = async (option) => {
    if (option.contacts.length === 0) {
      Toast.show({
        type: "error",
        text1: "No contacts set!",
        text2: `Add contacts for ${option.name} first.`,
        position: "center",
      });
      return;
    }
  
    const useMetaApi = (await AsyncStorage.getItem("useMetaApi")) === "true"; // Check toggle state
  
    let location = null;
    let locationLink = "";
  
    try {
      // Check if GPS is enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        Toast.show({
          type: "error",
          text1: "GPS Disabled",
          text2: "Please enable GPS in your device settings.",
          position: "center",
        });
        return;
      }
  
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Location Permission Denied",
          text2: "Please grant location permissions in your device settings.",
          position: "center",
        });
        return;
      }
    } catch (error) {
      console.error("Error requesting location permissions:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to request location permissions.",
        position: "center",
      });
      return;
    }
  
    try {
      location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      locationLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    } catch (error) {
      console.error("Error fetching location:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Get Location",
        text2: "Please enable GPS and try again.",
        position: "center",
      });
      return;
    }
  
    if (isCallMode) {
      // Call the first contact
      const firstContact = option.contacts[0];
      if (firstContact) {
        Linking.openURL(`tel:${firstContact}`).catch(() => {
          Toast.show({
            type: "error",
            text1: "Call Failed",
            text2: `Unable to call ${firstContact}.`,
            position: "center",
          });
        });
      } else {
        Toast.show({
          type: "error",
          text1: "No contact available to call.",
          position: "center",
        });
      }
      return; // Exit the function after initiating the call
    }
  
    if (!useMetaApi) {
      // Send a simple message using WhatsApp URL
      const firstContact = option.contacts[0];
      if (firstContact) {
        const timestamp = new Date().toLocaleString();
        const message = `⚠⚠ EMERGENCY ALERT ⚠⚠\n${option.name}\n${option.procedure}\n📌📌 Location: ${locationLink}\n🕒 ${timestamp}`;
        const whatsappUrl = `https://wa.me/${firstContact}?text=${encodeURIComponent(message)}`;
        Linking.openURL(whatsappUrl).catch(() => {
          Toast.show({
            type: "error",
            text1: "Failed to Send Message",
            text2: `Unable to send message to ${firstContact}.`,
            position: "center",
          });
        });
  
        // Save to history
        await saveToHistory({
          type: option.name,
          phoneNumber: firstContact,
          procedure: option.procedure,
          timestamp,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "No contact available to send message.",
          position: "center",
        });
      }
      return; // Exit the function after sending the message
    }
  
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${BASE_API_URL}/contact/send-whatsapp-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: option.name, // Pass option.name
          procedure: option.procedure, // Pass option.procedure
          locationLink, // Pass locationLink
          contacts: option.contacts, // Pass contacts
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send WhatsApp messages.");
      }
  
      const timestamp = new Date().toLocaleString();
  
      // Save to history
      await saveToHistory({
        type: option.name,
        phoneNumber: option.contacts[0],
        procedure: option.procedure,
        timestamp,
      });
  
      Toast.show({
        type: "success",
        text1: "WHATSAPP",
        text2: "Message send via CHATBOT.",
        position: "top", // or "top", "bottom"
        topOffset: 50,  
      });
    } catch (error) {
      console.error("Error sending WhatsApp messages:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to send WhatsApp messages.",
        position: "top", // or "top", "bottom"
        topOffset: 50,  
      });
    }
  };
  const saveToHistory = async (alert) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${BASE_API_URL}/auth/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(alert),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save history");
      }
  
      console.log("Alert saved to history:", alert);
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };
  

  const handleEditOption = (item) => {
    setSelectedOption(item);
    setIsEditing(true);
  };

  const handleSaveOption = async (updatedOption) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${BASE_API_URL}/contact/report-options`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOption),
      });

      if (!response.ok) {
        throw new Error("Failed to update emergency option");
      }

      const data = await response.json();

      // Update the options state with the updated data
      setOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.name === updatedOption.name ? updatedOption : option
        )
      );

      setSelectedOption(null); // Close the edit modal
      setIsEditing(false); // Reset editing state
    } catch (error) {
      console.error("Error updating emergency option:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update emergency option.",
        position: "center",
      });
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
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>REPORT</Text>
        <Text style={styles.titledes}>Safety starts with a tap</Text>

        {/* Toggle switch for calling or sending message */}
        <View style={styles.switchContainer}>
          <FontAwesome name="phone" size={35} color={isDarkMode ? "rgb(250, 5, 5)" : "rgba(143, 141, 248, 0.94)"} /> {/* Scaled phone icon */}
          <View style={styles.switchWrapper}>
            <Switch
              value={isCallMode}
              onValueChange={setIsCallMode}
              trackColor={{ false: "blue", true: "rgba(171, 171, 175, 0.94)" }}

            />
          </View>
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.emergencyButton}
                  activeOpacity={0.8}
                  onPress={() => handleSendAlert(item)}
                >
                  <Text style={styles.buttonText}>{item.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditOption(item)}
                >
                  <FontAwesome name="pencil" size={22} color="white" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
                No emergency options available.
              </Text>
            }
          />
        </Animated.View>

        {isEditing && selectedOption && (
          <EditEmergencyOption
            option={selectedOption}
            onSave={handleSaveOption} // Pass the handleSaveOption function
            onDismiss={() => setIsEditing(false)}
          />
        )}

        <Toast />
      </SafeAreaView>
    </ImageBackground>
  );
}

function createStyles(isDarkMode) {
  return StyleSheet.create({
    backgroundImage: {
      width: "100%",
      height: "100%",
      flex: 1,
      resizeMode: "cover",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject, // Fill the entire screen
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black overlay
    },
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(7, 42, 107, 0.5)",
    },
    title: {
      fontSize: 65,
      paddingTop: 50,
      fontWeight: "800",
      marginBottom: 15,
      textAlign: "center",
      color: isDarkMode ? "white" : "rgb(0, 119, 255)",
    },
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 10,
    },
    titledes: {
      color: isDarkMode ? "lightgrey" : "rgb(147, 160, 248)",
      fontSize: 18,
      fontWeight: "300",
      fontFamily: "georgia",
      fontStyle: "italic",
      textAlign: "center",
      textShadowColor: "rgba(0, 0, 0, 0.7)",
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 10,
      marginBottom: 10,
    },
    switchContainer: {
      flexDirection: "row", // Align items horizontally
      alignItems: "left", // Vertically center the content
      justifyContent: "left", // Center the content horizontally
      paddingVertical: 20, // Add padding to the top and bottom
      paddingHorizontal: 45, // Add padding to the left and right

    },
    switchWrapper: {
      marginLeft: 10,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "85%",
      height: 55,
      marginBottom: 12,
      borderRadius: 18,
      backgroundColor: isDarkMode ? "rgba(55, 55, 55, 0.85)" : "rgba(0, 82, 245, 0.5)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 1,
      alignSelf: "center",
      paddingHorizontal: 10,
    },
    emergencyButton: {
      flex: 1,
      paddingVertical: 14,
    },
    editButton: {
      padding: 10,
    },
    buttonText: {
      fontSize: 20,
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
  });
}