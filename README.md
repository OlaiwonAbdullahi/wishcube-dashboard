# Wishcube Dashboard

Wishcube is a platform for creating greeting cards, Pages(website), virtual party rooms, and integrating gifting. Make every celebration unforgettable.

---

## Features

### Greeting Card

User can create a greeting card for a celebrant by just filling a form with the celebrant's name, occasion, preferred styling, font, and background image.

### Pages(Websites)

User will be able to create a page for a celebrant by just filling a form with the celebrant's name, occasion, and a few other details. The page will be a website with a unique URL. The user can then share the link with friends and family to view the page.

The form Message field has a component where the user can generate a message based on the occasion and relationship using AI.

### Integrated Gifting

The user can add gifts to the page, either gifts from verified vendors onboarded on the platform or digital gifts like Spotify/Amazon vouchers uploaded by the Wishcube Admin.

### Marketplace & Vendor

Wishcube has a marketplace where users can buy gifts for the celebrant/recipient. The marketplace features gifts uploaded by verified vendors onboarded on the platform.

### Virtual Party Room

The Virtual Party Room is a live call for celebrations. This feature is currently in development.

## Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/))
- **Authentication**: JWT, bcryptjs
- **Payments**: [Paystack](https://paystack.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **Icons**: [HugeIcons](https://hugeicons.com/)

---

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/OlaiwonAbdullahi/wishcube-dashboard.git
   cd wishcube-dashboard
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add the following:

   # Google Authentication

   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

   # Payments (Paystack)

   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
   PAYSTACK_SECRET_KEY=your_paystack_secret_key

   # External APIs

   NEXT_PUBLIC_GOOGLE_FONTS_API_KEY=your_google_fonts_api_key

   ```

   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📁 Project Structure

- `app/`: Next.js App Router (pages and layouts).
  - `dashboard/`: User and Vendor dashboard interfaces.
  - `w/[slug]/`: Public-facing celebration websites.
  - `api/`: Backend API routes handling logic.
- `components/`: Shared UI components (Shadcn/UI, forms, etc.).
- `lib/`: Utility functions, database models, and library configurations.
- `hooks/`: Custom React hooks for global state and data fetching.
- `public/`: Static assets (images, fonts, etc.).

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

Built with ❤️ for better celebrations.
