# ProductInsightAI

A modern, AI-powered data analysis platform that transforms raw datasets into actionable insights through natural language queries and automated visualizations.

## Features

### 🔍 AI-Powered Analysis
- **Natural Language Queries**: Ask questions about your data in plain English
- **Automated Insights**: Generate AI-driven insights and trends from your datasets
- **Intelligent Analysis**: Get confidence scores and detailed explanations for all insights

### 📊 Data Visualization
- **Interactive Charts**: Line, bar, and pie charts with real-time data
- **Dynamic Visualizations**: Automatically generated charts based on your data structure
- **Export Capabilities**: Share and export your visualizations

### 📁 Data Management
- **Multi-format Support**: Upload CSV and JSON files seamlessly
- **Data Preview**: Interactive table views with pagination
- **Dataset Metrics**: Real-time statistics on rows, columns, and file sizes

### 🔗 Sharing & Collaboration
- **Shareable Links**: Generate secure shareable links for your datasets
- **Password Protection**: Optional password protection for shared content
- **Download Controls**: Control whether shared datasets can be downloaded

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Dark/Light Themes**: Toggle between themes for comfortable viewing
- **Intuitive Interface**: Clean, modern design with smooth animations

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **Wouter** for routing
- **React Query** for state management

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** with Drizzle ORM
- **OpenAI API** for AI analysis
- **Multer** for file uploads
- **PapaParse** for CSV processing

### Infrastructure
- **Drizzle Kit** for database migrations
- **Passport.js** for authentication
- **bcryptjs** for password hashing
- **WebSocket** support for real-time features

## Installation

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database
- OpenAI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProductInsightAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/productinsightai
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   PORT=5000
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Usage

### Getting Started
1. **Upload Data**: Click the upload area or drag & drop CSV/JSON files
2. **View Dashboard**: See automatic metrics and data preview
3. **Generate Insights**: Click "Generate AI Insights" for automated analysis
4. **Ask Questions**: Use the AI query bar to ask natural language questions

### Example Queries
- "What are the key trends in this data?"
- "Show me the highest values"
- "Are there any correlations between the columns?"
- "What is the average value for [column name]?"

### Data Formats Supported
- **CSV**: Comma-separated values with headers
- **JSON**: Array of objects format

## API Endpoints

### Datasets
- `POST /api/datasets/upload` - Upload a new dataset
- `GET /api/datasets` - Get all datasets
- `GET /api/datasets/:id` - Get specific dataset
- `DELETE /api/datasets/:id` - Delete dataset

### Analysis
- `POST /api/datasets/:id/analyze` - Generate AI insights
- `POST /api/datasets/:id/query` - Answer natural language queries
- `GET /api/datasets/:id/insights` - Get insights for dataset

### Sharing
- `POST /api/shares` - Create shareable link
- `POST /api/shares/:token/verify` - Access shared dataset

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript checks
- `npm run db:push` - Push database schema changes

### Project Structure
```
ProductInsightAI/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── openai.ts          # AI integration
│   └── storage.ts         # Database operations
├── shared/                 # Shared types and schemas
└── attached_assets/       # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on the GitHub repository or contact the development team.