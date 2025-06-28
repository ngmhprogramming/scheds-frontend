# Site Routes Documentation

This document lists all the routes in the web application along with their purpose, components used, and access control.

---

## `/` - Root / Homepage

- **Component:** `Root`
- **Description:** Landing page.
- **Access:** Public

---

## `/login`

- **Component:** `Login`
- **Description:** Allows users to authenticate using email/password.
- **Form fields:**
  - Email
  - Password
- **On success:** Navigates to `/` with a success message.
- **Access:** Public

---

## `/signup`

- **Component:** `Signup`
- **Description:** New user registration.
- **Form fields:**
  - Username
  - Email
  - Password
- **On success:** Redirects to `/` with a success message.
- **Access:** Public

---

## `/schedule`

- **Component:** `Schedule`
- **Description:** Displays and manages a calendar of events.
- **Features:**
  - Renders event calendar
  - Form to create new events
  - Shows success/error feedback
- **Access:** Protected

---

## Component Reuse

| Component | Used In      | Description                        |
|-----------|--------------|------------------------------------|
| `Navbar`  | All pages    | Top navbar with                   |
| `Footer`  | All pages    | Bottom footer                      |
| `API`     | All pages    | Backend communication wrapper      |

---

## Notes

- Protected routes require users to be logged in to access, if not they should be redirected to `/`.
- Navigation uses `react-router-dom` with `createBrowserRouter`.