# CERES Scolarité

Plateforme de gestion scolaire pour les établissements au Tchad.

## 🎯 Fonctionnalités

- ✅ Formulaire de demande d'établissement
- 📧 Notifications email automatiques via Resend
- 💾 Stockage des données dans Supabase
- 🔐 Gestion sécurisée des variables d'environnement
- 📱 Interface responsive et conviviale

## 📋 Prérequis

- Compte GitHub (créé ✓)
- Compte Netlify (lié au projet ✓)
- Clé API Resend (configurée ✓)
- Projet Supabase avec table `demandes_etablissements`

## 🚀 Installation et Configuration

### 1. Cloner le dépôt

```bash
git clone https://github.com/ahmatbongo/ceres-scolarite.git
cd ceres-scolarite
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement dans Netlify

Accédez à votre projet Netlify et ajoutez les variables suivantes:

- **RESEND_API_KEY** - Votre clé API Resend (déjà configurée ✓)
- **SUPABASE_URL** - L'URL de votre projet Supabase
- **SUPABASE_ANON_KEY** - La clé publique de Supabase

### 4. Créer la table Supabase

Exécutez cette requête SQL dans Supabase:

```sql
CREATE TABLE demandes_etablissements (
  id SERIAL PRIMARY KEY,
  nom_etablissement VARCHAR(255) NOT NULL,
  ville VARCHAR(255) NOT NULL,
  province VARCHAR(255) NOT NULL,
  nom_directeur VARCHAR(255) NOT NULL,
  telephone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  formule_souhaitee VARCHAR(255) NOT NULL,
  message TEXT,
  date_soumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  email_envoye BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Déployer avec Netlify

#### Option A: Déploiement automatique via GitHub (Recommandé)

1. Poussez vos changements sur GitHub:
```bash
git add .
git commit -m "Ajouter backend et configuration Netlify"
git push origin main
```

2. Dans Netlify:
   - Allez à **Site settings** → **Build & deploy** → **Connected repository**
   - Connectez `ahmatbongo/ceres-scolarite`
   - Configurez le branch à déployer: `main`
   - Sauvegardez

3. Chaque push sur GitHub déclenchera un déploiement automatique

#### Option B: Déploiement manuel

```bash
npm run build
netlify deploy --prod
```

## 📁 Structure du projet

```
ceres-scolarite/
├── netlify/
│   └── functions/
│       └── demander-etablissement.js    # Fonction serverless pour traiter les demandes
├── public/
│   └── demander-etablissement.html      # Formulaire HTML
├── netlify.toml                          # Configuration Netlify
├── package.json                          # Dépendances
├── .gitignore
└── README.md
```

## 🔌 API Endpoints

### POST /api/demander-etablissement

Traite une nouvelle demande d'établissement.

**Payload:**
```json
{
  "nom_etablissement": "Lycée de N'Djaména",
  "ville": "N'Djaména",
  "province": "Région du Logone Occidental",
  "nom_directeur": "Maïmos Arsène",
  "telephone": "+235 61 23 45 67",
  "email": "contact@etablissement.td",
  "formule_souhaitee": "Formule Premium",
  "message": "Information supplémentaire (optionnel)"
}
```

**Réponse réussie (200):**
```json
{
  "message": "Demande traitée avec succès",
  "email_id": "email_id_resend",
  "database_id": 1
}
```

## 🧪 Tester le formulaire

1. Accédez à: `https://ceres-scolarite.netlify.app/demander-etablissement.html`
2. Remplissez le formulaire avec les informations de test
3. Vérifiez que:
   - ✅ Un email est reçu à `ceres151266@gmail.com`
   - ✅ Les données sont stockées dans Supabase
   - ✅ Une confirmation s'affiche dans le navigateur

## 📧 Configuration Resend

Pour envoyer depuis un domaine personnalisé:

1. Ajoutez votre domaine dans Resend
2. Remplacez `noreply@ceres-scolarite.com` par votre email vérifié dans la fonction

## 🛠️ Dépannage

**Erreur: "RESEND_API_KEY not found"**
- Vérifiez que la variable d'environnement est définie dans Netlify

**Erreur: "Supabase connection failed"**
- Vérifiez SUPABASE_URL et SUPABASE_ANON_KEY
- Assurez-vous que la table `demandes_etablissements` existe

**Le formulaire ne soumet pas:**
- Ouvrez la console du navigateur (F12) pour voir les erreurs
- Vérifiez que l'API endpoint est accessible

## 📞 Support

Pour toute question ou problème, contactez: `ceres151266@gmail.com`

## 📄 License

MIT
