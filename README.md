# Orders Management System

Sistema de gestión de órdenes desarrollado con **FastAPI** (Backend) y **React** (Frontend).

## 🌐 Demo en Vivo

| Servicio | URL |
|----------|-----|
| **Frontend** | https://orders-management-pi.vercel.app |
| **Backend API** | https://orders-management-zhrn.onrender.com |
| **API Docs** | https://orders-management-zhrn.onrender.com/docs |

---

## 📋 Funcionalidades

### Vista 1: My Orders (Lista de Órdenes)
- ✅ Tabla con columnas: ID, Order #, Date, # Products, Final Price, Status, Options
- ✅ Ordenamiento por fecha (más reciente primero)
- ✅ Botón "Add Order" para crear nuevas órdenes
- ✅ Botón "Edit" para modificar órdenes existentes
- ✅ Botón "Delete" con confirmación modal
- ✅ Dropdown para cambiar status (Pending → InProgress → Completed)

### Vista 2: Add/Edit Order (Gestión de Orden)
- ✅ Formulario con Order Number y Date
- ✅ Tabla de productos dentro de la orden
- ✅ Botón "Add Product" con modal de selección
- ✅ Editar cantidad de productos
- ✅ Eliminar productos de la orden
- ✅ Cálculo automático de # Products y Final Price

### Extras Implementados
- ✅ **Vista Products**: CRUD completo de productos (crear, editar, eliminar)
- ✅ **Cambio de Status**: Dropdown interactivo en la tabla de órdenes
- ✅ **Validación de órdenes completadas**: No se pueden modificar ni eliminar
- ✅ **Soft Delete**: Las órdenes eliminadas se marcan como `is_deleted`

### Bonus
- ✅ **Backend en Python/FastAPI** (en lugar de Node.js)
- ✅ **Deployment**: Backend en Render, Frontend en Vercel, DB en Aiven

---

## 🛠️ Tech Stack

### Backend
| Tecnología | Versión |
|------------|---------|
| Python | 3.11+ |
| FastAPI | 0.109.0 |
| SQLAlchemy | 2.0.36 |
| PyMySQL | 1.1.0 |
| Uvicorn | 0.27.0 |
| Pydantic Settings | 2.1.0 |

### Frontend
| Tecnología | Versión |
|------------|---------|
| React | 19.2.0 |
| TypeScript | 5.9.3 |
| Vite | 7.2.4 |
| React Router | 7.13.0 |
| Axios | 1.13.4 |
| TailwindCSS | 4.1.18 |

### Base de Datos
- **MySQL 8.0** (Aiven Cloud)

---

## 📊 Modelo de Datos

### Order
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Primary Key, Auto-increment |
| order_number | VARCHAR(50) | Número de orden |
| date | DATETIME | Fecha de creación |
| num_products | INT | Cantidad total de productos |
| final_price | DECIMAL(10,2) | Precio total calculado |
| status | ENUM | Pending, InProgress, Completed |
| is_deleted | BOOLEAN | Soft delete flag |
| created_at | DATETIME | Timestamp de creación |
| updated_at | DATETIME | Timestamp de actualización |

### Product
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Primary Key, Auto-increment |
| name | VARCHAR(100) | Nombre del producto |
| unit_price | DECIMAL(10,2) | Precio unitario |
| is_deleted | BOOLEAN | Soft delete flag |
| created_at | DATETIME | Timestamp de creación |
| updated_at | DATETIME | Timestamp de actualización |

### OrderProduct (Relación N:M)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Primary Key |
| order_id | INT | FK → orders.id |
| product_id | INT | FK → products.id |
| quantity | INT | Cantidad del producto |
| unit_price | DECIMAL(10,2) | Precio al momento de agregar |
| total_price | DECIMAL(10,2) | quantity × unit_price |

---

## 🔌 API Endpoints

### Orders
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/orders/` | Listar todas las órdenes |
| GET | `/api/v1/orders/{id}` | Obtener orden con sus items |
| POST | `/api/v1/orders/` | Crear nueva orden |
| PUT | `/api/v1/orders/{id}` | Actualizar orden (número, status) |
| DELETE | `/api/v1/orders/{id}` | Eliminar orden (soft delete) |

### Order Items
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/orders/{id}/items` | Agregar producto a orden |
| PUT | `/api/v1/orders/{id}/items/{item_id}` | Actualizar cantidad |
| DELETE | `/api/v1/orders/{id}/items/{item_id}` | Eliminar producto de orden |

### Products
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/products/` | Listar todos los productos |
| GET | `/api/v1/products/{id}` | Obtener producto por ID |
| POST | `/api/v1/products/` | Crear nuevo producto |
| PUT | `/api/v1/products/{id}` | Actualizar producto |
| DELETE | `/api/v1/products/{id}` | Eliminar producto (soft delete) |

---

## 🚀 Instalación Local

### Requisitos
- Python 3.11+
- Node.js 18+
- MySQL 8.0 (o Docker)

### Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu DATABASE_URL

# Ejecutar
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con VITE_API_URL

# Ejecutar
npm run dev
```

---

## 🌍 Variables de Entorno

### Backend (.env)
```env
DATABASE_URL=mysql+pymysql://user:password@host:port/database
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8001/api/v1
```

---

## 📦 Deployment

### Backend (Render)
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**: `DATABASE_URL`

### Frontend (Vercel)
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: `VITE_API_URL`

### Base de Datos (Aiven)
- MySQL 8.0 con SSL habilitado
- El backend maneja automáticamente la conexión SSL

---

## 🎨 Diseño

Estilo inspirado en **Notion** con la paleta "Tinta y Papel":

| Variable | Color | Uso |
|----------|-------|-----|
| `--bg-primary` | #FAF8F5 | Fondo principal |
| `--bg-secondary` | #EDEAE5 | Fondo secundario |
| `--primary` | #2D4A6F | Botones, enlaces |
| `--secondary` | #B87333 | Acentos |
| `--text` | #1A1A1A | Texto principal |
| `--success` | #4A7C59 | Status completado |
| `--error` | #8B4049 | Errores, eliminar |

---

## 📁 Estructura del Proyecto

```
technical_test/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── orders.py
│   │   │   │   └── products.py
│   │   │   └── router.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── database.py
│   │   ├── models/
│   │   │   ├── order.py
│   │   │   ├── order_product.py
│   │   │   └── product.py
│   │   ├── schemas/
│   │   │   ├── order.py
│   │   │   ├── order_product.py
│   │   │   └── product.py
│   │   └── main.py
│   ├── migrations/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.tsx
│   │   ├── pages/
│   │   │   ├── MyOrders.tsx
│   │   │   ├── AddOrder.tsx
│   │   │   └── Products.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── orderService.ts
│   │   │   └── productService.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vercel.json
│   └── .env.example
└── README.md
```

---

## 👤 Autor

Desarrollado como prueba técnica.

## 📄 Licencia

MIT
