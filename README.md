# Shreeji Food Online

Original full-stack Indian food ordering platform inspired by the business flow of shreejifood.in, without copying its branding, content, or layout.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Axios, Lucide React, React Router, React Hot Toast, Socket.IO client
- Backend: Node.js, Express, GitHub JSON database, JWT, UPI payment submission, Socket.IO
- Auth: phone-number login with automatic profile creation
- Owner phone: `7021157367`

## Folder Structure

```txt
Shreeji Food Online/
  frontend/
    src/api
    src/components
    src/context
    src/styles
  backend/
    config
    middleware
    models
    routes
    socket
```

## Setup Commands

```bash
cd "Shreeji Food Online/backend"
npm install
copy .env.example .env

cd ../frontend
npm install
copy .env.example .env
```

## GitHub Database Setup

Create a private GitHub repository to store JSON collection files. Generate a GitHub fine-grained token with Contents read/write access for that repository, then configure `backend/.env`:

```env
JWT_SECRET=replace_with_a_long_random_secret
GITHUB_TOKEN=github_pat_with_repo_contents_access
GITHUB_REPO=your-github-username/shreeji-food-online-data
GITHUB_BRANCH=main
```

Seed demo categories, menu items, and content into GitHub JSON files under `data/`:

```bash
cd "Shreeji Food Online/backend"
npm run seed
```

## UPI Payment Setup

Set your receiving UPI ID in `backend/.env`:

```env
UPI_ID=yourupi@bank
UPI_PAYEE_NAME=Shreeji Food Online
```

The backend creates a UPI intent link for the order. Customers pay through any UPI app, submit their UTR/reference number, and the owner verifies it in the dashboard by marking the payment `paid`.

## Run Locally

Terminal 1:

```bash
cd "Shreeji Food Online/backend"
npm run dev
```

Terminal 2:

```bash
cd "Shreeji Food Online/frontend"
npm run dev
```

Open `http://localhost:5173`.

## Test Owner Login

1. Click login.
2. Enter `7021157367`.
3. The owner dashboard link appears.
4. Double-click editable hero, offer, contact, menu name, menu description, or price fields.
5. Changes save to GitHub JSON data files and broadcast over Socket.IO.

## Test Customer Order

1. Login with any other phone number.
2. Add menu items to cart.
3. Apply coupon `SHREEJI10` if desired.
4. Checkout with delivery details.
5. Pay with any UPI app.
6. Submit the UPI UTR/reference number.
7. Open Orders to track live order status.

## Required API Routes

- `POST /api/auth/login-phone`
- `GET /api/auth/me`
- `GET /api/menu`
- `POST /api/menu`
- `PUT /api/menu/:id`
- `DELETE /api/menu/:id`
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`
- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders/all`
- `PUT /api/orders/:id/status`
- `POST /api/payment/create-upi`
- `POST /api/payment/confirm`
- `POST /api/payment/verify` returns a removed-gateway message for backward compatibility
- `GET /api/content`
- `PUT /api/content/:key`

## Socket Events

- `menu:updated`
- `content:updated`
- `order:new`
- `order:statusUpdated`
- `payment:success`

## Deployment Guide

### Render Backend

1. Push this project to GitHub.
2. Create a Render Web Service from `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `backend/.env.example`, including `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH`, `UPI_ID`, and `UPI_PAYEE_NAME`.
6. Set `CLIENT_URL` to the deployed Vercel frontend URL.

### Vercel Frontend

1. Import the GitHub repo into Vercel.
2. Set root directory to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add `VITE_API_URL` with the Render backend URL.
6. No payment key is needed on the frontend for UPI intent payments.

After deployment, update Render CORS `CLIENT_URL` to the exact Vercel domain.
