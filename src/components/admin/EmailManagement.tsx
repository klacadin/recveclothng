import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, Search, Eye, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResendEmail {
  id: string;
  from: string;
  to: string[];
  subject: string;
  created_at: string;
  last_event: string;
  cc?: string[];
  bcc?: string[];
  reply_to?: string[];
}

interface EmailDetails extends ResendEmail {
  html?: string;
  text?: string;
  object?: string;
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'bounced':
    case 'complained':
      return 'bg-red-100 text-red-800';
    case 'opened':
    case 'clicked':
      return 'bg-blue-100 text-blue-800';
    case 'queued':
    case 'sending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return <CheckCircle className="h-4 w-4" />;
    case 'bounced':
    case 'complained':
      return <XCircle className="h-4 w-4" />;
    case 'queued':
    case 'sending':
      return <Clock className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

const EmailManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<EmailDetails | null>(null);
  const [emailDetailsLoading, setEmailDetailsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: emailsData, isLoading, error, refetch } = useQuery({
    queryKey: ['resend-emails', user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Ensure we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const { data, error } = await supabase.functions.invoke('get-resend-emails', {
        body: { limit: 100 },
      });

      if (error) {
        console.error('Function invoke error:', error);
        throw error;
      }
      
      // Resend API returns { data: [...] }
      return data as { data: ResendEmail[] };
    },
    enabled: !!user, // Only fetch when user is authenticated
    retry: false, // Don't retry on auth errors
  });

  // Extract emails array from response
  const emails = (emailsData as any)?.data || [];

  const filteredEmails = emails.filter((email) => {
    const query = searchQuery.toLowerCase();
    return (
      email.subject?.toLowerCase().includes(query) ||
      email.to?.some((to) => to.toLowerCase().includes(query)) ||
      email.from?.toLowerCase().includes(query)
    );
  });

  const handleViewEmail = async (emailId: string) => {
    setEmailDetailsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-resend-email', {
        body: { email_id: emailId },
      });

      if (error) throw error;
      setSelectedEmail(data as EmailDetails);
    } catch (error) {
      console.error('Error fetching email details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load email details',
        variant: 'destructive',
      });
    } finally {
      setEmailDetailsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Email Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage emails sent through Resend
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by subject, recipient, or sender..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Email List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-sm">
          <p className="text-sm text-red-800">Failed to load emails. Please try again.</p>
        </div>
      ) : filteredEmails.length === 0 ? (
        <div className="p-8 text-center">
          <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No emails found</p>
        </div>
      ) : (
        <div className="border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Subject</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">To</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">From</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmails.map((email) => (
                  <tr key={email.id} className="border-t border-border hover:bg-secondary/50">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{email.subject || '—'}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {email.to?.slice(0, 2).map((to, idx) => (
                          <span key={idx} className="text-sm text-foreground">{to}</span>
                        ))}
                        {email.to && email.to.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{email.to.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-foreground">{email.from}</span>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(email.last_event)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(email.last_event)}
                          {email.last_event || 'Unknown'}
                        </span>
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(email.created_at)}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewEmail(email.id)}
                        disabled={emailDetailsLoading}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Email Details Dialog */}
      <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Details
            </DialogTitle>
            <DialogDescription>
              {selectedEmail?.subject}
            </DialogDescription>
          </DialogHeader>

          {emailDetailsLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : selectedEmail ? (
            <div className="space-y-4">
              {/* Email Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-secondary rounded-sm">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">From</p>
                  <p className="text-sm text-foreground">{selectedEmail.from}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">To</p>
                  <p className="text-sm text-foreground">{selectedEmail.to?.join(', ')}</p>
                </div>
                {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">CC</p>
                    <p className="text-sm text-foreground">{selectedEmail.cc.join(', ')}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Status</p>
                  <Badge className={getStatusColor(selectedEmail.last_event)}>
                    {selectedEmail.last_event || 'Unknown'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Sent</p>
                  <p className="text-sm text-foreground">{formatDate(selectedEmail.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Email ID</p>
                  <p className="text-sm font-mono text-foreground break-all">{selectedEmail.id}</p>
                </div>
              </div>

              {/* Email Content */}
              {selectedEmail.html && (
                <div className="border border-border rounded-sm overflow-hidden">
                  <div className="bg-secondary px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">HTML Content</p>
                  </div>
                  <div className="p-4">
                    <iframe
                      srcDoc={selectedEmail.html}
                      className="w-full h-96 border-0"
                      title="Email HTML Content"
                    />
                  </div>
                </div>
              )}

              {selectedEmail.text && (
                <div className="border border-border rounded-sm overflow-hidden">
                  <div className="bg-secondary px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">Plain Text</p>
                  </div>
                  <div className="p-4">
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
                      {selectedEmail.text}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailManagement;
