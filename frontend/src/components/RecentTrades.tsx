
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

interface Trade {
  asset: string;
  type: string;
  amount: number;
  profit: string;
  time: string;
  status: string;
  payout: string;
}

interface RecentTradesProps {
  recentTrades: Trade[];
}

const RecentTrades = ({ recentTrades }: RecentTradesProps) => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center text-lg">
          <History className="w-5 h-5 mr-2" />
          Recent Trades
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentTrades.map((trade, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
            <div className="flex-1">
              <div className="text-white text-sm font-medium">{trade.asset}</div>
              <div className="text-slate-400 text-xs">{trade.type} • ${trade.amount}</div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-bold ${trade.status === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                {trade.profit}
              </div>
              <div className="text-slate-400 text-xs">{trade.time}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentTrades;
