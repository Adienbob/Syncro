# Syncro

A modern Kanban project management application built with Next.js, TypeScript, Clerk Authentication, and Supabase.

**Syncro** helps users organize projects, manage tasks, and track progress through an intuitive drag-and-drop interface inspired by modern project management tools.

## ✨ Features

### Authentication
- Secure authentication with **Clerk**
- Sign up and Sign in
- User-specific data isolation

### Boards
- Create, rename, and delete boards
- Automatic board selection

### Tasks
- Create, edit, and delete tasks
- Drag & Drop between columns
- Move tasks across boards

### Search & Filtering
- Real-time search
- Filter and sort tasks

### User Experience
- Fully responsive design
- Light & Dark mode
- Smooth animations and interactions
- Loading & empty states

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **State Management**: React Context API + `useReducer`
- **Authentication**: Clerk
- **Backend**: Next.js Route Handlers
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 📁 Folder Structure

```bash
app/
├── boardpage/           # Board view page
├── boardsPage/          # Boards listing page
├── Features/            # Feature-based components & logic
├── shared/              # Shared utilities & components
├── sign-in/             # Clerk sign-in page
├── sign-up/             # Clerk sign-up page
├── state/               # Global state (Context + reducers)
├── types/               # TypeScript type definitions
├── api/                 # Next.js Route Handlers
└── globals.css
```

## 🖼️ Screenshots

*(Add screenshots here after deployment)*

- **Dashboard**
- **Board View**
- **Dark Mode**
- **Mobile Responsive**

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/syncro.git
   cd syncro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   Create a `.env.local` file in the root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📋 Environment Variables

| Variable                        | Description                     |
|--------------------------------|---------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`     | Supabase project URL            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Supabase public anon key        |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key     |
| `CLERK_SECRET_KEY`             | Clerk secret key                |

## 🗺️ Roadmap

- [ ] Real-time synchronization (Supabase Realtime)
- [ ] Board sharing & collaboration
- [ ] Team workspaces
- [ ] Activity history
- [ ] Notifications
- [ ] Labels & tags
- [ ] Comments on tasks
- [ ] File attachments

## 👨‍💻 Author

**Hussein** — Junior Front-End Developer

---

**Why Syncro?**  
This project was built to simulate a real-world SaaS application. The main goal was to practice modern application architecture, authentication flows, scalable state management, and clean frontend development using the latest technologies.

---

⭐ Star this repo if you found it helpful!
