import athleteSummit from "@/assets/athlete-summit.jpg";
import storeInterior from "@/assets/store-interior.jpg";
import athleteEvent from "@/assets/athlete-event.jpg";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const SocialProof = () => {
  const FACEBOOK_EVENTS = [
    {
      url: "https://www.facebook.com/photo/?fbid=160405426582435&set=ecnf.100078389367782",
      label: "Tabuk Adventour"
    },
    {
      url: "https://www.facebook.com/story.php?story_fbid=122172954518591770&id=61567753107311&rdid=QNJKt7mAVomueCb5#",
      label: "Uphill Challenge"
    },
    {
      url: "https://scontent.fcgy2-1.fna.fbcdn.net/v/t15.5256-10/611768074_1840005416640220_1773579303995830358_n.jpg?stp=cmp128_dst-jpg_p600x1066_tt6_u&_nc_cat=106&ccb=1-7&_nc_sid=487f02&_nc_ohc=V1lBP65Gc_EQ7kNvwGV4f7N&_nc_oc=AdlK9CJuvP3s4SoQoJ3OjTGMoKigOaXxtEGvx-PWPKYv6v8KUTY1TWx2WIICfYv_hT4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fcgy2-1.fna&_nc_gid=ZUdRFrHI4MvAbKEi5AWWhA&oh=00_AfpsgOdbtiB1XAoUlTbdku9Yz1BLQleupk5YJ9S6XYkKnA&oe=6962C118",
      label: "New Year Trail Run for a Cause"
    },
    {
      url: "#",
      label: "Conqueror"
    }
  ];

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
            {FACEBOOK_EVENTS.map((event, index) => (
              event.url !== "#" ? (
                <Button 
                  key={index}
                  variant="default"
                  size="lg" 
                  asChild
                  className="gap-2"
                >
                  <a 
                    href={event.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {event.label}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button 
                  key={index}
                  variant="outline"
                  size="lg" 
                  disabled
                  className="gap-2"
                >
                  {event.label}
                </Button>
              )
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="aspect-[4/3] overflow-hidden rounded-sm">
            <img
              src={athleteEvent}
              alt="Year End Uphill Challenge event - participants at START archway"
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
