# SavQuest

## Duolingo for Banking

_This project is part of our Milan Hackathon 2025 submission_

SavQuest is a gamified financial literacy platform that transforms how people learn about money. By connecting to real banking data and using game mechanics inspired by Duolingo, we make financial education engaging, personalized, and effective.

#### Landing Page
https://www.savquest.com

## 💡 The Problem

Financial literacy remains a critical gap for many people, with traditional education methods failing to engage users or provide practical, personalized guidance. SavQuest addresses this by creating an experience that's both educational and addictive.

## 🎮 Our Solution

SavQuest turns financial learning into a game where users:

- Level up financial character traits through real-world actions
- Complete daily challenges and missions
- Compete with friends on leaderboards
- Earn rewards for developing healthy financial habits

## 🔑 Key Features

### Character Progression

- Four financial literacy traits to develop:
  - **Saver** - Master saving techniques
  - **Investor** - Learn wealth-building strategies
  - **Budgeter** - Develop expense management skills
  - **Financial Scholar** - Build financial knowledge

### Engagement Systems

- **Daily Quests**: Quick financial literacy challenges
- **Weekly Challenges**: Action-based goals tied to real spending
- **Streaks**: Rewards for consistent app usage
- **Leaderboards**: Compete with friends in leagues
- **XP System**: Progress based on learning and actions, not net worth

### Rewards Marketplace

- **Tiered Rewards System**: Bronze, Silver, Gold, and Platinum tiers unlocked by leveling up
- **Real-world Rewards**: Redeem coins for coffee vouchers, Amazon gift cards, WeWork passes, and more
- **Educational Rewards**: Access to premium financial webinars and courses
- **Experience Rewards**: One-on-one financial coaching sessions

### Banking Integration

We leverage TrueLayer API to access:

- **Balance** data for tracking financial health
- **Spending** patterns to create personalized challenges
- **Trends** analysis for tailored financial insights
- **Subscription** management to identify savings opportunities

### AI Financial Coach

- **Personalized Advice**: Get tailored financial guidance based on your spending patterns
- **Statement Analysis**: Upload bank statements for AI-powered analysis
- **Subscription Management**: Identify and manage recurring expenses
- **Savings Opportunities**: Discover potential areas to save money

## 💻 Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Python 3.12, FastAPI
- **Cloud**: AWS Amplify
- **APIs**: TrueLayer, OpenAI

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.12
- npm or yarn
- Git

### Project Structure

```
sav-quest/
├── frontend/           # Next.js frontend application
├── backend/            # FastAPI backend application
├── docs/               # Documentation files
├── Designs/            # UI/UX design files
└── README.md           # This file
```

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sav-quest.git
   cd sav-quest
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```
   Then edit the `.env.local` file to add your API keys and configuration.

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Access the application at http://localhost:3000

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # On macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate

   # On Windows
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file to add your API keys and configuration.

5. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

6. Access the API documentation at:
   - Swagger UI: http://127.0.0.1:8000/docs
   - ReDoc: http://127.0.0.1:8000/redoc

### Running with Docker

You can also run the entire application using Docker Compose:

1. Make sure Docker and Docker Compose are installed on your system.

2. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📱 Using the Application

### User Registration and Onboarding

1. Create an account with your email and password
2. Complete the financial personality assessment
3. Connect your bank account (optional)
4. Set your financial goals and preferences

### Core Features

#### Dashboard

The dashboard provides an overview of your financial health and progress:
- Current level and XP
- Financial trait levels
- Daily challenges
- Recent achievements
- Streak information

#### Learning Journey

Access personalized financial education content:
- Beginner to advanced modules
- Interactive quizzes and challenges
- Earn XP and coins for completing lessons
- Track your progress through the learning path

#### Statement Analysis

Upload your bank statements for AI-powered analysis:
- Spending patterns and trends
- Category breakdown
- Personalized insights
- Savings opportunities

#### Rewards Marketplace

Redeem your earned coins for various rewards:
- Bronze Tier (Levels 1-5): Coffee vouchers, basic e-books
- Silver Tier (Levels 6-10): WeWork passes, Amazon vouchers
- Gold Tier (Levels 11-15): Financial coaching sessions
- Platinum Tier (Levels 16+): Premium financial planning services

#### Financial Coach

Chat with our AI financial coach:
- Ask questions about your finances
- Get personalized advice
- Analyze subscriptions and recurring expenses
- Receive savings recommendations

### Coins and Rewards System

Earn coins through various activities:
- Leveling up (50 base coins + level × 25)
- Completing daily challenges (5-15 coins each)
- Finishing learning modules (15-35 coins each)
- Maintaining streaks (bonus coins)
- Unlocking achievements (bonus coins)

## 🔮 Future Plans

- Mobile app versions
- Advanced skill tree progression system
- Expanded AI-powered financial coaching
- Premium subscription with enhanced features
- Financial institution partnerships
- Expanded reward marketplace

## 👥 Team

- Henry Allen -
- Davide Paulillo -

## 🛠️ Troubleshooting

### Common Issues

1. **API Connection Issues**:
   - Ensure your OpenAI API key is correctly set in the `.env` file
   - Check that the backend server is running on port 8000
   - Verify network connectivity between frontend and backend

2. **Frontend Development Issues**:
   - Clear browser cache and reload
   - Check browser console for errors
   - Ensure all dependencies are installed with `npm install`

3. **Backend Development Issues**:
   - Verify Python version (3.12 recommended)
   - Ensure virtual environment is activated
   - Check logs for detailed error messages

### Getting Help

If you encounter issues not covered in this documentation:
1. Check the GitHub issues section
3. Contact the development team
- Henry
- Davide

---

_SavQuest: Level up your financial life, one challenge at a time._
