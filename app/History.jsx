import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { BASE_API_URL } from "@/services/authService";
import { useTheme } from "@/context/ThemeContext";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();
  const { isDarkMode } = useTheme(); // Access dark mode state

  const styles = createStyles(isDarkMode); // Dynamically create styles

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide header
  }, []);

  const fetchHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${BASE_API_URL}/auth/history`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch history");

      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const handleDelete = async (historyId) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this history item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              const response = await fetch(
                `${BASE_API_URL}/auth/history/${historyId}`,
                {
                  method: "DELETE",
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (!response.ok) throw new Error("Failed to delete history");

              setHistory((prev) => prev.filter((item) => item._id !== historyId));
            } catch (error) {
              console.error("Error deleting history:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyDetails}>
        <Text style={styles.alertHeader}>EMERGENCY ALERT SENT</Text>
        <Text style={styles.historyText}>
          <Text style={styles.label}>SITUATION:</Text> {item.type}
        </Text>
        <Text style={styles.historyText}>
          <Text style={styles.label}>ALERT-SENT TO:</Text> {item.phoneNumber}
        </Text>
        <Text style={styles.historyText}>
          <Text style={styles.label}>CONTENT:</Text> {item.procedure}
        </Text>
        <Text style={styles.historyText}>
          <Text style={styles.label}>DATE & TIME:</Text> {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
        <FontAwesome name="trash" size={25} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
    source={
      isDarkMode
        ? require("@/assets/images/0002.jpg")
        : require("@/assets/images/002.jpg")
    }
    style={styles.background}
  >
  
     
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>HISTORY</Text>
          {history.length > 0 ? (
            <FlatList
              data={history}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.flatListContainer}
            />
          ) : (
            <Text style={styles.noHistory}>No history available.</Text>
          )}
        </SafeAreaView>
      
    </ImageBackground>
  );
}

const createStyles = (isDarkMode) =>
  StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: "cover", // Ensure the image covers the entire screen
    },
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 10,
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
      color: isDarkMode ? "white" : "black",
    },
    alertHeader: {
      fontSize: 20,
      fontWeight: "700",
      color: isDarkMode ? "#f2f5f6" : "#131415",
      textAlign: "center",
      marginBottom: 8,
    },
    flatListContainer: {
      paddingBottom: 20,
    },
    historyItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      alignSelf: "center",
      width: "90%",
      maxWidth: 600,
      padding: 12,
      borderRadius: 12,
      backgroundColor: isDarkMode ? "rgba(50, 50, 50, 0.54)" : "rgba(0, 128, 255, 0.37)",
      marginBottom: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    historyDetails: {
      flex: 1,
      paddingLeft: 10,
    },
    historyText: {
      fontSize: 14,
      fontWeight: "bold",
      color: isDarkMode ? "white" : "black",
      marginBottom: 5,
    },
    label: {
      fontWeight: "bold",
      color: isDarkMode ? "rgba(148, 151, 158, 0.9)" : "rgba(128, 165, 246, 0.9)",
    },
    deleteButton: {
      padding: 10,
    },
    noHistory: {
      fontSize: 18,
      textAlign: "center",
      fontWeight: "bold",
      color: isDarkMode ? "#888" : "#444",
      marginTop: 20,
    },
  });

