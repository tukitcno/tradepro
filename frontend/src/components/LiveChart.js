import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

const FIATS = [
  { code: 'USD', label: 'US Dollar' },
  { code: 'GBP', label: 'British Pound' },
  { code: 'CNY', label: 'Chinese Yuan' },
  { code: 'INR', label: 'Indian Rupee' },
  { code: 'BDT', label: 'Bangladeshi Taka' },
];

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LiveChart = ({ onTrade, lastTradeResult, selectedSignal }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const candleSeriesRef = useRef();
  const [candles, setCandles] = useState([]);
  const [fiat, setFiat] = useState('USD');
  const [prediction, setPrediction] = useState(null);
  const [amount, setAmount] = useState(10);
  const [duration, setDuration] = useState(1); // in minutes
  const [price, setPrice] = useState(null);

  useEffect(() => {
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 350,
      layout: {
        background: { type: 'solid', color: '#181c24' },
        textColor: '#fff',
      },
      grid: { vertLines: { color: '#222' }, horzLines: { color: '#222' } },
      timeScale: { timeVisible: true, secondsVisible: false },
      crosshair: { mode: 1 },
    });
    candleSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#16c784', downColor: '#ea3943', borderVisible: false, wickUpColor: '#16c784', wickDownColor: '#ea3943',
    });
    candleSeriesRef.current.setData([]);
    return () => chartRef.current.remove();
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on('connect', () => {
      // Optionally send fiat selection to backend
    });
    socket.on('candleUpdate', (candle) => {
      setCandles((prev) => {
        const newCandles = [...prev, {
          time: Math.floor(candle.start / 1000),
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }];
        if (newCandles.length > 100) newCandles.shift();
        return newCandles;
      });
    });
    socket.on('priceUpdate', (data) => {
      setPrice(data.price);
    });
    return () => socket.disconnect();
  }, [fiat]);

  useEffect(() => {
    if (candleSeriesRef.current) {
      candleSeriesRef.current.setData(candles);
    }
  }, [candles]);

  useEffect(() => {
    if (lastTradeResult) {
      if (lastTradeResult.status === 'won') {
        toast.success(`You WON! +${lastTradeResult.payout?.toFixed(2)} ${lastTradeResult.fiat || ''}`);
      } else if (lastTradeResult.status === 'lost') {
        toast.error(`You lost. -${lastTradeResult.amount?.toFixed(2)} ${lastTradeResult.fiat || ''}`);
      }
    }
  }, [lastTradeResult]);

  useEffect(() => {
    if (selectedSignal) {
      setFiat(selectedSignal.pair.split('/')[0]);
    }
  }, [selectedSignal]);

  // Add trade placement handler
  const handlePlaceTrade = async () => {
    if (!prediction || !amount || !duration) return;
    if (onTrade) {
      await onTrade({
        amount,
        direction: prediction,
        duration: duration * 60, // convert minutes to seconds
        fiat
      });
      setPrediction(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-[#23272f] rounded-xl shadow-2xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-300">Pair:</span>
          <span className="text-white font-bold">{selectedSignal ? selectedSignal.pair : fiat}</span>
        </div>
        <div className="text-2xl font-bold text-green-400 animate-pulse">{price ? `${price.toFixed(5)} ${fiat}` : '--'}</div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[350px]" />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setPrediction('up')} className={`px-6 py-2 rounded-lg font-bold transition-all ${prediction==='up' ? 'bg-green-500 text-white scale-105' : 'bg-[#181c24] text-green-400 hover:bg-green-600 hover:text-white'}`}>UP</button>
          <button onClick={() => setPrediction('down')} className={`px-6 py-2 rounded-lg font-bold transition-all ${prediction==='down' ? 'bg-red-500 text-white scale-105' : 'bg-[#181c24] text-red-400 hover:bg-red-600 hover:text-white'}`}>DOWN</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-300">Time:</span>
          <input type="range" min={1} max={15} value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-32 accent-blue-500" />
          <span className="text-white font-bold">{duration}m</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-300">Amount:</span>
          <input type="range" min={1} max={1000} value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-32 accent-green-500" />
          <span className="text-white font-bold">{amount} {fiat}</span>
        </div>
        <button
          onClick={handlePlaceTrade}
          className={`px-8 py-2 rounded-lg font-bold transition-all bg-blue-600 text-white hover:bg-blue-700 mt-4 ${!prediction ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!prediction}
        >
          Place Trade
        </button>
      </div>
    </div>
  );
};

export default LiveChart;
