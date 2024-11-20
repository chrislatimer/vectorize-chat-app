# Vectorize API Integration

This repository is a simple integration for using the Vectorize API with OpenAI.

## Setup

1. **Environment Variables**  
   Ensure the following environment variables are set in your `.env` file:

   - `OPENAI_API_KEY`: Your OpenAI API key.
   - `VECTORIZE_TOKEN`: Your Vectorize API token.

2. **Configure Retrieval Endpoint**  
   Set your Vectorize retrieval endpoint in `routes.ts`:
   ```typescript
   const pipelineRetrievalUrl = 'https://client.app.vectorize.io/api/gateways/service/.../retrieve';
   ```

## Installation

1. Install dependencies:

Note that this repo uses new features in React 19 which is currently available only as a release candidate as of the time of this writing. Once `react:19.0.0` is officially released we will be able to remove the `--force` flag.

```bash
npm install --force
```

2. Start the development server:
   ```bash
   npm run dev
   ```

You're ready to go! 🚀

Open `http://localhost:3000/chat` to start chatting
