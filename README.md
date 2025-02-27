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
- **Character Progression**: Gain attribute points (Strength, Vitality, Knowledge, Social, Willpower) as you complete tasks
- **Multiple Goal Types**:
  - Daily Goals: Regular tasks that reset daily
  - Missions: Medium-term goals (1-4 weeks)
  - Quests: Long-term goals (1-12 months)
- **Attribute System**: Each goal contributes to different character attributes
- **Real-time Updates**: Built with modern web technologies for a responsive experience

## Quick Start

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```
3. Set up environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
DATABASE_SESSION_POOL_URL=your_session_pool_url
SUPABASE_BUCKET_NAME=your_bucket_name
```
4. Run the development server:
```bash
pnpm dev
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

## Development

### Available Commands
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run linting
pnpm typecheck    # Run type checking
pnpm db:gen       # Generate database types
pnpm db:push      # Push database changes
pnpm db:studio    # Open database studio
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
