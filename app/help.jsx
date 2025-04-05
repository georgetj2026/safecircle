import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Animated,
  ImageBackground,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext"; // Using your global theme

const darkBg = require("@/assets/images/0002.jpg");
const lightBg = require("@/assets/images/002.jpg");

export default function HelpGuidelines() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { isDarkMode } = useTheme();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    StatusBar.setHidden(true);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const styles = createStyles(isDarkMode);

  return (
    <ImageBackground
      source={isDarkMode ? darkBg : lightBg}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.header}>HELP & GUIDELINES</Text>
            <Text style={styles.subHeader}>Welcome to SafeCircle</Text>
            <Text style={styles.description}>
            SafeCircle is like a personal emergency alert system designed to help you stay safe by instantly notifying your trusted contacts during emergencies. It sends your live location. The app offers quick real-time location shareing and service assistance all in one platform

            </Text>

            <Text style={styles.sectionTitle}>Features Overview</Text>

            {[
              {
                title: "1. Login & Profile",
                desc: "Securely log in to access your settings. Update your profile details anytime with medicals and blood group.",
              },
              {
                title: "2. Emergency Reporting",
                desc: "Press the 'Report' button to send an emergency alert with your real-time location.Use META_API to send alert message to your selected contacts using our whatapp chat bot",
              },
              {
                title: "3. Services",
                desc: "Includes emergency services in India from states to districts. Our databse includes police, hospitals, fire services , Vechile service , road side assistance services etc.",
              },
              {
                title: "4. Call Function",
                desc: "Enable call mode to redirect the call to your selected contact.",
              },
              {
                title: "5. Location Sharing",
                desc: "Your location is included in alerts to help contacts find you faster along with your preset situvation description.",
              },
              {
                title: "6. History & data",
                desc: "Each time the alert msg is send the history is stored in our database you can see the overview of your history and delete it from our database .",
              },
             
            ].map((item, idx) => (
              <View key={idx} style={styles.featureBox}>
                <Text style={styles.featureTitle}>{item.title}</Text>
                <Text style={styles.featureText}>{item.desc}</Text>
              </View>
            ))}
            <Text style={styles.EndText1}>For further details and infromation</Text>
            <Text style={styles.EndText}>Developer : Naveen Ajesh </Text>
            <Text style={styles.EndText}>Contact: 7909107741</Text>
            <Text style={styles.EndText2}>Naveenajesh@gmail.com</Text>
            
            
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

function createStyles(isDarkMode) {
  const textColor = isDarkMode ? "white" : "black";

  return StyleSheet.create({
    backgroundImage: {
      width: "100%",
      height: "100%",
      flex: 1,
      resizeMode: "cover",
    },
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 36,
      backgroundColor: "rgba(0, 0, 0, 0.6)", // optional overlay
    },
    header: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      color: isDarkMode ? "white" : "rgb(22, 81, 241)",
      marginBottom: 16,
    },
    subHeader: {
      fontSize: 20,
      fontWeight: "600",
      color: isDarkMode ? "white" : "rgba(203, 211, 237, 0.71)",
      textAlign: "center",
      marginBottom: 12,
    },
    description: {
      fontSize: 18,
      color: "white",
      paddingLeft: 40,
      textAlign: "centre",
      marginBottom: 24,
      paddingHorizontal: 10,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: isDarkMode ? "white" : "rgba(241, 194, 22, 0.84)",
      marginBottom: 12,
      paddingLeft: 30,
      paddingHorizontal: 10,
    },
    featureBox: {
      backgroundColor: isDarkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(72, 102, 190, 0.39)",
      padding: 15,
      borderRadius: 12,
      justifyContent: "center",
      alignSelf: "center",
      width: "90%",
      marginBottom: 16,
    },
    featureTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "white" : "rgb(183, 199, 233)",
      marginBottom: 6,
    },
    featureText: {
      fontSize: 15,
      color:"white",
      fontStyle: "italic",
      lineHeight: 22,
    },
    EndText: {
      fontSize: 15,
      color:"white",
      fontStyle: "italic",
      lineHeight: 23,
      alignSelf:"center"
    },
    EndText1: {
      fontSize: 15,
      color:"white",
      paddingTop:20,
      fontStyle: "italic",
      lineHeight: 23,
      alignSelf:"center"
    },
    EndText2: {
      fontSize: 15,
      color:"white",
      fontStyle: "italic",
      lineHeight: 23,
      alignSelf:"center",
      paddingBottom:190,
    },
  });
}
