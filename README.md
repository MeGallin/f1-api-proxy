# F1 API Proxy

Formula 1 data API proxy service that integrates with the Jolpica F1 API to provide cached and structured access to F1 racing data.

## Overview

This service acts as a proxy layer between the F1 MCP server and the Jolpica F1 API, providing:

- RESTful endpoints for all F1 data categories
- Intelligent caching for performance optimization
- Error handling and retry logic
- Rate limiting compliance
- Data validation and transformation

## Architecture

- **Node.js** with Express.js framework
- **JavaScript** (ES6+ with CommonJS modules)
- **Redis-compatible caching** for performance
- **Axios** for HTTP client communication
- **Winston** for structured logging

## Endpoints

- `/seasons` - All F1 seasons
- `/races/:year/:round?` - Race information
- `/drivers/:year?/:driverId?` - Driver data
- `/constructors/:year?/:constructorId?` - Constructor data
- `/qualifying/:year/:round` - Qualifying results
- `/laps/:year/:round/:lap?` - Lap times
- `/pitstops/:year/:round` - Pit stop data
- `/standings/:year/:type?` - Championship standings
- `/results/:year/:round` - Race results

## Development

```bash
npm install
npm run dev
```

## Deployment

- **Port**: 8000
- **Health Check**: `/health`
- **API Info**: `/api/info`

Part of the F1 MCP LangGraph project ecosystem.
