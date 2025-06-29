
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

interface Asset {
  name: string;
  price: string;
  change: string;
  trend: string;
  payout: string;
}

interface AssetsListProps {
  assets: Asset[];
  selectedAsset: string;
  setSelectedAsset: (asset: string) => void;
}

const AssetsList = ({ assets, selectedAsset, setSelectedAsset }: AssetsListProps) => {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center text-lg">
          <BarChart3 className="w-5 h-5 mr-2" />
          Assets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {assets.slice(0, 5).map((asset) => (
          <div 
            key={asset.name} 
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
              selectedAsset === asset.name 
                ? 'bg-blue-600/20 border border-blue-600/30' 
                : 'bg-slate-800/50 hover:bg-slate-800'
            }`}
            onClick={() => setSelectedAsset(asset.name)}
          >
            <div className="flex-1">
              <div className="text-white font-medium text-sm">{asset.name}</div>
              <div className="text-slate-400 text-xs">{asset.price}</div>
            </div>
            <div className="text-right">
              <Badge 
                variant="secondary" 
                className={`text-xs ${asset.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
              >
                {asset.change}
              </Badge>
              <div className="text-xs text-slate-400 mt-1">{asset.payout}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AssetsList;
