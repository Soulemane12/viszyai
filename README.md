# Viszy - Digital Business Cards for Everyone

A modern web application that allows anyone to create professional digital business cards with QR codes. No more expensive printing costs or outdated information - your digital business card is always up-to-date and accessible from your phone.

## 🚀 Features

### Core Functionality
- **Create Professional Profiles**: Add your name, title, photo, contact info, and social media links
- **Dynamic QR Code Generation**: Instantly generate a unique QR code for your profile
- **Public Profile Pages**: When someone scans your QR code, they see a beautiful, mobile-optimized profile page
- **One-Tap Actions**: Call, email, or follow on social media with a single tap
- **Contact Import**: Download a .vcf file to add contacts directly to your phone
- **User Authentication**: Secure signup and login with Supabase Auth
- **Database Storage**: All profiles and data stored securely in PostgreSQL

### User Experience
- **Mobile-First Design**: Optimized for mobile devices where QR codes are most useful
- **No App Required**: Recipients don't need to install anything - just scan with their phone camera
- **Always Accessible**: Your QR code is always available on your phone
- **Professional for Everyone**: Whether you're a student, freelancer, or CEO
- **Real-time Updates**: Change your info anytime - QR code stays the same

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **QR Code**: react-qr-code
- **TypeScript**: Full type safety
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Ready for Vercel deployment

## 📱 User Flows

### Creating Your Card
1. **Sign Up** → Create account with email and password
2. **Fill Profile** → Add your information, photo, and social links
3. **Choose Handle** → Pick a unique URL (e.g., `/u/jay-lee`)
4. **Get QR Code** → Instantly receive your unique QR code
5. **Share** → Show your QR code to people you meet

### Receiving Someone's Card
1. **Scan QR Code** → Use your phone camera to scan
2. **View Profile** → See their contact info and social links
3. **Connect** → Call, email, or follow with one tap
4. **Save Contact** → Download .vcf file to add to contacts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd viszy.ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Copy your project URL and anon key

4. **Configure environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
```bash
npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create a new project
- Wait for the project to be ready

### 2. Run Database Schema
- Go to your Supabase dashboard
- Navigate to SQL Editor
- Copy and paste the contents of `supabase-schema.sql`
- Run the script
- **Important**: This script will create proper RLS policies to fix the 42501 error

### 3. Troubleshooting RLS Issues
If you encounter `42501` errors (Row Level Security policy violations):
1. **Run the fix script**: Execute `fix-rls-policies.sql` in your Supabase SQL Editor
2. **Check RLS policies**: Ensure policies are applied to `authenticated` role, not `public` role
3. **Verify authentication**: Make sure users are properly authenticated before making requests
4. **Check API keys**: Ensure your Supabase API keys are correct in `.env.local`
5. **Test with SQL**: Run the verification query at the end of the fix script

**Common Issue**: If your policies show "Applied to: public role" instead of "authenticated", run the fix script.

### 4. Configure Authentication
- In Supabase dashboard, go to Authentication > Settings
- Configure your site URL and redirect URLs
- Enable email confirmations if desired

### 5. Get API Keys
- Go to Settings > API
- Copy your project URL and anon key
- Add them to your `.env.local` file

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── signup/
│   │   └── page.tsx          # Profile creation form
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── dashboard/
│   │   └── page.tsx          # User dashboard
│   ├── qr/
│   │   └── [handle]/
│   │       └── page.tsx      # QR code display page
│   ├── profile/
│   │   └── [handle]/
│   │       └── page.tsx      # Public profile page
│   ├── demo/
│   │   └── page.tsx          # Demo/showcase page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── lib/
│   ├── supabase.ts           # Supabase client configuration
│   └── auth.ts               # Authentication functions
├── contexts/
│   └── AuthContext.tsx       # Authentication state management
└── components/               # Reusable components
```

## 🎯 MVP Features

### ✅ Completed
- [x] Landing page with value proposition
- [x] User authentication (signup/login)
- [x] Profile creation form with all fields
- [x] Handle availability checking
- [x] QR code generation and display
- [x] Public profile page with contact actions
- [x] Mobile-responsive design
- [x] Demo page showcasing functionality
- [x] Database integration with Supabase
- [x] Row Level Security (RLS)
- [x] User dashboard
- [x] Authentication context
- [x] Social media links management

### 🔄 Next Steps (Future Enhancements)
- [ ] Profile editing functionality
- [ ] Image upload and storage
- [ ] Email verification
- [ ] Analytics and tracking
- [ ] Premium features (custom domains, branding)
- [ ] Apple Wallet/Google Wallet integration
- [ ] Metal QR code cards (physical product)

## 💡 Business Model

### Free Tier
- Basic profile creation
- Standard QR code
- Public profile page
- Contact sharing
- Social media links

### Premium Features (Future)
- Custom domain URLs
- Advanced analytics
- Branded QR codes
- Multiple profiles
- Priority support
- Photo uploads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Next.js and React
- Icons from Lucide React
- QR code generation with react-qr-code
- Styled with Tailwind CSS
- Database powered by Supabase

---

**Viszy** - Making professional networking accessible to everyone. ✨

## 🚀 User Authentication Flow

### Email Confirmation
- Users must confirm their email address after signing up
- A confirmation email is sent with a link to `/confirm-email`
- Users are redirected to `/create-profile` after successful email confirmation

### Signup Process
1. User fills out signup form with email, password, and name
2. Supabase sends a confirmation email
3. User clicks confirmation link
4. User is redirected to `/confirm-email` page
5. After confirmation, user proceeds to `/create-profile`

### 404 Handling
- Custom 404 page automatically redirects to home page
- Provides a user-friendly error message
- Includes a manual "Go to Home Page" button
