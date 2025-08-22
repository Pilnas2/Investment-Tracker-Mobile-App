import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function PortfolioListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seznam investic</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('AddInvestment')}>
        <Text style={styles.buttonText}>Přidat investici</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('InvestmentDetail')}>
        <Text style={styles.buttonText}>Detail investice</Text>
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
