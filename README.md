# Frontend Setup Instructions

## Installation

1. Install Node.js dependencies:

```bash
npm install
```

## Running the Application

### Development Mode:

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Production Build:

```bash
npm run build
npm run preview
```

## Configuration

The frontend uses environment variables from `.env` for configuration.

- `VITE_API_BASE_URL` (default: `/api`) controls the Axios base URL used in `src/api/api.ts`.
- `VITE_DEV_PROXY_TARGET` (default: `http://localhost:5000`) controls the Vite dev-server proxy target in `vite.config.ts`.

For local dev with the backend running on the default port, the provided `.env` values should work as-is.

## Features Overview

### Pages

- **Home** (`/`) - Landing page with features and secret ID input
- **Login** (`/login`) - User login page
- **Register** (`/register`) - User registration page
- **Dashboard** (`/dashboard`) - User's secret letters dashboard (protected)
- **Create Secret** (`/create`) - Create new secret letter (protected)
- **View Secret** (`/secret/:id`) - View and decrypt secret letter (public)

### Components

- **Navbar** - Navigation bar with authentication state
- **MagicBackground** - Animated particle background

### Styling

The app uses:

- **Tailwind CSS** for utility-first styling
- **Custom CSS** for magical effects and animations
- **Google Fonts** - Cinzel (magical) and Dancing Script (cursive)
- **Framer Motion** for animations

### Themes

Six magical themes available:

1. Magical (default purple/indigo)
2. Gryffindor (red/gold)
3. Slytherin (green/gray)
4. Ravenclaw (blue/gray)
5. Hufflepuff (yellow/gray)
6. Dark Magic (black/gray)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

### Core

- React 18.2.0
- React Router DOM 6.20.0
- TypeScript 5.3.2

### UI & Styling

- Tailwind CSS 3.3.6
- Framer Motion 10.16.5
- Lucide React (icons)

### Editor & Forms

- React Quill 2.0.0 (rich text editor)

### HTTP & State

- Axios 1.6.2
- React Hot Toast 2.4.1

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, Vite will automatically use the next available port.

### API Connection Issues

Make sure the backend server is running (default `http://localhost:5000`) before starting the frontend, or update `VITE_DEV_PROXY_TARGET` in `.env`.

### Build Errors

Try deleting `node_modules` and `package-lock.json`, then run `npm install` again.
