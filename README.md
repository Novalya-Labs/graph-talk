# Graph Talk 📊

> **Talk to your database, get answers, visualize your data**

Graph Talk is an AI-powered data visualization platform that transforms natural language questions into SQL queries and automatically generates intelligent chart recommendations. Perfect for marketers, analysts, and business users who need quick insights from their data without writing complex SQL.

![Graph Talk Demo](https://img.shields.io/badge/Status-Demo-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## ✨ Key Features

### 🤖 **Natural Language to SQL**
- Ask questions in plain English or French
- AI automatically converts to optimized SQL queries
- No SQL knowledge required

### 📈 **Intelligent Chart Recommendations**
- AI analyzes your data and suggests the best visualization
- Supports bar charts, line charts, pie charts, scatter plots, and more
- Confidence scoring for chart recommendations

### 🎨 **Rich Visualizations**
- Interactive charts powered by Recharts
- Multiple chart types with smart defaults
- Responsive design for all devices

### 📤 **Comprehensive Export Options**
- Export charts as PNG, PDF, or SVG
- Export data as CSV or JSON
- High-quality outputs for presentations and reports

### 🌍 **Multilingual Support**
- English and French interfaces
- Localized responses and insights

### ⚡ **Real-time Analysis**
- Instant query execution
- Performance metrics and insights
- Conversational AI responses explaining your data

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- PostgreSQL database
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Novalya-Labs/graph-talk.git
cd graph-talk
```

2. **Install dependencies**
```bash
yarn install
```

3. **Set up environment variables**

Create `.env` files in both packages:

**packages/server/.env**
```env
PORT=8888
DB_HOST=localhost
DB_PORT=5444
DB_USER=postgres
DB_PASS=postgres
DB_NAME=graph-talk
OPENAI_API_KEY=your_openai_api_key_here
```

**packages/client/.env**
```env
VITE_APP_NAME=Graph Talk
VITE_API_URL=http://localhost:8888
```

4. **Start the database**
```bash
make db-up
```

5. **Seed the demo database**
```bash
yarn workspace @graph-talk/server seed
```

6. **Start the development servers**
```bash
# Terminal 1 - Start the backend
yarn dev:server

# Terminal 2 - Start the frontend
yarn dev:client
```

7. **Open your browser**
Navigate to `http://localhost:5173` and start asking questions!

## 💡 Example Queries

Try these natural language questions with the demo data:

- **"What are the most expensive products?"**
- **"Show me the top customers by order count"**
- **"Which products are selling the best?"**
- **"List all users and their email addresses"**
- **"What's the average order value?"**

## 🏗️ Architecture

### Frontend (`packages/client`)
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** components for accessibility
- **Recharts** for data visualization
- **Zustand** for state management

### Backend (`packages/server`)
- **Node.js** with Express and TypeScript
- **TypeORM** for database management
- **LangChain** for AI-powered SQL generation
- **OpenAI GPT-4** for natural language processing
- **PostgreSQL** database

### AI Pipeline
1. **Natural Language Processing**: User question → AI analysis
2. **SQL Generation**: AI creates optimized PostgreSQL queries
3. **Data Analysis**: AI analyzes query results
4. **Visualization Recommendation**: AI suggests best chart type
5. **Insight Generation**: AI provides conversational explanations

## 🎯 Use Cases

### For Marketers
- **Campaign Performance**: "Show me conversion rates by marketing channel"
- **Customer Segmentation**: "Who are our highest-value customers?"
- **Trend Analysis**: "How have sales changed over the last quarter?"

### For Business Analysts
- **KPI Monitoring**: "What's our monthly recurring revenue?"
- **Product Analytics**: "Which features are most popular?"
- **Financial Reporting**: "Show me profit margins by product category"

### For Data Teams
- **Quick Exploration**: Rapid data discovery without writing SQL
- **Stakeholder Demos**: Generate charts for presentations instantly
- **Data Validation**: Verify data quality with natural language queries

## 🔧 Customization

### Using Different LLMs
The platform uses OpenAI by default, but you can easily switch to other LLMs by modifying `packages/server/services/query.service.ts`:

```typescript
// Replace OpenAI with your preferred LLM
const llm = new ChatOpenAI({
  temperature: 0,
  model: 'gpt-4o-mini', // Change this
  apiKey: Env.OPENAI_API_KEY,
  maxTokens: 1000,
});
```

### Adding Your Own Database
While this demo uses a sample e-commerce database, you can connect your own PostgreSQL database by:

1. Updating the database configuration in `packages/server/configs/database.ts`
2. Modifying the table descriptions in `packages/server/services/query.service.ts`
3. Updating the AI prompts to understand your schema

## 📊 Demo Database Schema

The demo includes a sample e-commerce database with:

- **Users**: Customer information (id, name, email)
- **Products**: Product catalog (id, name, description, price)
- **Orders**: Order records (id, userId, createdAt)
- **Order Items**: Order details (id, orderId, productId, quantity)

## 🛠️ Development Commands

```bash
# Development
yarn dev:client          # Start frontend dev server
yarn dev:server          # Start backend dev server
make dev-all             # Start both servers

# Building
yarn build:client        # Build frontend for production
yarn build:server        # Build backend for production

# Database
make db-up               # Start PostgreSQL container
make db-down             # Stop PostgreSQL container
make db-restart          # Restart database
yarn workspace @graph-talk/server seed  # Seed demo data

# Code Quality
yarn lint                # Run linter
yarn format              # Format code
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏢 About Novalya Labs

Graph Talk is developed by [Novalya Labs](https://novalya.com), specializing in AI-powered business intelligence solutions.

---

**Ready to transform how you interact with your data?** 🚀

[Get Started](#quick-start) | [View Demo](https://graph-talk-demo.novalya.com) | [Documentation](https://docs.graph-talk.novalya.com) 