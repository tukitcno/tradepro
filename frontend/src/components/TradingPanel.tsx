
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock,
  Play
} from "lucide-react";

interface Asset {
  name: string;
  price: string;
  change: string;
  trend: string;
  payout: string;
}

interface TradingPanelProps {
  selectedAsset: string;
  setSelectedAsset: (asset: string) => void;
  tradeAmount: string;
  setTradeAmount: (amount: string) => void;
  assets: Asset[];
  handleTrade: (direction: 'higher' | 'lower') => void;
  isTrading: boolean;
  countdown: number;
  formatTime: (seconds: number) => string;
}

const TradingPanel = ({ 
  selectedAsset, 
  setSelectedAsset, 
  tradeAmount, 
  setTradeAmount, 
  assets, 
  handleTrade, 
  isTrading, 
  countdown, 
  formatTime 
}: TradingPanelProps) => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center">
          <Play className="w-5 h-5 mr-2" />
          Binary Options Trading
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm font-medium">Asset</Label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {assets.map((asset) => (
                  <SelectItem key={asset.name} value={asset.name} className="text-white">
                    <div className="flex items-center justify-between w-full">
                      <span>{asset.name}</span>
                      <span className="text-green-400 ml-4">{asset.payout}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm font-medium">Investment Amount</Label>
            <div className="relative">
              <Input
                type="number"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white h-12 pl-8"
                placeholder="Enter amount"
              />
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm font-medium">Potential Profit</Label>
            <div className="bg-slate-800 border border-slate-700 rounded-md h-12 flex items-center px-3">
              <span className="text-green-400 font-bold">
                +${(parseFloat(tradeAmount || '0') * 0.8).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white h-14 text-lg font-semibold"
            onClick={() => handleTrade('higher')}
            disabled={isTrading}
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            HIGHER
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white h-14 text-lg font-semibold"
            onClick={() => handleTrade('lower')}
            disabled={isTrading}
          >
            <TrendingDown className="w-5 h-5 mr-2" />
            LOWER
          </Button>
        </div>
        
        {isTrading && (
          <div className="mt-4 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-400">Active Trade: {selectedAsset}</span>
              <span className="text-white font-mono text-lg">{formatTime(countdown)}</span>
            </div>
            <div className="mt-2 bg-slate-800 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((60 - countdown) / 60) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingPanel;
