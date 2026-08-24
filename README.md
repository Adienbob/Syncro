# Syncro

**Syncro** is a modern real-time collaborative Kanban project management platform inspired by tools like Trello and Jira.

It helps teams organize work through boards, tasks, role-based collaboration, real-time synchronization, notifications, and activity tracking.

## 🚀 Live Demo

[Syncro — Live Demo](https://syncro-kanban.org/)

## ✨ Features

* 🔐 Authentication with Clerk
* 📋 Board CRUD operations
* ✅ Task CRUD operations
* 🖱️ Drag-and-drop task management
* 👥 Multi-user collaboration
* 🔄 Real-time task synchronization
* 📝 Activity timeline
* 🔔 Live notifications
* ✉️ Member invitations
* 🛡️ Role-based permissions
* 👤 Task assignment
* 🔎 Task search
* 📱 Responsive design
* 🌙 Dark theme
* 🔒 Protected API routes
* 🗄️ PostgreSQL Row Level Security
* 🧠 Global state management with Context + Reducer
* ⚡ Optimistic UI updates with server synchronization

## 🛠️ Tech Stack

| Technology        | Purpose                            |
| ----------------- | ---------------------------------- |
| Next.js           | Full-stack React framework         |
| React             | User interface                     |
| TypeScript        | Type safety                        |
| Tailwind CSS      | Styling and responsive UI          |
| Clerk             | Authentication and user management |
| Supabase          | Backend services and database      |
| PostgreSQL        | Relational data storage            |
| Supabase Realtime | Live data synchronization          |
| DnD Kit           | Drag-and-drop interactions         |
| Sonner            | Toast notifications                |
| date-fns          | Date formatting                    |
| Vercel            | Production deployment              |

## 🏗️ Architecture

Syncro follows a feature-oriented architecture designed to keep business logic, UI components, state management, and shared utilities separated.

```text
app/
├── features/
│   ├── boards/
│   ├── tasks/
│   ├── activity/
│   └── notifications/
│
├── shared/
│   ├── services/
│   ├── utils/
│   └── ui/
│
├── state/
│   ├── AppContext.tsx
│   ├── reducer.ts
│   ├── actions.ts
│   └── initialState.ts
│
├── api/
└── types/
```

The application uses React Context and `useReducer` for centralized client-side state management while Supabase/PostgreSQL acts as the persistent source of truth.

## 🗄️ Database

The application uses **PostgreSQL through Supabase** with a relational schema designed around the application's main domains.

Core tables include:

* `boards`
* `tasks`
* `board_members`
* `activity_logs`
* `notifications`

### Board Members

Board membership is modeled through a junction table rather than storing members directly inside boards.

```text
boards
   │
   └── board_members
          │
          └── user_id → Clerk user
```

Each board member has a role:

```text
owner
editor
viewer
```

This structure allows multiple users to collaborate on the same board while maintaining granular permissions.

## 🔐 Security

Syncro uses multiple layers of authorization and data protection:

* Clerk authentication for user identity.
* Protected API routes for authenticated operations.
* Server-side permission checks for sensitive actions.
* PostgreSQL Row Level Security (RLS).
* Role-based authorization for board operations.
* Supabase security policies for database access.

The client interface is not treated as a security boundary; authorization is enforced server-side and at the database level.

## 🔄 Realtime Collaboration

Supabase Realtime is used to synchronize task changes between connected users.

For example:

```text
User A
  │
  ├── Updates task
  │
  ▼
PostgreSQL
  │
  ▼
Supabase Realtime
  │
  ├──────────────► User B
  └──────────────► User C
```

This allows collaborators to see task changes without manually refreshing the board.

Optimistic UI updates are used alongside server synchronization to make interactions feel immediate while the server remains the source of truth.

## 📝 Activity Logging

Syncro includes an activity logging system that records important board and task actions.

Each activity stores information such as:

* Actor
* Action
* Entity type
* Entity ID
* Metadata
* Timestamp
* Board ID

Activity metadata can also contain snapshots of relevant entity information, allowing historical activity to remain readable even after the original entity changes.

## 🔔 Notifications

The notification system provides users with live feedback about relevant collaborative events.

Notifications are stored persistently and synchronized with the application state to keep the interface up to date.

## 👥 Collaboration & Permissions

Board owners can manage members and assign roles.

| Role       | Permissions                      |
| ---------- | -------------------------------- |
| **Owner**  | Full board and member management |
| **Editor** | Manage board tasks               |
| **Viewer** | View board content               |

Permission checks are enforced through the application and protected backend operations.

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/Adienbob/Syncro.git
cd Syncro
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## 🔑 Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
```

Never commit environment variables or secret keys to the repository.

## 📁 Project Structure

The project follows a feature-oriented structure:

```text
app/
├── api/
├── features/
│   ├── activity/
│   ├── boards/
│   ├── notifications/
│   └── tasks/
├── shared/
│   ├── services/
│   ├── ui/
│   └── utils/
├── state/
├── types/
├── BoardPage/
└── BoardsPage/
```

Each feature contains its own components, hooks, and domain-specific logic where appropriate.

## 🔮 Future Improvements

* Task comments
* File attachments
* Due date reminders
* Email notifications
* Workspace support
* Labels and tags
* Task archiving
* Board templates
* Advanced filters
* Activity timeline pagination
* Further mobile optimizations
* End-to-end testing

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Hussien Walid**

* Portfolio: [Hussien Walid Portfolio](https://hussien-walid-portfolio.vercel.app/)
* LinkedIn: [Hussien Walid](https://www.linkedin.com/in/hussien-walid-127513319/)
* Email: [hussienwalid125@gmail.com](mailto:hussienwalid125@gmail.com)

## 💡 Project Motivation

Syncro was built to simulate a production-ready collaborative application rather than a simple CRUD project.

The development process focused on:

* Clean architecture
* Scalability
* Real-time collaboration
* Security
* Maintainability
* Robust state management
* Production-oriented backend design

### Key Architectural Decisions

**Database as the source of truth**

Persistent application data is stored in PostgreSQL, while the client state reflects server state.

**Realtime synchronization**

Supabase Realtime propagates database changes to connected clients, enabling live collaboration.

**Optimistic UI**

User interactions update the interface immediately while server requests are processed, with error handling available when operations fail.

**Domain-driven state actions**

Reducer actions are organized around application domains and business operations rather than generic UI events.

**Dedicated business endpoints**

Operations such as task assignment and member management use dedicated backend endpoints instead of relying exclusively on generic CRUD operations.

**Activity snapshots**

Activity metadata stores relevant snapshots so historical events remain understandable after the original data changes.

**Layered authorization**

Authentication, server-side authorization, and PostgreSQL RLS work together to protect collaborative data.
