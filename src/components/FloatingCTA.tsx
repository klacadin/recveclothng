import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingCTA = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Messenger Button */}
      <Button
        variant="messenger"
        size="icon"
        className="h-14 w-14 rounded-full shadow-elevated animate-float"
        asChild
      >
        <a 
          href="https://m.me/reveclothing" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Chat with us on Messenger"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </Button>
    </div>
  );
};

export default FloatingCTA;
