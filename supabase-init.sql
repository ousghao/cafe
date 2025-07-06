-- Script d'initialisation Supabase pour Assouan Fès
-- À exécuter dans l'éditeur SQL de Supabase

-- Création des tables
CREATE TABLE IF NOT EXISTS dish_types (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dishes (
  id SERIAL PRIMARY KEY,
  type_id INTEGER REFERENCES dish_types(id) NOT NULL,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  description_fr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  price INTEGER NOT NULL,
  img_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  allergens JSONB,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  persons INTEGER NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  type_event TEXT NOT NULL,
  persons INTEGER NOT NULL,
  date_needed TEXT NOT NULL,
  budget TEXT,
  description TEXT NOT NULL,
  img_refs JSONB,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
create table customer_orders (
  id serial primary key,
  full_name text,
  email text,
  phone text,
  address text,
  items jsonb, -- [{dish_id, name, quantity, price}]
  total_price numeric,
  status text default 'pending',
  created_at timestamp default now()
);
-- Insertion des types de plats par défaut
INSERT INTO dish_types (slug, name_fr, name_en, name_ar, "order") VALUES
('breakfast', 'Petit-Déjeuner', 'Breakfast', 'إفطار مغربي', 1),
('drinks', 'Boissons Chaudes', 'Hot Drinks', 'مشروبات ساخنة', 2),
('juices', 'Jus & Smoothies', 'Juices & Smoothies', 'عصائر وسمودي', 3),
('viennoiserie', 'Viennoiserie', 'Pastries', 'معجنات', 4),
('savory', 'Plats Salés', 'Savory Dishes', 'أطباق مالحة', 5),
('desserts', 'Desserts', 'Desserts', 'حلويات', 6);

-- Insertion des plats par défaut
INSERT INTO dishes (type_id, name_fr, name_en, name_ar, description_fr, description_en, description_ar, price, img_url, allergens) VALUES
(1, 'Petit-Déjeuner Marocain', 'Moroccan Breakfast', 'إفطار مغربي', 'Pain traditionnel, miel, beurre, confiture maison, olives et thé à la menthe', 'Traditional bread, honey, butter, homemade jam, olives and mint tea', 'خبز تقليدي، عسل، زبدة، مربى منزلي، زيتون وأتاي بالنعناع', 45, 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400', '["gluten"]'),
(4, 'Croissants Artisanaux', 'Artisanal Croissants', 'كرواسان حرفي', 'Croissants au beurre, pains au chocolat, chaussons aux pommes, préparés quotidiennement', 'Butter croissants, chocolate croissants, apple turnovers, prepared daily', 'كرواسان بالزبدة، بان أو شوكولا، تشوسون بالتفاح، محضر يومياً', 15, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400', '["gluten", "dairy"]'),
(6, 'Gâteaux Signature', 'Signature Cakes', 'كعك مميز', 'Gâteau au chocolat, cheesecake, millefeuille, tiramisu - créations du chef pâtissier', 'Chocolate cake, cheesecake, millefeuille, tiramisu - pastry chef creations', 'كعكة الشوكولاتة، تشيز كيك، ميلفاي، تيراميسو - إبداعات رئيس الحلوانيين', 50, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400', '["gluten", "dairy", "eggs"]'),
(2, 'Thé à la Menthe', 'Mint Tea', 'أتاي بالنعناع', 'Thé vert traditionnel à la menthe fraîche, servi dans un verre authentique', 'Traditional green tea with fresh mint, served in an authentic glass', 'شاي أخضر تقليدي بالنعناع الطازج، يقدم في كأس أصيل', 15, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400', '[]'),
(3, 'Jus de Fruits Frais', 'Fresh Fruit Juices', 'عصائر فواكه طازجة', 'Orange, pomme, carotte, avocat, cocktails de fruits de saison pressés minute', 'Orange, apple, carrot, avocado, seasonal fruit cocktails freshly pressed', 'برتقال، تفاح، جزر، أفوكادو، كوكتيلات فواكه موسمية معصورة طازجة', 22, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400', '[]'),
(5, 'Tajine du Chef', 'Chef''s Tagine', 'طاجين الشيف', 'Tajine aux légumes de saison, agneau ou poulet, épices traditionnelles, servi avec pain', 'Seasonal vegetable tagine, lamb or chicken, traditional spices, served with bread', 'طاجين بخضار الموسم، خروف أو دجاج، بهارات تقليدية، يقدم مع الخبز', 85, 'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400', '["gluten"]');

-- Insertion des paramètres par défaut
INSERT INTO settings (key, value) VALUES
('max_capacity', '50'),
('opening_time', '07:00'),
('closing_time', '23:00'),
('restaurant_name', 'Assouan Fès'),
('restaurant_address', '4 Avenue Allal Ben Abdellah, Fès'),
('restaurant_phone', '+212 5 35 62 34 56'),
('restaurant_email', 'contact@assouan-fes.com');

-- Création d'un utilisateur administrateur par défaut
-- Note: L'ID UUID doit correspondre à l'utilisateur créé dans Supabase Auth
-- INSERT INTO users (id, email, role) VALUES 
-- ('your-admin-user-id', 'admin@assouan-fes.com', 'admin');

-- Création des index pour les performances
CREATE INDEX IF NOT EXISTS idx_dishes_type_id ON dishes(type_id);
CREATE INDEX IF NOT EXISTS idx_dishes_active ON dishes(is_active);
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_dish_types_order ON dish_types("order");

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_dishes_updated_at BEFORE UPDATE ON dishes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour réorganiser les types de plats
CREATE OR REPLACE FUNCTION reorder_dish_types(orders JSON)
RETURNS VOID AS $$
DECLARE
    item JSON;
BEGIN
    FOR item IN SELECT * FROM json_array_elements(orders)
    LOOP
        UPDATE dish_types 
        SET "order" = (item->>'order')::INTEGER 
        WHERE id = (item->>'id')::INTEGER;
    END LOOP;
END;
$$ LANGUAGE plpgsql; 