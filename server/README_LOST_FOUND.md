# Lost & Found Backend - Separate Models Implementation

## Overview
This implementation provides **separate models, controllers, and routes** for Lost Items and Found Items, allowing users to report both types independently.

## Architecture

### Models

#### 1. **LostItem Model** (`src/models/lostitem.js`)
Used when a user **loses something** and wants to report it.

**Fields:**
- `title` (required): Item name
- `category` (required): Item category
- `description` (required): Detailed description
- `dateLost` (required): When item was lost
- `timeLost`: Approximate time
- `location` (required): Where it was lost
- `reward`: Boolean flag for reward offer
- `rewardAmount`: Reward amount if offered
- `images`: Array of image paths
- `status`: reported | found | claimed | closed
- `userId` (required): User who lost the item (auto-populated from auth)
- `contactEmail`: Contact email
- `contactPhone`: Contact phone
- `timestamps`: createdAt, updatedAt

#### 2. **FoundItem Model** (`src/models/Founditem.js`)
Used when a user **finds something** and wants to report it.

**Fields:**
- `title` (required): Item name
- `category` (required): Item category
- `description` (required): Detailed description
- `dateFound` (required): When item was found
- `timeFound`: Approximate time
- `location` (required): Where it was found
- `condition`: excellent | good | fair | poor
- `images`: Array of image paths
- `status`: available | claimed | returned | closed
- `userId` (required): User who found the item (auto-populated from auth)
- `claimedBy`: User who claimed the item
- `contactEmail`: Contact email
- `contactPhone`: Contact phone
- `handoverLocation`: Where to collect the item
- `timestamps`: createdAt, updatedAt

### Controllers

#### **LostItem Controller** (`src/controllers/lost-controller.js`)
- `getAllLostItems`: Get all lost items
- `getLostItemById`: Get specific lost item
- `getUserLostItems`: Get items lost by specific user
- `createLostItem`: Report new lost item
- `updateLostItem`: Update lost item (owner only)
- `deleteLostItem`: Delete lost item (owner only)
- `markAsFound`: Mark item as found
- `searchLostItems`: Search with filters

#### **FoundItem Controller** (`src/controllers/found-controller.js`)
- `getAllFoundItems`: Get all found items
- `getFoundItemById`: Get specific found item
- `getUserFoundItems`: Get items found by specific user
- `createFoundItem`: Report new found item
- `updateFoundItem`: Update found item (owner only)
- `deleteFoundItem`: Delete found item (owner only)
- `claimFoundItem`: Claim a found item
- `markAsReturned`: Mark as returned to owner
- `searchFoundItems`: Search with filters

### Routes

#### **Lost Items Routes** (`/api/lost`)
```
GET    /api/lost              - Get all lost items
GET    /api/lost/:id          - Get lost item by ID
GET    /api/lost/user/:userId - Get user's lost items (auth)
GET    /api/lost/search       - Search lost items
POST   /api/lost              - Create lost item (auth)
PUT    /api/lost/:id          - Update lost item (auth, owner)
DELETE /api/lost/:id          - Delete lost item (auth, owner)
PATCH  /api/lost/:id/mark-found - Mark as found (auth)
```

#### **Found Items Routes** (`/api/found`)
```
GET    /api/found              - Get all found items
GET    /api/found/:id          - Get found item by ID
GET    /api/found/user/:userId - Get user's found items (auth)
GET    /api/found/search       - Search found items
POST   /api/found              - Create found item (auth)
PUT    /api/found/:id          - Update found item (auth, owner)
DELETE /api/found/:id          - Delete found item (auth, owner)
PATCH  /api/found/:id/claim    - Claim item (auth)
PATCH  /api/found/:id/mark-returned - Mark as returned (auth, owner)
```

## File Structure
```
server/
├── src/
│   ├── models/
│   │   ├── lostitem.js      ✅ Updated with full schema
│   │   ├── Founditem.js     ✅ Updated with full schema
│   │   └── Item.js          (kept for backward compatibility)
│   ├── controllers/
│   │   ├── lost-controller.js   ✅ Complete CRUD + search
│   │   ├── found-controller.js  ✅ Complete CRUD + claim
│   │   └── item-controller.js   (kept for backward compatibility)
│   ├── routes/
│   │   ├── lost-routes.js   ✅ New
│   │   ├── found-routes.js  ✅ New
│   │   ├── index.js         ✅ Updated to mount new routes
│   │   └── item-routes.js   (kept for backward compatibility)
│   ├── middlewares/
│   │   ├── auth.js          ✅ Updated with authenticate export
│   │   └── upload.js        (existing)
│   └── app.js              ✅ Added static file serving for /uploads
├── uploads/                (image storage)
└── API_DOCUMENTATION.md    ✅ Complete API docs
```

## Key Features

### 1. **Separate Reporting**
Users can report items they **lost** OR items they **found** using different endpoints.

### 2. **User Ownership**
- Lost items: Owned by the user who **lost** them
- Found items: Owned by the user who **found** them
- Only owners can edit/delete their items

### 3. **Status Management**
- Lost items: Track from reported → found → claimed → closed
- Found items: Track from available → claimed → returned → closed

### 4. **Claiming System**
- For found items: Other users can claim they are the owner
- Stores `claimedBy` reference to claiming user

### 5. **Image Upload**
- Supports up to 5 images per item
- Files stored in `/uploads` directory
- Accessible via `http://localhost:3000/uploads/filename.jpg`

### 6. **Search & Filter**
Both endpoints support:
- Text search (title, description)
- Category filtering
- Location filtering
- Status filtering

## Usage Flow

### Scenario 1: User Loses an Item
1. User logs in
2. POST to `/api/lost` with item details
3. Item stored with `userId` = current user
4. Others can view and help find it
5. User can mark as found when recovered

### Scenario 2: User Finds an Item
1. User logs in
2. POST to `/api/found` with item details
3. Item stored with `userId` = current user (finder)
4. Owner can claim via `/api/found/:id/claim`
5. Finder marks as returned when handed over

## Environment
- **Port**: 3000 (default)
- **Database**: MongoDB
- **Image Storage**: Local filesystem (`/uploads`)
- **Authentication**: Cookie-based (`auth_token`)

## Testing

### Test Lost Item Creation
```bash
curl -X POST http://localhost:3000/api/lost \
  -H "Cookie: auth_token=YOUR_TOKEN" \
  -F "title=Lost Phone" \
  -F "category=Electronics" \
  -F "description=iPhone 13 Pro" \
  -F "location=Library" \
  -F "dateLost=2026-02-01" \
  -F "images=@photo.jpg"
```

### Test Found Item Creation
```bash
curl -X POST http://localhost:3000/api/found \
  -H "Cookie: auth_token=YOUR_TOKEN" \
  -F "title=Found Wallet" \
  -F "category=Wallets & IDs" \
  -F "description=Brown leather wallet" \
  -F "location=Cafeteria" \
  -F "dateFound=2026-02-01" \
  -F "condition=good" \
  -F "images=@photo.jpg"
```

## Migration Notes

If you had previous data in the `Item` model:
1. Old `/api/items` endpoint still works (for backward compatibility)
2. New endpoints provide better separation: `/api/lost` and `/api/found`
3. Frontend should be updated to use new endpoints
4. Migrate existing data to new models if needed

## Next Steps

For complete integration:
1. ✅ Models created and updated
2. ✅ Controllers implemented
3. ✅ Routes configured
4. ✅ API documentation provided
5. 🔄 Update frontend to use new endpoints
6. 🔄 Test all CRUD operations
7. 🔄 Implement email notifications (optional)
8. 🔄 Add admin dashboard for monitoring (optional)

## Support

For detailed API documentation, see `API_DOCUMENTATION.md`.
