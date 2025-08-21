# Viszy - Digital Business Cards for Everyone

A modern web application that allows anyone to create professional digital business cards with QR codes. No more expensive printing costs or outdated information - your digital business card is always up-to-date and accessible from your phone.

## 🚀 Features

### Core Functionality
- **Create Professional Profiles**: Add your name, title, photo, contact info, and social media links
- **Dynamic QR Code Generation**: Instantly generate a unique QR code for your profile
- **Public Profile Pages**: When someone scans your QR code, they see a beautiful, mobile-optimized profile page
- **One-Tap Actions**: Call, email, or follow on social media with a single tap
- **Contact Import**: Download a .vcf file to add contacts directly to your phone

### User Experience
- **Mobile-First Design**: Optimized for mobile devices where QR codes are most useful
- **No App Required**: Recipients don't need to install anything - just scan with their phone camera
- **Always Accessible**: Your QR code is always available on your phone
- **Professional for Everyone**: Whether you're a student, freelancer, or CEO

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **QR Code**: react-qr-code
- **TypeScript**: Full type safety
- **Deployment**: Ready for Vercel deployment

## 📱 User Flows

### Creating Your Card
1. **Sign Up** → Create account with email
2. **Fill Profile** → Add your information, photo, and social links
3. **Get QR Code** → Instantly receive your unique QR code
4. **Share** → Show your QR code to people you meet

### Receiving Someone's Card
1. **Scan QR Code** → Use your phone camera to scan
2. **View Profile** → See their contact info and social links
3. **Connect** → Call, email, or follow with one tap
4. **Save Contact** → Download .vcf file to add to contacts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

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

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── signup/
│   │   └── page.tsx          # Profile creation form
│   ├── login/
│   │   └── page.tsx          # Login page
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
```

## 🎯 MVP Features

### ✅ Completed
- [x] Landing page with value proposition
- [x] Profile creation form with all fields
- [x] QR code generation and display
- [x] Public profile page with contact actions
- [x] Mobile-responsive design
- [x] Demo page showcasing functionality
- [x] Login page (basic structure)

### 🔄 Next Steps (Future Enhancements)
- [ ] Backend API integration
- [ ] User authentication and profiles
- [ ] Database for storing profile data
- [ ] Image upload and storage
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

### Premium Features (Future)
- Custom domain URLs
- Advanced analytics
- Branded QR codes
- Multiple profiles
- Priority support

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

---

**Viszy** - Making professional networking accessible to everyone. ✨
