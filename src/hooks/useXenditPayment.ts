import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface XenditPaymentStatus {
  success: boolean;
  status: string;
  payment_request_id: string;
  payment_status: 'ACCEPTING_PAYMENTS' | 'REQUIRES_ACTION' | 'AUTHORIZED' | 'CANCELED' | 'EXPIRED' | 'SUCCEEDED' | 'FAILED';
  reference_id: string;
  request_amount: number;
  currency: string;
  channel_code: string;
  failure_code?: string | null;
  created: string;
  updated: string;
  latest_payment_id?: string | null;
  actions: Array<{ type: string; value?: string; descriptor?: string }>;
  metadata: Record<string, any>;
}

export const useXenditPaymentStatus = (paymentRequestId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['xendit-payment-status', paymentRequestId],
    queryFn: async () => {
      if (!paymentRequestId) {
        throw new Error('Payment request ID is required');
      }

      const { data, error } = await supabase.functions.invoke('get-xendit-payment-status', {
        body: { payment_request_id: paymentRequestId },
      });

      if (error) throw error;
      return data as XenditPaymentStatus;
    },
    enabled: enabled && !!paymentRequestId,
    refetchInterval: (data) => {
      // Refetch every 30 seconds if payment is not yet succeeded or failed
      const status = data?.payment_status;
      if (status === 'SUCCEEDED' || status === 'FAILED' || status === 'CANCELED' || status === 'EXPIRED') {
        return false; // Stop polling
      }
      return 30000; // Poll every 30 seconds
    },
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};
