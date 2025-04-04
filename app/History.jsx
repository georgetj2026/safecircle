import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageBackground,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { BASE_API_URL } from "@/services/authService"; // Import BASE_API_URL

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide header
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const response = await fetch(`${BASE_API_URL}/auth/history`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []); // Empty dependency array means this runs once when the component is mounted

  const handleDelete = async (historyId) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const response = await fetch(`${BASE_API_URL}/auth/history/${historyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete history");
      }

      setHistory((prevHistory) => prevHistory.filter((item) => item._id !== historyId));
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyDetails}>
      <Text style={styles.alertHeader}>EMERGENCY ALERT SENT</Text>
        <Text style={styles.historyText}>
          <Text style={styles.label}>SITUVATION:</Text> {item.type}
        </Text>
        <Text style={styles.historyText}>
          <Text style={styles.label}>ALERT-SEND TO:</Text> {item.phoneNumber}
        </Text>
        <Text style={styles.historyText}>
          <Text style={styles.label}>CONTENT:</Text> {item.procedure}
        </Text>
        <Text style={styles.historyText}>
          <Text style={styles.label}>DATE & TIME:</Text> {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
        <FontAwesome name="trash" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('@/assets/images/bg.jpg')} // Updated background image
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>HISTORY</Text>
        {history.length > 0 ? (
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <Text style={styles.noHistory}>No history available.</Text>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === "android" ? 25 : 0, // Add padding for Android to avoid overlap with the status bar
  },
   alertHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black", // Bright orange color for emphasis
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    fontStyle:"Georgia",
    textAlign: "center",
    marginBottom: 20,
    color: "rgb(242, 245, 246)", // Semi-transparent background for better readability
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center", // Center the item horizontally
    width: "90%", // Use percentage for responsive width
    maxWidth: 600, // Limit the width for larger screens
    height: 175, // Adjust height for better alignment
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "rgba(6, 104, 201, 0.8)", // Semi-transparent background for better readability
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Add elevation for Android shadow
  },
  historyDetails: {
    flex: 1,
    paddingLeft: 15,
    color:"white"
  },
  historyText: {
    fontSize: 14, // Slightly larger font for better readability
    fontWeight: "bold",
    color: "white", // White text for better contrast
    marginBottom: 5,
    alignContent:"right"
  },
  label: {
    fontWeight: "bold",
    color: "rgba(128, 165, 246, 0.8)", // Gold color for labels
  },
  deleteButton: {
    marginRight: 20,
    padding: 10,
  },
  background: {
    flex: 1,
    resizeMode: "cover", // Ensures the image covers the entire screen
  },
  noHistory: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "#888",
    marginTop: 20,
  },
});
