import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Building, Clock, Users, Mail } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Configurer les paramètres du restaurant</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5 text-teal" />
              Informations Générales
            </CardTitle>
            <CardDescription>
              Informations de base du restaurant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="restaurant-name">Nom du Restaurant</Label>
              <Input 
                id="restaurant-name" 
                defaultValue="Assouan Fès" 
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="address">Adresse</Label>
              <Input 
                id="address" 
                defaultValue="4 Avenue Allal Ben Abdellah, Fès" 
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input 
                id="phone" 
                defaultValue="+212 5 35 62 34 56" 
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                defaultValue="contact@assouan-fes.com" 
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Horaires d'ouverture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-teal" />
              Horaires d'Ouverture
            </CardTitle>
            <CardDescription>
              Configurer les horaires du restaurant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="opening-time">Heure d'ouverture</Label>
                <Input 
                  id="opening-time" 
                  type="time" 
                  defaultValue="07:00" 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="closing-time">Heure de fermeture</Label>
                <Input 
                  id="closing-time" 
                  type="time" 
                  defaultValue="23:00" 
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="ramadan-mode" />
              <Label htmlFor="ramadan-mode">Mode Ramadan (horaires spéciaux)</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="iftar-time">Heure Iftar</Label>
                <Input 
                  id="iftar-time" 
                  type="time" 
                  defaultValue="18:30" 
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="suhur-time">Heure Suhur</Label>
                <Input 
                  id="suhur-time" 
                  type="time" 
                  defaultValue="04:00" 
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Capacité et réservations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-teal" />
              Capacité et Réservations
            </CardTitle>
            <CardDescription>
              Paramètres de gestion des réservations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="max-capacity">Capacité maximale</Label>
              <Input 
                id="max-capacity" 
                type="number" 
                defaultValue="50" 
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="reservation-advance">Réservation à l'avance (jours)</Label>
              <Input 
                id="reservation-advance" 
                type="number" 
                defaultValue="30" 
                className="mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="waitlist" defaultChecked />
              <Label htmlFor="waitlist">Activer la liste d'attente</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auto-confirm" />
              <Label htmlFor="auto-confirm">Confirmation automatique</Label>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5 text-teal" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configuration des notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="email-notifications" defaultChecked />
              <Label htmlFor="email-notifications">Notifications par email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="sms-notifications" />
              <Label htmlFor="sms-notifications">Notifications par SMS</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="whatsapp-notifications" defaultChecked />
              <Label htmlFor="whatsapp-notifications">Notifications WhatsApp</Label>
            </div>
            <div>
              <Label htmlFor="admin-email">Email administrateur</Label>
              <Input 
                id="admin-email" 
                defaultValue="admin@assouan-fes.com" 
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Actions de maintenance et sauvegarde
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button className="bg-teal hover:bg-teal-600">
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder les paramètres
            </Button>
            <Button variant="outline">
              Restaurer les valeurs par défaut
            </Button>
            <Button variant="outline">
              Exporter la configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 