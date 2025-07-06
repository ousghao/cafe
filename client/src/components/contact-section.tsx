import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { MapPin, Phone, Mail, Clock, Info, Send, MessageSquare } from "lucide-react";
import { createClient } from '@/lib/supabase';

export default function ContactSection() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const supabase = createClient();
      return supabase.from('messages').insert({
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        is_read: false,
      });
    },
    onSuccess: () => {
      toast({
        title: t('contact.successTitle'),
        description: t('contact.successMessage'),
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contact"] });
    },
    onError: (error) => {
      toast({
        title: t('contact.errorTitle'),
        description: t('contact.errorMessage'),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    mutation.mutate(data);
  };

  return (
    <section id="contact" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-deep-black mb-4">
            {t('contact.title')} <span className="text-teal">{t('contact.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-gray-600">
            {t('contact.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-deep-black mb-6">{t('contact.coordinates')}</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-teal w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-deep-black">{t('contact.address')}</h4>
                      <p className="text-gray-600">{t('contact.fullAddress')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-teal/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="text-teal w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-deep-black">{t('contact.phone')}</h4>
                      <p className="text-gray-600">+212 5 35 62 34 56</p>
                      <Button variant="link" className="text-teal hover:text-teal p-0 h-auto font-medium">
                        {t('contact.callNow')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="text-green-600 w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-deep-black">WhatsApp</h4>
                      <p className="text-gray-600">+212 6XX XXX XXX</p>
                      <Button variant="link" className="text-green-600 hover:text-green-700 p-0 h-auto font-medium">
                        {t('contact.sendMessage')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="text-blue-500 w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-deep-black">Email</h4>
                      <p className="text-gray-600">contact@assouanfes.com</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Opening Hours */}
            <Card className="bg-gray-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-deep-black mb-6">
                  <Clock className="inline w-6 h-6 mr-2 text-gold" />
                  {t('contact.openingHours')}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{t('contact.mondayToSunday')}</span>
                    <span className="text-gold font-semibold">7h00 - 23h00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{t('contact.continuousService')}</span>
                    <span className="text-green-600 font-semibold">{t('contact.yes')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{t('contact.delivery')}</span>
                    <span className="text-blue-500 font-semibold">9h00 - 22h00</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gold/10 rounded-lg border border-gold/20">
                  <div className="flex items-center">
                    <Info className="text-gold w-4 h-4 mr-2" />
                    <span className="text-sm text-gray-700">{t('contact.holidayInfo')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Social Media */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-deep-black mb-6">{t('contact.followUs')}</h3>
                <div className="flex space-x-4">
                  <Button 
                    size="icon"
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-300"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </Button>
                  <Button 
                    size="icon"
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full transition-all duration-300"
                  >
                    <i className="fab fa-instagram"></i>
                  </Button>
                  <Button 
                    size="icon"
                    className="w-12 h-12 bg-blue-400 hover:bg-blue-500 text-white rounded-full transition-colors duration-300"
                  >
                    <i className="fab fa-twitter"></i>
                  </Button>
                  <Button 
                    size="icon"
                    className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-300"
                  >
                    <i className="fab fa-youtube"></i>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Contact Form & Map */}
          <div className="space-y-8">
            {/* Carte Interactive */}
            <div className="rounded-xl shadow-lg bg-white overflow-hidden">
              <div className="bg-gray-100 flex flex-col items-center justify-center py-10">
                <iframe
                  title="Carte Interactive"
                  src={`https://www.google.com/maps?q=${encodeURIComponent('4 Avenue Allal Ben Abdellah, Fès, Maroc')}&output=embed`}
                  width="100%"
                  height="250"
                  style={{ border: 0, borderRadius: 12, marginBottom: 16, maxWidth: 500 }}
                  allowFullScreen
                  loading="lazy"
                />
                <div className="text-center">
                  <h3 className="text-lg font-semibold mt-2 mb-1">Carte Interactive</h3>
                  <div className="text-gray-600 mb-2">4 Avenue Allal Ben Abdellah, Fès, Maroc</div>
                  <Button asChild>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('4 Avenue Allal Ben Abdellah, Fès, Maroc')}`} target="_blank" rel="noopener noreferrer">
                      Obtenir l'itinéraire
                    </a>
                  </Button>
                </div>
              </div>
              <div className="flex justify-between px-6 py-4 bg-white border-t">
                <div>
                  <div className="font-semibold">Transport</div>
                  <div className="text-sm text-gray-600">Accessible en voiture et transport public</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">Parking</div>
                  <div className="text-sm text-gray-600">Places disponibles à proximité</div>
                </div>
              </div>
            </div>
            {/* Contact Form */}
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-deep-black mb-6">{t('contact.contactForm')}</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact.form.name')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('contact.form.namePlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('contact.form.phone')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('contact.form.phonePlaceholder')} {...field} value={String(field.value ?? '')} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.form.email')}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t('contact.form.emailPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.form.subject')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('contact.form.subjectPlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('contact.form.message')}</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={4}
                              placeholder={t('contact.form.messagePlaceholder')}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-teal hover:bg-teal text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                      disabled={mutation.isPending}
                    >
                      <Send className="mr-2 h-5 w-5" />
                      {mutation.isPending ? t('contact.form.sending') : t('contact.form.sendMessage')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
