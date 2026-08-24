# DevEngine - AI-Powered Developer Portfolio Builder

A modern AI-powered portfolio builder platform designed specifically for developers. Create professional, visually appealing portfolios using pre-designed templates across multiple industries with AI-assisted content generation.

![DevEngine](https://img.shields.io/badge/DevEngine-v1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **AI-Assisted Content Generation**: Automatically generates professional project descriptions and summaries using the Gemini API
- **Multiple Professional Templates**: Industry-specific templates for aviation, legal services, and business operations
- **Real-Time Preview**: Instant visual feedback during portfolio creation with live preview functionality
- **Multi-Format Export**: Export portfolios as CSV and PDF with template-specific formatting
- **GitHub Integration**: Seamlessly import user profiles and repositories from GitHub
- **Supabase Authentication**: Secure user authentication and session management
- **Responsive Design**: Fully responsive with dark/light theme support
- **Data Visualization**: Skills and experience visualization

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Responsive web design with CSS Grid and Flexbox
- Dark/light theme switching
- jsPDF for PDF generation

### Backend
- Node.js with Express.js
- CORS-enabled REST API
- Environment variable configuration with dotenv

### Database & Authentication
- Supabase (PostgreSQL) for data storage
- Supabase Auth for user authentication
- Real-time data synchronization

### AI Integration
- Gemini API for AI-powered content generation
- Fallback heuristic algorithms for content suggestions

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- A Supabase account
- Gemini API key (optional, for AI features)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DevEngine.git
   cd DevEngine
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Open the Supabase SQL Editor and run `supabase/schema.sql`
   - Enable Email authentication in Supabase Authentication settings
   - Copy the Project URL and anon public key

4. **Configure Supabase**
   - Open `js/supabase-config.js`
   - Replace the placeholder values with your Supabase credentials:
   ```javascript
   const SUPABASE_URL = 'your-project-url';
   const SUPABASE_ANON_KEY = 'your-anon-public-key';
   ```

5. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Add your Gemini API key (optional):
   ```env
   GEMINI_API_KEY=your-gemini-api-key
   ```

6. **Start the server**
   ```bash
   npm start
   ```

7. **Open the application**
   - Open `html/portfolio.html` through a local static server
   - Or use a simple HTTP server:
   ```bash
   npx http-server . -p 8080
   ```

## Usage

### Creating a Portfolio

1. Sign up or log in using email authentication
2. Choose a template from the available options (Flight Attendant, Legal Assistant, Office Manager)
3. Fill in your personal information, skills, and experience
4. Use the AI assistant to generate project descriptions (requires Gemini API key)
5. Import your GitHub repositories to automatically populate project data
6. Preview your portfolio in real-time
7. Export as PDF or CSV when ready

### GitHub Integration

To import GitHub repositories:
- Click the "Import from GitHub" button
- Authorize the application (if required)
- Select repositories to import
- Data will be automatically formatted for your portfolio

### Export Options

- **PDF Export**: Generates a professionally formatted PDF matching your selected template
- **CSV Export**: Exports portfolio data in CSV format for easy sharing and backup

## Project Structure

```
DevEngine/
├── css/
│   └── style.css              # Main stylesheet with theme support
├── html/
│   ├── pages/
│   │   ├── builder.html       # Portfolio builder interface
│   │   ├── contact.html       # Contact page
│   │   └── home.html          # Home page
│   ├── partials/
│   │   ├── footer.html        # Footer component
│   │   └── header.html        # Header component
│   └── portfolio.html         # Main application entry point
├── js/
│   ├── script.js              # Main application logic
│   └── supabase-config.js     # Supabase configuration
├── server/
│   ├── ai-service.js          # AI service endpoints
│   └── index.js               # Express server
├── supabase/
│   └── schema.sql             # Database schema
├── images/                    # Static images
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Security Notes

- Only the Supabase anon public key should be used in the browser
- Never add a Supabase service-role key to this project
- Keep your `.env` file secure and never commit it to version control
- Gemini API keys should be kept secure and not exposed in client-side code

## Unique Selling Points

1. **AI-Enhanced Content**: Reduces time spent writing content with automatic generation
2. **Template-Specific PDF Export**: Ensures brand consistency across web and print formats
3. **Industry-Specific Templates**: Purpose-built designs for different industries
4. **GitHub Integration**: Automatic data population from GitHub profiles
5. **Real-Time Preview**: Instant visual feedback during creation
6. **Multi-Format Export**: Flexible sharing options for different use cases

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
The application is designed to run as a static site with a Node.js backend for AI services. For production deployment:
1. Deploy the static files to a hosting service (Netlify, Vercel, GitHub Pages)
2. Deploy the Node.js server to a cloud provider (Heroku, Railway, Render)
3. Update API endpoints in the frontend to point to your production server

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Acknowledgments

- Built with [Supabase](https://supabase.com) for backend services
- AI powered by [Gemini API](https://ai.google.dev/)
- PDF generation with [jsPDF](https://github.com/parallax/jsPDF)
- Icons and UI components from various open-source libraries
