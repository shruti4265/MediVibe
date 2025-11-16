import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatSection = () => {
  const [healthMessages, setHealthMessages] = useState<Message[]>([]);
  const [mealMessages, setMealMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("health");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [healthMessages, mealMessages]);

  const streamChat = async (messages: Message[], type: string) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-chat`;
    
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, type }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        toast({
          title: "Rate limit exceeded",
          description: "Too many requests. Please try again in a moment.",
          variant: "destructive",
        });
      } else if (resp.status === 402) {
        toast({
          title: "AI credits exhausted",
          description: "Please add credits to continue using AI features.",
          variant: "destructive",
        });
      }
      throw new Error("Failed to start stream");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;
    let assistantContent = "";

    const updateMessages = (content: string) => {
      assistantContent = content;
      if (type === "health") {
        setHealthMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          return [...prev, { role: "assistant", content: assistantContent }];
        });
      } else {
        setMealMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          return [...prev, { role: "assistant", content: assistantContent }];
        });
      }
    };

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            updateMessages(assistantContent);
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const type = activeTab === "health" ? "health" : "meal";
    
    if (type === "health") {
      setHealthMessages(prev => [...prev, userMessage]);
    } else {
      setMealMessages(prev => [...prev, userMessage]);
    }
    
    setInput("");
    setLoading(true);

    try {
      const messages = type === "health" ? [...healthMessages, userMessage] : [...mealMessages, userMessage];
      await streamChat(messages, type);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderMessages = (messages: Message[]) => (
    <div className="space-y-4">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] px-4 py-3 rounded-2xl ${
              msg.role === "user"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-secondary text-foreground"
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="bg-secondary px-4 py-3 rounded-2xl flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>MediVibe is thinking...</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="health">Health Chatbot 🩺</TabsTrigger>
          <TabsTrigger value="meal">Get Meal Plan 🍽️</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            {healthMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Ask me about your health concerns...</p>
              </div>
            ) : (
              renderMessages(healthMessages)
            )}
          </div>
        </TabsContent>

        <TabsContent value="meal" className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
            {mealMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <p>Tell me your symptoms to get a meal plan...</p>
              </div>
            ) : (
              renderMessages(mealMessages)
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;