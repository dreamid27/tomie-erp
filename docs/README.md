# Tomie ERP Documentation

Welcome to the Tomie ERP documentation! This directory contains comprehensive documentation for the Tomie ERP API and system.

## 📚 Documentation Index

### API Documentation
- **[API Documentation](./api-documentation.md)** - Complete API reference with detailed endpoint documentation, authentication, data models, and examples
- **[API Quick Reference](./api-quick-reference.md)** - Condensed reference guide for quick lookup during development

## 🚀 Getting Started

### For Frontend Developers
1. Start with the [API Quick Reference](./api-quick-reference.md) for a fast overview
2. Review authentication flow and role-based access control
3. Check endpoint examples for integration patterns
4. Use the Swagger UI at `http://localhost:3000/api` for interactive testing

### For Backend Developers
1. Read the complete [API Documentation](./api-documentation.md)
2. Review database schema and data relationships
3. Understand security considerations and validation rules
4. Check troubleshooting section for common issues

### For External Integrators
1. Start with authentication section in [API Documentation](./api-documentation.md)
2. Review data models and validation requirements
3. Test endpoints using provided curl examples
4. Use Swagger documentation for interactive exploration

## 🔑 Key Concepts

### Authentication & Authorization
- **JWT-based authentication** with 30-day token expiration
- **Role-based access control**: `sales` and `customer` roles
- **Bearer token** format: `Authorization: Bearer <token>`

### Core Entities
- **Quotations**: Sales quotes with approval workflow
- **Sales Orders**: Converted from approved quotations
- **Customers**: Client information and contact details
- **Products**: Catalog items for quotations/orders

### Business Workflow
1. **Create Quotation** → Any authenticated user
2. **Review & Approve** → Sales users only
3. **Convert to Sales Order** → Approved quotations
4. **Audit Trail** → All changes tracked in JSON logs

## 🛠️ Development Resources

### Interactive Documentation
- **Swagger UI**: http://localhost:3000/api
- **Auto-generated** from NestJS decorators and DTOs
- **Live testing** environment with authentication

### Database Tools
- **Prisma Studio**: `npx prisma studio`
- **Database migrations**: `npx prisma migrate deploy`
- **Schema visualization**: Available in Prisma Studio

### Testing Tools
- **Unit tests**: `npm run test`
- **E2E tests**: `npm run test:e2e`
- **API testing**: Use Postman, Insomnia, or curl examples

## 📋 Quick Commands

### Start Development Environment
```bash
# Backend API
cd backend && npm run start:dev

# Frontend (if needed)
cd frontend && npm run dev

# Database
docker-compose up postgres
```

### Common API Calls
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "sales123", "password": "sales123"}'

# Get quotations
curl http://localhost:3000/quotation?page=1&pageSize=10

# Create quotation (requires auth)
curl -X POST http://localhost:3000/quotation \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d @quotation-example.json
```

## 🔍 Finding Information

| Need to find... | Look in... |
|----------------|------------|
| Endpoint URLs and methods | [API Quick Reference](./api-quick-reference.md) |
| Request/response schemas | [API Documentation](./api-documentation.md) |
| Authentication setup | Both docs, Auth section |
| Error codes and troubleshooting | [API Documentation](./api-documentation.md) |
| Database schema | [API Documentation](./api-documentation.md) |
| Role permissions | Both docs, Authorization section |
| Code examples | Both docs, Examples sections |

## 🆘 Support & Troubleshooting

### Common Issues
1. **Authentication errors** → Check token format and expiration
2. **Permission denied** → Verify user role requirements
3. **Validation errors** → Review request body schema
4. **Database errors** → Check connection and migrations

### Getting Help
1. Check the troubleshooting section in [API Documentation](./api-documentation.md)
2. Use Swagger UI for interactive testing
3. Review error response format and status codes
4. Check browser network tab for detailed error information

## 📝 Contributing to Documentation

### Updating API Docs
- API documentation is manually maintained
- Update when adding new endpoints or changing existing ones
- Include examples and validation rules
- Test all examples before committing

### Documentation Standards
- Use clear, concise language
- Provide working code examples
- Include both success and error scenarios
- Keep quick reference in sync with detailed docs

---

**Last Updated**: July 2025  
**API Version**: 1.0  
**Documentation Version**: 1.0
