# 🎨 Project Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE PAGES                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐      ┌──────────────────────────┐   │
│  │  PUBLIC MENU     │      │   ADMIN PANEL            │   │
│  │  (index.html)    │      │   (admin/index.html)     │   │
│  │                  │      │                          │   │
│  │ • Display items  │      │ • Login form             │   │
│  │ • Lazy load imgs │      │ • Add/edit/delete items │   │
│  │ • Real-time      │      │ • Image preview         │   │
│  └────────┬─────────┘      └────────┬─────────────────┘   │
│           │                         │                      │
│           └────────────┬────────────┘                      │
│                        │                                   │
│           ┌────────────▼────────────┐                     │
│           │   CLOUDFLARE WORKERS    │                     │
│           │   (API Functions)       │                     │
│           ├────────────────────────┤                      │
│           │ /api/items    (CRUD)   │                      │
│           │ /api/auth     (Login)  │                      │
│           └────────────┬────────────┘                     │
│                        │                                   │
│           ┌────────────▼────────────┐                     │
│           │   CLOUDFLARE KV        │                     │
│           │   (Database)           │                     │
│           │                        │                     │
│           │  ┌──────────────────┐  │                     │
│           │  │ items: [...]     │  │                     │
│           │  │ {name, desc,     │  │                     │
│           │  │  price, image}   │  │                     │
│           │  └──────────────────┘  │                     │
│           └────────────────────────┘                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Menu Page Load
```
User visits menu
       ↓
Browser loads index.html
       ↓
JavaScript fetch('/api/items')
       ↓
Cloudflare Worker receives GET request
       ↓
Worker reads from KV namespace (items key)
       ↓
Returns JSON array of menu items
       ↓
JavaScript renders items with lazy-loaded images
       ↓
User sees beautiful menu! 🍝
```

### Admin: Add New Item
```
Admin visits /admin/
       ↓
Sees login form
       ↓
Enters password → POST /api/auth
       ↓
Worker verifies password matches env.ADMIN_PASSWORD
       ↓
Returns auth token → stored in localStorage
       ↓
Admin panel unlocks
       ↓
Admin fills form (name, description, price, image)
       ↓
Clicks "Save" → POST /api/items
       ↓
Header: X-Admin-Token: <token>
Body: {name, description, price, image}
       ↓
Worker validates token exists
       ↓
Generates new item with unique ID
       ↓
Reads current items from KV
       ↓
Appends new item to array
       ↓
Writes back to KV
       ↓
Returns saved item (with ID)
       ↓
Admin panel updates instantly
       ↓
Shows in menu on refresh! ✨
```

### Admin: Edit Item
```
Admin clicks "Edit" on item card
       ↓
Modal opens with current item data
       ↓
User changes field (e.g., price)
       ↓
Clicks "Save" → PUT /api/items
       ↓
Header: X-Admin-Token: <token>
Body: {id, name, description, price, image}
       ↓
Worker validates token
       ↓
Finds item by ID in KV array
       ↓
Merges updates into existing item
       ↓
Writes array back to KV
       ↓
Returns updated item
       ↓
Admin panel refreshes list
       ↓
Menu shows new price on refresh! 💰
```

## Information Architecture

```
📱 USER EXPERIENCE
├── Public Menu (Customers)
│   ├── View all items
│   ├── See prices
│   ├── View images
│   └── Link to admin panel
│
└── Admin Panel (Staff)
    ├── 🔐 Authentication
    │   └── Password login
    │
    ├── 📋 Item Management
    │   ├── View all items
    │   ├── Add new item
    │   │   ├── Name field
    │   │   ├── Description field
    │   │   ├── Price field
    │   │   └── Image URL field
    │   │
    │   ├── Edit item
    │   │   └── Change any field
    │   │
    │   └── Delete item
    │       └── Confirm deletion
    │
    └── 🚪 Logout
```

## File Relationships

```
wrangler.toml (Config)
├── Specifies KV namespace binding
├── Sets environment variables (ADMIN_PASSWORD)
└── Defines API routes

functions/api/
├── items.js (CRUD operations)
│   ├── Reads/writes to KV namespace
│   ├── Checks for auth token
│   └── Returns JSON responses
│
├── auth.js (Login)
│   ├── Validates password
│   └── Returns auth token
│
└── data-init.js (Utilities)
    └── Initializes sample data

public/
├── index.html (Public Menu)
│   ├── Fetches from /api/items
│   ├── Implements lazy-loading
│   └── Renders items
│
└── admin/
    └── index.html (Admin Panel)
        ├── Communicates with /api/auth
        ├── Sends requests to /api/items
        └── Manages UI state
```

## API Request/Response Examples

### Get Menu Items
```
REQUEST:
GET /api/items

RESPONSE (200):
[
  {
    "id": "1645000000000",
    "name": "ROSSO",
    "description": "بلونز ، سس گوجه، بشامل",
    "price": "835,000 تومان",
    "image": "https://example.com/rosso.jpg",
    "createdAt": "2024-02-22T10:00:00.000Z"
  },
  ...
]
```

### Login
```
REQUEST:
POST /api/auth
Content-Type: application/json
{
  "password": "mypassword"
}

RESPONSE (200):
{
  "token": "bXlwYXNzd29yZDE2NDUwMDAwMDAwMDA=",
  "message": "Authenticated"
}

RESPONSE (401):
{
  "error": "Invalid password"
}
```

### Create Item
```
REQUEST:
POST /api/items
X-Admin-Token: bXlwYXNzd29yZDE2NDUwMDAwMDAwMDA=
Content-Type: application/json
{
  "name": "ROSSO",
  "description": "بلونز ، سس گوجه، بشامل",
  "price": "835,000 تومان",
  "image": "https://example.com/rosso.jpg"
}

RESPONSE (201):
{
  "id": "1645000000000",
  "name": "ROSSO",
  "description": "بلونز ، سس گوجه، بشامل",
  "price": "835,000 تومان",
  "image": "https://example.com/rosso.jpg",
  "createdAt": "2024-02-22T10:00:00.000Z"
}
```

## Technology Stack Interactions

```
┌─────────────────────────────────────────────────────┐
│              BROWSER (HTML/CSS/JavaScript)         │
│                                                     │
│  ┌────────────────────────────────────────────┐   │
│  │ Fetch API (Modern standard)                │   │
│  │ ├─ GET/POST/PUT/DELETE requests            │   │
│  │ ├─ JSON request/response bodies            │   │
│  │ └─ Header management (tokens, content-type)│   │
│  └────────────────────────────────────────────┘   │
│                          │                         │
│                 ┌────────▼─────────┐              │
│                 │   HTTP Requests  │              │
│                 └────────┬─────────┘              │
│                          │                         │
└──────────────────────────┼──────────────────────────┘
                           │
                 ┌─────────▼──────────┐
                 │  CLOUDFLARE EDGE   │
                 │  (Global Points)   │
                 └─────────┬──────────┘
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
┌─────▼──────┐      ┌──────▼────────┐    ┌─────▼─────┐
│ Static     │      │  Workers      │    │ KV DB     │
│ Files      │      │ (Logic)       │    │ (Storage) │
│(index.html)│      │ (api/items.js)│    │ (items)   │
└────────────┘      └───────────────┘    └───────────┘
```

## Security Model

```
REQUEST TO PROTECTED ENDPOINT
         │
         ├─ GET /api/items
         │  └─ ✅ NO TOKEN NEEDED (public data)
         │
         └─ POST/PUT/DELETE /api/items
            │
            ├─ Check X-Admin-Token header exists
            │  ├─ ✅ Token exists → Proceed
            │  └─ ❌ No token → 401 Unauthorized
            │
            └─ Process request
               ├─ Read/write to KV
               └─ Return updated data

TOKEN GENERATION
         │
    POST /api/auth
         │
    Compare password with env.ADMIN_PASSWORD
         ├─ ✅ Match → Generate token
         │  └─ Return to client (localStorage)
         │
         └─ ❌ No match → 401 Unauthorized
```

## Deployment Architecture

```
GitHub Repository
         │
         ├─ Push to main branch
         │
         └─ Webhook triggered
            │
            └─ Cloudflare Pages
               │
               ├─ Clone repo
               ├─ Read wrangler.toml
               ├─ Deploy to edge locations
               │  ├─ /public → Static assets
               │  └─ /functions/api → Workers
               │
               └─ Bind environment
                  ├─ KV namespace
                  └─ Variables (ADMIN_PASSWORD)

RESULT: Your site is now on Cloudflare's global network! 🌍
        Available in ~200 data centers worldwide
        Auto-caching enabled
        DDoS protection included
```

## Performance Optimization

```
LAZY LOADING FLOW

Page Load
   │
   ├─ Load HTML/CSS/JS
   ├─ Fetch menu items from API
   └─ Render visible items only

User Scrolls
   │
   ├─ Intersection Observer detects image enter viewport
   │
   └─ Set src attribute  
      │
      ├─ Image starts loading
      └─ Fade in animation

RESULT: 
- Faster initial page load
- Reduced bandwidth for mobile users  
- Smooth scrolling experience
```

---

**This architecture provides:**
- 🚀 Fast global performance
- 🔒 Secure authentication
- 📱 Mobile-friendly design
- ♻️ Real-time updates
- 📈 Automatic scaling
- 💚 Free hosting

Ready to build? Start with [SETUP.md](./docs/SETUP.md)! 👉
