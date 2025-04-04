import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  ImageBackground,
  SafeAreaView,
  Animated,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const data = {
  "": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat", "Bomdila"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba", "Jagdalpur"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Haryana": ["Chandigarh", "Gurgaon", "Faridabad", "Panipat", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Kullu", "Solan"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
  "Kerala": [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", "Idukki",
    "Ernakulam", "Thrissur", "Palakkad", "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
  ],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Bishnupur", "Ukhrul"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Baghmara"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
  "Punjab": ["Chandigarh", "Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Bikaner"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Ravangla"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Ambassa"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Rishikesh", "Almora"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Durgapur"],
};

const services = {
  "Thiruvananthapuram": [
    { name: "Thampanoor Police Station", address: "THE STATION HOUSE OFFICER, Thampanoor Police Station, ThampanoorPIN- 695001", phone:"+919497987013", location:"https://maps.app.goo.gl/SH78UZRfthCHPi3b8?g_st=ic" },
    { name: "Kazhakootam Fire and Rescue Station", address: "Kazhakootam Fire and Rescue Station Technopark Campus Park Centre, Technopark Rd Technopark Campus, Karyavattom Thiruvananthapuram Kerala 695581", phone: "+914712700099", location: "https://g.co/kgs/nkmSehh" }
  ],
  // Other districts...
};

export default function ServicesScreen() {
  const [currentScreen, setCurrentScreen] = useState("states");
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current; // Track scroll position

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide header
  }, []);

  const renderStatesScreen = () => (
    <View style={{ flex: 1 }}>
      <Animated.View style={[styles.fixedHeader]}>
       
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={styles.container}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16} // Smooth scrolling
      >
        {Object.keys(data).map((state, index) => {
          const inputRange = [
            (index - 1) * 100, // Before the button reaches the center
            index * 100,       // When the button is at the center
            (index + 1) * 100, // After the button leaves the center
          ];

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1.2, 1], // Scale up at the center
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={state}
              style={[styles.button, { transform: [{ scale }] }]}
            >
              <Pressable
                onPress={() => {
                  setSelectedState(state);
                  setCurrentScreen("districts");
                }}
              >
                <Text style={styles.buttonText}>{state}</Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );

  const renderDistrictsScreen = () => (
    <ScrollView contentContainerStyle={styles.containerDis}>
      {data[selectedState]?.map((district) => (
        <Pressable
          key={district}
          style={styles.button}
          onPress={() => {
            setSelectedDistrict(district);
            setCurrentScreen("services");
          }}
        >
          <Text style={styles.buttonText}>{district}</Text>
        </Pressable>
      ))}
      <Pressable style={styles.backButton} onPress={() => setCurrentScreen("states")}>
        <Text style={styles.buttonText}>Back to States</Text>
      </Pressable>
    </ScrollView>
  );

  const renderServicesScreen = () => (
    <ScrollView contentContainerStyle={styles.containerDis}>
      <Text style={styles.header}>{selectedDistrict} Services</Text>
      {services[selectedDistrict]?.length > 0 ? (
        services[selectedDistrict].map((service, index) => (
          <View key={index} style={styles.serviceCard}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceadd}>{service.address}</Text>
            <Pressable onPress={() => Linking.openURL(`tel:${service.phone}`)}>
              <Text style={styles.phoneLink}>Call: {service.phone}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (service.location) {
                  Linking.openURL(service.location).catch((err) =>
                    console.error("Failed to open location:", err)
                  );
                } else {
                  console.error("Location URL is missing");
                }
              }}
            >
              <Text style={styles.locationLink}>Open Location</Text>
            </Pressable>
          </View>
        ))
      ) : (
        <Text>No services available for this district.</Text>
      )}
      <Pressable style={styles.backButton} onPress={() => setCurrentScreen("districts")}>
        <Text style={styles.buttonText}>Back to Districts</Text>
      </Pressable>
    </ScrollView>
  );

  return (
    <ImageBackground
      source={require('@/assets/images/a7395e40-2054-4147-8314-728e940a8063.jpg')} // Use alias or relative path
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1 }}>
          {currentScreen === "states" && renderStatesScreen()}
          {currentScreen === "districts" && renderDistrictsScreen()}
          {currentScreen === "services" && renderServicesScreen()}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(7, 42, 107, 0.5)", // Optional: Set a fallback background color
  },
  container: {
    alignItems: "center",
    paddingVertical: 250,
  },
  containerDis: {
    alignItems: "center",
    paddingVertical: 20,
  },
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    zIndex: 1,
    padding: 10,
  },
  button: {
    backgroundColor: "rgba(83, 130, 216, 0.5)",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Ensures the image covers the entire screen
  },
  backButton: {
    backgroundColor: "#f44336",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  serviceCard: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: "rgba(119, 125, 129, 0.8)",
    borderWidth: 8,
    borderRadius: 20,
    width: "90%",
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
    color: "rgb(27, 34, 47)",
  },
  serviceadd: {
    fontSize: 15,
    textAlign: "left",
    color: "white",
  },
  phoneLink: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    textAlign: "left",
  },
  locationLink: {
    color: "rgb(9, 245, 37)",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
});