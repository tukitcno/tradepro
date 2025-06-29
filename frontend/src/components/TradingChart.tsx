
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useState, useEffect } from 'react';

const TradingChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState(1.0856);

  // Generate realistic candlestick data
  const generateCandlestickData = () => {
    const newData = [];
    let basePrice = 1.0856;
    
    for (let i = 0; i < 50; i++) {
      const time = new Date(Date.now() - (50 - i) * 60000);
      const timeStr = time.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      // Generate OHLC data
      const open = basePrice;
      const volatility = (Math.random() - 0.5) * 0.01;
      const high = open + Math.abs(volatility) + Math.random() * 0.005;
      const low = open - Math.abs(volatility) - Math.random() * 0.005;
      const close = open + volatility;
      
      basePrice = close;
      
      const isGreen = close > open;
      
      newData.push({
        time: timeStr,
        open: parseFloat(open.toFixed(4)),
        high: parseFloat(high.toFixed(4)),
        low: parseFloat(low.toFixed(4)),
        close: parseFloat(close.toFixed(4)),
        volume: Math.floor(Math.random() * 1000) + 500,
        color: isGreen ? '#00ff88' : '#ff4757',
        isGreen
      });
    }
    
    setCurrentPrice(basePrice);
    return newData;
  };

  useEffect(() => {
    const initialData = generateCandlestickData();
    setData(initialData);
    
    // Update chart every 3 seconds
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        const lastPoint = newData[newData.length - 1];
        
        // Update last candle
        const volatility = (Math.random() - 0.5) * 0.005;
        const newClose = lastPoint.open + volatility;
        const newHigh = Math.max(lastPoint.high, newClose);
        const newLow = Math.min(lastPoint.low, newClose);
        
        newData[newData.length - 1] = {
          ...lastPoint,
          close: parseFloat(newClose.toFixed(4)),
          high: parseFloat(newHigh.toFixed(4)),
          low: parseFloat(newLow.toFixed(4)),
          color: newClose > lastPoint.open ? '#00ff88' : '#ff4757',
          isGreen: newClose > lastPoint.open
        };
        
        setCurrentPrice(newClose);
        return newData;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-600 rounded-lg p-3 shadow-xl">
          <p className="text-slate-300 text-sm font-semibold">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-white">Open: <span className="text-blue-400">{data.open}</span></p>
            <p className="text-white">High: <span className="text-green-400">{data.high}</span></p>
            <p className="text-white">Low: <span className="text-red-400">{data.low}</span></p>
            <p className="text-white">Close: <span className={data.isGreen ? 'text-green-400' : 'text-red-400'}>{data.close}</span></p>
            <p className="text-slate-300">Volume: {data.volume}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CandlestickBar = (props: any) => {
    const { payload, x, y, width, height } = props;
    if (!payload) return null;
    
    const { open, high, low, close, isGreen } = payload;
    const color = isGreen ? '#00ff88' : '#ff4757';
    
    // Calculate positions
    const yScale = height / (Math.max(...data.map(d => d.high)) - Math.min(...data.map(d => d.low)));
    const minPrice = Math.min(...data.map(d => d.low));
    
    const openY = y + (Math.max(...data.map(d => d.high)) - open) * yScale;
    const closeY = y + (Math.max(...data.map(d => d.high)) - close) * yScale;
    const highY = y + (Math.max(...data.map(d => d.high)) - high) * yScale;
    const lowY = y + (Math.max(...data.map(d => d.high)) - low) * yScale;
    
    const bodyHeight = Math.abs(closeY - openY);
    const bodyY = Math.min(openY, closeY);
    const bodyWidth = width * 0.8;
    const bodyX = x + (width - bodyWidth) / 2;
    
    return (
      <g>
        {/* High-Low line */}
        <line
          x1={x + width / 2}
          y1={highY}
          x2={x + width / 2}
          y2={lowY}
          stroke={color}
          strokeWidth={1}
        />
        {/* Body rectangle */}
        <rect
          x={bodyX}
          y={bodyY}
          width={bodyWidth}
          height={Math.max(bodyHeight, 2)}
          fill={isGreen ? color : 'transparent'}
          stroke={color}
          strokeWidth={1}
        />
      </g>
    );
  };

  return (
    <div className="w-full h-96 bg-slate-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-white">{currentPrice.toFixed(4)}</span>
          <span className={`text-sm px-2 py-1 rounded ${
            currentPrice > 1.0856 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {currentPrice > 1.0856 ? '+' : ''}{((currentPrice - 1.0856) * 100).toFixed(2)}%
          </span>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600">1m</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">5m</button>
          <button className="px-3 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600">15m</button>
          <button className="px-3 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600">1h</button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="1 1" stroke="#374151" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF"
            fontSize={11}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={11}
            domain={['dataMin - 0.005', 'dataMax + 0.005']}
            tickFormatter={(value) => value.toFixed(4)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="high"
            fill="transparent"
            shape={<CandlestickBar />}
          />
          <ReferenceLine y={currentPrice} stroke="#3B82F6" strokeDasharray="2 2" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradingChart;
