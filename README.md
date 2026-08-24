# DevEngine with Supabase

## Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open the Supabase SQL Editor and run `supabase/schema.sql`.
3. Copy the Project URL and anon public key into `js/supabase-config.js`.
4. Enable Email authentication in Supabase Authentication settings.
5. Open `html/portfolio.html` through a local static server.

The frontend uses Supabase Auth for accounts and the Supabase PostgreSQL database for portfolio and contact data. Only the anon public key belongs in the browser; never add a Supabase service-role key to this project.
