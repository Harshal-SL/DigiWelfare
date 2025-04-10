import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, X, Bot } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const LoadingDots = () => {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
    </div>
  );
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: "Hello! I'm here to make your DigiWelfare experience smoother. What would you like help with today?" }]);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API key is missing. Please check your .env file.");
      }

      const apiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=" + apiKey;
      
      console.log("API Configuration:", {
        url: apiUrl,
        keyLength: apiKey?.length || 0,
        keyPrefix: apiKey?.substring(0, 10) + "..."
      });

      const requestBody = {
        contents: [{
          parts: [{
            text: userMessage
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };

      console.log("Request Body:", JSON.stringify(requestBody, null, 2));

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      });

      console.log("Response Status:", response.status);
      console.log("Response Headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        
        if (response.status === 400) {
          throw new Error("Invalid request. Please check your input.");
        } else if (response.status === 401) {
          throw new Error("Invalid API key. Please check your .env file.");
        } else if (response.status === 403) {
          throw new Error("API key doesn't have permission to access the service.");
        } else if (response.status === 404) {
          throw new Error("The model or API version is not available. Please check the API documentation.");
        } else if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        } else {
          throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log("Success Response:", data);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error("Invalid response format from Gemini API");
      }

      const botResponse = data.candidates[0].content.parts[0].text;
      
      setMessages(prev => [...prev, { role: "assistant", content: botResponse }]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      let errorMessage = "I apologize, but I'm having trouble processing your request. Please try again in a moment.";
      
      if (error instanceof Error) {
        console.error("Error Details:", error.message);
        if (error.message.includes("API key")) {
          errorMessage = "There seems to be an issue with the API configuration. Please check your API key.";
        } else if (error.message.includes("quota") || error.message.includes("Rate limit")) {
          errorMessage = "The service is currently experiencing high demand. Please try again later.";
        } else if (error.message.includes("permission")) {
          errorMessage = "The API key doesn't have the required permissions. Please check your API key settings.";
        } else if (error.message.includes("Invalid request")) {
          errorMessage = "I couldn't process your request. Please try rephrasing your message.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setMessages(prev => [...prev, { role: "assistant", content: errorMessage }]);
      toast.error("Failed to get response from AI. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-500 hover:bg-blue-600 group border-0"
          onClick={() => setIsOpen(true)}
        >
          <div className="absolute -top-8 right-0 bg-blue-500 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Ask DigiMitra
          </div>
          <MessageSquare className="h-5 w-5 text-white" />
        </Button>
      ) : (
        <Card className="w-[350px] shadow-xl border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/10 p-1.5 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg font-semibold">DigiMitra</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="h-[300px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="mx-auto h-8 w-8 mb-2" />
                    <p>How can I help you today?</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg p-3",
                          message.role === "user"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <LoadingDots />
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask DigiMitra..."
                  className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {isLoading ? (
                    <LoadingDots />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatBot; 