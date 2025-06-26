let currentPrice = 1.2345;
let priceDirection = 1;

const startPriceEngine = (io) => {
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
    
    // Emit price update to all connected clients
    io.emit('priceUpdate', {
      price: currentPrice,
      timestamp: Date.now(),
      change: change > 0 ? 'up' : 'down'
    });
  }, 1000); // Update every second
};

const getCurrentPrice = () => currentPrice;

module.exports = { startPriceEngine, getCurrentPrice };