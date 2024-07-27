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


## Inspiration
Inspired by click trackers such as [Voluum](https://voluum.com), [Bemob](https://bemob.com), and [Binom](https://binom.org)
