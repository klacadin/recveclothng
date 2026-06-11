import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminUsers, useGrantAdminRoleById, useRevokeAdminRole } from '@/hooks/useAdminUsers';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Trash2, UserPlus } from 'lucide-react';
import ContactInbox from '@/components/admin/ContactInbox';
import { getErrorMessage } from '@/utils/errors';

type UserDetails = { email: string; full_name: string };

const AdminSettings = () => {
  const [newAdminUserId, setNewAdminUserId] = useState('');
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<Record<string, UserDetails>>({});

  const { user } = useAuth();
  const { toast } = useToast();
  const { data: adminUsers = [], isLoading } = useAdminUsers();
  const grantAdmin = useGrantAdminRoleById();
  const revokeAdmin = useRevokeAdminRole();

  useEffect(() => {
    const fetchDetails = async () => {
      if (adminUsers.length === 0) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const userIds = adminUsers.map((a) => a.user_id);
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-user-emails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ user_ids: userIds }),
        });
        if (res.ok) {
          const { users } = await res.json();
          const details: Record<string, UserDetails> = {};
          for (const [id, v] of Object.entries(users || {})) {
            const val = v as { email?: string; full_name?: string };
            details[id] = { email: val.email || '', full_name: val.full_name || '' };
          }
          setUserDetails(details);
        }
      } catch {
        // ignore
      }
    };
    fetchDetails();
  }, [adminUsers]);

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUserId.trim()) return;

    try {
      await grantAdmin.mutateAsync(newAdminUserId.trim());
      toast({
        title: 'Admin access granted',
        description: 'The user now has admin privileges.',
      });
      setNewAdminUserId('');
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleRevokeAdmin = async (userId: string) => {
    if (userId === user?.id) {
      toast({
        title: 'Cannot revoke',
        description: 'You cannot revoke your own admin access.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await revokeAdmin.mutateAsync(userId);
      toast({
        title: 'Admin access revoked',
        description: 'The user no longer has admin privileges.',
      });
      setConfirmRevoke(null);
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin User Management */}
      <div className="bg-card rounded-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin User Management
        </h3>

        {/* Grant Admin Form */}
        <form onSubmit={handleGrantAdmin} className="mb-6">
          <Label htmlFor="userId" className="text-sm text-muted-foreground mb-2 block">
            Grant admin access to a user
          </Label>
          <div className="flex gap-2">
            <Input
              id="userId"
              value={newAdminUserId}
              onChange={(e) => setNewAdminUserId(e.target.value)}
              placeholder="Enter user email or user ID"
              className="flex-1"
            />
            <Button type="submit" disabled={grantAdmin.isPending || !newAdminUserId.trim()}>
              <UserPlus className="h-4 w-4 mr-2" />
              Grant Admin
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Enter the user's email address or their user ID. Users must sign up first before you can grant them admin access.
          </p>
        </form>

        {/* Current Admins List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Current Admins</h4>
          
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Loading...</div>
          ) : adminUsers.length === 0 ? (
            <div className="p-4 bg-secondary rounded-sm text-center text-muted-foreground">
              No admin users found
            </div>
          ) : (
            <div className="space-y-2">
              {adminUsers.map((adminRole) => {
                const details = userDetails[adminRole.user_id];
                const name = details?.full_name?.trim();
                const email = details?.email;
                return (
                <div 
                  key={adminRole.id} 
                  className="flex items-center justify-between p-3 bg-secondary rounded-sm"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {name || email || 'Loading user details...'}
                      {adminRole.user_id === user?.id && (
                        <span className="text-xs text-accent ml-1">(You)</span>
                      )}
                    </p>
                    {name && email && (
                      <p className="text-sm text-muted-foreground">{email}</p>
                    )}
                    {!name && email && (
                      <p className="text-sm text-muted-foreground">{email}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Added: {new Date(adminRole.created_at).toLocaleDateString()}
                      {!name && !email && (
                        <span className="ml-1 text-muted-foreground/60">(User ID: {adminRole.user_id.slice(0, 8)}…)</span>
                      )}
                    </p>
                  </div>
                  
                  {confirmRevoke === adminRole.user_id ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevokeAdmin(adminRole.user_id)}
                        disabled={revokeAdmin.isPending}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmRevoke(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setConfirmRevoke(adminRole.user_id)}
                      disabled={adminRole.user_id === user?.id}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Contact Inbox */}
      <div className="bg-card rounded-sm border border-border p-6">
        <ContactInbox />
      </div>

      {/* Store Settings */}
      <div className="bg-card rounded-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Store Settings</h3>
        <div className="p-4 bg-secondary rounded-sm text-sm text-muted-foreground">
          Configure store details from the admin dashboard. Contact support for advanced settings.
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
