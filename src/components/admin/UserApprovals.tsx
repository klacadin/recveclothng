import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePendingUsers, useApproveUser, useRejectUser, useAllUserApprovals } from '@/hooks/useUserApprovals';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Mail, User, Calendar, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const UserApprovals = () => {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const { toast } = useToast();
  const { data: pendingUsers = [], isLoading: pendingLoading } = usePendingUsers();
  const { data: allApprovals = [] } = useAllUserApprovals();
  const approveUser = useApproveUser();
  const rejectUser = useRejectUser();

  const getDisplayName = (approval: { email?: string | null; full_name?: string | null; user_id: string }) => {
    const name = approval.full_name?.trim();
    const email = approval.email?.trim();
    if (name) return name;
    if (email) return email;
    return `User ${approval.user_id.slice(0, 8)}…`;
  };

  const handleApprove = async (userId: string) => {
    try {
      await approveUser.mutateAsync(userId);
      toast({
        title: 'User approved',
        description: 'The user can now log in to their account.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve user',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedUserId) return;

    try {
      await rejectUser.mutateAsync({
        userId: selectedUserId,
        reason: rejectionReason || undefined,
      });
      toast({
        title: 'User rejected',
        description: 'The user has been rejected.',
      });
      setRejectDialogOpen(false);
      setSelectedUserId(null);
      setRejectionReason('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject user',
        variant: 'destructive',
      });
    }
  };

  const openRejectDialog = (userId: string) => {
    setSelectedUserId(userId);
    setRejectDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (pendingLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Approvals */}
      <div className="bg-card rounded-sm border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Approvals ({pendingUsers.length})
          </h3>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No pending user approvals</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingUsers.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between p-4 bg-secondary rounded-sm border border-border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {getDisplayName(approval)}
                      </span>
                      {approval.full_name && approval.email && (
                        <span className="text-sm text-muted-foreground">{approval.email}</span>
                      )}
                    </div>
                    {getStatusBadge(approval.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(approval.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleApprove(approval.user_id)}
                    disabled={approveUser.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => openRejectDialog(approval.user_id)}
                    disabled={rejectUser.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Approvals History */}
      <div className="bg-card rounded-sm border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          All User Approvals ({allApprovals.length})
        </h3>

        {allApprovals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No user approvals yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allApprovals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between p-3 bg-secondary rounded-sm border border-border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {getDisplayName(approval)}
                      </span>
                      {approval.full_name && approval.email && (
                        <span className="text-xs text-muted-foreground">{approval.email}</span>
                      )}
                    </div>
                    {getStatusBadge(approval.status)}
                  </div>
                  {approval.rejection_reason && (
                    <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4 mt-0.5" />
                      <span>{approval.rejection_reason}</span>
                    </div>
                  )}
                  {approval.approved_at && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {approval.status === 'approved' ? 'Approved' : 'Rejected'} on{' '}
                      {formatDate(approval.approved_at)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject User</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this user? You can optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="rejection-reason">Rejection Reason (Optional)</Label>
              <Input
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Invalid email domain, suspicious activity..."
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={rejectUser.isPending}>
              {rejectUser.isPending ? 'Rejecting...' : 'Reject User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserApprovals;

