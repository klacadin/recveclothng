import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";

const FeedbackButton = () => {
  return (
    <Link
      to="/contact"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform text-sm font-medium"
      aria-label="Send feedback"
    >
      <MessageSquare className="h-4 w-4" />
      <span className="hidden sm:inline">Send Feedback</span>
    </Link>
  );
};

export default FeedbackButton;
