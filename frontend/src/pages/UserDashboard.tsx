import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import AccountSummary from "@/components/AccountSummary";
import ChartSection from "@/components/ChartSection";
import TradingPanel from "@/components/TradingPanel";
import AssetsList from "@/components/AssetsList";
import RecentTrades from "@/components/RecentTrades";
import { connectDeriv, sendDerivMessage, closeDerivConnection } from "@/lib/derivApi";

const DERIV_TOKEN = "***********wWFq"; // Place your real token here

const UserDashboard = () => {
  const [balance, setBalance] = useState(10000);
  const [tradeAmount, setTradeAmount] = useState('100');
  const [selectedAsset, setSelectedAsset] = useState('EUR/USD');
  const [countdown, setCountdown] = useState(0);
  const [isTrading, setIsTrading] = useState(false);
  const [winRate, setWinRate] = useState(78);
  const [todaysPnL, setTodaysPnL] = useState(247.50);

  // Trading countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isTrading) {
      setIsTrading(false);
      // Simulate trade result
      const isWin = Math.random() > 0.3;
      const amount = parseFloat(tradeAmount);
      const payout = isWin ? amount * 0.8 : -amount;
      setBalance(prev => prev + payout);
      setTodaysPnL(prev => prev + payout);
      
      toast.success(
        isWin ? `Trade Won! +$${payout.toFixed(2)}` : `Trade Lost! -$${Math.abs(payout).toFixed(2)}`,
        {
          description: `${selectedAsset} trade completed`,
        }
      );
    }
    return () => clearInterval(interval);
  }, [countdown, isTrading, tradeAmount, selectedAsset]);

  const assets = [
    { name: 'EUR/USD', price: '1.0856', change: '+0.23%', trend: 'up', payout: '85%' },
    { name: 'GBP/USD', price: '1.2743', change: '-0.15%', trend: 'down', payout: '82%' },
    { name: 'USD/JPY', price: '149.82', change: '+0.45%', trend: 'up', payout: '88%' },
    { name: 'BTC/USD', price: '43,250', change: '+2.1%', trend: 'up', payout: '80%' },
    { name: 'ETH/USD', price: '2,685', change: '-1.2%', trend: 'down', payout: '83%' },
    { name: 'Gold', price: '2,025', change: '+0.8%', trend: 'up', payout: '85%' },
  ];

  const recentTrades = [
    { asset: 'EUR/USD', type: 'HIGHER', amount: 250, profit: '+$200.00', time: '2 min ago', status: 'win', payout: '80%' },
    { asset: 'BTC/USD', type: 'LOWER', amount: 500, profit: '-$500.00', time: '5 min ago', status: 'loss', payout: '85%' },
    { asset: 'Gold', type: 'HIGHER', amount: 150, profit: '+$127.50', time: '8 min ago', status: 'win', payout: '85%' },
    { asset: 'USD/JPY', type: 'HIGHER', amount: 300, profit: '+$246.00', time: '12 min ago', status: 'win', payout: '82%' },
  ];

  const handleTrade = (direction: 'higher' | 'lower') => {
    const amount = parseFloat(tradeAmount);
    if (amount <= 0 || amount > balance) {
      toast.error('Invalid trade amount');
      return;
    }
    
    if (isTrading) {
      toast.error('Please wait for current trade to finish');
      return;
    }
    
    setIsTrading(true);
    setCountdown(60); // 1 minute trade
    setBalance(prev => prev - amount);
    
    toast.success(`${direction.toUpperCase()} trade placed for ${selectedAsset}`, {
      description: `Amount: $${amount} • Duration: 1 minute`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Deriv API connection
  const wsRef = useRef<WebSocket | null>(null);

  const handleDerivConnect = useCallback(() => {
    if (wsRef.current) return;
    wsRef.current = connectDeriv(
      (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.msg_type === "authorize") {
          toast.success("Deriv API authorized!");
        } else if (data.error) {
          toast.error(`Deriv error: ${data.error.message}`);
        }
      },
      () => {
        // On open, send authorize
        sendDerivMessage({ authorize: DERIV_TOKEN });
      },
      (err) => toast.error("WebSocket error: " + err.message),
      () => {
        wsRef.current = null;
        toast("Deriv WebSocket closed");
      }
    );
  }, []);

  useEffect(() => {
    handleDerivConnect();
    return () => closeDerivConnection();
  }, [handleDerivConnect]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Header balance={balance} />

      <div className="flex">
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            {/* Chart Section */}
            <div className="xl:col-span-3 space-y-4">
              <ChartSection 
                selectedAsset={selectedAsset}
                assets={assets}
                isTrading={isTrading}
                countdown={countdown}
                formatTime={formatTime}
              />

              <TradingPanel 
                selectedAsset={selectedAsset}
                setSelectedAsset={setSelectedAsset}
                tradeAmount={tradeAmount}
                setTradeAmount={setTradeAmount}
                assets={assets}
                handleTrade={handleTrade}
                isTrading={isTrading}
                countdown={countdown}
                formatTime={formatTime}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <AccountSummary 
                balance={balance}
                todaysPnL={todaysPnL}
                winRate={winRate}
                isTrading={isTrading}
              />

              <AssetsList 
                assets={assets}
                selectedAsset={selectedAsset}
                setSelectedAsset={setSelectedAsset}
              />

              <RecentTrades recentTrades={recentTrades} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
