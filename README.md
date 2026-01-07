# Shift Harmony (VKS Shift Planner)

A collaborative shift planning application for waiters, allowing for availability submission, automated schedule generation, and history tracking.

## Features

- **Shared Database**: Uses Supabase to sync data across all devices.
- **Availability Management**: Waiters can mark their days off.
- **Automated Scheduler**: Generates fair schedules based on availability.
- **Mobile Friendly**: Designed for access on phones.

## Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/shift_harmony.git
    cd shift_harmony
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Fill in your Supabase credentials in `.env` (See `SUPABASE_SETUP.md` for details on getting these keys).
      ```
      VITE_SUPABASE_URL=your_project_url
      VITE_SUPABASE_ANON_KEY=your_publishable_key
      ```

## Running Locally

To start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

This project is configured to deploy to **GitHub Pages**.

1.  **Build and Deploy**:
    Run the following command in your terminal **inside the project folder**:

    ```bash
    npm run build && npm run deploy
    ```

    *   `npm run build`: Compiles the code for production.
    *   `npm run deploy`: Pushes the build to the `gh-pages` branch on GitHub.

2.  **Verify**:
    Go to your GitHub repository settings -> Pages, and ensure the source is set to the `gh-pages` branch. Your site will be live at `https://yourusername.github.io/shift_harmony/`.

## Documentation

-   [Supabase Setup Guide](SUPABASE_SETUP.md)
