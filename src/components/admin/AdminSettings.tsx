import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminUsers, useGrantAdminRoleById, useRevokeAdminRole } from '@/hooks/useAdminUsers';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Trash2, UserPlus, AlertTriangle } from 'lucide-react';

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
        description: 'The user now has admin privileges.',
      });
      setNewAdminUserId('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
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
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
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
            Grant admin access to a user by their User ID
          </Label>
          <div className="flex gap-2">
            <Input
              id="userId"
              value={newAdminUserId}
              onChange={(e) => setNewAdminUserId(e.target.value)}
              placeholder="Enter user ID (UUID)"
              className="flex-1"
            />
            <Button type="submit" disabled={grantAdmin.isPending || !newAdminUserId.trim()}>
              <UserPlus className="h-4 w-4 mr-2" />
              Grant Admin
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Users must sign up first. You can find their User ID in the database after they register.
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
              {adminUsers.map((adminRole) => (
                <div 
                  key={adminRole.id} 
                  className="flex items-center justify-between p-3 bg-secondary rounded-sm"
                >
                  <div>
                    <p className="font-mono text-sm text-foreground">{adminRole.user_id}</p>
                    <p className="text-xs text-muted-foreground">
                      Added: {new Date(adminRole.created_at).toLocaleDateString()}
                    </p>
                    {adminRole.user_id === user?.id && (
                      <span className="text-xs text-accent">(You)</span>
                    )}
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
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Store Settings Placeholder */}
      <div className="bg-card rounded-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Store Settings</h3>
        <div className="p-4 bg-secondary rounded-sm flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Additional store settings coming soon...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
