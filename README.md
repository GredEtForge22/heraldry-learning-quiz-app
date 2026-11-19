# Blasons — apprendre l'héraldique par le quiz

Site Next.js (App Router) pour apprendre l'héraldique :

- **Leçons illustrées** : émaux, écu, partitions, pièces, meubles, blasonnement, histoire
- **Quiz** : « À qui est ce blason ? », « Quel est son blason ? », texte → dessin, savoir blasonner, vocabulaire ; niveaux, thèmes, mode « mort subite », révision des erreurs
- **Armorial** de 55 blasons (royaumes, provinces, villes, maisons) avec mode auto-test
- **Atelier** pour composer son blason et obtenir le blasonnement
- **Classement** des scores (PostgreSQL via Drizzle ORM)

Tous les blasons sont dessinés en **SVG à partir de leur description** (`src/lib/heraldry`) : aucune image à héberger.

## Développement local

```bash
npm install
cp .env.example .env      # puis renseignez DATABASE_URL
npm run dev
```

La table `quiz_scores` est créée automatiquement au premier appel (voir `src/db/ensure.ts`).
Vous pouvez aussi l'appliquer avec Drizzle :

```bash
npx drizzle-kit push --dialect postgresql --schema ./src/db/schema.ts --url "$DATABASE_URL"
```

## Déploiement : GitHub → Vercel + Neon

1. **GitHub** : créez un dépôt et poussez le projet
   ```bash
   git init && git add . && git commit -m "Blasons"
   git branch -M main
   git remote add origin git@github.com:VOTRE_COMPTE/blasons.git
   git push -u origin main
   ```
2. **Neon** : créez un projet sur <https://neon.tech>, puis copiez la chaîne de connexion
   (*Connect* → connexion « pooled », se terminant par `?sslmode=require`).
3. **Vercel** : *Add New → Project*, importez le dépôt GitHub. Dans *Environment Variables*, ajoutez :
   - `DATABASE_URL` = la chaîne de connexion Neon

   (Ou utilisez l'intégration Neon du Marketplace Vercel, qui crée `DATABASE_URL` automatiquement.)
4. Cliquez sur **Deploy**. Chaque `git push` redéploie le site.

Le site fonctionne même si la base est indisponible : seuls le classement et l'envoi de scores en dépendent.
La progression personnelle (blasons maîtrisés, meilleur score) est stockée dans le navigateur.

## Ajouter un blason

Éditez `src/lib/heraldry/armorial.ts` et ajoutez une entrée avec son blasonnement et sa description SVG
(champ, pièces, meubles). Les quiz, l'armorial et les pages de détail se mettent à jour tout seuls.
