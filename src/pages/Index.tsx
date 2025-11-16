import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Calendar, Apple } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9D5FF] to-[#FCE7F3]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            💜 MediVibe
          </h1>
          <p className="text-2xl text-muted-foreground mb-2">Your AI Health Companion</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Get instant health advice, book appointments with top doctors, and receive personalized diet plans—all powered by AI.
          </p>
          <Button
            onClick={() => navigate("/auth")}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:scale-105 transition-transform"
          >
            Get Started →
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-scale-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Health Chatbot</h3>
            <p className="text-muted-foreground">
              Describe your symptoms and get instant advice, home remedies, and meal suggestions from our AI assistant.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Appointments</h3>
            <p className="text-muted-foreground">
              Book appointments with nearby hospitals and specialists. Get instant confirmations and directions.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Apple className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Personalized Diet Plans</h3>
            <p className="text-muted-foreground">
              Get BMI-based diet recommendations tailored to your health goals, food preferences, and lifestyle.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-primary">
            <Heart className="h-5 w-5 animate-pulse" />
            <p className="text-lg">Trusted by thousands of users for better health</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
