import { useQuery } from '@tanstack/react-query';
import { apiSend } from '@/lib/api';

export interface HitPayPaymentStatus {
  success: boolean;
  status: string;
  payment_request_id: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'expired' | 'canceled' | 'inactive' | 'succeeded';
  reference_number: string;
  amount: string;
  currency: string;
  payments?: Array<{ id: string; status: string }>;
  created_at: string;
  updated_at: string;
}

export const useHitPayPaymentStatus = (
  paymentRequestId: string | null | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['hitpay-payment-status', paymentRequestId],
    queryFn: async () => {
      if (!paymentRequestId) {
        throw new Error('Payment request ID is required');
      }
      const via = await apiSend<HitPayPaymentStatus>(
        '/api/admin/hitpay-status',
        'POST',
        { payment_request_id: paymentRequestId }
      );
      if (via.ok && via.data) return via.data;
      throw new Error(via.error || 'Failed to load HitPay status');
    },
    enabled: enabled && !!paymentRequestId,
    refetchInterval: (query) => {
      const status = query.state.data?.payment_status;
      if (
        status === 'completed' ||
        status === 'succeeded' ||
        status === 'failed' ||
        status === 'expired' ||
        status === 'canceled'
      ) {
        return false;
      }
      return 30000;
    },
    staleTime: 10000,
  });
};
