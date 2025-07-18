# Tomie ERP API Documentation

## Overview

The Tomie ERP API is a RESTful API built with NestJS that provides endpoints for managing quotations, sales orders, customers, products, and authentication. The API uses JWT-based authentication with role-based access control.

**Base URL:** `http://localhost:3000`  
**API Documentation (Swagger):** `http://localhost:3000/api`

## Authentication & Authorization

### Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens are valid for 30 days.

### Authorization Roles

- **sales**: Can approve/reject quotations and access all customer information
- **customer**: Limited access, cannot approve quotations or see customer names

### Guards

- `AuthGuard`: Requires valid JWT token
- `SalesAuthGuard`: Requires valid JWT token + 'sales' role

---

## API Endpoints

### 1. Authentication

#### POST /auth/login

Authenticate user and receive JWT token.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (400):** Bad Request - Invalid credentials

---

### 2. Quotations

#### GET /quotation

Get paginated list of quotations.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `excludeStatus` (optional): Exclude specific status

**Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "code": "Q-0001",
      "date": "2025-07-16T08:45:59.000Z",
      "customer_name": "Customer Name",
      "customer_id": "uuid",
      "street_address": "123 Main St",
      "city": "City",
      "phone": "123-456-7890",
      "note": "Optional note",
      "subtotal": 20000,
      "other_amount": 5000,
      "total_price": 25000,
      "status": "pending",
      "audit_log": [],
      "created_at": "2025-07-16T08:45:59.000Z",
      "updated_at": "2025-07-16T08:45:59.000Z",
      "details": [
        {
          "id": "uuid",
          "product_id": "uuid",
          "description": "Product description",
          "note": "Item note",
          "unit_price": 10000,
          "qty": 2,
          "total_price": 20000,
          "quotation_id": "uuid",
          "created_at": "2025-07-16T08:45:59.000Z",
          "updated_at": "2025-07-16T08:45:59.000Z"
        }
      ]
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10,
  "hasNextPage": true
}
```

#### GET /quotation/:id

Get specific quotation by ID.

**Path Parameters:**

- `id`: Quotation UUID

**Response (200):** Single quotation object (same structure as above)

#### POST /quotation

Create new quotation.

**Authentication:** Required (Bearer token)  
**Authorization:** Any authenticated user

**Request Body:**

```json
{
  "code": "Q-0001",
  "date": "2025-07-16T08:45:59+00:00",
  "customer_id": "uuid",
  "note": "Optional note",
  "other_amount": 5000,
  "details": [
    {
      "product_id": "uuid",
      "description": "Product description",
      "note": "Item note",
      "unit_price": 10000,
      "qty": 2
    }
  ]
}
```

**Response (201):** Created quotation object

#### PATCH /quotation/:id

Update quotation status (approve/reject).

**Authentication:** Required (Bearer token)  
**Authorization:** Sales role only

**Path Parameters:**

- `id`: Quotation UUID

**Request Body:**

```json
{
  "status": "approved"
}
```

**Valid Status Values:**

- `pending`
- `approved`
- `rejected`

**Response (200):** Updated quotation object

#### DELETE /quotation/:id

Delete quotation.

**Path Parameters:**

- `id`: Quotation UUID

**Response (200):** Success confirmation

---

### 3. Sales Orders

#### GET /sales-order

Get paginated list of sales orders.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)
- `status` (optional): Filter by status

**Response (200):**

```json
{
  "data": [
    {
      "id": "uuid",
      "code": "SO-0001",
      "date": "2025-07-16T08:45:59.000Z",
      "customer_name": "Customer Name",
      "customer_id": "uuid",
      "street_address": "123 Main St",
      "city": "City",
      "phone": "123-456-7890",
      "note": "Optional note",
      "subtotal": 20000,
      "other_amount": 5000,
      "total_price": 25000,
      "status": "pending",
      "created_at": "2025-07-16T08:45:59.000Z",
      "updated_at": "2025-07-16T08:45:59.000Z",
      "quotation_id": "uuid",
      "details": [
        {
          "id": "uuid",
          "product_id": "uuid",
          "description": "Product description",
          "note": "Item note",
          "unit_price": 10000,
          "qty": 2,
          "total_price": 20000,
          "created_at": "2025-07-16T08:45:59.000Z",
          "updated_at": "2025-07-16T08:45:59.000Z",
          "sales_orderId": "uuid"
        }
      ]
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10,
  "hasNextPage": true
}
```

#### GET /sales-order/:id

Get specific sales order by ID.

**Path Parameters:**

- `id`: Sales order UUID

**Response (200):**

```json
{
  "id": "uuid",
  "code": "SO-0001",
  "date": "2025-07-16T08:45:59.000Z",
  "customer_name": "Customer Name",
  "customer_id": "uuid",
  "street_address": "123 Main St",
  "city": "City",
  "phone": "123-456-7890",
  "note": "Optional note",
  "subtotal": 20000,
  "other_amount": 5000,
  "total_price": 25000,
  "status": "pending",
  "created_at": "2025-07-16T08:45:59.000Z",
  "updated_at": "2025-07-16T08:45:59.000Z",
  "quotation_id": "uuid"
}
```

---

### 4. Customers

#### GET /customer

Get all customers.

**Response (200):**

```json
[
  {
    "id": "uuid",
    "name": "Customer Name",
    "street_address": "123 Main St",
    "city": "City",
    "phone": "123-456-7890"
  }
]
```

---

### 5. Products

#### GET /product

Get all products.

**Response (200):**

```json
[
  {
    "id": "uuid",
    "name": "Product Name"
  }
]
```

## Error Handling

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Missing or invalid token
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource doesn't exist
- **500**: Internal Server Error

### Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Business Logic Notes

1. **Quotation Creation**:

   - Automatically generates quotation code
   - Calculates subtotal and total price
   - Creates audit log entry
   - Copies customer information for historical record

2. **Role-Based Access**:

   - Sales users can approve/reject quotations
   - Customer users have read-only access to most endpoints
   - Customer names are hidden from customer role users

3. **Audit Trail**:

   - All quotation changes are logged in JSON audit_log field
   - Tracks user, timestamp, action, and value changes

4. **Data Relationships**:
   - Quotations can be converted to sales orders
   - Products and customers are referenced by UUID
   - Details are stored as separate entities with foreign keys

## Security Considerations

### JWT Token Security

- Tokens expire after 30 days
- Secret key: `DREAMID27XFARISHERE` (should be environment variable in production)
- Tokens include user ID, username, and role in payload

### Password Security

- Passwords are hashed using bcrypt
- Plain text passwords are never stored

### Role-Based Access Control

- `AuthGuard`: Validates JWT token presence and validity
- `SalesAuthGuard`: Additional check for 'sales' role
- Unauthorized requests return 401 status

### Input Validation

- All request bodies validated using class-validator decorators
- UUID format validation for ID parameters
- Numeric validation with minimum value constraints
- Required field validation
