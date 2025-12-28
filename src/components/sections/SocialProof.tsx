const SocialProof = () => {
  const events = [
    { name: "Skymarathon", year: "2024" },
    { name: "Ultra Trail", year: "2024" },
    { name: "Mt. Apo Challenge", year: "2023" },
    { name: "Bukidnon Trail", year: "2023" },
  ];

  return (
    <section className="py-12 bg-secondary border-y border-border overflow-hidden">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Trusted By
            </p>
            <h3 className="font-display text-xl font-bold text-foreground">
              Event Partners & Athletes
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-6 md:gap-10">
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
      </div>
    </section>
  );
};

export default SocialProof;
