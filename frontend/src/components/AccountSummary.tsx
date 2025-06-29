
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface AccountSummaryProps {
  balance: number;
  todaysPnL: number;
  winRate: number;
  isTrading: boolean;
}

const AccountSummary = ({ balance, todaysPnL, winRate, isTrading }: AccountSummaryProps) => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center text-lg">
          <User className="w-5 h-5 mr-2" />
          Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Balance:</span>
          <span className="text-white font-bold text-lg">${balance.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Today's P&L:</span>
          <span className={`font-bold ${todaysPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {todaysPnL >= 0 ? '+' : ''}${todaysPnL.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Win Rate:</span>
          <span className="text-white font-bold">{winRate}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-sm">Active Trades:</span>
          <span className="text-white font-bold">{isTrading ? '1' : '0'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountSummary;
