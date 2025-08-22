import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Přehled portfolia</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Portfolio')}>
        <Text style={styles.buttonText}>Portfolio</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Stats')}>
        <Text style={styles.buttonText}>Statistiky</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Watchlist')}>
        <Text style={styles.buttonText}>Watchlist</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Nastavení</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  button: {
    backgroundColor: COLORS.card,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 12,
    width: 220,
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
