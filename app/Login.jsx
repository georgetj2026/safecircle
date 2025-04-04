import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import DatePicker from "react-native-date-picker"; // Import DatePicker
import { useRouter } from "expo-router";
import { login, register } from "@/services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

export default function LoginScreen() {
  const router = useRouter();
  const navigation = useNavigation(); // Use useNavigation to access navigation options

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control date picker visibility
  const [selectedDate, setSelectedDate] = useState(new Date()); // State to hold the selected date

  // Hide the header
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleDateConfirm = (date) => {
    const formattedDate = date.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
    setDob(formattedDate);
    setShowDatePicker(false); // Hide the date picker
  };

  const handleSubmit = async () => {
    if (!isLogin) {
      if (!name || !address || !aadhar || !dob || !gender) {
        Alert.alert("Invalid Input", "Please fill all the required fields.");
        return;
      }
    }

    try {
      if (isLogin) {
        const userData = await login(email, password);
        await AsyncStorage.setItem("authToken", userData.token);
        Alert.alert("Success", "Logged in successfully!");
        router.push("/");
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
          <Text style={styles.titleText}>{isLogin ? "LOGIN" : "NEW ACCOUNT"}</Text>

          <View style={styles.inputContainer}>
            {!isLogin && (
              <>
                <InputField label="Name" value={name} onChangeText={setName} />
                <InputField label="Address" value={address} onChangeText={setAddress} />
                <InputField label="Aadhar Number" value={aadhar} onChangeText={setAadhar} />
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <InputField
                    label="Date of Birth"
                    value={dob}
                    onChangeText={setDob}
                    editable={false} // Prevent manual editing
                  />
                </TouchableOpacity>
                <InputField label="Gender" value={gender} onChangeText={setGender} />
              </>
            )}

            <InputField label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <InputField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <InputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{isLogin ? "Login" : "Sign Up"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DatePicker
          modal
          open={showDatePicker}
          date={selectedDate}
          mode="date"
          maximumDate={new Date()} // Prevent selecting future dates
          onConfirm={(date) => {
            setSelectedDate(date);
            handleDateConfirm(date);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      )}
    </SafeAreaView>
  );
}

const InputField = ({ label, value, onChangeText, keyboardType = "default", secureTextEntry = false, editable = true }) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      editable={editable} // Control whether the field is editable
    />
  </View>
);

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "lightblue",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 220,
  },
  container: {
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  titleText: {
    fontSize: 35,
    fontWeight: "700",
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  input: {
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    borderColor: "#DDD",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchText: {
    color: "#4A90E2",
    marginTop: 10,
  },
});