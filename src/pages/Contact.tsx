import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Send, Loader2 } from 'lucide-react';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
  phone: z.string().max(50, 'Phone number is too long').optional(),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('contact_submissions').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      });

      if (error) throw error;

      toast({
        title: 'Message sent!',
        description: "We've received your message and will get back to you soon.",
      });

      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again or email us directly at shop@reveclothingxnobody.com',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Address',
      value: 'P5 North Poblacion, Maramag, Bukidnon',
      href: 'https://www.google.com/maps/search/?api=1&query=Maramag,+Bukidnon,+Philippines',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '0955 446 5207',
      href: 'tel:09554465207',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'shop@reveclothingxnobody.com',
      href: 'mailto:shop@reveclothingxnobody.com',
    },
    {
      icon: Facebook,
      label: 'Facebook',
      value: 'REVE Clothing Bukidnon',
      href: 'https://www.facebook.com/ReveClothingBukidnon/',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@jingjing',
      href: 'https://www.instagram.com/jingjing',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Contact Us"
        description="Get in touch with REVE Clothing. Located in Maramag, Bukidnon. Call 0955 446 5207 or email shop@reveclothingxnobody.com. We ship nationwide via J&T."
        url="/contact"
      />
      <Header />
      <main id="main-content" className="pt-20" tabIndex={-1}>
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container">
            <nav className="text-xs text-primary-foreground/60 mb-4">
              <Link to="/" className="hover:text-primary-foreground">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-primary-foreground">Contact</span>
            </nav>
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              Contact Us
            </h1>
            <p className="text-primary-foreground/80 mt-2 max-w-xl">
              Have questions about your order, sizing, or our products? We're here to help.
            </p>
          </div>
        </section>

        <div className="container py-12 md:py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-accent" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          placeholder="Your name"
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive mt-1">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="your@email.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="09XX XXX XXXX"
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        placeholder="What is this about?"
                      />
                      {errors.subject && (
                        <p className="text-sm text-destructive mt-1">{errors.subject}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        placeholder="Tell us how we can help..."
                        rows={5}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive mt-1">{errors.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info & Map */}
            <div className="space-y-6">
              {/* Contact Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block p-4 bg-secondary rounded-sm border border-border hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-sm bg-background flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium text-foreground mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Business Hours */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Business Hours</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Monday - Saturday: 9:00 AM - 6:00 PM
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Sunday: Closed
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        * Orders placed outside business hours will be processed the next business day
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="overflow-hidden">
                <div className="aspect-video bg-secondary relative">
                  <iframe
                    title="REVE Clothing Location - Maramag, Bukidnon"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63158.58044839377!2d125.0051!3d7.7631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32ff7e7e7e7e7e7f%3A0x0!2sMaramag%2C%20Bukidnon!5e0!3m2!1sen!2sph!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                </div>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    📍 P5 North Poblacion, Maramag, Bukidnon, Philippines
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Maramag,+Bukidnon,+Philippines"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline inline-flex items-center gap-1 mt-2"
                  >
                    Open in Google Maps →
                  </a>
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <div className="bg-accent/10 border border-accent/20 rounded-sm p-4">
                <h3 className="font-semibold text-foreground mb-2">Shipping Information</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Nationwide shipping via J&T Express</li>
                  <li>• Flat shipping fee: ₱130</li>
                  <li>• Processing time: 1-2 business days</li>
                  <li>• Delivery: 3-7 days depending on location</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
