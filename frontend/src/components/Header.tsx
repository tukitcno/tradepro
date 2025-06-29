
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  Bell,
  Settings,
  Wallet,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface HeaderProps {
  balance: number;
}

const Header = ({ balance }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">TradePro</span>
          <div className="hidden md:flex items-center space-x-4 ml-8">
            <span className="text-sm text-slate-400">Live Trading</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white bg-slate-800 px-4 py-2 rounded-lg">
            <Wallet className="w-4 h-4" />
            <span className="font-bold text-lg">${balance.toLocaleString()}</span>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <Settings className="w-4 h-4" />
          </Button>
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
              JD
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-300 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
