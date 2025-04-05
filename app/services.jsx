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
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/context/ThemeContext"; // Import ThemeContext

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
"Kollam": [
  { name: "Fort Police Station ", address: "Attakulangara, Trivandrum Vizhinjam Rd, Near Vanitha Jail, Manacaud, Thiruvananthapuram, Kerala 695023", phone: "+91 0471 246 1105", location: "https://goo.gl/maps/XdYZU" },
  { name: "Fire & Rescue Station, Chamakkada", address: "Chamakkada, Thamarakulam Rd, Andamukkam, Kollam, Kerala 691001", phone: "+91 0474 275 0201", location: "https://g.co/kgs/fVVfYzh" }
],
"Pathanamthitta": [
  { name: "Aranmula Police Station", address: " Mavelikkara - Chengannur - Kozhenchery Rd, Aranmula, Mallapuzhassery, Kerala 689533", phone: "NA", location: "https://g.co/kgs/eJ9EdXq" },
  { name: "Fire and Rescue Station, Pathanamthitta", address: "T.K. Road, Valanchuzhy, Pathanamthitta, Kerala 689645", phone: "91 0468 222 2001", location: "https://g.co/kgs/MaQwjGS" }
],
"Alappuzha": [
  { name: "Alappuzha North Police Station ", address: " Coirfed Lane, Sea View Ward, Alappuzha, Kerala 688001", phone: "+91  0477 224 5541", location: "https://g.co/kgs/bjLMhXC" },
  { name: "Fire Force Station ", address: "Krishnakripa, Cherthala, Kerala 688524", phone: "NA", location: "https://g.co/kgs/xKfdcCj" }
],
"Kottayam": [
  { name: "Kottayam West Police Station", address: "Kottayam West Police Station Old MC Rd, Kodimatha, Kottayam, Kerala 686013", phone: "  +91 0481 256 7210", location: "https://g.co/kgs/jPjKsF2" },
  { name: "Fire Force Station ", address: "Krishnakripa, Cherthala, Kerala PIN-688524", phone: "NA", location: "https://g.co/kgs/i1hgXrt" },
  { name: "KOTTYAM MEDICAL COLLEGE", address: "Gandhi Nagar, Kottayam, Arpookara, Kerala PIN-686008", phone: " +91 0481-2731050", location: "https://g.co/kgs/bRquUyR" },
  { name: "CHILDLINE KOTTAYAM", address: "Amala nilayam, Vijayapuram social serviece society, Keezhukunnu, Collectorate P O, Kottayam, Kerala PIN-686002 ", phone: " +91  0481 230 7470", location: "https://g.co/kgs/nBxtcxH" }

],
"idukki": [
  { name: "Idukki Police Station", address: "Thodupuzha - Puliyanmala Road, Idukki Colony Post, Cheruthoni, Kerala 685602", phone: ": 04862 235 229", location: "https://g.co/kgs/q5t77Tk" },
  { name: "Fire and Rescue Station, Idukki", address: "Aalin Chuvadu, Road, Alinchuvadu, Kattappana, Kerala 685602", phone: " 04868 272 300", location: "https://g.co/kgs/H3dwWgd" }
],
"Ernakulam": [
  { name: "Cheranalloor Police Station", address: "Cheranalloor Rd, Cheranallur, Kochi, Ernakulam, Kerala 682034", phone: ": 0484 243 0227", location: "https://g.co/kgs/J31qHQn" },
  { name: "Fire and Rescue Station Gandhinagar", address: "Gandhinagar Rd, MIG and HIG Colony, Gandhi Nagar, Kadavanthra, Ernakulam, Kerala 682020", phone: "0484 220 5550", location: "https://g.co/kgs/cJpXDJA" },
],
  // Other districts...
};

export default function ServicesScreen() {
  const [currentScreen, setCurrentScreen] = useState("states");
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current; // Track scroll position
  const { isDarkMode } = useTheme(); // Access dark mode state

  useEffect(() => {
    navigation.setOptions({ headerShown: false }); // Hide header
  }, []);

  const styles = createStyles(isDarkMode); // Dynamically create styles

  const renderStatesScreen = () => (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        contentContainerStyle={styles.container}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16} // Smooth scrolling
      >
        {Object.keys(data).map((state, index) => (
          <Pressable
            key={state}
            style={styles.button}
            onPress={() => {
              setSelectedState(state);
              setCurrentScreen("districts");
            }}
          >
            <Text style={styles.buttonText}>{state}</Text>
          </Pressable>
        ))}
      </Animated.ScrollView>
    </View>
  );

  const renderDistrictsScreen = () => (
    <ScrollView contentContainerStyle={styles.container}>
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{selectedDistrict} Services</Text>
      {services[selectedDistrict]?.length > 0 ? (
        services[selectedDistrict].map((service, index) => (
          <View key={index} style={styles.serviceCard}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceadd}>{service.address}</Text>
            <Pressable onPress={() => Linking.openURL(`tel:${service.phone}`)}>
              <Text style={styles.phoneLink}>CALL: {service.phone}</Text>
            </Pressable >
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
                 style={{ flexDirection: "row",paddingLeft:15,paddingBottom:15, alignItems: "center", marginTop: 6 }}
                >
               <Icon name="location-on" size={29} color="red" style={{ marginRight: 5 }} />
                <Text style={styles.locationLink}>LOCATION</Text>
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
            source={
              isDarkMode
                ? require("@/assets/images/0002.jpg")
                : require("@/assets/images/002.jpg")
            }
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

const createStyles = (isDarkMode) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      alignItems: "center",
      paddingVertical: 20,
    },
    button: {
      backgroundColor: isDarkMode ? "rgba(60, 60, 60, 0.9)" : "rgba(18, 130, 227, 0.91)", // Adjust button color
      padding: 15,
      marginVertical: 10,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
    },
    backgroundImage: {
      flex: 1,
      resizeMode: "cover",
    },
    backButton: {
      backgroundColor: isDarkMode ? "rgba(100, 100, 100, 0.9)" : "rgba(6, 104, 201, 0.8)", // Adjust back button color
      padding: 15,
      marginVertical: 5,
      borderRadius: 10,
      width: "90%",
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 18,
    },
    header: {
      fontSize: 30,
      fontWeight: "bold",
      textAlign: "center",
      color: "white", // Adjust text color
    },
    serviceCard: {
      padding: 10,
      marginVertical: 10,
      backgroundColor: isDarkMode ? "rgba(42, 41, 41, 0.9)" : "rgba(60, 95, 183, 0.8)", // Adjust card color
      borderRadius: 20,
      width: "90%",
    },
    serviceName: {
      fontSize: 22,
      fontWeight: "bold",
      padding: 10,
      textAlign: "center",
      color: isDarkMode ? "white" : "black", // Adjust text color
    },
    serviceadd: {
      fontSize: 15,
      textAlign: "left",
      paddingLeft: 10,
      fontFamily: "Georgia",
      color: "white", // Adjust text color
    },
    phoneLink: {
      color: isDarkMode ? "white" : "white", // Adjust link color
      padding: 10,
      fontWeight: "bold",
      fontSize: 16,
      marginTop: 10,
      textAlign: "left",
    },
    locationLink: {
      color:"white",
      fontWeight: "700",
      fontSize: 20,
    },
  });