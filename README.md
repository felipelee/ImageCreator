# 🎨 Social Post Generator

A powerful tool for creating beautiful, on-brand social media posts with AI-powered content generation. Built with Next.js, Supabase, and Tailwind CSS.

## ✨ Features

- 🎨 **Brand DNA System** - Define colors, fonts, and visual identity
- 🤖 **AI Content Generation** - Generate compelling copy with OpenAI
- 📱 **Multiple Layout Templates** - Hero, comparison, testimonials, and more
- 🖼️ **Export to Images** - Download posts as high-quality images
- 💾 **Cloud Database** - Store brands and products in Supabase
- 🌓 **Dark Mode** - Beautiful dark theme support
- 📊 **Dashboard** - Track your brands and SKUs

## 🚀 Quick Deploy

Want to deploy this in 5 minutes? See **[DEPLOY_WITH_BOLT.md](./DEPLOY_WITH_BOLT.md)** for a complete guide to deploy with Bolt.new + Supabase.

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: OpenAI API
- **Export**: html2canvas
- **State**: Zustand
- **Type Safety**: TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- A Supabase account (free tier works great!)
- OpenAI API key (for content generation)

## 🛠️ Local Development

1. **Clone the repository**:
```bash
git clone https://github.com/YOUR_USERNAME/social-post-generator.git
cd social-post-generator
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up Supabase**:
   - Create a new project at https://supabase.com
   - Run the SQL in `supabase-schema.sql` in your SQL Editor
   - Copy your project URL and anon key

4. **Configure environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

5. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 📁 Project Structure

```
social-post-generator/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (content generation, etc.)
│   ├── brands/            # Brand management pages
│   ├── dashboard/         # Main dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── admin/            # Admin layout components
│   ├── brands/           # Brand-specific components
│   ├── layouts/          # Post layout components
│   ├── skus/             # SKU management components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities and services
│   ├── supabase.ts       # Supabase client & services
│   ├── db.ts             # Dexie (legacy/fallback)
│   ├── render-engine.ts  # Post rendering engine
│   └── layouts/          # Layout specifications
├── types/                 # TypeScript types
│   ├── brand.ts          # Brand types
│   └── sku.ts            # SKU types
└── public/               # Static assets
```

## 🎯 How It Works

1. **Create a Brand** - Define your brand's visual DNA (colors, fonts, images)
2. **Add SKUs** - Create products/variations under your brand
3. **Generate Content** - Use AI to create compelling copy or write your own
4. **Choose Layouts** - Select from 15+ professionally designed layouts
5. **Export** - Download as images for social media

## 🔒 Database Schema

The app uses two main tables:

### Brands
- Stores brand identity (colors, fonts, images)
- Contains brand knowledge for AI generation
- Parent to SKUs

### SKUs
- Product variations under a brand
- Stores copy for all layouts
- Custom images and overrides

See `supabase-schema.sql` for the complete schema.

## 🎨 Available Layouts

- Hero (Multiple variations)
- Product Comparison
- Testimonials
- Benefits Grid
- Stats & Big Numbers
- Timeline/Journey
- Price Comparison
- Bottle/Product List
- Pack Hero
- Promo Product
- And more!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Supabase](https://supabase.com)
- Deployed with [Bolt.new](https://bolt.new)

---

Made with ❤️ for marketers and content creators
