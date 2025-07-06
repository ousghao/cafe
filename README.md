# Assouan Fès - Web Admin & Client

## Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Supabase](https://supabase.com/) account & project

## 1. Clone the repository
```bash
git clone <repo-url>
cd WebDevHub
```

## 2. Install dependencies
```bash
npm install
# or
yarn install
```

## 3. Configure environment variables
Create a `.env.local` file in the root of the project and add:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
Replace `your-supabase-url` and `your-supabase-anon-key` with your Supabase project credentials (find them in your Supabase dashboard under Project Settings > API).

## 4. Supabase Database Setup
- Run the SQL scripts in `supabase-init.sql` (or your own schema) in the Supabase SQL editor to create the necessary tables.
- Make sure your tables match the structure expected by the app (see `supabase-init.sql` and the code for details).

## 5. Start the development server
```bash
npm run dev
# or
yarn dev
```
The app will be available at [http://localhost:3000](http://localhost:3000)

## 6. Build for production
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 7. Admin Access
- Go to `/admin` to access the admin dashboard.
- You need a user in the `users` table with the correct role (e.g. `admin`).
- The login form uses Supabase Auth (email/password).

## 8. Customization
- Update branding, colors, and content in the components as needed.
- Supabase table/column names must match those in the code.

## 9. Troubleshooting
- If you see blank pages or errors, check your environment variables and Supabase table structure.
- Use browser console logs and Supabase logs for debugging.

---

**Enjoy!** 