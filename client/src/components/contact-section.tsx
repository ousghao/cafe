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
      return apiRequest("POST", "/api/contact", data);
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
            {t('contact.title')} <span className="text-gold">{t('contact.titleHighlight')}</span>
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
                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-gold w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-deep-black">{t('contact.address')}</h4>
                      <p className="text-gray-600">{t('contact.fullAddress')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="text-gold w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-deep-black">{t('contact.phone')}</h4>
                      <p className="text-gray-600">+212 5 35 62 34 56</p>
                      <Button variant="link" className="text-gold hover:text-gold p-0 h-auto font-medium">
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
                              <Input placeholder="+212 6XX XXX XXX" {...field} />
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
                      className="w-full bg-gold hover:bg-gold text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                      disabled={mutation.isPending}
                    >
                      <Send className="mr-2 h-5 w-5" />
                      {mutation.isPending ? t('contact.form.sending') : t('contact.form.sendMessage')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Map */}
            <Card className="shadow-lg overflow-hidden">
              <div className="h-96 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="text-gold w-16 h-16 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-deep-black mb-2">{t('contact.interactiveMap')}</h4>
                    <p className="text-gray-600 mb-4">{t('contact.fullAddress')}</p>
                    <Button className="bg-gold hover:bg-gold text-white px-6 py-3 rounded-full font-medium transition-colors duration-300">
                      <i className="fas fa-directions mr-2"></i>
                      {t('contact.getDirections')}
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-deep-black">{t('contact.transport')}</h4>
                    <p className="text-sm text-gray-600">{t('contact.transportInfo')}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="font-semibold text-deep-black">{t('contact.parking')}</h4>
                    <p className="text-sm text-gray-600">{t('contact.parkingInfo')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
