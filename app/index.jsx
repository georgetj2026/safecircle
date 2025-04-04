import { View, Text, StyleSheet, ImageBackground, Pressable, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import rctimage from '@/assets/images/a7395e40-2054-4147-8314-728e940a8063.jpg';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const App = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  return (
    <View style={styles.container}>
      <ImageBackground source={rctimage} resizeMode="cover" style={styles.image}>
        
        {/* Profile Button */}
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
          <Ionicons name="person-circle" size={50} color="white" />
        </TouchableOpacity>

        {/* History Button */}
        <TouchableOpacity style={styles.historyButton} onPress={() => router.push('/History')}>
          <Ionicons name="time" size={50} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.title}>SAFE CIRCLE</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    top: 30, 
    right: 30,
    padding: 5,
    borderRadius: 100,
    elevation: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  historyButton: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    padding: 5,
    borderRadius: 100,
    elevation: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    color: 'white',
    fontSize: 45,
    fontWeight: 'bold',
    fontFamily: 'sans-serif' ,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  titledes: {
    color: 'rgb(75, 87, 170)',
    fontSize: 18,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    marginBottom: 40,
  },
  buttonContainer: {
    alignItems: 'center',
    flexDirection: "column",
    width: '100%',
  },
  button: {
    height: 60,
    width: 220,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 20},
    shadowOpacity: 0.8,
    shadowRadius: 8,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
  },
  loginButton: {
    backgroundColor: 'dodgerblue',
  },
  logoutButton: {
    backgroundColor: 'rgb(99, 56, 173)',
  },
  reportButton: {
    backgroundColor: 'red',
  },
  helpButton: {
    backgroundColor: 'darkblue',
  },
  settingsButton: {
    backgroundColor: 'blue',
  },
  servicesButton: {
    backgroundColor: 'rgb(7, 53, 151)', // Add a distinct color for the Services button
  },
  buttonText: {
    color: 'rgb(255, 255, 255)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
