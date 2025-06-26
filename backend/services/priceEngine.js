// --- Fiat configuration ---
const fiats = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'CNY', symbol: '¥', rate: 7.25 },
  { code: 'INR', symbol: '₹', rate: 83.1 },
  { code: 'BDT', symbol: '৳', rate: 117.5 }
];

let currentPrice = 1.2345;
let priceDirection = 1;

// Candle state per fiat
let candles = {};
let candleInterval = 60 * 1000; // 1 minute
let candleTimer = null;

const startPriceEngine = (io) => {
  // Start price updates every second
  setInterval(() => {
    // Generate realistic price movement
    const volatility = 0.0001;
    const change = (Math.random() - 0.5) * volatility;
    // Add some trend
    if (Math.random() < 0.1) {
      priceDirection *= -1;
    }
    currentPrice += change + (priceDirection * volatility * 0.1);
    // Keep price in reasonable range
    if (currentPrice < 1.2000) currentPrice = 1.2000;
    if (currentPrice > 1.2700) currentPrice = 1.2700;

    const now = Date.now();
    // For each fiat, simulate conversion and emit price
    fiats.forEach(fiat => {
      const fiatPrice = currentPrice * fiat.rate;
      // --- Candle logic per fiat ---
      if (!candles[fiat.code]) {
        candles[fiat.code] = {
          open: fiatPrice,
          high: fiatPrice,
          low: fiatPrice,
          close: fiatPrice,
          start: now - (now % candleInterval),
          end: now - (now % candleInterval) + candleInterval
        };
      } else {
        candles[fiat.code].high = Math.max(candles[fiat.code].high, fiatPrice);
        candles[fiat.code].low = Math.min(candles[fiat.code].low, fiatPrice);
        candles[fiat.code].close = fiatPrice;
      }
      // Emit price update for this fiat
      io.emit('priceUpdate', {
        fiat: fiat.code,
        price: fiatPrice,
        symbol: fiat.symbol,
        timestamp: now,
        change: change > 0 ? 'up' : 'down'
      });
    });
  }, 1000); // Update every second

  // Emit candle every minute for each fiat
  candleTimer = setInterval(() => {
    const now = Date.now();
    fiats.forEach(fiat => {
      const candle = candles[fiat.code];
      if (candle) {
        io.emit('candleUpdate', {
          fiat: fiat.code,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          start: candle.start,
          end: candle.end
        });
        // Start new candle for this fiat
        const fiatPrice = currentPrice * fiat.rate;
        candles[fiat.code] = {
          open: fiatPrice,
          high: fiatPrice,
          low: fiatPrice,
          close: fiatPrice,
          start: now - (now % candleInterval),
          end: now - (now % candleInterval) + candleInterval
        };
      }
    });
  }, candleInterval);
};

const getCurrentPrice = (fiat = 'USD') => {
  const fiatObj = fiats.find(f => f.code === fiat);
  return fiatObj ? currentPrice * fiatObj.rate : currentPrice;
};

module.exports = { startPriceEngine, getCurrentPrice };