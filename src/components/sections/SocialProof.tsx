import athleteEvent from "@/assets/athlete-event.jpg";
import athleteSummit from "@/assets/athlete-summit.jpg";
import storeInterior from "@/assets/store-interior.jpg";

const SocialProof = () => {
  const events = [
    { name: "Trail Masters", year: "2024" },
    { name: "Hamugaway Trail", year: "2024" },
    { name: "MUSPO Series", year: "2024" },
    { name: "Conquerors Run", year: "2024" },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container">
        {/* Event Partners */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
            Trusted By
          </p>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
            Event Partners & Athletes
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {events.map((event) => (
              <div key={event.name} className="text-center">
                <p className="font-display text-sm font-semibold text-foreground">
                  {event.name}
                </p>
                <p className="text-xs text-muted-foreground">{event.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="aspect-[4/3] overflow-hidden rounded-sm">
            <img 
              src={athleteEvent} 
              alt="NOBODY athletes at Trail Masters event" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-sm">
            <img 
              src={athleteSummit} 
              alt="Trail runners at mountain summit wearing NOBODY gear" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-sm">
            <img 
              src={storeInterior} 
              alt="REVE Clothing store with NOBODY collection" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
