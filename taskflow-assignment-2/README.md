# TaskFlow — Productivity & Contact Dashboard

TaskFlow is a responsive SaaS-style web dashboard created for **ApexPlanet Software Pvt. Ltd. — 45-Day Web Development Internship, Assignment 2**.  
It combines a dynamic to-do manager with LocalStorage persistence and a validated contact form built entirely with frontend technologies.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Flexbox
- CSS Grid
- Browser LocalStorage API

## Features Implemented

### 1) Contact Form (HTML + CSS)
- Full Name, Email Address, Subject, Message fields
- Submit and Clear Form buttons
- Semantic labels and placeholders
- Frontend success notification after valid submit
- No page reload on submit
- Clear notice that the form is frontend-only and does not send emails

### 2) JavaScript Form Validation
- Full Name required
- Valid email format required
- Subject required
- Message minimum length of 10 characters
- Field-level error messages
- Real-time error removal while typing
- Submission blocked when invalid
- Accessible validation using ARIA attributes (`aria-invalid`, `aria-describedby`, live regions)

### 3) Responsive Layout (Flexbox + Grid)
- Responsive navigation with mobile menu toggle
- Flexbox used for navbar and horizontal alignments
- CSS Grid used for summary cards and form grid
- Breakpoints for mobile/tablet/desktop
- Touch-friendly buttons and controls
- Smooth scrolling for in-page navigation links

### 4) Dynamic To-Do List (JavaScript + LocalStorage)
- Add tasks by button or Enter key
- Prevent empty/whitespace-only tasks
- Mark tasks completed
- Edit existing tasks
- Delete tasks
- Filter by All / Active / Completed
- Live counts for total, active, completed tasks
- Friendly empty state
- Persistent tasks via LocalStorage and restore on reload

## How to Run Locally

1. Download or copy the project folder.
2. Open the folder in your editor (optional).
3. Open `index.html` directly in any modern browser.

No build tools, package installation, or backend setup is required.

## Project Structure

```text
taskflow-assignment-2/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Form Validation Logic (Summary)

- Validation is handled in `script.js` via field-specific validators.
- On `submit`, all fields are validated:
  - Name and Subject must be non-empty after trimming.
  - Email must match a standard email pattern.
  - Message must have at least 10 non-space characters.
- Errors are shown beside each field.
- Errors are cleared automatically when input becomes valid.
- Successful submissions show a confirmation message without reloading.

## LocalStorage Persistence (Summary)

- Tasks are stored under the key `taskflow_tasks`.
- Any add/edit/complete/delete action updates LocalStorage.
- On page load, tasks are read from LocalStorage and rendered.
- Invalid LocalStorage data is handled safely by resetting to an empty task list.

## Frontend-Only Contact Form Note

This contact form is intentionally frontend-only for assignment purposes.  
It validates and displays success feedback in the browser but does **not** send emails or submit data to a server.

## Assignment 2 Requirements Checklist

- [x] Contact form built with HTML/CSS and semantic labels
- [x] JavaScript validation with meaningful field errors
- [x] Accessible validation feedback with ARIA usage
- [x] Responsive layout using Flexbox and CSS Grid
- [x] Mobile-friendly responsive navigation
- [x] Dynamic to-do list with add/edit/delete/complete actions
- [x] Task filters (All, Active, Completed)
- [x] Live dashboard task counters
- [x] LocalStorage save and restore
- [x] Friendly empty state and polished UI
- [x] Separate HTML, CSS, JavaScript files
