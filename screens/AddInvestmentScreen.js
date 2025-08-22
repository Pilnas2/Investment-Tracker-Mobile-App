
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';

export default function AddInvestmentScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const searchYahooProxy = async (text) => {
    setQuery(text);
    if (text.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const url = `http://192.168.0.136:4000/search?q=${encodeURIComponent(text)}`;
      const response = await axios.get(url);
      setResults(response.data.quotes || []);
    } catch (e) {
      setError('Chyba při vyhledávání.');
      setResults([]);
    }
    setLoading(false);
  };

  const handleAdd = (item) => {
    setSelectedInvestment(item);
    setPrice('');
    setQuantity('');
  };

  const handleConfirmAdd = async () => {
    if (!price || isNaN(price) || Number(price) <= 0) {
      alert('Zadej platnou nákupní cenu.');
      return;
    }
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      alert('Zadej platné množství.');
      return;
    }
    try {
      const key = 'investments';
      const stored = await AsyncStorage.getItem(key);
      let investments = stored ? JSON.parse(stored) : [];
      if (!investments.some(inv => inv.symbol === selectedInvestment.symbol)) {
        investments.push({ ...selectedInvestment, buyPrice: Number(price), quantity: Number(quantity) });
        await AsyncStorage.setItem(key, JSON.stringify(investments));
        alert(`Přidáno: ${selectedInvestment.shortname || selectedInvestment.symbol}`);
        setSelectedInvestment(null);
        setPrice('');
        setQuantity('');
      } else {
        alert('Tato investice už je v portfoliu.');
      }
    } catch (e) {
      alert('Chyba při ukládání investice.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Přidání investice</Text>
      <TextInput
        style={styles.input}
        placeholder="Vyhledej akcii, ETF..."
        placeholderTextColor={COLORS.accent}
        value={query}
        onChangeText={searchYahooProxy}
      />
      {loading && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 16 }} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={results}
        keyExtractor={item => item.symbol}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem} onPress={() => handleAdd(item)}>
            <Text style={styles.resultText}>{item.shortname || item.symbol} <Text style={{ color: COLORS.accent }}>{item.symbol}</Text></Text>
          </TouchableOpacity>
        )}
        style={{ width: '100%' }}
      />

      {selectedInvestment && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Zadej nákupní cenu a množství</Text>
            <Text style={styles.resultText}>{selectedInvestment.shortname || selectedInvestment.symbol} <Text style={{ color: COLORS.accent }}>{selectedInvestment.symbol}</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Nákupní cena"
              placeholderTextColor={COLORS.accent}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              autoFocus
            />
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              placeholder="Množství (např. počet akcií)"
              placeholderTextColor={COLORS.accent}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: 'row', marginTop: 16 }}>
              <TouchableOpacity style={[styles.button, { flex: 1, marginRight: 8 }]} onPress={handleConfirmAdd}>
                <Text style={styles.buttonText}>Přidat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { flex: 1, backgroundColor: COLORS.border, marginLeft: 8 }]} onPress={() => setSelectedInvestment(null)}>
                <Text style={styles.buttonText}>Zrušit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 24,
    width: 320,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
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
    marginBottom: 24,
    marginTop: 24,
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.card,
    color: COLORS.text,
    borderRadius: 8,
    padding: 14,
    fontSize: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  resultText: {
    color: COLORS.text,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 12,
  },
});


