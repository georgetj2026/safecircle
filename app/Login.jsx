import { StyleSheet, TextInput, View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router'; // Import useRouter
import { login, register } from '@/services/authService';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

export default function LoginScreen() {
  const router = useRouter(); // Use useRouter for navigation
  const navigation = useNavigation(); // Use useNavigation to access navigation options

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');

  // Hide the header
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  };

  // Phone number validation function
  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(String(phone));
  };

  // Password validation function
  const validatePassword = (password) => {
    // Minimum 6 characters required for the password
    return password.length >= 6;
  };

  // Aadhar number validation function (12 digits)
  const validateAadhar = (aadhar) => {
    const re = /^[0-9]{12}$/;
    return re.test(String(aadhar));
  };

  // Date of Birth validation function (DD/MM/YYYY format)
  const validateDOB = (dob) => {
    const re = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d\d$/;
    const isValidFormat = re.test(dob);
    if (isValidFormat) {
      const [day, month, year] = dob.split('/');
      const date = new Date(year, month - 1, day);
      const today = new Date();
      return date < today;
    }
    return false;
  };

  // Function to handle Login & Signup
  const handleSubmit = async () => {
    // Validate fields
    if (!isLogin) {
      if (!name || !address || !aadhar || !dob || !gender) {
        Alert.alert("Invalid Input", "Please fill all the required fields.");
        return;
      }
      if (!validateAadhar(aadhar)) {
        Alert.alert("Invalid Aadhar", "Please enter a valid 12-digit Aadhar number.");
        return;
      }
      if (!validateDOB(dob)) {
        Alert.alert("Invalid DOB", "Please enter a valid Date of Birth in DD/MM/YYYY format and ensure the date is in the past.");
        return;
      }
    }

    if (!phone || !validatePhone(phone)) {
      Alert.alert("Invalid Phone", "Please enter a valid 10-digit phone number.");
      return;
    }

    if (!email || !validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!password || !validatePassword(password)) {
      Alert.alert("Invalid Password", "Password should be at least 6 characters long.");
      return;
    }

    try {
      if (isLogin) {
        const userData = await login(email, password);

        // ✅ Store token in AsyncStorage
        await AsyncStorage.setItem("authToken", userData.token);
        const storedToken = await AsyncStorage.getItem("authToken");
        console.log("Stored Token:", storedToken); // ✅ Debugging token storage

        Alert.alert("Success", "Logged in successfully!");
        router.push("/"); // Navigate to profile page
      } else {
        await register({ name, address, aadhar, phone, email, dob, gender, password });
        Alert.alert("Success", "Account created successfully!");
        setIsLogin(true);
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong!");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>

          <ThemedView style={styles.titleContainer}>
            <ThemedText style={styles.titleText}type="title">{isLogin ? ' LOGIN ' : 'Create Account'}</ThemedText>
          </ThemedView>

          <View style={styles.inputContainer}>
            {!isLogin && (
              <>
                <InputField label="Name" value={name} onChangeText={setName} />
                <InputField label="Address" value={address} onChangeText={setAddress} />
                <InputField label="Aadhar Number" value={aadhar} onChangeText={setAadhar} />
                <InputField label="Date of Birth" value={dob} onChangeText={setDob} />
                <InputField label="Gender" value={gender} onChangeText={setGender} />
              </>
            )}

            <InputField label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <InputField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <InputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />

          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>{isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable Input Field Component
const InputField = ({ label, value, onChangeText, keyboardType = 'default', secureTextEntry = false }) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
    />
  </View>
);

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: 'lightblue',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom:220,
  },
  container: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    marginBottom: 20,
  },
  titleContainer: {
    marginBottom: 20,
    backgroundColor: 'transparent' ,
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  input: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderColor: '#DDD',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleText: {
    color: '#FFF',
    paddingTop:10,
    fontSize: 40,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#4A90E2',
    marginTop: 10,
  },
});


