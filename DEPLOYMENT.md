# 🚀 Guide de Déploiement - Assouan Fès

## ✅ Pré-requis
- [x] Build local testé et fonctionnel
- [x] Base de données Supabase configurée
- [x] Variables d'environnement prêtes

## 🌐 Options de Déploiement

### 1. **Railway (Recommandé pour full-stack)** - Gratuit avec 500h/mois

#### Étapes :
1. **Créer un compte Railway** : https://railway.app
2. **Connecter votre repository GitHub**
3. **Créer un nouveau projet** > Deploy from GitHub
4. **Configurer les variables d'environnement** :
   ```
   NODE_ENV=production
   NEXT_PUBLIC_SUPABASE_URL=https://szqenlopnbjshiachmlh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cWVubG9wbmJqc2hpYWNobWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjM1MzcsImV4cCI6MjA2NzI5OTUzN30.8fjswRq5n08rqIDiE4LbJs6J72uy6gerNdKET2xUtgM
   VITE_SUPABASE_URL=https://szqenlopnbjshiachmlh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cWVubG9wbmJqc2hpYWNobWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjM1MzcsImV4cCI6MjA2NzI5OTUzN30.8fjswRq5n08rqIDiE4LbJs6J72uy6gerNdKET2xUtgM
   DATABASE_URL=postgresql://postgres.szqenlopnbjshiachmlh:VDwL05NbKjn6aVWZ@aws-0-eu-west-3.pooler.supabase.com:5432/postgres
   ```
5. **Déployer** : Railway détectera automatiquement le Dockerfile

### 2. **Render** - Alternative gratuite

#### Étapes :
1. **Créer un compte Render** : https://render.com
2. **New Web Service** > Connect GitHub repository
3. **Configuration** :
   - Build Command : `npm run build`
   - Start Command : `npm start`
   - Environment : Node
4. **Ajouter les variables d'environnement** (mêmes que Railway)

### 3. **Heroku** - Payant mais robuste

#### Étapes :
1. **Installer Heroku CLI** : https://devcenter.heroku.com/articles/heroku-cli
2. **Commandes** :
   ```bash
   heroku create assouan-fes-app
   git push heroku main
   ```

### 4. **VPS (DigitalOcean, OVH, etc.)** - Maximum de contrôle

#### Configuration avec PM2 :
```bash
# Installer PM2
npm install -g pm2

# Démarrer l'app
pm2 start dist/index.js --name "assouan-fes"

# Auto-restart
pm2 startup
pm2 save
```

## 🔧 Configuration Post-Déploiement

### 1. **Supabase - Domaines autorisés**
Dans votre projet Supabase :
- Settings > API
- Site URL : `https://votre-domaine.com`
- Redirect URLs : `https://votre-domaine.com/**`

### 2. **Créer l'utilisateur admin**
1. Dans Supabase > Authentication > Users
2. Créer : `admin@assouan-fes.com` avec un mot de passe fort
3. Dans SQL Editor :
   ```sql
   INSERT INTO users (id, email, role) VALUES 
   ('UUID_DE_L_UTILISATEUR', 'admin@assouan-fes.com', 'admin');
   ```

### 3. **Test final**
- Accédez à `https://votre-domaine.com`
- Testez `https://votre-domaine.com/admin`
- Vérifiez toutes les fonctionnalités

## 📊 Monitoring

### Variables à surveiller :
- Temps de réponse API
- Utilisation mémoire
- Connexions base de données
- Erreurs 500

### Logs utiles :
```bash
# Railway
railway logs

# Heroku  
heroku logs --tail

# PM2
pm2 logs
```

## 🔄 CI/CD Automatisé

### GitHub Actions (optionnel) :
```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run build
      - run: npm test # si vous avez des tests
```

## 🚨 Sécurité Production

- [x] HTTPS activé
- [x] Variables d'environnement sécurisées
- [x] Rate limiting configuré
- [x] CORS configuré correctement
- [x] Sessions sécurisées

## 📞 Support

En cas de problème :
1. Vérifiez les logs de déploiement
2. Testez en local avec `npm start`
3. Vérifiez la connectivité Supabase
4. Contactez le support de la plateforme

---
**Succès du déploiement ! 🎉**
