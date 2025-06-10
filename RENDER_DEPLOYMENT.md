# F1 API Proxy - Render.com Deployment Checklist

## 🚀 Ready for Deployment

Your f1-api-proxy is now configured and ready for Render.com deployment!

## Environment Variables for Render.com

Copy these exact environment variables into your Render.com service configuration:

```
NODE_ENV=production
PORT=8000
JOLPICA_API_URL=http://api.jolpi.ca/ergast/f1
API_TIMEOUT=15000
CACHE_TTL_HISTORICAL=86400
CACHE_TTL_CURRENT=3600
CACHE_TTL_LIVE=300
CACHE_TTL_DEFAULT=300
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
LOG_FORMAT=json
```

## Deployment Steps

### Step 1: Create Render Service

1. Go to [Render.com Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your repository or upload the f1-api-proxy folder

### Step 2: Configure Build Settings

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: Node

### Step 3: Add Environment Variables

Add all the environment variables listed above in the Render.com environment section.

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your deployment URL (e.g., `https://f1-api-proxy-xyz.onrender.com`)

### Step 5: Test Deployment

Once deployed, test these endpoints:

- `https://your-url.onrender.com/health` - Should return "OK"
- `https://your-url.onrender.com/api/seasons` - Should return F1 seasons data

## After Deployment

### Update MCP Server Configuration

1. Copy your f1-api-proxy deployment URL
2. Update the f1-mcp-server environment variable `F1_API_PROXY_URL` with your new URL
3. Redeploy the f1-mcp-server

### Verify Integration

- Check f1-mcp-server logs show "F1 API proxy connection verified"
- Test MCP tools return data successfully

## Important Notes

- ✅ **Production Ready**: All security, caching, and error handling configured
- ✅ **Environment**: Properly configured for production
- ✅ **Dependencies**: All required packages included
- ✅ **Health Checks**: Built-in health endpoint
- ✅ **Logging**: Structured logging for monitoring
- ✅ **Rate Limiting**: Protected against abuse
- ✅ **CORS**: Configured for cross-origin requests

## Troubleshooting

**If deployment fails:**

1. Check Render.com logs for specific errors
2. Verify all environment variables are set correctly
3. Ensure NODE_ENV=production

**If API calls fail:**

1. Test health endpoint first
2. Check JOLPICA_API_URL is accessible
3. Review rate limiting settings

**If MCP server can't connect:**

1. Verify f1-api-proxy URL is correct in MCP server env
2. Check both services are running
3. Test API proxy endpoints directly
