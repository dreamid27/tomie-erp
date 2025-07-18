# Tomie ERP System Diagrams

This document contains visual representations of the Tomie ERP system architecture using Mermaid diagrams following the C4 model approach.

## 1. System Context Diagram (C4 Level 1)

This diagram shows the high-level system boundaries and external actors interacting with the Tomie ERP system.

```mermaid
C4Context
    title System Context Diagram - Tomie ERP

    Person(salesUser, "Sales User", "Can approve quotations and access all customer information")
    Person(customerUser, "Customer User", "Limited access, cannot approve quotations or see customer names")

    System(tomieERP, "Tomie ERP System", "Web-based Enterprise Resource Planning application for managing quotations, sales orders, customers, and products")

    SystemDb(database, "PostgreSQL Database", "Stores all application data including users, quotations, sales orders, customers, and products")

    Rel(salesUser, tomieERP, "Uses", "HTTPS")
    Rel(customerUser, tomieERP, "Uses", "HTTPS")
    Rel(tomieERP, database, "Reads from and writes to", "SQL/TCP")

    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
```

## 2. Container Diagram (C4 Level 2)

This diagram illustrates the main containers (Frontend, Backend API, Database) and their relationships.

```mermaid
C4Container
    title Container Diagram - Tomie ERP System

    Person(salesUser, "Sales User", "Can approve quotations and access all customer information")
    Person(customerUser, "Customer User", "Limited access, cannot approve quotations")

    Container_Boundary(c1, "Tomie ERP System") {
        Container(frontend, "Frontend Application", "React, TypeScript, Vite", "Single Page Application providing responsive user interface with role-based access")
        Container(backend, "Backend API", "NestJS, TypeScript, Prisma", "RESTful API with business logic, authentication, and authorization")
    }

    ContainerDb(database, "Database", "PostgreSQL", "Stores users, quotations, sales orders, customers, products with audit logging")

    Rel(salesUser, frontend, "Uses", "HTTPS")
    Rel(customerUser, frontend, "Uses", "HTTPS")
    Rel(frontend, backend, "Makes API calls to", "JSON/HTTPS")
    Rel(backend, database, "Reads from and writes to", "SQL/TCP")

    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
```

## 3. Backend Component Diagram (C4 Level 3)

This diagram details the internal structure of the NestJS backend API.

```mermaid
C4Component
    title Component Diagram - Backend API

    Container(frontend, "Frontend Application", "React, TypeScript", "User interface")
    ContainerDb(database, "Database", "PostgreSQL", "Data storage")

    Container_Boundary(api, "Backend API") {
        Component(authController, "AuthController", "NestJS Controller", "Handles authentication endpoints")
        Component(authService, "AuthService", "NestJS Service", "JWT token generation and validation")
        Component(authGuard, "AuthGuard", "NestJS Guard", "Base authentication guard")
        Component(salesGuard, "SalesAuthGuard", "NestJS Guard", "Role-specific authorization")

        Component(quotationController, "QuotationController", "NestJS Controller", "Quotation CRUD operations")
        Component(quotationService, "QuotationService", "NestJS Service", "Quotation business logic and code generation")

        Component(salesOrderController, "SalesOrderController", "NestJS Controller", "Sales order CRUD operations")
        Component(salesOrderService, "SalesOrderService", "NestJS Service", "Sales order business logic")

        Component(customerController, "CustomerController", "NestJS Controller", "Customer management")
        Component(customerService, "CustomerService", "NestJS Service", "Customer business logic")

        Component(productController, "ProductController", "NestJS Controller", "Product management")
        Component(productService, "ProductService", "NestJS Service", "Product business logic")

        Component(userService, "UserService", "NestJS Service", "User management and validation")
        Component(prismaService, "PrismaService", "Prisma ORM", "Database connection and queries")
    }

    Rel(frontend, authController, "POST /auth/login", "JSON/HTTPS")
    Rel(frontend, quotationController, "CRUD operations", "JSON/HTTPS")
    Rel(frontend, salesOrderController, "CRUD operations", "JSON/HTTPS")
    Rel(frontend, customerController, "CRUD operations", "JSON/HTTPS")
    Rel(frontend, productController, "CRUD operations", "JSON/HTTPS")

    Rel(authController, authService, "Uses")
    Rel(authService, userService, "Uses")
    Rel(quotationController, quotationService, "Uses")
    Rel(salesOrderController, salesOrderService, "Uses")
    Rel(customerController, customerService, "Uses")
    Rel(productController, productService, "Uses")

    Rel(authGuard, authService, "Validates tokens")
    Rel(salesGuard, authService, "Validates roles")

    Rel(quotationService, prismaService, "Uses")
    Rel(salesOrderService, prismaService, "Uses")
    Rel(customerService, prismaService, "Uses")
    Rel(productService, prismaService, "Uses")
    Rel(userService, prismaService, "Uses")
    Rel(prismaService, database, "SQL queries")
```

## 4. Frontend Component Diagram (C4 Level 3)

This diagram shows the structure of the React frontend application.

```mermaid
C4Component
    title Component Diagram - Frontend Application

    Container(backend, "Backend API", "NestJS", "Business logic and data")

    Container_Boundary(frontend, "Frontend Application") {
        Component(app, "App Component", "React", "Main application component with routing")
        Component(authProvider, "AuthProvider", "React Context", "Authentication state management")
        Component(apiClient, "API Client", "Axios", "HTTP client for backend communication")

        Component(loginPage, "Login Page", "React Component", "User authentication interface")
        Component(dashboardPage, "Dashboard Page", "React Component", "Main dashboard with navigation")

        Component(quotationList, "Quotation List", "React Component", "Display and manage quotations")
        Component(quotationForm, "Quotation Form", "React Component", "Create/edit quotations")
        Component(quotationApproval, "Quotation Approval", "React Component", "Approve quotations (sales only)")

        Component(salesOrderList, "Sales Order List", "React Component", "Display and manage sales orders")
        Component(salesOrderForm, "Sales Order Form", "React Component", "Create/edit sales orders")

        Component(customerList, "Customer List", "React Component", "Display customers")
        Component(customerForm, "Customer Form", "React Component", "Create/edit customers")

        Component(productList, "Product List", "React Component", "Display products")
        Component(productForm, "Product Form", "React Component", "Create/edit products")

        Component(roleGuard, "Role Guard", "React HOC", "Role-based component access control")
    }

    Rel(app, authProvider, "Uses")
    Rel(app, dashboardPage, "Routes to")
    Rel(app, loginPage, "Routes to")

    Rel(loginPage, authProvider, "Updates auth state")
    Rel(dashboardPage, quotationList, "Contains")
    Rel(dashboardPage, salesOrderList, "Contains")
    Rel(dashboardPage, customerList, "Contains")
    Rel(dashboardPage, productList, "Contains")

    Rel(quotationList, quotationForm, "Opens")
    Rel(quotationList, quotationApproval, "Opens (sales only)")
    Rel(salesOrderList, salesOrderForm, "Opens")
    Rel(customerList, customerForm, "Opens")
    Rel(productList, productForm, "Opens")

    Rel(roleGuard, authProvider, "Checks user role")
    Rel(quotationApproval, roleGuard, "Protected by")

    Rel(apiClient, backend, "HTTP requests", "JSON/HTTPS")
    Rel(quotationList, apiClient, "Uses")
    Rel(quotationForm, apiClient, "Uses")
    Rel(quotationApproval, apiClient, "Uses")
    Rel(salesOrderList, apiClient, "Uses")
    Rel(salesOrderForm, apiClient, "Uses")
    Rel(customerList, apiClient, "Uses")
    Rel(customerForm, apiClient, "Uses")
    Rel(productList, apiClient, "Uses")
    Rel(productForm, apiClient, "Uses")
```

## 5. Database Schema Diagram

This diagram illustrates the database structure and relationships.

```mermaid
erDiagram
    User {
        string id PK
        string email UK
        string password
        string name
        enum role
        datetime createdAt
        datetime updatedAt
    }

    Customer {
        string id PK
        string name
        string email
        string phone
        string address
        json auditLog
        datetime createdAt
        datetime updatedAt
    }

    Product {
        string id PK
        string name
        string description
        decimal price
        string unit
        json auditLog
        datetime createdAt
        datetime updatedAt
    }

    Quotation {
        string id PK
        string code UK
        string customerId FK
        enum status
        decimal totalAmount
        datetime validUntil
        json auditLog
        datetime createdAt
        datetime updatedAt
    }

    QuotationItem {
        string id PK
        string quotationId FK
        string productId FK
        integer quantity
        decimal unitPrice
        decimal totalPrice
        datetime createdAt
        datetime updatedAt
    }

    SalesOrder {
        string id PK
        string code UK
        string customerId FK
        string quotationId FK
        enum status
        decimal totalAmount
        datetime deliveryDate
        json auditLog
        datetime createdAt
        datetime updatedAt
    }

    SalesOrderItem {
        string id PK
        string salesOrderId FK
        string productId FK
        integer quantity
        decimal unitPrice
        decimal totalPrice
        datetime createdAt
        datetime updatedAt
    }

    Customer ||--o{ Quotation : "has"
    Customer ||--o{ SalesOrder : "has"
    Product ||--o{ QuotationItem : "included in"
    Product ||--o{ SalesOrderItem : "included in"
    Quotation ||--o{ QuotationItem : "contains"
    Quotation ||--o| SalesOrder : "converts to"
    SalesOrder ||--o{ SalesOrderItem : "contains"
```

## 6. Authentication & Authorization Flow

This diagram shows the authentication and authorization flow in the system.

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as AuthController
    participant AS as AuthService
    participant US as UserService
    participant G as AuthGuard/SalesGuard
    participant C as Protected Controller
    participant DB as Database

    U->>F: Login with credentials
    F->>A: POST /auth/login
    A->>AS: validateUser(email, password)
    AS->>US: findByEmail(email)
    US->>DB: Query user
    DB-->>US: User data
    US-->>AS: User object
    AS->>AS: Verify password
    AS->>AS: Generate JWT token
    AS-->>A: JWT token
    A-->>F: { token, user }
    F->>F: Store token in localStorage

    Note over U,DB: Subsequent API requests

    U->>F: Access protected resource
    F->>C: API request with Authorization header
    C->>G: Check authentication
    G->>AS: Verify JWT token
    AS-->>G: Token valid + user info
    G->>G: Check user role (if SalesGuard)
    G-->>C: Authorization granted
    C->>C: Execute business logic
    C-->>F: Response data
    F-->>U: Display data
```

## 7. Business Process Flow

This diagram illustrates the main business processes in the ERP system.

```mermaid
flowchart TD
    A[Customer Inquiry] --> B[Create Quotation]
    B --> C{Quotation Status}
    C -->|Draft| D[Edit Quotation]
    D --> C
    C -->|Pending| E{User Role}
    E -->|Sales User| F[Approve/Reject Quotation]
    E -->|Customer User| G[Wait for Approval]
    F -->|Approved| H[Convert to Sales Order]
    F -->|Rejected| I[Quotation Rejected]
    G --> F
    H --> J[Process Sales Order]
    J --> K{Order Status}
    K -->|Processing| L[Update Order Status]
    L --> K
    K -->|Completed| M[Order Fulfilled]
    K -->|Cancelled| N[Order Cancelled]

    style A fill:#e1f5fe
    style H fill:#c8e6c9
    style M fill:#4caf50
    style I fill:#ffcdd2
    style N fill:#ffcdd2
```

## 8. Deployment Architecture

This diagram shows the deployment architecture and infrastructure components.

```mermaid
C4Deployment
    title Deployment Diagram - Tomie ERP System

    Deployment_Node(userDevice, "User Device", "Windows/Mac/Mobile") {
        Container(browser, "Web Browser", "Chrome/Firefox/Safari", "Renders React application")
    }

    Deployment_Node(webServer, "Web Server", "Production Environment") {
        Deployment_Node(appServer, "Application Server", "Node.js Runtime") {
            Container(frontend, "Frontend App", "React SPA", "Static files served")
            Container(backend, "Backend API", "NestJS Application", "Business logic and API endpoints")
        }

        Deployment_Node(dbServer, "Database Server", "PostgreSQL Server") {
            ContainerDb(database, "PostgreSQL DB", "PostgreSQL 14+", "Application data storage")
        }
    }

    Rel(browser, frontend, "HTTPS", "Static assets")
    Rel(browser, backend, "HTTPS", "API calls")
    Rel(backend, database, "TCP", "SQL queries")
```

## Key Features Highlighted in Diagrams

### Role-Based Access Control

- **Sales Users**: Can approve quotations, see customer names, access all functionality
- **Customer Users**: Limited access, cannot approve quotations or see sensitive customer data

### Audit Logging

- JSON columns in database tables track changes and history
- Implemented for Customer, Product, Quotation, and SalesOrder entities

### Responsive Design

- Frontend built with mobile-first approach
- Components designed for various screen sizes

### Code Generation

- Automatic generation of quotation and sales order codes
- Ensures unique identification for business documents

### Data Relationships

- Clear entity relationships with proper foreign key constraints
- Support for converting quotations to sales orders
- Item-level tracking for both quotations and sales orders
