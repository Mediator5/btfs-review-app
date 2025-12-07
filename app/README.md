## Project Name: Box Truck Freight Services (BTFS) Admin & Review System

A full-stack application built with React, Supabase, and Tailwind CSS to manage brokers, loads, and a public performance wall for customer reviews.
Features
 
# This application includes two main parts:

# Public Review Submission: A public form for brokers to submit performance reviews linked to specific loads.
Admin Dashboard: A protected area for BTFS staff to manage brokers, loads, and moderate reviews.

# Admin Features:
Dashboard: Overview of total brokers, loads, and reviews.
Broker Management: CRUD operations (Create, Read, Update, Delete) for managing broker contact information.
Load Management: CRUD operations for managing load details and assigning brokers.
Review Management: A table view of all reviews with the ability to toggle which reviews appear on the public wall.

# Public Features:
Public Website: A marketing homepage detailing services and contact info.
Review Form: A dynamic form pre-filled via URL parameters for easy review submission.
Performance Wall: A public grid view of moderated reviews.

# Tech Stack
Frontend: React.js, React Router, Tailwind CSS
Data Management: @tanstack/react-query (RQ)
Backend/Database: Supabase (PostgreSQL, Auth, RLS)
Forms: react-hook-form
UI/UX: lucide-react (Icons), react-hot-toast (Notifications)
Setup and Installation
Prerequisites
Node.js (v14+)
npm or yarn
A Supabase account and project
A Vercel account (for deployment)