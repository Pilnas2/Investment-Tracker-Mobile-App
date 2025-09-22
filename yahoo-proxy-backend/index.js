// Jednoduchý Express server pro proxy vyhledávání na Yahoo Finance
const express = require('express');
const cors = require('cors');
const yahooFinance = require('yahoo-finance2').default;

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Endpoint pro vyhledávání investic
app.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Missing q parameter' });
  }
  try {
    const results = await yahooFinance.search(q);
    // Vracíme pouze quotes, jak očekává frontend
    res.json({ quotes: results.quotes || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Endpoint pro získání aktuální ceny akcie podle symbolu
app.get('/quote', async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol parameter' });
  }
  try {
    const result = await yahooFinance.quote(symbol);
    res.json(result); // Vracíme celý výsledek, frontend si vytáhne regularMarketPrice
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Yahoo Proxy Backend running on port ${PORT}`);
});
