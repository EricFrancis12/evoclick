# EvoClick

EvoClick is a self-hosted click tracking software designed for media buyers and affiliate marketers. It helps you track, analyze, and optimize your marketing campaigns to ensure maximum ROI.


## Features
- Real-time Tracking: Monitor clicks, conversions, and other key metrics as they happen.
- Detailed Reports: Generate comprehensive reports to analyze the performance of your campaigns.
- Scalable Architecture: Designed to handle high volumes of traffic efficiently.


## Quickstart

### Prerequisites
[Docker](https://docs.docker.com/engine/install) and [Docker Compose](https://docs.docker.com/compose/install)

### Steps
1. Clone the repository:
   
```bash
git clone https://github.com/EricFrancis12/evoclick.git
```

2. Navigate to the project directory:
   
```bash
cd evoclick
```

3. Start the application:
 
```bash
docker compose up
```

The UI will now be running at http://localhost:3000 by default. Check the `.env` file for your Root Username and Root Password.


## Deployment

### Option A: Vercel
This application was designed for deployment on [Vercel](https://vercel.com). This is because Vercel offers a Postgres database and Redis instance on their free tier, which makes it extremely easy to get the application up and running using a single platform.

NOTE: When deploying to Vercel, the route handlers in `/api` are automatically ran as Serverless Functions. More information here: https://vercel.com/docs/functions/runtimes/go

### Option B: VPS
Instructions coming soon.


## Find a bug?
If you found an issue or would like to submit an improvement to this project, please submit an issue using the issues tab above. If you would like to submit a PR with a fix, reference the issue you created!


Thank you for using EvoClick! I hope it helps you optimize your marketing campaigns effectively.


## Inspiration
Inspired by click trackers such as [Voluum](https://voluum.com), [Bemob](https://bemob.com), and [Binom](https://binom.org)
