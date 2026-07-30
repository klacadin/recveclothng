import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminUsers, useGrantAdminRoleById, useRevokeAdminRole } from '@/hooks/useAdminUsers';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Trash2, UserPlus } from 'lucide-react';
import ContactInbox from '@/components/admin/ContactInbox';
import { getErrorMessage } from '@/utils/errors';

const AdminSettings = () => {
  const [newAdminUserId, setNewAdminUserId] = useState('');
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const { data: adminUsers = [], isLoading } = useAdminUsers();
  const grantAdmin = useGrantAdminRoleById();
  const revokeAdmin = useRevokeAdminRole();

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUserId.trim()) return;

    try {
      await grantAdmin.mutateAsync(newAdminUserId.trim());
      toast({
        title: 'Admin access granted',
        description: 'The user now has admin privileges (Clerk publicMetadata.role).',
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
      setConfirmRevoke(null);
      return;
    }
    try {
      await revokeAdmin.mutateAsync(userId);
      toast({ title: 'Admin access revoked' });
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
    <div className="space-y-10">
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Admin users
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Grant or revoke admin via Clerk user ID (sets publicMetadata.role = admin).
          </p>
        </div>

        <form onSubmit={handleGrantAdmin} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <div className="flex-1 space-y-1">
            <Label htmlFor="admin-user-id">Clerk user ID</Label>
            <Input
              id="admin-user-id"
              value={newAdminUserId}
              onChange={(e) => setNewAdminUserId(e.target.value)}
              placeholder="user_…"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={grantAdmin.isPending || !newAdminUserId.trim()}>
              <UserPlus className="h-4 w-4 mr-2" />
              Grant admin
            </Button>
          </div>
        </form>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <ul className="space-y-2 max-w-xl">
            {adminUsers.map((a) => (
              <li
                key={a.user_id}
                className="flex items-center justify-between gap-3 border border-border rounded-md px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {a.full_name || a.email || a.user_id}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono truncate">{a.user_id}</p>
                  {a.email ? (
                    <p className="text-xs text-muted-foreground truncate">{a.email}</p>
                  ) : null}
                </div>
                {confirmRevoke === a.user_id ? (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="destructive" onClick={() => handleRevokeAdmin(a.user_id)}>
                      Confirm
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setConfirmRevoke(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0"
                    onClick={() => setConfirmRevoke(a.user_id)}
                    disabled={a.user_id === user?.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
            {adminUsers.length === 0 && (
              <p className="text-sm text-muted-foreground">No admin users found.</p>
            )}
          </ul>
        )}
      </div>

      <ContactInbox />
    </div>
  );
};

export default AdminSettings;
