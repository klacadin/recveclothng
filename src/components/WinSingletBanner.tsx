import { useState } from "react";
import { Gift } from "lucide-react";
import { useBanner } from "@/contexts/BannerContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const BANNER_DISMISS_KEY = "win-singlet-banner-dismissed";
const BANNER_DISMISS_DAYS = 1;

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  phone: z.string().max(50).optional(),
});

type FormData = z.infer<typeof schema>;

const WinSingletBanner = () => {
  const { setBannerVisible } = useBanner();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      const raw = localStorage.getItem(BANNER_DISMISS_KEY);
      if (!raw) return false;
      const ts = parseInt(raw, 10);
      return Date.now() - ts < BANNER_DISMISS_DAYS * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  });
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleDismiss = () => {
    localStorage.setItem(BANNER_DISMISS_KEY, String(Date.now()));
    setDismissed(true);
    setBannerVisible(false);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as keyof FormData;
        if (key) fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: "Giveaway Entry – Win a Free Singlet",
        message: "I would like to enter the free singlet giveaway.",
      });

      if (error) throw error;

      toast({
        title: "Entry received!",
        description: "Good luck! We'll contact the winner soon.",
      });
      setFormData({ name: "", email: "", phone: "" });
      setOpen(false);
      handleDismiss();
    } catch {
      toast({
        title: "Error",
        description: "Could not submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (dismissed) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[55] flex items-center justify-between gap-4 bg-accent text-accent-foreground px-4 py-2.5 shadow-md">
        <div className="flex items-center gap-2 min-w-0">
          <Gift className="h-5 w-5 flex-shrink-0 text-accent-foreground" />
          <span className="font-medium text-sm truncate">Win a free singlet after your first successful order!</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="text-sm font-semibold underline underline-offset-2 hover:no-underline"
          >
            Enter here →
          </button>
          <button
            onClick={handleDismiss}
            className="text-accent-foreground/80 hover:text-accent-foreground text-xs px-2"
            aria-label="Dismiss banner"
          >
            ×
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Gift className="h-6 w-6 text-accent" />
              Win a Free Singlet
            </SheetTitle>
            <SheetDescription>
              Enter your details below for a chance to win a free singlet. Good luck!
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="giveaway-name">Name *</Label>
              <Input
                id="giveaway-name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Your name"
                className="mt-1"
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="giveaway-email">Email *</Label>
              <Input
                id="giveaway-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your@email.com"
                className="mt-1"
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="giveaway-phone">Phone (optional)</Label>
              <Input
                id="giveaway-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="09XX XXX XXXX"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Enter Giveaway"
              )}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default WinSingletBanner;
