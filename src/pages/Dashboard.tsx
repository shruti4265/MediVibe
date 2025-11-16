import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ChatSection from "@/components/ChatSection";
import AppointmentSection from "@/components/AppointmentSection";
import DietSection from "@/components/DietSection";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("chatbot");
  const [userName, setUserName] = useState<string | undefined>();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUserName(session.user.email?.split("@")[0]);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserName(session.user.email?.split("@")[0]);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const renderSection = () => {
    switch (activeSection) {
      case "chatbot":
        return <ChatSection />;
      case "appointment":
        return <AppointmentSection />;
      case "diet":
        return <DietSection />;
      default:
        return <ChatSection />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userName={userName} />
        <main className="flex-1 overflow-auto bg-background">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;