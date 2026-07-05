# FreightFlow — Setup & Run Guide

This is now a **real full-stack app**: a Node.js server, a SQLite database file on
your computer, and the frontend you already had. Data you add (accounts, shipments,
vehicles, drivers, customers) is saved permanently in the database file and will
still be there next time you open the app.

## 1. Install Node.js (one-time)

1. Go to https://nodejs.org
2. Download the **LTS** version for your operating system.
3. Run the installer, clicking through with defaults.
4. Confirm it worked: open a terminal (Mac: Terminal app, Windows: Command Prompt
   or PowerShell) and run:
   ```
   node -v
   npm -v
   ```
   Both should print a version number.

## 2. Install the server's dependencies (one-time per project)

Open a terminal, navigate into the `server` folder inside this project, and run:

```
cd path/to/freightflow/server
npm install
```

This downloads Express, the SQLite driver, and password hashing library. It needs
an internet connection and may take a minute.

## 3. Start the server

Still inside the `server` folder:

```
npm start
```

You should see:
```
FreightFlow server running at http://localhost:4000
```

Leave this terminal window open — closing it stops the server.

## 4. Open the app

Go to your browser and visit:

```
http://localhost:4000
```

**Important:** don't use Live Server or open `index.html` directly anymore — the
app now needs to go through the Node server at port 4000 so it can talk to the
database. `http://localhost:4000` serves everything (frontend + API) together.

## 5. Create an account

Click **"Create one"** on the sign-in page, fill in your name, email, password,
and role, and submit. This creates a real row in the database and logs you in.

## What's fully working right now

- Registration & login with real password hashing (bcrypt) and sessions
- Dashboard (KPIs pull from your real shipment data; charts/map remain illustrative)
- **Shipments** — full add / edit / delete, linked to customers, vehicles, drivers
- **Vehicles** — full add / edit / delete, with driver assignment
- **Drivers** — full add / edit / delete
- **Customers** — full add / edit / delete
- **Settings** — theme, accent color, font size, sidebar style (saved per-browser)
- Logout (properly ends your server session)

## Not built yet (placeholder pages, won't error, just marked "coming next")

- Routes, Schedules, Tariffs, Providers, Reports

Ask to have any of these built next — they'll be wired up the same way Shipments,
Vehicles, and Drivers are.

## Where your data lives

`server/data/freightflow.db` — a single SQLite file. Back it up like any file if
you want to keep your data safe. Deleting it just means the app starts fresh next
time you run `npm start` (it recreates empty tables automatically).

## Troubleshooting

- **"npm: command not found"** → Node.js isn't installed yet, or you need to
  restart your terminal after installing it.
- **Port 4000 already in use** → close whatever else is using it, or edit
  `server/server.js` and change `PORT` to something like `4001`.
- **Blank page / API errors in the browser console** → make sure you're visiting
  `http://localhost:4000` (not opening `index.html` as a file, and not using
  Live Server's port 5500).
