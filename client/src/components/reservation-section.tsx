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
import { insertReservationSchema, type InsertReservation } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { CalendarCheck, Clock, Phone, MapPin, Wifi } from "lucide-react";
import { createClient } from '@/lib/supabase';

export default function ReservationSection() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertReservation>({
    resolver: zodResolver(insertReservationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      guests: 2,
      preference: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertReservation) => {
      const supabase = createClient();
      return supabase.from('reservations').insert({
        full_name: data.name,
        phone: data.phone,
        email: data.email,
        date: data.date,
        time: data.time,
        persons: data.guests,
        notes: data.notes,
        status: 'pending',
      });
    },
    onSuccess: () => {
      toast({
        title: t('reservation.successTitle'),
        description: t('reservation.successMessage'),
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
    },
    onError: (error) => {
      toast({
        title: t('reservation.errorTitle'),
        description: t('reservation.errorMessage'),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertReservation) => {
    mutation.mutate(data);
  };

  const timeSlots = [
    "07:00", "08:00", "09:00", "12:00", "13:00", "19:00", "20:00", "21:00"
  ];

  const guestOptions = [1, 2, 3, 4, 5, 6];
  const preferences = ["", "terrasse", "interieur", "prive"];

  return (
    <section id="reservation" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-deep-black mb-4">
              {t('reservation.title')} <span className="text-teal">{t('reservation.titleHighlight')}</span>
            </h2>
            <p className="text-xl text-gray-600">
              {t('reservation.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Reservation Form */}
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('reservation.form.name')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('reservation.form.namePlaceholder')} {...field} />
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
                            <FormLabel>{t('reservation.form.phone')}</FormLabel>
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
                          <FormLabel>{t('reservation.form.email')}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={t('reservation.form.emailPlaceholder')} {...field} value={String(field.value ?? '')} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('reservation.form.date')}</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('reservation.form.time')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('reservation.form.timePlaceholder')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="guests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('reservation.form.guests')}</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('reservation.form.guestsPlaceholder')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {guestOptions.map((count) => (
                                  <SelectItem key={count} value={count.toString()}>
                                    {count} {count === 1 ? t('reservation.form.person') : t('reservation.form.people')}
                                  </SelectItem>
                                ))}
                                <SelectItem value="7">6+ {t('reservation.form.people')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="preference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('reservation.form.preference')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('reservation.form.preferencePlaceholder')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">{t('reservation.form.noPreference')}</SelectItem>
                                <SelectItem value="terrasse">{t('reservation.form.terrace')}</SelectItem>
                                <SelectItem value="interieur">{t('reservation.form.interior')}</SelectItem>
                                <SelectItem value="prive">{t('reservation.form.private')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('reservation.form.notes')}</FormLabel>
                          <FormControl>
                            <Textarea 
                              rows={3}
                              placeholder={t('reservation.form.notesPlaceholder')}
                              {...field} 
                              value={String(field.value ?? '')}
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
                      <CalendarCheck className="mr-2 h-5 w-5" />
                      {mutation.isPending ? t('reservation.form.submitting') : t('reservation.form.confirm')}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {/* Restaurant Info */}
            <div className="space-y-8">
              <img 
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt={t('reservation.terraceAlt')}
                className="rounded-xl shadow-lg w-full h-64 object-cover"
              />
              
              <Card className="bg-gray-50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-deep-black mb-4">{t('reservation.practicalInfo')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="text-teal w-5 h-5 mr-3" />
                      <span className="text-gray-700">{t('reservation.hours')}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="text-teal w-5 h-5 mr-3" />
                      <span className="text-gray-700">+212 5 35 62 34 56</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="text-gold w-5 h-5 mr-3" />
                      <span className="text-gray-700">{t('reservation.address')}</span>
                    </div>
                    <div className="flex items-center">
                      <Wifi className="text-gold w-5 h-5 mr-3" />
                      <span className="text-gray-700">{t('reservation.wifi')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gold/10 border-gold/20">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-deep-black mb-2">{t('reservation.expressReservation')}</h4>
                  <p className="text-gray-600 text-sm mb-4">{t('reservation.expressDescription')}</p>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-300">
                    <i className="fab fa-whatsapp mr-2"></i>
                    {t('reservation.whatsappDirect')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
