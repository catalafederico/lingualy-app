# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Run linting**: `npm run lint`

## Project Architecture

This is a Next.js 15 application using the App Router with TypeScript, built for a language learning platform called Lingualy.

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors for authentication
- **Icons**: Lucide React

### Project Structure
- `app/` - Next.js App Router pages and layouts
  - Authentication pages: `login/`, `sign-up/`, `forgot-password/`
  - Main app pages: `home/`, `lessons/`, `profile/`, `backoffice/`
  - Landing pages: `about/`, `pricing/`
- `components/` - Reusable React components
  - `ui/` - shadcn/ui components (Button, Input, Card, etc.)
  - `landing/` - Landing page specific components
- `services/auth/` - Authentication service functions
- `lib/` - Shared utilities and configurations
  - `axios.ts` - API client with auth interceptors
  - `utils.ts` - Utility functions
- `styles/` and `app/globals.css` - Global styles and Tailwind configuration

### Authentication System
- **Local auth**: Email/password login with JWT tokens stored in localStorage
- **OAuth providers**: Google and Facebook OAuth integration
- **Email verification**: Multi-step sign-up process with email confirmation
- **Password recovery**: Forgot password functionality
- **API integration**: All auth requests go through `NEXT_PUBLIC_API_URL` environment variable

### Key Conventions
- Uses `@/` path alias for root-level imports
- Component aliases: `@/components`, `@/lib`, `@/components/ui`
- Strict TypeScript configuration with Next.js plugin
- CSS variables for theming with HSL color space
- shadcn/ui components configured in `components.json`

### Environment Configuration
- Requires `NEXT_PUBLIC_API_URL` environment variable for backend API
- Uses Next.js built-in environment variable handling

### Development Notes
- The app uses localStorage for token management (client-side only)
- API client automatically attaches Bearer tokens to requests
- All auth flows redirect to external OAuth providers via backend endpoints
- Uses Turbopack in development for faster compilation