import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PortfolioListScreen from '../screens/PortfolioListScreen';
import AddInvestmentScreen from '../screens/AddInvestmentScreen';
import InvestmentDetailScreen from '../screens/InvestmentDetailScreen';
import StatsScreen from '../screens/StatsScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BottomTabNavigator from './BottomTabNavigator';
import { COLORS } from '../constants/colors';

const Stack = createStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background,
    card: COLORS.card,
    text: COLORS.text,
    border: COLORS.border,
    primary: COLORS.primary,
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.card,
            borderBottomWidth: 0,
            shadowColor: COLORS.primary,
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          },
          headerTintColor: COLORS.primary,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 22,
            color: COLORS.primary,
            letterSpacing: 1,
          },
        }}
      >
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
  <Stack.Screen name="AddInvestment" component={AddInvestmentScreen} />
  <Stack.Screen name="InvestmentDetail" component={InvestmentDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
