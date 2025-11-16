import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

interface NavbarProps {
  userName?: string;
}

const Navbar = ({ userName }: NavbarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "See you soon!",
    });
    navigate("/auth");
  };

  return (
    <nav className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Welcome{userName ? `, ${userName}` : ""}! 👋
        </h1>
      </div>
      <Button
        onClick={handleLogout}
        variant="outline"
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </nav>
  );
};

export default Navbar;