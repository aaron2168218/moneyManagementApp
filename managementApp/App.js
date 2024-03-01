import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Home'; // Assuming you have a Home.js
import ProfileScreen from './Profile'; // Assuming you have a Profile.js

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        {/* You can add more Tab.Screen components here for additional tabs */}
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
