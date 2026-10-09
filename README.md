# Steve Mezzo Images - Photography Portfolio Website

A premium photography portfolio and booking platform built with Next.js, Supabase, and Cloudinary.

## 🎨 Features

### Public Website
- **Cinematic Hero** - GSAP-powered animations with asymmetric image layout
- **Editorial Gallery** - Masonry-style layout with category filtering and lightbox
- **Premium Pricing** - Three packages with detailed features
- **Calendly-Style Booking** - Multi-step booking flow with date/time selection
- **Contact Form** - Professional contact page with business info
- **About Page** - Photographer bio and portfolio statistics

### Admin Dashboard
- **Gallery Management** - Upload images from Cloudinary, edit metadata, organize by category
- **Pricing Editor** - Create and manage photography packages
- **Bookings Manager** - View and update booking status
- **Settings** - Site configuration and quick links

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Image Storage**: Cloudinary
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui
- **Animations**: GSAP, Framer Motion
- **Smooth Scrolling**: Lenis
- **Form Validation**: React Hook Form + Zod
- **Image Lightbox**: yet-another-react-lightbox

## 📦 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Your `.env.local` is already configured with:
- Supabase credentials
- Cloudinary credentials (cloud name: a3y66bnu)

### 3. Run Database Schema

Go to your Supabase Dashboard: https://kqqggudtrkacxutcrwof.supabase.co

1. Navigate to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL

This creates:
- All database tables (categories, gallery_images, pricing_packages, bookings, etc.)
- Row Level Security (RLS) policies
- Seed data (categories, 3 pricing packages, site settings)
- Database functions and triggers

### 4. Create Storage Bucket

In Supabase Dashboard:
1. Go to **Storage**
2. Create a new bucket named `gallery`
3. Make it **public**
4. Set file size limit to **10MB**
5. Allow MIME types: `image/jpeg`, `image/png`, `image/webp`

### 5. Create Admin User

In Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Create a user with email and password
4. Copy the user ID

Then run this SQL in the SQL Editor:
```sql
INSERT INTO admin_users (id, email, full_name, role)
VALUES ('YOUR_USER_ID', 'admin@stevemezzoimages.com', 'Admin User', 'admin');
```

### 6. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 🔐 Admin Access

1. Go to http://localhost:3000/admin/login
2. Sign in with the admin credentials you created
3. Access the admin dashboard to manage:
   - Gallery images
   - Pricing packages
   - Client bookings
   - Site settings

## 📸 Cloudinary Setup

Your Cloudinary account (a3y66bnu) is already configured. To upload images:

1. Log into admin dashboard
2. Go to **Gallery** section
3. Click **Upload Image**
4. Fill in metadata (title, alt text, category, etc.)
5. Click upload and select images from Cloudinary

Images are automatically:
- Uploaded to the `steve-mezzo-images` folder
- Saved to Supabase database
- Displayed on the public gallery

## 🎯 Key Pages

### Public
- `/` - Homepage with hero, featured gallery, pricing
- `/work` - Full gallery with category filtering
- `/pricing` - Pricing packages
- `/about` - About the photographer
- `/book` - Multi-step booking form
- `/contact` - Contact form

### Admin
- `/admin/dashboard` - Overview and stats
- `/admin/gallery` - Image management
- `/admin/pricing` - Package editor
- `/admin/bookings` - Booking management
- `/admin/settings` - Site configuration

## 🎨 Design System

**Colors**:
- Background: White (#FFFFFF)
- Foreground: Near-black (#0A0A0A)
- Gold Accent: #C9A227 (primary)
- Gold Light: #D4B13F
- Gold Dark: #9F7E1A

**Typography**:
- Body: Inter (sans-serif)
- Headings: Playfair Display (serif)

**Style**:
- Sharp edges, minimal border radius (2px)
- Premium white + gold aesthetic
- Editorial/cinematic photography focus
- Clean, sophisticated layouts

## 📂 Project Structure

```
mezzo/
├── app/
│   ├── (public pages)/
│   │   ├── page.tsx (home)
│   │   ├── work/
│   │   ├── pricing/
│   │   ├── about/
│   │   ├── book/
│   │   └── contact/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── gallery/
│   │   ├── pricing/
│   │   ├── bookings/
│   │   └── settings/
│   └── api/
│       ├── bookings/
│       ├── cloudinary/
│       └── admin/
├── components/
│   ├── layout/ (navbar, footer)
│   ├── hero/
│   ├── gallery/
│   ├── pricing/
│   ├── booking/
│   ├── admin/
│   ├── providers/
│   └── ui/ (shadcn components)
├── lib/
│   ├── supabase/ (client, server, admin)
│   ├── cloudinary/
│   └── utils.ts
└── types/
    └── database.ts
```

## 🔧 Next Steps

1. **Run the Supabase schema** to set up your database
2. **Create an admin user** for dashboard access
3. **Upload your first images** via the admin gallery
4. **Customize content** in the About page
5. **Test the booking flow** end-to-end
6. **Deploy to Vercel** when ready

## 🌐 Deployment

The site is ready to deploy to Vercel:

```bash
vercel
```

Make sure to add all environment variables in Vercel's dashboard.

## 📝 License

All rights reserved - Steve Mezzo Images

---

Built with ❤️ using Next.js, Supabase, and Cloudinary
