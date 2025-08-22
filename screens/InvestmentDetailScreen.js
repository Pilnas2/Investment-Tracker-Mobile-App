import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';
import axios from 'axios';

export default function InvestmentDetailScreen({ route }) {
  const { investment } = route.params || {};
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugResponse, setDebugResponse] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!investment?.symbol) return;
      setLoading(true);
      setError('');
      try {
  const url = `http://192.168.0.136:4000/quote?symbol=${investment.symbol}`;
        const response = await axios.get(url);
        setDebugResponse(response.data); // Uložení celé odpovědi pro debug
        // Ošetření různých struktur odpovědi
        let price = null;
        if (response.data?.result?.regularMarketPrice) {
          price = response.data.result.regularMarketPrice;
        } else if (response.data?.regularMarketPrice) {
          price = response.data.regularMarketPrice;
        } else if (typeof response.data === 'number') {
          price = response.data;
        }
        if (price !== null) {
          setCurrentPrice(price);
        } else {
          setError('Aktuální cena není dostupná v odpovědi backendu.');
          setCurrentPrice(null);
        }
      } catch (e) {
        setError('Chyba při načítání aktuální ceny.');
        setCurrentPrice(null);
      }
      setLoading(false);
    };
    fetchPrice();
  }, [investment]);

  let profit = null;
  if (currentPrice !== null && investment?.buyPrice && investment?.quantity) {
    profit = (currentPrice - investment.buyPrice) * investment.quantity;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detail investice</Text>
      {investment && (
        <>
          <Text style={styles.label}>Název: <Text style={styles.value}>{investment.shortname || investment.symbol}</Text></Text>
          <Text style={styles.label}>Symbol: <Text style={styles.value}>{investment.symbol}</Text></Text>
          <Text style={styles.label}>Nákupní cena: <Text style={styles.value}>{investment.buyPrice} Kč</Text></Text>
          <Text style={styles.label}>Množství: <Text style={styles.value}>{investment.quantity}</Text></Text>
        </>
      )}
      {loading && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 24 }} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {currentPrice !== null && !loading && !error && (
        <Text style={styles.label}>Aktuální cena: <Text style={styles.value}>{currentPrice} Kč</Text></Text>
      )}
      {profit !== null && !loading && !error && (
        <Text style={[styles.label, { marginTop: 16 }]}>Zisk / Ztráta: <Text style={[styles.value, { color: profit >= 0 ? '#4CAF50' : '#FF5252' }]}>{profit.toFixed(2)} Kč</Text></Text>
      )}
      {/* Debug sekce - zobrazí celou odpověď z backendu vždy */}
      <View style={{ marginTop: 32, backgroundColor: '#222', padding: 12, borderRadius: 8, width: '100%' }}>
        <Text style={{ color: '#FFD700', fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>DEBUG odpověď backendu:</Text>
        <Text style={{ color: '#FFD700', fontSize: 11 }}>
          {debugResponse ? JSON.stringify(debugResponse, null, 2) : 'Žádná odpověď zatím nebyla načtena.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 24,
  },
  title: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 32,
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
  },
  label: {
    color: COLORS.text,
    fontSize: 18,
    marginBottom: 8,
  },
  value: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  error: {
    color: '#FF5252',
    marginTop: 16,
    fontSize: 16,
  },
});
