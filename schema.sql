-- Create products table
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    au_price DECIMAL(10,2),
    nz_price DECIMAL(10,2),
    au_url TEXT,
    nz_url TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create baskets table
CREATE TABLE baskets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create product_categories table (many-to-many relationship)
CREATE TABLE product_categories (
    product_id INTEGER,
    category_id INTEGER,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Create basket_products table (many-to-many relationship)
CREATE TABLE basket_products (
    basket_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    PRIMARY KEY (basket_id, product_id),
    FOREIGN KEY (basket_id) REFERENCES baskets(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_au_price ON products(au_price);
CREATE INDEX idx_products_nz_price ON products(nz_price);
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_baskets_name ON baskets(name); 