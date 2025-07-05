# Assouan Fès Restaurant Website

## Overview

This is a full-stack web application for Assouan Café-Pâtisserie-Restaurant, a prestigious Moroccan restaurant based in Fès. The application is built as a multilingual (French, English, Arabic) restaurant website featuring menu display, table reservations, custom cake inquiries, and contact management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with custom Assouan brand colors (gold, deep black, warm brown)
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema**: Shared TypeScript schemas with Zod validation

### Key Design Decisions
- **Single Page Application**: Chosen for smooth user experience and fast navigation
- **Component-based Architecture**: Modular design with reusable UI components
- **Type Safety**: Full TypeScript coverage from frontend to backend
- **Responsive Design**: Mobile-first approach with elegant desktop scaling
- **Multilingual Support**: Custom language context with comprehensive translations

## Key Components

### Core Features
1. **Homepage**: Hero section with restaurant showcase
2. **Menu Display**: Categorized menu items with multilingual support
3. **Gallery**: Photo showcase with Instagram integration placeholder
4. **About Section**: Restaurant history and team information
5. **Reservations**: Table booking system with form validation
6. **Custom Cakes**: Special order inquiry system
7. **Contact**: General contact form and information
8. **Floating WhatsApp**: Quick customer communication

### UI Component Library
- Accordion, Alert Dialog, Avatar, Badge, Breadcrumb
- Button, Calendar, Card, Carousel, Chart
- Checkbox, Collapsible, Command, Context Menu
- Dialog, Dropdown Menu, Form, Hover Card
- Input, Label, Navigation Menu, Pagination
- Popover, Progress, Radio Group, Scroll Area
- Select, Separator, Sheet, Sidebar, Skeleton
- Slider, Switch, Tabs, Textarea, Toast, Toggle
- Tooltip

## Data Flow

### Database Schema
1. **Menu Items**: Multilingual menu with categories, prices, and availability
2. **Reservations**: Customer table booking requests with status tracking
3. **Custom Cake Inquiries**: Special order requests with event details
4. **Contact Messages**: General customer inquiries and feedback

### API Endpoints
- `GET /api/menu` - Fetch menu items (with optional category filter)
- `POST /api/reservations` - Create new table reservation
- `GET /api/reservations` - Fetch all reservations (admin use)
- `POST /api/custom-cakes` - Submit custom cake inquiry
- `POST /api/contact` - Submit contact message

### Frontend State Management
- TanStack Query handles server state with caching and synchronization
- React Context manages language preferences
- Form state managed by React Hook Form with Zod validation

## External Dependencies

### Core Framework Dependencies
- React ecosystem: react, react-dom, react-router (wouter)
- TypeScript and build tools: typescript, vite, esbuild
- Backend: express, drizzle-orm, @neondatabase/serverless

### UI and Styling
- Tailwind CSS with PostCSS and Autoprefixer
- Radix UI components for accessibility
- shadcn/ui component library
- Lucide React for icons

### Form and Validation
- React Hook Form for form management
- Zod for schema validation
- @hookform/resolvers for integration

### Development Tools
- Replit integration plugins
- TSX for TypeScript execution
- Various type definitions

## Deployment Strategy

### Development Environment
- Vite dev server with HMR (Hot Module Replacement)
- Express server with TypeScript execution via TSX
- Middleware integration for seamless development experience

### Production Build
- Frontend: Vite builds optimized React application to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- Static file serving integrated with Express

### Database Management
- Drizzle Kit for schema migrations
- Environment-based configuration
- PostgreSQL connection via Neon Database

### Hosting Configuration
- Designed for Replit deployment
- Environment variables for database connection
- Production-ready Express server setup

## Changelog

Changelog:
- July 05, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.