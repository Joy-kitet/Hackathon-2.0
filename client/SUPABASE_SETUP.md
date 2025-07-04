# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in your project details:
   - Name: `ecowise-platform`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
6. Click "Create new project"

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" in the sidebar
3. Click on "API" in the settings menu
4. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon/public key** (starts with `eyJ`)

## 3. Update Environment Variables

1. Open your `.env.local` file
2. Replace the placeholder values:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

## 4. Configure Authentication

1. In your Supabase dashboard, go to "Authentication" > "Settings"
2. Under "Site URL", add your domain:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
3. Under "Redirect URLs", add:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)

## 5. Enable Email Authentication

1. Go to "Authentication" > "Providers"
2. Make sure "Email" is enabled
3. Configure email templates if needed

## 6. Test the Setup

1. Restart your development server: `npm run dev`
2. Try creating a new account
3. Check your email for the confirmation link
4. Try logging in with your new account

## Troubleshooting

- **Invalid API Key**: Double-check your environment variables
- **Email not sending**: Check your email provider settings in Supabase
- **Redirect issues**: Verify your redirect URLs in the Supabase dashboard
- **CORS errors**: Make sure your site URL is correctly configured

## Security Notes

- Never commit your actual Supabase keys to version control
- Use different projects for development and production
- Enable Row Level Security (RLS) for your database tables
- Regularly rotate your service role keys
