# Candidate Profile Screening System

A modern React + Vite application for managing the hiring process with separate interfaces for applicants, talent acquisition teams, and interview teams.

## Features

### For Applicants (Software Engineers)
- **Landing Page**: Modern, animated landing page with company information
- **Job Listings**: Browse all available positions with search and filtering
- **Application Form**: Submit applications with resume upload and cover letter

### For Talent Acquisition Team
- **Authentication**: Secure login/register system
- **Dashboard**: View all job openings with application counts
- **Job Details**: Detailed view with collapsible sections for applications and requirements
- **Session Management**: Persistent login with user information display

### For Interview Team
- **Authentication**: Secure login/register system  
- **Dashboard**: View all job openings with application counts
- **Job Details**: Detailed view with collapsible sections for applications and requirements
- **Session Management**: Persistent login with user information display

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API
- **Authentication**: Local storage-based session management

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd candidate-profile-screening
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### For Applicants
- Navigate to the root URL (`/`) to see the landing page
- Click "Explore Opportunities" to view job listings
- Click on any job to apply
- Fill out the application form and submit

### For Internal Teams
- Navigate to `/auth` to access the login page
- Use the demo credentials below to log in

## Demo Credentials

### Talent Acquisition Team
- **Email**: hr@techcorp.com
- **Password**: password123

### Interview Team  
- **Email**: interview@techcorp.com
- **Password**: password123

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LandingPage.jsx     # Applicant landing page
│   ├── JobListings.jsx     # Reusable job listings component
│   ├── ApplicationForm.jsx # Job application form
│   ├── AuthForm.jsx        # Login/register form
│   ├── DashboardLayout.jsx # Internal team dashboard layout
│   └── JobDetails.jsx      # Job details for internal teams
├── context/            # React context providers
│   └── AuthContext.jsx     # Authentication context
├── data/               # Mock data and API
│   └── mockData.js         # Sample job openings and users
├── App.jsx             # Main application component with routing
├── main.jsx            # Application entry point
└── index.css           # Global styles and Tailwind directives
```

## Key Features

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive grid layouts for job cards
- Optimized for all device sizes

### Modern UI/UX
- Clean, professional design with soft colors
- Red accent color for highlights (company branding)
- Smooth animations and transitions
- Interactive hover effects

### Security & Session Management
- Protected routes for internal teams
- Persistent login sessions
- Role-based access control
- Secure authentication flow

### Reusable Components
- `JobListings` component used across all user types
- Consistent styling and behavior
- Easy maintenance and updates

## Customization

### Colors
The application uses a custom color palette defined in `tailwind.config.js`:
- **Primary**: Red tones (company branding)
- **Secondary**: Gray tones
- **Accent**: Blue tones

### Styling
- All custom styles are in `src/index.css`
- Tailwind utility classes for consistent design
- Custom component classes for reusable styles

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features
1. Create new components in `src/components/`
2. Add routes in `src/App.jsx`
3. Update mock data in `src/data/mockData.js`
4. Style with Tailwind CSS classes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- This is a frontend-only application with mock data
- Backend integration points are prepared for future development
- Authentication is currently handled with localStorage (demo purposes)
- File uploads are simulated (no actual file storage)

## License

This project is proprietary and confidential.
