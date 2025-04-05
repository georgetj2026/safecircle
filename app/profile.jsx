import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { BASE_API_URL } from "@/services/authService"; // Import BASE_API_URL
import { useTheme } from "@/context/ThemeContext"; // Import ThemeContext

export default function Profile() {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [editableDetails, setEditableDetails] = useState({
    bloodGroup: "",
    medicalConditions: "",
  });
  const navigation = useNavigation();
  const { isDarkMode } = useTheme(); // Access dark mode state
  const styles = createStyles(isDarkMode); // Dynamically create styles

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide the header
  }, [navigation]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }
      const response = await fetch(`${BASE_API_URL}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Failed to fetch profile: ${errorText}`);
        throw new Error(`Failed to fetch profile: ${errorText}`);
      }

      const data = await response.json();
      setUserDetails(data);
      setEditableDetails({
        aadhar: data.aadhar || "",
        address: data.address || "",
        dob: data.dob || "",
        bloodGroup: data.bloodGroup || "",
        medicalConditions: data.medicalConditions || "",
      });
      setProfileImage(data.profileImage || null);
    } catch (error) {
      alert(`Failed to load profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        alert("User not authenticated. Please log in again.");
        return;
      }

      const response = await fetch(`${BASE_API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableDetails),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setUserDetails((prev) => ({ ...prev, ...editableDetails }));
      alert("Profile updated successfully!");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setEditableDetails({ ...editableDetails, profileImage: result.assets[0].uri });
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
       <ImageBackground
        source={
          isDarkMode
            ? require("@/assets/images/0002.jpg")
            : require("@/assets/images/002.jpg")
        }
        style={styles.backgroundImage}
      >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require('@/assets/images/featured_ask_help_istock-1.webp')
                }
                style={styles.profileImage}
              />
              <Text style={styles.changePhotoText}>Change</Text>
            </TouchableOpacity>

            {/* Non-Editable Details */}
            <View style={styles.infoContainer}>
              <Text style={styles.sectionTitle}>Personal Details</Text>
              <DetailRow label="Name" value={userDetails?.name} isEditable={false} styles={styles} />
              <DetailRow label="Phone" value={userDetails?.phone} isEditable={false} styles={styles} />
              <DetailRow label="Email" value={userDetails?.email} isEditable={false} styles={styles} />
              <DetailRow label="Address" value={userDetails?.address} isEditable={false} styles={styles} />
              <DetailRow label="Aadhar-No" value={userDetails?.aadhar} isEditable={false} styles={styles} />
              <DetailRow label="Date of Birth" value={userDetails?.dob} isEditable={false} styles={styles} />
            </View>

            {/* Editable Details */}
            <View style={styles.infoContainer}>
              <Text style={styles.sectionTitle}>Medical Details</Text>
              <DetailRow
                label="Blood Group"
                value={editableDetails.bloodGroup}
                onChangeText={(text) =>
                  setEditableDetails({ ...editableDetails, bloodGroup: text })
                }
                styles={styles}
              />
              <DetailRow
                label="Medical Conditions"
                value={editableDetails.medicalConditions}
                onChangeText={(text) =>
                  setEditableDetails({ ...editableDetails, medicalConditions: text })
                }
                styles={styles}
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </ImageBackground>
  );
}

const DetailRow = ({ label, value, isEditable = true, onChangeText, styles }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}:</Text>
    {isEditable ? (
      <TextInput
        style={[styles.input, { textAlignVertical: "top" }]} // Ensure proper alignment for multiline
        value={value}
        onChangeText={onChangeText}
        multiline={true} // Allow text wrapping
      />
    ) : (
      <Text style={styles.value}>{value}</Text>
    )}
  </View>
);

function createStyles(isDarkMode) {
  return StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: "cover", // Ensures the image covers the entire screen
    },
    overlay: {
      flex: 1,
      backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.42)" : "rgba(16, 18, 20, 0.5)", // Semi-transparent overlay
    },
    container: {
      flex: 1,
      padding: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    imageContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    scrollContainer: {
      flexGrow: 3,
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      borderWidth: 3,
      borderColor: isDarkMode ? "white" : "black", // Adjust border color
      marginTop: 20,
    },
    changePhotoText: {
      marginTop: 5,
      color: isDarkMode ? "lightgrey" : "black", // Adjust text color
      fontWeight: "bold",
    },
    infoContainer: {
      backgroundColor: isDarkMode ? "rgba(50, 50, 50, 0.8)" : "rgba(61, 58, 145, 0.8)", // Adjust background color
      padding: 15,
      borderRadius: 10,
      elevation: 3,
      width: "90%",
      marginTop: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "white",
      marginBottom: 10,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      color: "white", // Adjust text color
    },
    value: {
      fontSize: 16,
      color: "white",
      textAlign: "right",
      flex: 1,
    },
    input: {
      flex: 1,
      fontSize: 16,
      padding: 5,
      color: "white",
      textAlign: "right",
    },
    saveButton: {
      marginTop: 20,
      backgroundColor: isDarkMode ? "rgb(109, 109, 109)" : "dodgerblue", // Adjust button color
      padding: 12,
      borderRadius: 5,
      alignItems: "center",
      width: "90%",
    },
    saveButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
}

