import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { insertCustomCakeInquirySchema, type InsertCustomCakeInquiry } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Send, Check, CloudUpload } from "lucide-react";

export default function CustomCakesSection() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertCustomCakeInquiry>({
    resolver: zodResolver(insertCustomCakeInquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      eventType: "",
      eventDate: "",
      guestCount: 10,
      budget: "",
      description: "",
      inspirationPhotos: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertCustomCakeInquiry) => {
      return apiRequest("POST", "/api/custom-cakes", data);
    },
    onSuccess: () => {
      toast({
        title: t('customCakes.successTitle'),
        description: t('customCakes.successMessage'),
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/custom-cakes"] });
    },
    onError: (error) => {
      toast({
        title: t('customCakes.errorTitle'),
        description: t('customCakes.errorMessage'),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCustomCakeInquiry) => {
    mutation.mutate(data);
  };

  const eventTypes = ["mariage", "anniversaire", "entreprise", "bapteme", "autre"];
  const budgetRanges = ["", "500-1000", "1000-2000", "2000-5000", "5000+"];

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Wedding cake"
    },
    {
      src: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Birthday cake"
    },
    {
      src: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Corporate cake"
    },
    {
      src: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Artistic cake"
    }
  ];

  return (
    <section id="custom-cakes" className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-deep-black mb-4">
            {t('customCakes.title')} <span className="text-gold">{t('customCakes.titleHighlight')}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('customCakes.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Custom Cake Gallery */}
          <div>
            <h3 className="text-2xl font-semibold text-deep-black mb-6">{t('customCakes.ourCreations')}</h3>
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((image, index) => (
                <img
                  key={index}
                  src={image.src}
                  alt={image.alt}
                  className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-full h-48 object-cover"
                />
              ))}
            </div>
            
            <Card className="mt-8 shadow-lg">
              <CardContent className="p-6">
                <h4 className="font-semibold text-deep-black mb-3">{t('customCakes.specialties')}</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Check className="text-gold w-4 h-4 mr-2" />
                    {t('customCakes.weddingCakes')}
                  </li>
                  <li className="flex items-center">
                    <Check className="text-gold w-4 h-4 mr-2" />
                    {t('customCakes.birthdayCakes')}
                  </li>
                  <li className="flex items-center">
                    <Check className="text-gold w-4 h-4 mr-2" />
                    {t('customCakes.corporateEvents')}
                  </li>
                  <li className="flex items-center">
                    <Check className="text-gold w-4 h-4 mr-2" />
                    {t('customCakes.glutenFree')}
                  </li>
                  <li className="flex items-center">
                    <Check className="text-gold w-4 h-4 mr-2" />
                    {t('customCakes.delivery')}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Custom Cake Form */}
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-deep-black mb-6">{t('customCakes.quotationRequest')}</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('customCakes.form.name')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('customCakes.form.namePlaceholder')} {...field} />
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
                          <FormLabel>{t('customCakes.form.phone')}</FormLabel>
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
                        <FormLabel>{t('customCakes.form.email')}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder={t('customCakes.form.emailPlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('customCakes.form.eventType')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('customCakes.form.eventTypePlaceholder')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {eventTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {t(`customCakes.form.eventTypes.${type}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('customCakes.form.eventDate')}</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="guestCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('customCakes.form.guestCount')}</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              placeholder="Ex: 50"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('customCakes.form.budget')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('customCakes.form.budgetPlaceholder')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="not-defined">{t('customCakes.form.budgetNotDefined')}</SelectItem>
                              {budgetRanges.slice(1).map((range) => (
                                <SelectItem key={range} value={range}>
                                  {range.replace('+', '+')} DH
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('customCakes.form.description')}</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4}
                            placeholder={t('customCakes.form.descriptionPlaceholder')}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel>{t('customCakes.form.inspirationPhotos')}</FormLabel>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gold transition-colors duration-300 mt-2">
                      <CloudUpload className="text-gray-400 w-12 h-12 mx-auto mb-2" />
                      <p className="text-gray-600">{t('customCakes.form.uploadDescription')}</p>
                      <Button type="button" variant="outline" className="mt-2 text-gold hover:text-gold">
                        {t('customCakes.form.browseFiles')}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gold hover:bg-gold text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                    disabled={mutation.isPending}
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {mutation.isPending ? t('customCakes.form.submitting') : t('customCakes.form.sendRequest')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
