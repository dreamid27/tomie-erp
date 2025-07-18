# Tomie ERP - Design Explanation

This document outlines the rationale behind design choices, trade-offs made during development, and planned future improvements for the Tomie ERP system.

## System Overview

Tomie ERP is a quotation management system designed for small to medium businesses with the following key characteristics:

- Multi-user customer accounts with role-based access control
- Manual quotation approval workflow
- Simple product catalog (< 10 products)
- Hybrid customer management (both app users and manual entry)

## Design Assumptions & Business Requirements

### User Flow Assumptions

- **Customer-User Relationship**: One customer can have multiple users associated with their account
- **Hybrid Access Model**: Some customers may not have app access and require manual data entry by sales staff
- **Simple Product Catalog**: Products sold are limited (< 10 items), eliminating the need for search functionality or caching at this stage
- **Manual Approval Workflow**: Customer quotation requests require manual approval from sales personnel
- **Simplified Pricing**: No tax calculations or discount systems implemented initially

### Access Control Model

- **Sales Users**: Can approve pending quotations and create quotations for any customer
- **Customer Users**: Limited to creating quotations for their own associated customer account with pre-filled, read-only customer information

## Key Features & User Experience Design

### Quotation Management Interface

- **Tab-based Navigation**: Implemented tabbed interface on the quotation page to help users easily distinguish between pending and reviewed quotations, improving workflow efficiency
- **Card-based Layout**: Used card design for quotation display to enhance readability and eliminate the need for horizontal scrolling, providing better mobile responsiveness

### Create Quotation Experience

- **Input Formatting**: Applied real-time formatting for quantity and price inputs to improve user experience and reduce input errors
- **Role-based Customer Selection**: Customer users are restricted to creating quotations only for their assigned customer account, with the customer field pre-filled and read-only
- **Auto-populated Date**: Quotation date automatically defaults to the current date for user convenience

### Sales Order Management

- **Automated Data Flow**: Sales orders are automatically populated with approved quotation data, eliminating manual data entry and reducing errors
- **Real-time Updates**: Sales order list updates automatically when quotations are approved, maintaining data consistency

### Invoice Preview System

- **Print-ready Preview**: Implemented invoice preview functionality to allow users to review and print invoices as needed, supporting business documentation requirements

## Technical Architecture Decisions

### Frontend Technology Stack

#### React.js Selection

**Rationale:**

- **Team Familiarity**: All team members have React experience, reducing onboarding time
- **Ecosystem Maturity**: Large community, extensive library ecosystem, and abundant learning resources
- **Development Speed**: Rapid prototyping capabilities suitable for tight project timelines
- **Scalability**: Well-suited for future feature expansion and team growth

**Trade-offs:**

- Larger bundle size compared to lighter alternatives like Vue.js
- Steeper learning curve for complex state management patterns

#### Tailwind CSS Selection

**Rationale:**

- **Development Velocity**: Utility-first approach enables rapid UI development
- **Consistency**: Built-in design system ensures visual consistency across components
- **Mobile-First**: Responsive design capabilities align with mobile-first approach preference
- **Library Ecosystem**: Extensive component library availability

**Trade-offs:**

- Larger CSS bundle in development
- Potential for verbose HTML classes

### Backend Technology Stack

#### NestJS Selection

**Rationale:**

- **Developer Familiarity**: Team expertise with the framework reduces development risk
- **Enterprise Readiness**: Built-in support for dependency injection, decorators, and modular architecture
- **TypeScript Integration**: Strong typing support improves code quality and maintainability
- **Scalability**: Architecture supports growth from small projects to enterprise applications
- **Rich Ecosystem**: Extensive library support and community resources

**Trade-offs:**

- Higher initial complexity compared to Express.js
- Steeper learning curve for developers new to decorators and dependency injection

### Infrastructure & Deployment

#### Docker Strategy

**Current Approach:**

- Monolithic docker-compose setup for rapid development and deployment

**Rationale:**

- **Development Speed**: Single command deployment reduces setup complexity
- **Resource Efficiency**: Suitable for current scale and team size

**Trade-offs:**

- Coupled deployment process (frontend and backend deploy together)
- Less flexibility for independent service scaling

#### Database Architecture

**Current Approach:**

- Database container coupled with backend service

**Rationale:**

- **Rapid Development**: Simplified setup for development and testing
- **Resource Optimization**: Suitable for current scale

**Trade-offs:**

- Limited scalability and backup options
- Potential performance bottlenecks as data grows

## Future Improvements & Roadmap

### Short-term Enhancements (Next 3-6 months)

1. **Search Functionality**: Implement product and customer search when data volume increases
2. **Caching Layer**: Add Redis caching for improved performance
3. **UI/UX Improvements**: Enhanced responsive design and user experience
4. **Security Enhancements**: Implement refresh token mechanism for improved authentication security

### Medium-term Improvements (6-12 months)

1. **Infrastructure Separation**:

   - Split docker-compose into separate frontend and backend configurations
   - Enable independent deployment cycles
   - Implement proper database environment separation

2. **Feature Expansion**:

   - Tax calculation system
   - Discount management
   - Advanced reporting and analytics
   - Email notification system

3. **Performance Optimization**:
   - Database query optimization
   - Frontend code splitting
   - CDN implementation for static assets

## Technical Debt & Known Limitations

### Current Technical Debt

1. **Database Coupling**: Database should be separated into its own environment
2. **Monolithic Deployment**: Frontend and backend deployment coupling reduces deployment flexibility
3. **Limited Error Handling**: Basic error handling implementation needs enhancement
4. **Testing Coverage**: Comprehensive test suite needs implementation

### Performance Considerations

- Current architecture suitable for < 1000 users and < 10,000 quotations
- Database optimization required for larger datasets
- Frontend bundle optimization needed for slower network connections

## Conclusion

The current architecture prioritizes rapid development and deployment while maintaining a foundation for future scalability. Design decisions favor team familiarity and development speed over premature optimization, with a clear roadmap for addressing technical debt and scaling challenges as the system grows.
