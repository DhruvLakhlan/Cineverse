# CineVerse

CineVerse is a modern movie ticket booking web application built using React and Vite. It provides separate interfaces for customers, theatre owners, and administrators, allowing users to browse movies, book tickets, manage theatres, and monitor bookings.

## Features

### Customer
- Browse currently available movies
- View movie details, trailers, cast, and reviews
- Search and filter movies
- Select city, theatre, screen, and show timings
- Choose seats through an interactive seat layout
- View booking summary and confirmation
- Access booking history
- Manage profile and account settings

### Theatre Owner
- Manage theatres and screens
- Add and update movies
- Create and manage shows
- View booking information
- Monitor theatre performance through dashboard analytics

### Administrator
- Manage users
- Review and approve theatre requests
- View reports and platform statistics
- Monitor theatres and platform activity

## Tech Stack

- React
- Vite
- React Router
- Context API
- CSS3
- JavaScript

## Installation

Clone the repository

```bash
git clone https://github.com/DhruvLakhlan/Cineverse.git
```

Move into the project directory

```bash
cd Cineverse
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Preview the production build

```bash
npm run preview
```

## Project Structure

```text
src/
├── components/
├── context/
├── data/
├── layouts/
├── pages/
│   ├── admin/
│   ├── auth/
│   ├── customer/
│   └── owner/
├── routes/
├── styles/
└── main.jsx
```

## Notes

- The application currently uses mock data and browser storage.
- Authentication and booking information are not persisted in a backend database.
- The project was developed primarily as a frontend-focused learning project.

## License

This project is intended for educational and portfolio purposes.
