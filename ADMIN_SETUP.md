# 🎯 Panneau d'Administration Assouan Fès

## 📋 Vue d'ensemble

Le panneau d'administration d'Assouan Fès est une extension complète du site web existant qui permet de gérer dynamiquement :
- **Menu** : Types de plats et plats avec drag & drop
- **Réservations** : Gestion des réservations avec vérification de disponibilité
- **Commandes** : Gestion des commandes personnalisées (gâteaux)
- **Messages** : Gestion des messages de contact
- **Paramètres** : Configuration du restaurant
- **Dashboard** : Statistiques et KPIs en temps réel

## 🚀 Installation

### 1. Configuration Supabase

1. **Créer un projet Supabase** :
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un nouveau projet
   - Notez l'URL et la clé anon

2. **Initialiser la base de données** :
   - Dans l'éditeur SQL de Supabase, exécutez le contenu de `supabase-init.sql`
   - Cela créera toutes les tables et données de base

3. **Configurer l'authentification** :
   - Dans Supabase Auth > Settings, activez l'authentification par email
   - Créez un utilisateur administrateur via l'interface ou l'API

### 2. Configuration de l'environnement

1. **Copier le fichier d'environnement** :
   ```bash
   cp .env.example .env
   ```

2. **Remplir les variables** :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
   DATABASE_URL=votre_url_database
   NODE_ENV=development
   ```

### 3. Installation des dépendances

```bash
npm install
```

### 4. Créer un utilisateur administrateur

1. **Via l'interface Supabase** :
   - Allez dans Authentication > Users
   - Créez un nouvel utilisateur avec email et mot de passe

2. **Ajouter le rôle dans la base** :
   ```sql
   INSERT INTO users (id, email, role) VALUES 
   ('uuid-de-lutilisateur', 'admin@assouan-fes.com', 'admin');
   ```

## 🔐 Rôles et Permissions

### Admin
- **Accès complet** à toutes les fonctionnalités
- Peut créer, modifier, supprimer tous les éléments
- Accès aux paramètres système

### Manager
- **Gestion du menu** : CRUD des plats et types
- **Gestion des réservations** : Confirmer, annuler, modifier
- **Gestion des commandes** : Traiter les demandes
- **Gestion des messages** : Marquer comme lu, répondre
- **Pas d'accès** aux paramètres système

### Viewer
- **Lecture seule** de toutes les données
- Peut voir les statistiques et les listes
- **Pas de modification** possible

## 📊 Fonctionnalités

### Dashboard
- **KPIs en temps réel** : Réservations, commandes, messages
- **Graphiques** : Top 5 des plats les plus consultés
- **Actions rapides** vers les sections principales

### Gestion du Menu
- **Types de plats** : Création, modification, réorganisation par drag & drop
- **Plats** : CRUD complet avec images, prix, allergènes
- **Visibilité** : Activer/désactiver des plats
- **Statistiques** : Compteur de vues par plat

### Gestion des Réservations
- **Vérification automatique** de disponibilité
- **Liste d'attente** automatique si capacité atteinte
- **Filtres** par date, statut, nombre de personnes
- **Actions** : Confirmer, annuler, modifier

### Gestion des Commandes
- **Demandes de gâteaux** personnalisés
- **Suivi des statuts** : Nouvelle, en cours, terminée, annulée
- **Export CSV** des commandes
- **Gestion des images** d'inspiration

### Gestion des Messages
- **Messages de contact** du site public
- **Marquage** comme lu/non lu
- **Réponses** intégrées
- **Filtres** par statut

### Paramètres
- **Informations restaurant** : Nom, adresse, contact
- **Horaires** : Ouverture, fermeture, mode Ramadan
- **Capacité** : Nombre maximum de places
- **Notifications** : Email, SMS, WhatsApp

## 🔧 API Endpoints

### Authentification
- `POST /api/admin/auth/login` - Connexion
- `POST /api/admin/auth/logout` - Déconnexion

### Dashboard
- `GET /api/admin/dashboard` - Statistiques

### Menu
- `GET /api/admin/dish-types` - Liste des types
- `POST /api/admin/dish-types` - Créer un type
- `PUT /api/admin/dish-types/:id` - Modifier un type
- `DELETE /api/admin/dish-types/:id` - Supprimer un type
- `POST /api/admin/dish-types/reorder` - Réorganiser

- `GET /api/admin/dishes` - Liste des plats
- `POST /api/admin/dishes` - Créer un plat
- `PUT /api/admin/dishes/:id` - Modifier un plat
- `DELETE /api/admin/dishes/:id` - Supprimer un plat

### Réservations
- `GET /api/admin/reservations` - Liste des réservations
- `PUT /api/admin/reservations/:id/status` - Modifier le statut

### Commandes
- `GET /api/admin/orders` - Liste des commandes
- `PUT /api/admin/orders/:id/status` - Modifier le statut

### Messages
- `GET /api/admin/messages` - Liste des messages
- `PUT /api/admin/messages/:id/read` - Marquer comme lu

### Paramètres
- `GET /api/admin/settings` - Liste des paramètres
- `PUT /api/admin/settings/:key` - Modifier un paramètre

## 🎨 Interface Utilisateur

### Design System
- **Couleurs** : Teal (#2A9CA3) comme couleur principale
- **Composants** : shadcn/ui avec Radix UI
- **Responsive** : Mobile-first design
- **Accessibilité** : WCAG 2.1 AA compliant

### Navigation
- **Sidebar** fixe avec navigation par sections
- **Header** avec avatar utilisateur et déconnexion
- **Breadcrumbs** pour la navigation contextuelle

## 📱 Responsive Design

- **Desktop** : Interface complète avec sidebar
- **Tablet** : Sidebar rétractable
- **Mobile** : Menu hamburger, interface adaptée

## 🔒 Sécurité

- **Authentification** Supabase avec JWT
- **Autorisation** basée sur les rôles
- **Validation** des données avec Zod
- **Protection CSRF** intégrée
- **Rate limiting** sur les API

## 🚀 Déploiement

### Variables d'environnement de production
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_production
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_production
NODE_ENV=production
```

### Build et déploiement
```bash
npm run build
npm start
```

## 🐛 Dépannage

### Problèmes courants

1. **Erreur d'authentification** :
   - Vérifiez les variables d'environnement Supabase
   - Assurez-vous que l'utilisateur existe dans la table `users`

2. **Erreur de base de données** :
   - Vérifiez que le script `supabase-init.sql` a été exécuté
   - Contrôlez les permissions RLS dans Supabase

3. **Problèmes de CORS** :
   - Configurez les origines autorisées dans Supabase
   - Vérifiez les paramètres de sécurité

## 📞 Support

Pour toute question ou problème :
- **Email** : admin@assouan-fes.com
- **Documentation** : Voir les commentaires dans le code
- **Issues** : Créer une issue sur le repository

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2025  
**Compatible avec** : Node.js 18+, React 18+, Supabase 