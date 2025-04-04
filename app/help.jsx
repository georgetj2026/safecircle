import React, { useEffect, useRef } from "react";
import {
  Appearance,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Animated,
  ImageBackground,
  StatusBar,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import bgImage from "@/assets/images/a7395e40-2054-4147-8314-728e940a8063.jpg"; // Replace with your actual background image

export default function HelpGuidelines() {
  const navigation = useNavigation();
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Remove white space at the top
  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide header
    StatusBar.setHidden(true); // Hide status bar
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ImageBackground source={bgImage} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.header}>Help & Guidelines</Text>
            <Text style={styles.subHeader}>Welcome to SafeCircle</Text>
            <Text style={styles.description}>
              SafeCircle is an emergency alert system that helps you notify your trusted contacts
              in case of danger. The app provides quick access to emergency reporting, location
              sharing, and media recording for your safety.
            </Text>

            <Text style={styles.sectionTitle}>Features Overview</Text>

            <View style={styles.featureBox}>
              <Text style={styles.featureTitle}>1. Login & Profile</Text>
              <Text style={styles.featureText}>
                Securely log in to access your settings. Update your profile details anytime.
              </Text>
            </View>

            <View style={styles.featureBox}>
              <Text style={styles.featureTitle}>2. Emergency Reporting</Text>
              <Text style={styles.featureText}>
                Press the 'Report' button to send an emergency alert with your real-time location to usew selected contact.
              </Text>
            </View>

            <View style={styles.featureBox}>
              <Text style={styles.featureTitle}>3.Call function</Text>
              <Text style={styles.featureText}>
               Enable call mode to redirect call to your selected contact.
              </Text>
            </View>

            <View style={styles.featureBox}>
              <Text style={styles.featureTitle}>4. Location Sharing</Text>
              <Text style={styles.featureText}>
                Your location is included in alerts to help contacts find you faster.
              </Text>
            </View>

            <View style={styles.featureBox}>
              <Text style={styles.featureTitle}>5. Services </Text>
              <Text style={styles.featureText}>
                We have include all the services available in india to enable user to search for nerby police stations and hospitals.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    backgroundImage: {
      width: "100%",
      height: "100%",
      flex: 1,
      resizeMode: "cover",
    },
    container: {
      flex: 10,
      padding: 36,
      backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent overlay for better readability
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      color: "blue",
      marginBottom: 10,
    },
    subHeader: {
      fontSize: 18,
      fontWeight: "bold",
      color: "lightblue",
      textAlign: "center",
      marginBottom: 10,
    },
    description: {
      fontSize: 16,
      color: "white",
      textAlign: "center",
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "violet",
      marginBottom: 10,
    },
    featureBox: {
      backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent box effect
      padding: 20,
      borderRadius: 10,
      marginBottom: 12,
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "pink",
      marginBottom: 5,
    },
    featureText: {
      fontSize: 14,
      color: "white",
    },
  });
}
