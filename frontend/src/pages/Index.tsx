
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield, Zap, Users, BarChart3, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: "Advanced Trading",
      description: "Professional trading tools with real-time market data"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Bank-level security with encrypted transactions"
    },
    {
      icon: Zap,
      title: "Fast Execution",
      description: "Lightning-fast order execution with minimal latency"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Comprehensive market analysis and trading insights"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "24/7 customer support from trading experts"
    },
    {
      icon: Globe,
      title: "Global Markets",
      description: "Access to international markets and assets"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 backdrop-blur-md bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">TradePro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-slate-300 hover:text-white hover:bg-slate-700"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Trade Like a
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {" "}Professional
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Access global markets with our advanced trading platform. Real-time data, 
              professional tools, and expert support to maximize your trading potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3"
                onClick={() => navigate('/login')}
              >
                Start Trading Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-800 text-lg px-8 py-3"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="absolute top-20 left-10 animate-float">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+12.5%</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="absolute top-32 right-16 animate-float-delayed">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-blue-400">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Live Data</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose TradePro?
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Everything you need to succeed in the markets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-md hover:bg-slate-700/50 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Join thousands of traders who trust TradePro for their trading needs
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-3"
            onClick={() => navigate('/login')}
          >
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
