
# TaskMate🛠️

**TaskMate** is a modern service marketplace platform that connects customers with local service professionals. Whether you need a plumber, a programmer, or a house cleaner, TaskMate makes it easy to find, book, and hire verified experts.

## 🚀 Features 

👤 **User Roles**

- Customers: Browse services, view provider profiles, book appointments, and manage booking history.

- Providers: Create and manage service listings, accept/reject incoming job requests, and customize their public profile.

🔍 **Discovery & Booking**

- Service Categories: Browse services by featured categories.

- Provider Profiles: View detailed profiles including bio, location, ratings, and active services.

- Smart Booking System: Select specific dates and duration (hours) for tasks.

- Status Workflow: Real-time booking statuses: Pending → Confirmed (or Rejected/Cancelled) → Completed.

⚡ **Dashboard Management**

- Provider Dashboard: Manage "My Services" (Create, Edit, Delete) and handle incoming "Incoming Requests" with Accept/Reject actions.

- Customer Dashboard: View "My Bookings" history and cancel pending requests if needed.

- Settings: Update profile details like Avatar, Username, and Location.

🛠️ **Tech Stack**

- Framework: Next.js 15+ (App Router)

- Language: TypeScript

- Styling: Tailwind CSS

- Backend & Auth: Supabase (PostgreSQL, Auth, Row Level Security)

- Icons: Lucide React

- Data Pattern: Server Components with "Fetch-Separate-then-Map" pattern.

## 🏁 Getting Started

Follow these steps to run the project locally.

1. **Prerequisites**
Make sure you have Node.js (v18 or higher) installed.

2. **Clone the Repository**

```
git clone https://github.com/yourusername/taskmate.git
cd taskmate
```

3. **Install Dependencies**

```
npm install
 # or
yarn install
```

4. **Configure Environment Variables**
Create a .env.local file in the root directory and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Database Setup (Supabase)
Run the following SQL in your Supabase SQL Editor to set up the required tables and Row Level Security (RLS) policies.

```

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  username text unique,
  fullname text,
  avatar_url text,
  role text check (role in ('customer', 'provider')),
  location text,
  rating numeric default 0,
  is_active boolean default true,
  updated_at timestamp with time zone
);

-- 2. Services Table
create table public.services (
  id uuid default gen_random_uuid() primary key,
  provider_id uuid references public.profiles(id) not null,
  category_id bigint references public.categories(id), -- Assuming you have a categories table
  title text not null,
  description text,
  price numeric not null,
  is_published boolean default false,
  created_at timestamp with time zone default now()
);

-- 3. Bookings Table
create table public.bookings (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references auth.users(id) not null,
  provider_id uuid references public.profiles(id) not null,
  service_id uuid references public.services(id) not null,
  date date not null,
  time text not null, -- Stores duration like "2 hours"
  amount numeric not null,
  status text check (status in ('Pending', 'Confirmed', 'Rejected', 'Cancelled', 'Completed', 'In Progress')) default 'Pending',
  created_at timestamp with time zone default now()
);

-- 4. Enable RLS (Security Policies)
alter table profiles enable row level security;
alter table services enable row level security;
alter table bookings enable row level security;
```

-- (Add specific policies for Insert/Select/Update based on your needs)

6. **Run the Development Server**

```
npm run dev
Open http://localhost:3000 with your browser to see the result.
```

📂 **Project Structure**

```
taskmate/
├── app/
│   ├── auth/              # Sign In / Sign Up pages
│   ├── book/[id]/         # Service Booking Page (Dynamic)
│   ├── category/[id]/     # Service Listings by Category
│   ├── dashboard/         # Customer & Provider Dashboards
│   │   ├── bookings/      # Customer Booking History
│   │   ├── provider/      # Provider-specific routes
│   │   └── settings/      # Account Settings
│   ├── profile/[username]/# Public Provider Profile
│   ├── layout.tsx         # Root Layout
│   └── page.tsx           # Landing Page
├── components/            # Reusable UI Components
│   ├── header/            # Global Navigation
│   ├── recent-bookings/   # Shared Booking Table Component
│   ├── sidebar/           # Dashboard Sidebars
│   └── ...
├── lib/
│   └── supabase/          # Supabase Client & Server utilities
└── public/                # Static assets (images, logos)
```

🤝 **Contributing**

Contributions are welcome! Please fork this repository and submit a pull request for any features, bug fixes, or enhancements.