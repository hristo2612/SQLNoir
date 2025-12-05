# SQL Noir 🔍

[➡️ Play the game online at sqlnoir.com](https://sqlnoir.com)

Step into the shoes of a real detective and solve crimes using SQL! SQL Noir is an interactive mystery-solving game where you crack cases by writing SQL queries.

## About

Welcome to SQL Noir, where you're a data detective solving criminal cases through the power of SQL. Each case file presents you with a unique crime scenario and a database full of evidence. Your mission is to:

- Uncover suspicious patterns in the data
- Track down missing records
- Connect the dots between suspects
- Expose fraudulent transactions
- Piece together the evidence using SQL

## Getting Started

Prerequisite: Node.js 18.17+ (Next.js requirement).

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Go to [Supabase](https://supabase.com/) and create a new project
4. Copy the generated `anon public key` and `Project URL` from the project
5. Create a `.env.local` file at the root of the project and set the following environment variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   ```
   (Legacy `VITE_` variables are still read, but using `NEXT_PUBLIC_` is recommended.)
6. Install Supabase CLI:

   - Follow the instructions at [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)

7. Login to Supabase:

   ```bash
   supabase login
   ```

8. Link your project ( You need to be in the root of the project to run this command ):

   ```bash
   supabase link
   ```

   - Select the project you just created when prompted

9. Run database migrations:

   ```bash
   supabase db push
   ```

10. Start the development server:

    ```bash
    npm run dev
    ```

11. Open your browser and navigate to `http://localhost:3000`

## Case Files

Each case in SQL Noir is a unique crime that needs solving. Cases range from simple thefts to complex murders, organized by difficulty level. Put your SQL skills to the test and climb the ranks from rookie to master detective.

## Join the Detective Agency

We welcome new detectives! Whether you want to:

- Submit new cases for others to solve
- Improve existing investigations
- Fix bugs in the system
- Enhance the detective interface
- Improve documentation

Check the [Contributing Guidelines](CONTRIBUTING.md) to join the force and help make SQL Noir even better.
