import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PortfolioListScreen({ navigation }) {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInvestments = async () => {
    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem('investments');
      setInvestments(stored ? JSON.parse(stored) : []);
    } catch (e) {
      setInvestments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadInvestments);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (symbol) => {
    Alert.alert(
      'Smazat investici',
      'Opravdu chceš tuto investici smazat?',
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Smazat', style: 'destructive', onPress: async () => {
            try {
              const key = 'investments';
              const stored = await AsyncStorage.getItem(key);
              let investments = stored ? JSON.parse(stored) : [];
              investments = investments.filter(inv => inv.symbol !== symbol);
              await AsyncStorage.setItem(key, JSON.stringify(investments));
              setInvestments(investments);
            } catch (e) {
              alert('Chyba při mazání investice.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seznam investic</Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate('AddInvestment')}>
        <Text style={styles.buttonText}>Přidat investici</Text>
      </Pressable>
      <FlatList
        data={investments}
        keyExtractor={item => item.symbol}
        style={{ width: '100%', marginTop: 24 }}
        ListEmptyComponent={!loading && <Text style={{ color: COLORS.text, textAlign: 'center', marginTop: 24 }}>Žádné investice</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.investmentItem}
            onPress={() => navigation.navigate('InvestmentDetail', { investment: item })}
            onLongPress={() => handleDelete(item.symbol)}
          >
            <Text style={styles.investmentName}>{item.shortname || item.symbol}</Text>
            <Text style={styles.investmentSymbol}>{item.symbol}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  investmentItem: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 8,
    shadowColor: COLORS.accent,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  investmentName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  investmentSymbol: {
    color: COLORS.accent,
    fontSize: 14,
    marginTop: 2,
  },
});
