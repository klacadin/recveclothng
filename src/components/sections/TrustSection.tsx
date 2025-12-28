import { Truck, CreditCard, RotateCcw, MessageCircle } from "lucide-react";

const TrustSection = () => {
  const trustItems = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders ₱999 and above. Nationwide delivery.",
    },
    {
      icon: CreditCard,
      title: "Flexible Payment",
      description: "COD, GCash, Maya, or bank transfer—your choice.",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "7-day hassle-free returns if you're not satisfied.",
    },
    {
      icon: MessageCircle,
      title: "Chat Support",
      description: "Message us on Facebook—we reply fast!",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-accent text-accent-foreground">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item) => (
            <div 
              key={item.title}
              className="text-center space-y-3"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-accent-foreground/10 flex items-center justify-center">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm md:text-base">
                  {item.title}
                </h3>
                <p className="text-accent-foreground/70 text-xs md:text-sm mt-1 leading-relaxed">
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

export default TrustSection;
