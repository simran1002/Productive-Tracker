# Personal Task Tracker

A simple personal task management application built with React and TypeScript, designed as an intern pre-hire assignment.

## 📖 Description

This Personal Task Tracker is a frontend-only React application that allows users to manage their personal tasks with a clean, intuitive interface. Users can create, edit, delete, and track the completion status of their tasks, with all data persisted in localStorage.

## 🚀 Features

- **Simple Login**: Basic username-based authentication stored in localStorage
- **Task Management**: 
  - Add new tasks with title (required) and description (optional)
  - Edit existing tasks inline or via modal
  - Delete tasks with confirmation prompt
  - Toggle task completion status
- **Task Display**: 
  - Show task title, description, and completion status
  - Display creation date/time
  - Visual distinction between completed and pending tasks
- **Task Filtering**: 
  - Filter by All, Completed, or Pending tasks
  - Show task count for each filter
- **Data Persistence**: All tasks stored in localStorage and persist after page refresh
- **Responsive Design**: Works seamlessly on both mobile and desktop
- **Dark Mode Toggle**: Switch between light and dark themes

## 🛠 Setup Instructions

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🧰 Technologies Used

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Beautiful icons
- **date-fns** - Date formatting utilities
- **React Router** - Client-side routing

## 🔗 Live Demo

https://drive.google.com/file/d/19ENsqFQSQr85MfIK5iWa6GOmhae9mMgs/view?usp=sharing

## 🖼 Screenshots

![Task Tracker Screenshot 1](./screenshot1.png)
![Task Tracker Screenshot 2](./screenshot2.png)
![Task Tracker Screenshot 3](./screenshot3.png)
![Task Tracker Screenshot 4](./screenshot4.png)
![Task Tracker Screenshot 5](./screenshot5.png)
