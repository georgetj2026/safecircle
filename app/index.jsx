import { View, Text, StyleSheet, ImageBackground, Pressable, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { useTheme } from "@/context/ThemeContext";

const App = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isDarkMode } = useTheme(); // Access dark mode state

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsLoggedIn(!!token); // If token exists, user is logged in
    };
    checkLoginStatus();
  }, []);

  // Logout function
  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken'); // Remove the stored token
    setIsLoggedIn(false); // Update state
  };

  const styles = createStyles(isDarkMode); // Dynamically create styles based on theme

  return (
    <View style={styles.container}>
       <ImageBackground
        source={
          isDarkMode
            ? require("@/assets/images/0001.jpg")
            : require("@/assets/images/001.jpg")
        }
        style={styles.image}
      >
        {/* Profile Button */}
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
          <Ionicons name="person" size={40} color={"rgb(255, 255, 255)"} style={{ padding:5,}}/>
        </TouchableOpacity>

        {/* History Button */}
        <TouchableOpacity style={styles.historyButton} onPress={() => router.push('/History')}>
          <Ionicons name="time" size={50} color={"white"} />
        </TouchableOpacity>
        
        <Text style={styles.title}>SAFECIRCLE</Text>
        <Text style={styles.titledes}>Empowering Safety</Text>
        <Text style={styles.titledes}> Strengthening Connections</Text>

        <View style={styles.buttonContainer}>

          {/* Report Button */}
          <Link href="/REPORT" asChild>
            <Pressable style={StyleSheet.flatten([styles.button, styles.reportButton])}>
              <Text style={styles.buttonText}>REPORT</Text>
            </Pressable>
          </Link>

           {/* Services Button */}
           <Link href="/services" asChild>
            <Pressable style={StyleSheet.flatten([styles.button, styles.servicesButton])}>
              <Text style={styles.buttonText}>SERVICES</Text>
            </Pressable>
          </Link>


          {/* Help & Guidelines Button */}
          <Link href="/help" asChild>
            <Pressable style={StyleSheet.flatten([styles.button, styles.helpButton])}>
              <Text style={styles.buttonText}>GUIDELINES</Text>
            </Pressable>
          </Link>

          {/* Settings Button */}
          <Link href="/settings" asChild>
            <Pressable style={StyleSheet.flatten([styles.button, styles.settingsButton])}>
              <Text style={styles.buttonText}>SETTINGS</Text>
            </Pressable>
          </Link>

          {/* Login/Logout Button */}
          {isLoggedIn ? (
            <Pressable style={StyleSheet.flatten([styles.button, styles.logoutButton])} onPress={handleLogout}>
              <Text style={styles.buttonText}>LOG OUT</Text>
            </Pressable>
          ) : (
            <Link href="/Login" asChild>
              <Pressable style={StyleSheet.flatten([styles.button, styles.loginButton])}>
                <Text style={styles.buttonText}>Log in</Text>
              </Pressable>
            </Link>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default App;

const createStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "black" : "white", // Set background to black in dark mode
    },
    image: {
      width: '100%',
      height: '100%',
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileButton: {
      position: 'absolute',
      top: 45, 
      right: 30,
      padding: 5,
      borderRadius: 100,
      elevation: 5,
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust based on theme
    },
    historyButton: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      padding: 5,
      borderRadius: 100,
      elevation: 5,
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust based on theme
    },
    title: {
      color: "white", // Adjust text color based on theme
      fontSize: 45,
      fontWeight: 'bold',
      fontFamily: 'sans-serif' ,
      textAlign: 'center',
      textShadowColor: "rgba(0, 0, 0, 0.7)",
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 10,
      letterSpacing:1.5,
    },
    titledes: {
      color: isDarkMode ? "lightgrey" : "rgb(75, 87, 170)", // Adjust text color based on theme
      fontSize: 18,
      textAlign: 'center',
      textShadowColor : "rgba(0, 0, 0, 0.7)",
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 10,
    },
    buttonContainer: {
      alignItems: 'center',
      flexDirection: "column",
      width: '100%',
      paddingTop: 30,
    },
    button: {
      height: 60,
      width: 220,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 10, height: 20},
      shadowOpacity: 0.8,
      shadowRadius: 8,
      borderBottomWidth: 5,
      borderBottomColor: "rgba(0, 0, 0, 0.3)", // Adjust based on theme
    },
    loginButton: {
      backgroundColor: isDarkMode ? "rgb(55, 52, 52)" : "rgba(30, 144, 255, .74)", // Adjust button color
    },
    logoutButton: {
      backgroundColor: isDarkMode ? "rgb(55, 52, 52)" : "rgba(69, 17, 191, 0.7)", // Adjust button color
    },
    reportButton: {
      backgroundColor:  "red", // Adjust button color
    },
    helpButton: {
      backgroundColor: isDarkMode ? "rgb(55, 52, 52)" : "darkblue", // Adjust button color
    },
    settingsButton: {
      backgroundColor: isDarkMode ? "rgb(55, 52, 52)" : "rgba(0, 0, 255, 0.73)", // Adjust button color
    },
    servicesButton: {
      backgroundColor: isDarkMode ? "rgb(55, 52, 52)" : "rgba(7, 53, 151, 0.74)", // Adjust button color
    },
    buttonText: {
      color:  "rgb(255, 255, 255)", // Adjust text color
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      textShadowColor: "rgba(0, 0, 0, 0.5)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
  })
