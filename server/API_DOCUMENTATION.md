# Lost & Found API Documentation

## Base URL
`http://localhost:3000/api`

## Authentication
Most POST, PUT, DELETE routes require authentication via cookies (`auth_token`).

---

## Lost Items API

### Get All Lost Items
**GET** `/lost`
- **Description**: Retrieve all lost items from all users
- **Auth**: Not required
- **Response**: Array of lost items

```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "location": "string",
    "dateLost": "date",
    "timeLost": "string",
    "reward": "boolean",
    "rewardAmount": "number",
    "images": ["string"],
    "status": "reported | found | claimed | closed",
    "userId": {
      "_id": "string",
      "name": "string",
      "email": "string"
    },
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

### Get Lost Item by ID
**GET** `/lost/:id`
- **Description**: Get single lost item details
- **Auth**: Not required
- **Response**: Lost item object

### Get User's Lost Items
**GET** `/lost/user/:userId`
- **Description**: Get all lost items reported by a specific user
- **Auth**: Required
- **Response**: Array of lost items

### Create Lost Item
**POST** `/lost`
- **Description**: Report a new lost item
- **Auth**: Required
- **Body** (multipart/form-data):
  - `title`: string (required)
  - `description`: string (required)
  - `category`: string (required)
  - `location`: string (required)
  - `dateLost`: date (required)
  - `timeLost`: string (optional)
  - `reward`: boolean (optional)
  - `rewardAmount`: number (optional)
  - `contactEmail`: string (optional)
  - `contactPhone`: string (optional)
  - `images`: files (max 5)
- **Response**: Created lost item

### Update Lost Item
**PUT** `/lost/:id`
- **Description**: Update a lost item (only owner can update)
- **Auth**: Required
- **Body**: Same as create (all fields optional)
- **Response**: Updated lost item

### Delete Lost Item
**DELETE** `/lost/:id`
- **Description**: Delete a lost item (only owner can delete)
- **Auth**: Required
- **Response**: Success message

### Mark as Found
**PATCH** `/lost/:id/mark-found`
- **Description**: Mark a lost item as found
- **Auth**: Required
- **Response**: Updated lost item

### Search Lost Items
**GET** `/lost/search?query=keyword&category=Electronics&location=Library`
- **Description**: Search lost items with filters
- **Auth**: Not required
- **Query Parameters**:
  - `query`: Search in title/description
  - `category`: Filter by category
  - `location`: Filter by location
- **Response**: Array of matching lost items

---

## Found Items API

### Get All Found Items
**GET** `/found`
- **Description**: Retrieve all found items
- **Auth**: Not required
- **Response**: Array of found items

```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "location": "string",
    "dateFound": "date",
    "timeFound": "string",
    "condition": "excellent | good | fair | poor",
    "images": ["string"],
    "status": "available | claimed | returned | closed",
    "userId": {
      "_id": "string",
      "name": "string",
      "email": "string"
    },
    "claimedBy": {
      "_id": "string",
      "name": "string",
      "email": "string"
    },
    "createdAt": "date",
    "updatedAt": "date"
  }
]
```

### Get Found Item by ID
**GET** `/found/:id`
- **Description**: Get single found item details
- **Auth**: Not required
- **Response**: Found item object

### Get User's Found Items
**GET** `/found/user/:userId`
- **Description**: Get all items found by a specific user
- **Auth**: Required
- **Response**: Array of found items

### Create Found Item
**POST** `/found`
- **Description**: Report a new found item
- **Auth**: Required
- **Body** (multipart/form-data):
  - `title`: string (required)
  - `description`: string (required)
  - `category`: string (required)
  - `location`: string (required)
  - `dateFound`: date (required)
  - `timeFound`: string (optional)
  - `condition`: string (optional)
  - `contactEmail`: string (optional)
  - `contactPhone`: string (optional)
  - `handoverLocation`: string (optional)
  - `images`: files (max 5)
- **Response**: Created found item

### Update Found Item
**PUT** `/found/:id`
- **Description**: Update a found item (only owner can update)
- **Auth**: Required
- **Body**: Same as create (all fields optional)
- **Response**: Updated found item

### Delete Found Item
**DELETE** `/found/:id`
- **Description**: Delete a found item (only owner can delete)
- **Auth**: Required
- **Response**: Success message

### Claim Found Item
**PATCH** `/found/:id/claim`
- **Description**: Claim a found item (mark as yours)
- **Auth**: Required
- **Response**: Updated found item with claimer info

### Mark as Returned
**PATCH** `/found/:id/mark-returned`
- **Description**: Mark item as returned to owner (only finder can do this)
- **Auth**: Required
- **Response**: Updated found item

### Search Found Items
**GET** `/found/search?query=keyword&category=Electronics&location=Library&status=available`
- **Description**: Search found items with filters
- **Auth**: Not required
- **Query Parameters**:
  - `query`: Search in title/description
  - `category`: Filter by category
  - `location`: Filter by location
  - `status`: Filter by status (default: available)
- **Response**: Array of matching found items

---

## Status Enums

### Lost Item Status
- `reported`: Item is reported as lost (default)
- `found`: Someone found the item
- `claimed`: Owner claimed the item
- `closed`: Case closed

### Found Item Status
- `available`: Item is available for claiming (default)
- `claimed`: Someone claimed the item
- `returned`: Item returned to owner
- `closed`: Case closed

## Categories
- Electronics
- Wallets & IDs
- Documents
- Clothing
- Accessories
- Keys
- Other

## Condition (Found Items Only)
- excellent
- good
- fair
- poor

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Item is not available for claiming"
}
```

### 401 Unauthorized
```json
{
  "msg": "Please Login First!"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to update this item"
}
```

### 404 Not Found
```json
{
  "message": "Lost item not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Error fetching lost items",
  "error": "error message"
}
```

---

## Usage Examples

### Report a Lost Item
```javascript
const formData = new FormData();
formData.append('title', 'Blue Backpack');
formData.append('description', 'Blue Samsonite backpack with laptop inside');
formData.append('category', 'Other');
formData.append('location', 'Library 3rd Floor');
formData.append('dateLost', '2026-02-01');
formData.append('reward', true);
formData.append('rewardAmount', 50);
formData.append('images', file1);

fetch('http://localhost:3000/api/lost', {
  method: 'POST',
  body: formData,
  credentials: 'include'
});
```

### Report a Found Item
```javascript
const formData = new FormData();
formData.append('title', 'iPhone 13');
formData.append('description', 'Black iPhone 13 found in cafeteria');
formData.append('category', 'Electronics');
formData.append('location', 'Student Cafeteria');
formData.append('dateFound', '2026-02-01');
formData.append('condition', 'good');
formData.append('images', file1);

fetch('http://localhost:3000/api/found', {
  method: 'POST',
  body: formData,
  credentials: 'include'
});
```

### Get My Lost Items
```javascript
const userId = 'current-user-id';
fetch(`http://localhost:3000/api/lost/user/${userId}`, {
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log(data));
```

### Claim a Found Item
```javascript
fetch('http://localhost:3000/api/found/item-id/claim', {
  method: 'PATCH',
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log(data));
```
