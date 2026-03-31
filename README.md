# Real Estate Management System - Frontend

React + Vite frontend for the Real Estate Management System.

## Tech Stack

- React 18
- Vite
- React Router v6
- Zustand (State Management)
- React Hook Form + Zod (Form Validation)
- Tailwind CSS + shadcn/ui
- Sonner (Notifications)
- Leaflet (Mapping)
- Axios (API Client)

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── common/         # Common components (Navbar, Footer, etc)
│   ├── auth/           # Authentication components
│   ├── properties/     # Property listing components
│   ├── search/         # Search & filter components
│   ├── dashboard/      # Dashboard components
│   ├── leads/          # Lead management components
│   └── notifications/  # Notification components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API service calls
├── utils/              # Utility functions
├── styles/             # Global styles
└── App.jsx            # Main App component
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Update environment variables**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Available Scripts

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features

- User Authentication (Login/Register)
- Property Listing & Management
- Advanced Search & Filtering
- Interactive Map View (Leaflet)
- Lead Management
- User Dashboard
- Admin Panel
- Email Notifications

## API Integration

All API calls are made through `src/services/api.js`. The base URL is configured via `VITE_API_BASE_URL` environment variable.

## Contributing

1. Create feature branches
2. Follow component naming conventions
3. Use shadcn/ui for UI components
4. Keep components focused and reusable

## Notes

- All components use Tailwind CSS for styling
- Form validation uses Zod schemas
- State management is handled by Zustand
- No real-time features (no Socket.io)
