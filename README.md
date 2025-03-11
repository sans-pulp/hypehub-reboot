# HypeHub

HypeHub is a gamified productivity application built with Next.js that turns your daily tasks into an exciting adventure. Complete goals, gain experience, and watch your character grow!

## Screenshots

![Login Page](./screenshots/login.png)
*Login Page with retro-styled interface*

![Register Page](./screenshots/register.png)
*Registration Page with retro-styled interface*

![Dashboard](./screenshots/dashboard.png)
*Dashboard showing welcome screen, character stats and active goals*

![Goal Creation](./screenshots/goal-creation.png)
*Goal Creation Form with attribute rewards*

## Features

- **Gamified Task Management**: Transform your daily tasks into an RPG-style adventure
- **Character Progression**: Level up your character through five core attributes:
  - **Strength**: Master physical challenges and tasks requiring endurance
    - Perfect for exercise goals, sports activities, and physical projects
    - Example: "Complete 30 minutes of weight training" (+3 STR)
  - **Vitality**: Boost your health and wellness stats
    - Ideal for health goals, sleep schedule, and maintaining good habits
    - Example: "Maintain a consistent sleep schedule" (+2 VIT)
  - **Knowledge**: Increase your wisdom and learning power
    - Great for study goals, learning new skills, and intellectual pursuits
    - Example: "Complete a programming tutorial" (+4 KNW)
  - **Social**: Enhance your charisma and networking abilities
    - Perfect for networking goals, social events, and communication tasks
    - Example: "Attend a community meetup" (+3 SOC)
  - **Willpower**: Strengthen your mental fortitude and discipline
    - Ideal for breaking bad habits, meditation, and challenging personal goals
    - Example: "Meditate for 15 minutes" (+2 WIL)
- **Multiple Goal Types**:
  - **Daily**: Quick quests that reset daily (1-2 attribute points)
    - Perfect for building habits and maintaining daily routines
  - **Missions**: Medium-term challenges (1-4 weeks, 2-3 attribute points)
    - Ideal for projects and medium-scope achievements
  - **Quests**: Epic long-term adventures (1-12 months, 3-5 attribute points)
    - Perfect for life-changing goals and major achievements
- **Attribute System**: Each completed goal awards attribute points based on type and difficulty
- **Real-time Features**: 
  - Live chat with other users
  - Real-time notifications
  - User presence tracking
  - Goal completion celebrations

## Project Structure

This is a monorepo containing:
- `client/`: Next.js frontend application
- `server/`: WebSocket server for real-time features

## Quick Start

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```
3. Set up environment variables:
```env
# Client (.env in client/)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WEBSOCKET_URL=your_websocket_url
DATABASE_URL=your_database_url
DATABASE_SESSION_POOL_URL=your_session_pool_url
SUPABASE_BUCKET_NAME=your_bucket_name

# Server (.env in server/)
PORT=8080
ALLOWED_ORIGINS=http://localhost:3000
```
4. Start the development servers:
```bash
# Start WebSocket server
pnpm --filter server dev

# Start Next.js client
pnpm --filter client dev
```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Runtime**: Node.js 20.x
- **Package Manager**: pnpm 10.x
- **Framework**: Next.js 15.1.7 with TypeScript
- **Styling**: Tailwind CSS, NES.css for retro styling
- **Database**: Supabase with PostgreSQL
- **Authentication**: Supabase Auth
- **ORM**: Drizzle
- **Real-time**: WebSocket server with ws package

## Development

### Available Commands
```bash
# Start both client and server
pnpm dev

# Client commands (run from client directory)
cd client
pnpm dev          # Start Next.js development server
pnpm build        # Build client for production
pnpm start        # Start production client
pnpm lint         # Run linting
pnpm typecheck    # Run type checking
pnpm db:gen       # Generate database types
pnpm db:push      # Push database changes
pnpm db:studio    # Open database studio

# Server commands (run from server directory)
cd server
pnpm dev          # Start WebSocket development server
pnpm build        # Build server for production
pnpm start        # Start production server
```

## Roadmap

### Dashboard Enhancements
- Enhanced progress bars for task completion and attribute growth
- Flexible goal filtering system (daily, 3-day, weekly, monthly views)
- Expanded dashboard to include:
  - Current weather information
  - Local news feed
  - Goals due within next 3 days
- Additional animations and visual feedback

### Social Features
- Real-time chat with other users via WebSocket integration
- Notifications system for goal updates and social interactions
- Settings customization page

### Smart Goal Features
- Intelligent goal creation with helpful prompts
- Suggested timeframes for different goal types:
  - Missions: 1-4 weeks
  - Quests: 1-12 months
- Weather integration for outdoor goals:
  - Location-based weather checking
  - Smart suggestions for alternative indoor activities
  - Weather alerts and confirmations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - Copyright (c) 2024 HypeHub

See [MIT License](https://opensource.org/licenses/MIT) for details.
