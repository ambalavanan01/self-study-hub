# 📚 StudyTrack - Academic Life Manager

A modern, full-featured web application designed to help college students organize their academic life. Track your CGPA, manage schedules, store files, handle tasks, and boost productivity with built-in study sessions.

## ✨ Features

### 🎯 Dashboard
- Quick overview of CGPA, credits, tasks, and today's schedule
- Visual CGPA trend chart using Recharts
- Upcoming tasks and schedule widgets

### 📊 CGPA Manager
- Track grades across multiple semesters
- Automatic GPA/CGPA calculations
- Support for credit-based grading (S, A, B, C, D, E)
- Semester-by-semester performance visualization

### 📅 Timetable
- Weekly schedule management
- Support for Theory (90 mins) and Lab (100 mins) classes
- Day-wise filtering and organization
- Visual indicators for different class types

### 📁 Files Manager
- Drag-and-drop file upload
- Integration with Supabase Storage
- Organized file management by user
- Download and delete functionality

### ✅ Task Management
- Create tasks with priorities and due dates
- Status tracking (Todo, In Progress, Completed)
- Quick task completion toggle
- Due date sorting and filtering

### ⏱️ Study Sessions (Pomodoro)
- Configurable focus timer (25/5/15 minutes)
- Automatic session logging
- Study statistics and progress tracking
- Visual circular progress indicator

### 👤 Profile & Settings
- Update profile information
- Secure password management
- Theme customization (Dark/Light mode)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Client-side routing
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **date-fns** - Date utilities

### Backend & Services
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Storage for files
- **TanStack Query** - Data fetching and caching

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Supabase account ([supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ambalavanan01/self-study-hub.git
   cd self-study-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   
   Follow the comprehensive guides:
   - [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup
   - [STORAGE_SETUP.md](./STORAGE_SETUP.md) - Storage buckets and policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` folder.

## 📖 Database Schema

The application uses the following main tables:

- `profiles` - User profile information
- `semesters` - Academic semesters
- `subjects` - Courses with grades and credits
- `timetable_entries` - Class schedule
- `tasks` - Todo items and assignments
- `study_sessions` - Pomodoro session logs
- `files` - File metadata (actual files in Supabase Storage)

For the complete schema, see [`supabase/schema.sql`](./supabase/schema.sql)

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Secure authentication via Supabase Auth
- Protected routes for authenticated users only
- Storage policies ensure file privacy

## 📁 Project Structure

```
vstudyapp/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── layout/          # Layout components (Sidebar, etc.)
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── cgpa/            # CGPA modals
│   │   ├── timetable/       # Timetable components
│   │   ├── files/           # File upload/list
│   │   ├── tasks/           # Task modals
│   │   └── study/           # Timer component
│   ├── pages/               # Route pages
│   ├── context/             # React Context providers
│   ├── lib/                 # Utilities and helpers
│   ├── hooks/               # Custom React hooks
│   └── main.tsx             # App entry point
├── supabase/
│   └── schema.sql           # Database schema
├── SUPABASE_SETUP.md        # Database setup guide
├── STORAGE_SETUP.md         # Storage setup guide
└── package.json
```

## 🎨 Design System

The application uses a custom Tailwind CSS theme with:
- HSL-based color system
- Dark mode support via React Context
- Responsive design (mobile-first)
- Consistent spacing and typography
- Smooth animations and transitions

## 📱 Responsive Design

Fully responsive across:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Ambalavanan**
- GitHub: [@ambalavanan01](https://github.com/ambalavanan01)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Lucide](https://lucide.dev) for beautiful icons
- [Recharts](https://recharts.org) for data visualization

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) guide
- Review the [STORAGE_SETUP.md](./STORAGE_SETUP.md) guide

---

**Built with ❤️ for students, by students.**
