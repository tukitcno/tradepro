
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Eye,
  UserX,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const stats = [
    { title: "Total Users", value: "12,847", change: "+12%", icon: Users, color: "blue" },
    { title: "Total Volume", value: "$2.4M", change: "+8%", icon: DollarSign, color: "green" },
    { title: "Active Trades", value: "1,234", change: "+15%", icon: TrendingUp, color: "purple" },
    { title: "Platform Uptime", value: "99.9%", change: "+0.1%", icon: Activity, color: "emerald" },
  ];

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", balance: 5250, trades: 47, status: "active", lastActive: "2 min ago" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", balance: 12750, trades: 89, status: "active", lastActive: "5 min ago" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", balance: 3400, trades: 23, status: "restricted", lastActive: "1 hour ago" },
    { id: 4, name: "Sarah Wilson", email: "sarah@example.com", balance: 8900, trades: 156, status: "active", lastActive: "12 min ago" },
    { id: 5, name: "Tom Brown", email: "tom@example.com", balance: 0, trades: 12, status: "suspended", lastActive: "2 days ago" },
  ];

  const trades = [
    { id: "T001", user: "John Doe", asset: "EUR/USD", type: "CALL", amount: 500, result: "win", profit: 95, time: "2 min ago" },
    { id: "T002", user: "Jane Smith", asset: "BTC/USD", type: "PUT", amount: 1000, result: "loss", profit: -1000, time: "3 min ago" },
    { id: "T003", user: "Mike Johnson", asset: "Gold", type: "CALL", amount: 250, result: "win", profit: 47.5, time: "5 min ago" },
    { id: "T004", user: "Sarah Wilson", asset: "USD/JPY", type: "PUT", amount: 750, result: "win", profit: 142.5, time: "8 min ago" },
  ];

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleUserAction = (action: string, userId: number) => {
    toast.success(`User ${action} successfully`);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TradePro Admin</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              System Online
            </Badge>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-r from-red-500 to-orange-600 text-white text-sm">
                AD
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

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-white text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-slate-700">Users</TabsTrigger>
            <TabsTrigger value="trades" className="data-[state=active]:bg-slate-700">Trades</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">User Management</CardTitle>
                    <CardDescription className="text-slate-400">
                      Manage user accounts and permissions
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input 
                        placeholder="Search users..." 
                        className="pl-10 bg-slate-700 border-slate-600 text-white w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">User</TableHead>
                      <TableHead className="text-slate-300">Balance</TableHead>
                      <TableHead className="text-slate-300">Trades</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Last Active</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="border-slate-700">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-slate-700 text-white text-sm">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-white font-medium">{user.name}</p>
                              <p className="text-slate-400 text-sm">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-white">${user.balance.toLocaleString()}</TableCell>
                        <TableCell className="text-white">{user.trades}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={
                              user.status === 'active' ? 'bg-green-500/20 text-green-400' :
                              user.status === 'restricted' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400">{user.lastActive}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-slate-400 hover:text-white"
                              onClick={() => handleUserAction('viewed', user.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {user.status !== 'suspended' && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleUserAction('suspended', user.id)}
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trades" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Recent Trades</CardTitle>
                    <CardDescription className="text-slate-400">
                      Monitor all trading activity
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                    <Download className="w-4 h-4 mr-2" />
                    Export Trades
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Trade ID</TableHead>
                      <TableHead className="text-slate-300">User</TableHead>
                      <TableHead className="text-slate-300">Asset</TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Amount</TableHead>
                      <TableHead className="text-slate-300">Result</TableHead>
                      <TableHead className="text-slate-300">P&L</TableHead>
                      <TableHead className="text-slate-300">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trades.map((trade) => (
                      <TableRow key={trade.id} className="border-slate-700">
                        <TableCell className="text-white font-mono">{trade.id}</TableCell>
                        <TableCell className="text-white">{trade.user}</TableCell>
                        <TableCell className="text-white">{trade.asset}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={trade.type === 'CALL' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                          >
                            {trade.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">${trade.amount}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary" 
                            className={trade.result === 'win' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                          >
                            {trade.result}
                          </Badge>
                        </TableCell>
                        <TableCell className={trade.profit > 0 ? 'text-green-400' : 'text-red-400'}>
                          ${trade.profit > 0 ? '+' : ''}{trade.profit}
                        </TableCell>
                        <TableCell className="text-slate-400">{trade.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Platform Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Server Response Time</span>
                      <span className="text-green-400">125ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Database Performance</span>
                      <span className="text-green-400">Optimal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">API Uptime</span>
                      <span className="text-green-400">99.98%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Active Connections</span>
                      <span className="text-white">2,847</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Risk Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <div>
                        <p className="text-white text-sm">High Volume Alert</p>
                        <p className="text-slate-400 text-xs">User #1247 trading above limits</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-red-500/10 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-white text-sm">Suspicious Activity</p>
                        <p className="text-slate-400 text-xs">Multiple failed login attempts detected</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Platform Settings</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure platform parameters and limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Minimum Trade Amount</Label>
                    <Input 
                      type="number" 
                      defaultValue="10" 
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Maximum Trade Amount</Label>
                    <Input 
                      type="number" 
                      defaultValue="10000" 
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Default Payout (%)</Label>
                    <Input 
                      type="number" 
                      defaultValue="85" 
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Trade Duration (minutes)</Label>
                    <Input 
                      type="number" 
                      defaultValue="5" 
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
