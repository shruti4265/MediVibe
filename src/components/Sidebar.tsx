import { MessageCircle, Calendar, Apple } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const menuItems = [
    { id: "chatbot", label: "Chatbot", icon: MessageCircle },
    { id: "appointment", label: "Book Appointment", icon: Calendar },
    { id: "diet", label: "Diet Plan", icon: Apple },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-[#E9D5FF] to-[#FCE7F3] p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          💜 MediVibe
        </h2>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                activeSection === item.id
                  ? "bg-white shadow-md scale-105 text-purple-600"
                  : "hover:bg-white/50 text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;