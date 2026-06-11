import { CheckCircle, Clock, Package, PackageCheck, Truck, XCircle } from 'lucide-react';

interface OrderStatusTrackerProps {
  status: 'new' | 'pending_payment' | 'for_verification' | 'paid' | 'preparing' | 'packed' | 'for_pickup' | 'shipped' | 'completed' | 'cancelled';
}

const steps = [
  { key: 'new', label: 'Order Placed', icon: Clock },
  { key: 'pending_payment', label: 'Pending payment', icon: Clock },
  { key: 'for_verification', label: 'For verification', icon: Clock },
  { key: 'paid', label: 'Payment confirmed', icon: CheckCircle },
  { key: 'preparing', label: 'Preparing', icon: PackageCheck },
  { key: 'packed', label: 'Packed', icon: PackageCheck },
  { key: 'for_pickup', label: 'For pickup', icon: Truck },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'completed', label: 'Delivered', icon: Package },
];

const OrderStatusTracker = ({ status }: OrderStatusTrackerProps) => {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
        <XCircle className="h-6 w-6 text-destructive" />
        <div>
          <p className="font-medium text-destructive">Order Cancelled</p>
          <p className="text-sm text-muted-foreground">This order has been cancelled</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.key === status);

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground">Order Progress</h4>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
        <div 
          className="absolute left-4 top-0 w-0.5 bg-primary transition-all duration-500"
          style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="relative flex items-center gap-4">
                <div 
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    isCompleted 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'bg-background border-muted text-muted-foreground'
                  } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                >
                  <StepIcon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-primary">Current Status</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusTracker;
