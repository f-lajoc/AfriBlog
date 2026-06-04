# AfriBlog — Community Blogging Platform

> A space for African voices — articles, opinions, and stories.

**Live Site:** [https://afriblog.onrender.com](https://afriblog.onrender.com)  
**Repository:** [https://github.com/f-lajoc/AfriBlog](https://github.com/f-lajoc/AfriBlog)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Design System](#design-system)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [Capstone Requirements Checklist](#capstone-requirements-checklist)
- [Demo Video](#demo-video)
- [Author](#author)

---

## Overview

AfriBlog is a full-stack community blogging platform built as a capstone project for the IDA/3MTT Software Development programme. It celebrates African writers, stories, and perspectives by providing a space to publish, discover, and discuss content across a range of categories.

The project covers content-heavy layout design, Django CRUD operations, user authentication, a draft/publish workflow, comment system, SEO-friendly slugs, and a responsive editorial UI — all built without CSS frameworks.

---

## Features

### Reader Features
- Browse all published articles on a paginated homepage (6 per page)
- Featured article hero section with cover image, title overlay, author, and read time
- Filter articles by category via the category bar
- Search articles by title or body content
- Read full articles with author sidebar, related posts, and social share buttons
- Leave comments on articles (no account required)
- Dark / Light mode toggle with localStorage persistence
- Reading progress bar on article pages

### Author Features
- Register and log in to an author account
- Write and publish articles with a free-text category input (creates new categories automatically)
- Upload a cover image per article
- Save articles as drafts and return to edit them later
- Publish, update, or delete your own posts
- View all your drafts in a dedicated Drafts page
- Author profile page showing all posts by that writer

### Platform Features
- Auto-generated SEO-friendly slugs from post titles (collision-safe)
- Estimated read time calculated from word count
- Success and error messages across all key actions (login, register, post, delete)
- Django admin panel for moderating posts, categories, and comments
- Responsive design — works on mobile, tablet, and desktop

---

## Design System

| Token | Value |
|---|---|
| Primary | `#2C1810` — Dark Kola Brown |
| Accent | `#E8A838` — Ankara Gold |
| Background | `#FBF6EE` — Parchment |
| Body Text | `#1A1A1A` |
| Tag Chips | `#3A7D44` — Forest Green |
| Heading Font | Cormorant Garamond (Google Fonts) |
| Body Font | Source Serif 4 (Google Fonts) |
| UI Labels | IBM Plex Sans (Google Fonts) |

The design follows an editorial, warm, and literary aesthetic — inspired by premium African print magazines.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.14 · Django 6.0 |
| Database | SQLite (development) · PostgreSQL (production) |
| Frontend | HTML5 · Custom CSS · Vanilla JavaScript |
| Media Files | Pillow · WhiteNoise |
| Server | Gunicorn |
| Deployment | Render |
| Icons | Font Awesome 6 |
| Fonts | Google Fonts |
| Version Control | Git · GitHub |

---

## Project Structure

```
AfriBlog/
├── blog/
│   ├── migrations/
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css
│   │   ├── js/
│   │   │   └── main.js
│   │   └── images/
│   │       └── favicon.png
│   ├── templates/
│   │   └── blog/
│   │       ├── base.html
│   │       ├── index.html
│   │       ├── detail.html
│   │       ├── form.html
│   │       ├── drafts.html
│   │       ├── category.html
│   │       ├── profile.html
│   │       ├── login.html
│   │       ├── register.html
│   │       └── post_confirm_delete.html
│   ├── models.py
│   ├── views.py
│   ├── urls.py
│   └── admin.py
├── afriblog/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── media/
├── requirements.txt
├── .gitignore
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python 3.10 or higher
- pip
- Git

### 1. Clone the repository

```bash
git clone https://github.com/f-lajoc/AfriBlog.git
cd AfriBlog
```

### 2. Create and activate a virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Apply migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create a superuser (for admin access)

```bash
python manage.py createsuperuser
```

### 6. Collect static files

```bash
python manage.py collectstatic
```

---

## Environment Variables

Create a `.env` file in the root directory with the following (or set them directly in `settings.py` for local development):

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
```

For production on Render, set `DEBUG=False` and add your Render domain to `ALLOWED_HOSTS`.

---

## Running the Project

```bash
python manage.py runserver
```

Visit [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

To access the admin panel, go to [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin) and log in with your superuser credentials.

---

## Deployment

This project is deployed on **Render** using the following build configuration:

**Build command:**
```bash
pip install -r requirements.txt && python manage.py makemigrations && python manage.py migrate
```

**Start command:**
```bash
gunicorn afriblog.wsgi:application
```

Static files are served via **WhiteNoise**. Media files (cover images) are stored in the `media/` directory and served via Django's media URL configuration in development.

---

## Capstone Requirements Checklist

### Frontend Track
- [x] Semantic HTML throughout all pages (`article`, `aside`, `section`, `header`, `footer`)
- [x] Featured article hero section with cover image, title overlay, author, and read time
- [x] Article card component with category chip, title, excerpt, author avatar, and date
- [x] Magazine-style CSS Grid layout for article listing
- [x] Full Article Detail page with author bio sidebar, social share buttons, and related articles
- [x] Reading progress bar linked to scroll position
- [x] Category filter via category bar
- [x] Comment form with DOM append and success/error notices
- [x] Dark / Light mode toggle with localStorage persistence
- [x] Fully responsive — mobile, tablet, and desktop
- [x] Featured badge (gold ribbon) on featured articles
- [x] Font Awesome icons throughout
- [x] Favicon and custom animations

### Full Stack Track
- [x] Django models: `Post`, `Category`, `Comment`
- [x] Post fields: `title`, `slug`, `body`, `cover_image`, `category`, `author`, `status`, `featured`, `created_at`
- [x] List, detail, create, update, and delete views for posts
- [x] Auto-generated SEO-friendly slugs via `slugify` (collision-safe)
- [x] Author restriction — only the post's author can edit or delete
- [x] Comment submission view with approved comments displayed under posts
- [x] Draft / Published status — authors can save drafts before publishing
- [x] Search across post title and body using Django `Q` objects
- [x] Pagination — 6 articles per page
- [x] Django admin panel configured for posts, categories, and comments
- [x] User authentication — register, login, logout
- [x] Django messages framework for success/error notifications
- [x] `.gitignore` file included

---

## Demo Video

> 📹 [Watch the demo presentation](#) ← _i'll add video link when it's ready_

---

## Author

**Bolaji Funmilola (Lajoc_devs)**  
Frontend Developer & Technical Writer

- GitHub: [@f-lajoc](https://github.com/f-lajoc)  
- LinkedIn: [linkedin.com/in/funmilola-b-b4044b13b](https://linkedin.com/in/funmilola-b-b4044b13b)  
- Twitter/X: [@lajoc__](https://twitter.com/lajoc__)  
- Instagram: [@lajoc_devs](https://instagram.com/lajoc_devs)

---

*Built as part of the IDA/3MTT Software Development Capstone — 2026*

