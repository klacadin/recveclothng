import { useState, useEffect, useCallback } from "react";
import athleteSummit from "@/assets/athlete-summit.jpg";
import storeInterior from "@/assets/store-interior.jpg";
import athleteEvent from "@/assets/athlete-event.jpg";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useEventCarousel } from "@/hooks/useEventCarousel";

const FALLBACK_IMAGES = [
  { src: athleteEvent, title: "Year End Uphill Challenge", caption: "Participants at START archway" },
  { src: athleteSummit, title: "Trail Runners Summit", caption: "Trail runners at mountain summit wearing NOBODY gear" },
  { src: storeInterior, title: "REVE Clothing Store", caption: "Store with NOBODY collection" },
];

const SocialProof = () => {
  const { data: carouselItems = [], isLoading } = useEventCarousel();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const FACEBOOK_EVENTS = [
    { url: "https://www.facebook.com/photo/?fbid=160405426582435&set=ecnf.100078389367782", label: "Tabuk Adventour" },
    { url: "https://www.facebook.com/story.php?story_fbid=122172954518591770&id=61567753107311&rdid=QNJKt7mAVomueCb5#", label: "Uphill Challenge" },
    { url: "https://scontent.fcgy2-1.fna.fbcdn.net/v/t15.5256-10/611768074_1840005416640220_1773579303995830358_n.jpg?stp=cmp128_dst-jpg_p600x1066_tt6_u&_nc_cat=106&ccb=1-7&_nc_sid=487f02&_nc_ohc=V1lBP65Gc_EQ7kNvwGV4f7N&_nc_oc=AdlK9CJuvP3s4SoQoJ3OjTGMoKigOaXxtEGvx-PWPKYv6v8KUTY1TWx2WIICfYv_hT4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fcgy2-1.fna&_nc_gid=ZUdRFrHI4MvAbKEi5AWWhA&oh=00_AfpsgOdbtiB1XAoUlTbdku9Yz1BLQleupk5YJ9S6XYkKnA&oe=6962C118", label: "New Year Trail Run for a Cause" },
    { url: "#", label: "Conqueror" },
  ];

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api, onSelect]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (!api || carouselItems.length <= 1) return;
    const interval = setInterval(() => {
      api.scrollNext();
      if (api.canScrollNext() === false) api.scrollTo(0);
    }, 5000);
    return () => clearInterval(interval);
  }, [api, carouselItems.length]);

  const hasCarouselData = carouselItems.length > 0;

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container">
        {/* Event Section */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
            Upcoming Events
          </p>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Join Us
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Stay connected with our community and upcoming events
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {FACEBOOK_EVENTS.map((event, index) =>
              event.url !== "#" ? (
                <Button key={index} variant="default" size="lg" asChild className="gap-2">
                  <a href={event.url} target="_blank" rel="noopener noreferrer">
                    {event.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button key={index} variant="outline" size="lg" disabled className="gap-2">
                  {event.label}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Photo Section: 3 columns on desktop, auto carousel on mobile */}
        {isLoading ? (
          <div className="aspect-[4/3] rounded-sm bg-muted animate-pulse" />
        ) : hasCarouselData ? (
          <>
            {/* Desktop: 3-column grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-4">
              {carouselItems.map((item) => (
                <div key={item.id} className="space-y-3">
                  <div className="aspect-[4/3] overflow-hidden rounded-sm">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="font-display text-lg md:text-xl font-semibold text-foreground">
                      {item.title}
                    </h4>
                    {item.caption && (
                      <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: auto carousel */}
            <div className="md:hidden">
              <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} className="w-full">
                <CarouselContent>
                  {carouselItems.map((item) => (
                    <CarouselItem key={item.id} className="pl-0">
                      <div className="space-y-3">
                        <div className="aspect-[4/3] overflow-hidden rounded-sm">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="text-center space-y-1">
                          <h4 className="font-display text-lg font-semibold text-foreground">
                            {item.title}
                          </h4>
                          {item.caption && (
                            <p className="text-sm text-muted-foreground">
                              {item.caption}
                            </p>
                          )}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {carouselItems.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {carouselItems.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => api?.scrollTo(i)}
                        className={`h-2 rounded-full transition-colors ${
                          i === current ? "w-6 bg-accent" : "w-2 bg-muted-foreground/30"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </Carousel>
            </div>
          </>
        ) : (
          <>
            {/* Desktop: 3-column grid fallback */}
            <div className="hidden md:grid md:grid-cols-3 gap-4">
              {FALLBACK_IMAGES.map((img, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[4/3] overflow-hidden rounded-sm">
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="font-display text-lg font-semibold text-foreground">{img.title}</h4>
                    <p className="text-sm text-muted-foreground">{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Mobile: carousel fallback */}
            <div className="md:hidden">
              <Carousel setApi={setApi} opts={{ loop: true, align: "start" }} className="w-full">
                <CarouselContent>
                  {FALLBACK_IMAGES.map((img, i) => (
                    <CarouselItem key={i} className="pl-0">
                      <div className="space-y-3">
                        <div className="aspect-[4/3] overflow-hidden rounded-sm">
                          <img
                            src={img.src}
                            alt={img.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="text-center space-y-1">
                          <h4 className="font-display text-lg font-semibold text-foreground">{img.title}</h4>
                          <p className="text-sm text-muted-foreground">{img.caption}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-4">
                  {FALLBACK_IMAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => api?.scrollTo(i)}
                      className={`h-2 rounded-full transition-colors ${
                        i === current ? "w-6 bg-accent" : "w-2 bg-muted-foreground/30"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </Carousel>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SocialProof;
