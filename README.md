# SavQuest
## Duolingo for Banking

*This project is part of our Milan Hackathon 2025 submission*

SavQuest is a gamified financial literacy platform that transforms how people learn about money. By connecting to real banking data and using game mechanics inspired by Duolingo, we make financial education engaging, personalized, and effective.

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

### Banking Integration
We leverage TrueLayer API to access:
- **Balance** data for tracking financial health
- **Spending** patterns to create personalized challenges
- **Trends** analysis for tailored financial insights
- **Subscription** management to identify savings opportunities

## 💻 Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Python 3.12
- **Cloud**: AWS Amplify
- **APIs**: TrueLayer, OpenAI

## 🚀 Getting Started

### Frontend Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Connect your bank account to begin your financial journey

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate

   # On Windows
   python -m venv venv
   venv\Scripts\activate
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
   uvicorn app.main:app --reload
   ```

6. Access the API documentation at:
   - Swagger UI: http://127.0.0.1:8000/docs
   - ReDoc: http://127.0.0.1:8000/redoc

### Running the Full Stack

1. Start the backend server in one terminal window (follow backend setup steps)
2. Start the frontend server in another terminal window: `npm run dev`
3. Access the application at http://localhost:3000

## 🔮 Future Plans

- Mobile app versions
- Advanced skill tree progression system
- AI-powered financial coaching
- Premium subscription with enhanced features
- Financial institution partnerships
- Expanded reward marketplace

## 👥 Team

- Henry Allen - 
- Davide Paulillo - 

---

*SavQuest: Level up your financial life, one challenge at a time.*

``` this project is part of our Milan Hackathon 2025 submission ```


### Tech Stack

- Python 3.12 , Javascript
- AWS
- Next.js, React
- OpenAI, Truelayer


### Data we will be working with (from TrueLayer)

- Balance
- Spending
- Trends
- Subcriptions