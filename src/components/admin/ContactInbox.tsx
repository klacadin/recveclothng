import { Mail, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactSubmissions, useMarkContactRead } from "@/hooks/useContactSubmissions";
import { useState } from "react";

const ContactInbox = () => {
  const { data: submissions = [], isLoading } = useContactSubmissions();
  const markRead = useMarkContactRead();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const unreadCount = submissions.filter((s) => !s.read_at).length;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Mail className="h-5 w-5" />
        Contact Inbox
        {unreadCount > 0 && (
          <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded">
            {unreadCount} new
          </span>
        )}
      </h3>

      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-8 bg-secondary rounded-sm text-center text-muted-foreground text-sm">
          No contact submissions yet.
        </div>
      ) : (
        <div className="space-y-2">
          {submissions.map((sub) => {
            const isExpanded = expandedId === sub.id;
            const isUnread = !sub.read_at;
            return (
              <div
                key={sub.id}
                className={`border rounded-sm overflow-hidden ${isUnread ? "border-accent/50 bg-accent/5" : "border-border"}`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50"
                  onClick={() => {
                    setExpandedId(isExpanded ? null : sub.id);
                    if (isUnread) markRead.mutate(sub.id);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{sub.subject}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {sub.name} &lt;{sub.email}&gt;
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(sub.created_at).toLocaleString()}
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-border space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>From:</strong> {sub.name} ({sub.email})
                      {sub.phone && ` · ${sub.phone}`}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{sub.message}</p>
                    <a
                      href={`mailto:${sub.email}?subject=Re: ${encodeURIComponent(sub.subject)}`}
                      className="inline-block"
                    >
                      <Button variant="outline" size="sm">
                        Reply
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContactInbox;
