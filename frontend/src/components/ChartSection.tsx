
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import TradingChart from "@/components/TradingChart";

interface Asset {
  name: string;
  price: string;
  change: string;
  trend: string;
  payout: string;
}

interface ChartSectionProps {
  selectedAsset: string;
  assets: Asset[];
  isTrading: boolean;
  countdown: number;
  formatTime: (seconds: number) => string;
}

const ChartSection = ({ selectedAsset, assets, isTrading, countdown, formatTime }: ChartSectionProps) => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-white text-xl">{selectedAsset}</CardTitle>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-sm">
              Payout: {assets.find(a => a.name === selectedAsset)?.payout}
            </Badge>
          </div>
          {isTrading && (
            <div className="flex items-center space-x-2 bg-blue-600/20 px-3 py-1 rounded-lg">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-mono text-lg">{formatTime(countdown)}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <TradingChart />
      </CardContent>
    </Card>
  );
};

export default ChartSection;
