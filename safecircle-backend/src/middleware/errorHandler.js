import React, { useState, useEffect, useRef } from "react";import {  Appearance,  StyleSheet,  TouchableOpacity,  SafeAreaView,  FlatList,  View,  Text,  Animated,  ImageBackground,  StatusBar,  Linking,} from "react-native";import { Colors } from "@/constants/Colors";import Toast from "react-native-toast-message";import EditEmergencyOption from "./edit-emergency-option";import { FontAwesome } from "@expo/vector-icons";import { useNavigation } from "@react-navigation/native";import rctimage from "@/assets/images/a7395e40-2054-4147-8314-728e940a8063.jpg";// Default emergency optionsconst defaultOptions = [