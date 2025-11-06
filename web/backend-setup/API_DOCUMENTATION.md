# Paola Bolívar Nievas Portfolio - API Documentation

## Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

## Authentication
All admin endpoints require a JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## Endpoints

### Authentication

#### POST /auth/login
Login to get JWT token
\`\`\`json
{
  "email": "admin@example.com",
  "password": "password"
}
\`\`\`

#### POST /auth/register
Register new admin user
\`\`\`json
{
  "email": "admin@example.com",
  "password": "password",
  "name": "Admin Name"
}
\`\`\`

### Projects

#### GET /projects
Get all published projects
\`\`\`
Response: Array of projects with categories and images
\`\`\`

#### GET /projects/:slug
Get single project by slug
\`\`\`
Response: Project object with full details
\`\`\`

#### GET /projects/category/:categorySlug
Get all projects in a category
\`\`\`
Response: Array of projects in category
\`\`\`

#### POST /projects (Admin)
Create new project
\`\`\`json
{
  "title": "Project Title",
  "slug": "project-slug",
  "description": "Project description",
  "categoryId": "category-id",
  "thumbnail": "image-url",
  "featured": false
}
\`\`\`

#### PUT /projects/:id (Admin)
Update project
\`\`\`json
{
  "title": "Updated Title",
  "description": "Updated description",
  "featured": true
}
\`\`\`

#### DELETE /projects/:id (Admin)
Delete project

### Contacts

#### POST /contacts
Submit contact form (public)
\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Project Inquiry",
  "message": "I'm interested in your services..."
}
\`\`\`

#### GET /contacts (Admin)
Get all contact submissions

#### GET /contacts/:id (Admin)
Get single contact submission

#### PUT /contacts/:id (Admin)
Update contact status
\`\`\`json
{
  "status": "READ",
  "notes": "Follow up needed"
}
\`\`\`

#### DELETE /contacts/:id (Admin)
Delete contact submission

## Error Responses

\`\`\`json
{
  "error": "Error message"
}
\`\`\`

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
