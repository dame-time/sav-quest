# SavQuest Database Schema

This document outlines the database structure for SavQuest, a gamified financial literacy application.

## Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ UserTrait : has
    User ||--o{ Challenge : completes
    User ||--o{ Transaction : has
    User ||--o{ ContentProgress : tracks
    User ||--o{ Reward : earns
    User ||--o{ LeagueParticipant : participates
    User ||--o{ Friendship : has
    
    Trait ||--o{ UserTrait : assigned
    Trait ||--o{ TraitLevel : contains
    
    Challenge ||--o{ ChallengeReward : offers
    ChallengeType ||--o{ Challenge : categorizes
    
    Content ||--o{ ContentProgress : completed_by
    ContentType ||--o{ Content : categorizes
    
    League ||--o{ LeagueParticipant : includes
    LeagueTier ||--o{ League : categorizes
    
    RewardType ||--o{ Reward : categorizes
```

## Tables

### User
```mermaid
classDiagram
    class User {
        +String user_id (PK)
        +String email
        +String name
        +String profile_picture_url
        +Integer total_xp
        +Integer savpoints_balance
        +Date created_at
        +Date last_login
        +Boolean is_active
    }
```

### Trait
```mermaid
classDiagram
    class Trait {
        +Integer trait_id (PK)
        +String name
        +String description
        +String icon_url
    }
    
    class UserTrait {
        +String user_id (PK, FK)
        +Integer trait_id (PK, FK)
        +Integer current_level
        +Integer current_xp
        +Date last_updated
    }
    
    class TraitLevel {
        +Integer trait_id (PK, FK)
        +Integer level (PK)
        +Integer xp_required
        +String title
        +String description
        +String reward_id
    }
```

### Challenge
```mermaid
classDiagram
    class Challenge {
        +Integer challenge_id (PK)
        +Integer challenge_type_id (FK)
        +String title
        +String description
        +Integer difficulty
        +Integer xp_reward
        +Integer savpoints_reward
        +Boolean is_personalized
        +Date start_date
        +Date end_date
        +Boolean is_active
    }
    
    class ChallengeType {
        +Integer challenge_type_id (PK)
        +String name
        +String description
        +String frequency
    }
    
    class UserChallenge {
        +String user_id (PK, FK)
        +Integer challenge_id (PK, FK)
        +Boolean is_completed
        +Integer progress
        +Date completed_at
        +Boolean reward_claimed
    }
    
    class ChallengeReward {
        +Integer challenge_id (PK, FK)
        +Integer reward_id (PK, FK)
        +Integer quantity
    }
```

### Transaction
```mermaid
classDiagram
    class Transaction {
        +String transaction_id (PK)
        +String user_id (FK)
        +Float amount
        +String currency
        +String category
        +String merchant_name
        +String description
        +Date transaction_date
        +Boolean is_expense
        +Boolean is_subscription
        +String truelayer_id
    }
```

### Content
```mermaid
classDiagram
    class Content {
        +Integer content_id (PK)
        +Integer content_type_id (FK)
        +String title
        +String description
        +String content_url
        +Integer trait_id (FK)
        +Integer difficulty
        +Integer xp_reward
        +Boolean is_active
    }
    
    class ContentType {
        +Integer content_type_id (PK)
        +String name
        +String description
    }
    
    class ContentProgress {
        +String user_id (PK, FK)
        +Integer content_id (PK, FK)
        +Boolean is_completed
        +Integer progress_percentage
        +Integer quiz_score
        +Date last_accessed
        +Date completed_at
    }
```

### Reward
```mermaid
classDiagram
    class Reward {
        +Integer reward_id (PK)
        +Integer reward_type_id (FK)
        +String title
        +String description
        +String image_url
        +Integer savpoints_cost
        +Boolean is_premium
        +Date valid_from
        +Date valid_until
        +Boolean is_active
    }
    
    class RewardType {
        +Integer reward_type_id (PK)
        +String name
        +String description
    }
    
    class UserReward {
        +String user_id (PK, FK)
        +Integer reward_id (PK, FK)
        +Date acquired_at
        +Date redeemed_at
        +Boolean is_redeemed
        +String redemption_code
    }
```

### League
```mermaid
classDiagram
    class League {
        +Integer league_id (PK)
        +Integer league_tier_id (FK)
        +String name
        +Date start_date
        +Date end_date
        +Integer max_participants
        +Boolean is_active
    }
    
    class LeagueTier {
        +Integer league_tier_id (PK)
        +String name
        +String description
        +Integer rank
        +String icon_url
    }
    
    class LeagueParticipant {
        +Integer league_id (PK, FK)
        +String user_id (PK, FK)
        +Integer current_xp
        +Integer rank
        +Boolean promoted
        +Boolean relegated
        +Date joined_at
    }
```

### Friendship
```mermaid
classDiagram
    class Friendship {
        +String user_id (PK, FK)
        +String friend_id (PK, FK)
        +Date created_at
        +Boolean is_active
    }
```

## Data Flow

```mermaid
flowchart TD
    A[User] --> B[Authentication]
    B --> C[User Profile]
    
    C --> D[Traits & Progress]
    C --> E[Challenges]
    C --> F[Banking Data]
    C --> G[Social Features]
    C --> H[Rewards]
    C --> I[Educational Content]
    
    D --> J[XP & Levels]
    E --> K[Challenge Completion]
    F --> L[Transaction Analysis]
    G --> M[Leaderboards & Leagues]
    H --> N[Reward Redemption]
    I --> O[Learning Progress]
    
    J --> P[User Progress]
    K --> P
    L --> P
    M --> P
    O --> P
    
    P --> Q[Personalized Experience]
    Q --> R[AI Recommendations]
    R --> E
```

## Notes on Implementation

### For Hackathon MVP:
1. **Focus Areas:**
   - User, UserTrait, and Trait tables are essential
   - Challenge system for basic gamification
   - Mock transaction data instead of full TrueLayer integration
   - Basic content for financial literacy quizzes

2. **Simplified Tables:**
   - Consider combining some related tables for the MVP
   - Use mock data for leagues and friendships
   - Implement basic reward structure

3. **Data Storage:**
   - Use AWS DynamoDB for flexible schema during development
   - Consider migration path to relational database for production

### Future Considerations:
1. **Scaling:**
   - Plan for partitioning of transaction data as it grows
   - Consider caching strategies for leaderboard and frequently accessed data

2. **Analytics:**
   - Add tables for tracking user engagement metrics
   - Implement data warehouse structure for analytics

3. **Performance:**
   - Add indexes on frequently queried fields
   - Consider read replicas for leaderboard and social features
``` 