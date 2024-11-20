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

   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

You're ready to go! 🚀

Open `http://localhost:3000/chat` to start chatting
