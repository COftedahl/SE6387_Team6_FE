import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

// Screens
import MapScreen from '../screens/MapScreen';
import ReportScreen from '../screens/ReportScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Screen names
const mapName = "DFW Airport: Terminal D Interactive Map";
const reportName = "Submit Report";
const profileName = "Profile";

const Tab = createBottomTabNavigator();

export default function NavContainer() {
    return(
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={mapName}
                screenOptions={({route}) => ({
                    headerStyle: {
                        borderBottomWidth: 3,
                        borderBottomColor: '#FF3B00',
                    },
                    
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;
                        let rn = route.name;

                        if (rn === mapName) {
                            iconName = focused ? 'location' : 'location-outline';
                        } else if (rn === reportName) {
                            iconName = focused ? 'warning' : 'warning-outline';
                        } else if (rn === profileName) {
                            iconName = focused ? 'person' : 'person-outline';
                        }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#FF3B00',
                tabBarInactiveTintColor: '#666666',
                tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
                tabBarStyle: { padding: 10, height: 70 },
                })}>

                <Tab.Screen name={reportName} component={ReportScreen} options={{ tabBarLabel: 'Report' }} />
                <Tab.Screen name={mapName} component={MapScreen} options={{ tabBarLabel: 'Navigate' }} />
                <Tab.Screen name={profileName} component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}