import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./screens/Home";
import ProfileScreen from "./screens/Profile";
import EditProfileScreen from "./screens/EditProfileScreen";
import Budget from "./screens/Budget";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import DataScreen from "./screens/DataScreen";
import { UserProvider } from "./data/UserContext";
import SearchScreen from "./screens/SearchScreen";
import { Ionicons } from "@expo/vector-icons";

const queryClient = new QueryClient();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Budget") {
            iconName = focused ? "wallet" : "wallet-outline";
          } else if (route.name === "Search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Data") {
            iconName = focused ? "analytics" : "analytics-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: [{ display: "flex" }, null],
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Budget" component={Budget} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Data" component={DataScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Main" component={MainApp} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </QueryClientProvider>
    </UserProvider>
  );
}
