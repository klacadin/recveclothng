import { Truck, CreditCard, Shield, Phone } from "lucide-react";

const TrustBar = () => {
  const trustItems = [
    {
      icon: Truck,
      title: "Nationwide Shipping",
      description: "Free on orders ₱1,500+",
    },
    {
      icon: CreditCard,
      title: "Flexible Payment",
      description: "GCash, Maya",
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Performance-tested gear",
    },
    {
      icon: Phone,
      title: "Fast Support",
      description: "Chat with us on FB",
    },
  ];

  return (
    <section className="py-8 bg-secondary border-y border-border">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item) => (
            <div 
              key={item.title}
              className="flex items-start gap-3"
            >
              <div className="shrink-0 w-10 h-10 rounded-sm bg-background flex items-center justify-center">
                <item.icon className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
