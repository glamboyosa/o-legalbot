# Legal Jobs Telegram Bot 🤖

An automated system that scrapes legal job postings from Telegram channels, processes them using Gemini AI, and sends daily email digests. Built with Bun, Trigger.dev, and the Telegram API.

## Features

- 🔍 Monitors Telegram channels for legal job postings
- 🤖 Uses Gemini AI to extract and summarize job information
- 📧 Sends daily email digests with job listings in CSV format
- ⏰ Runs hourly checks for new postings
- 🎯 Filters jobs based on legal industry keywords

## Prerequisites

- Bun installed
- Telegram API credentials
- Google Cloud (Gemini AI) API key
- Resend API key for email delivery
- Trigger.dev account

## Setup

1. Clone the repository and install dependencies:
```bash
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Fill in your environment variables:
- **Telegram**: Get your API credentials by [creating a Telegram application](https://github.com/gram-js/gramjs?tab=readme-ov-file#how-to-get-started)
- **Gemini AI**: Get your API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs#node.js)
- **Resend**: Sign up at [resend.com](https://resend.com) to get your API key
- **Trigger.dev**: Set up your account and get credentials from [trigger.dev](https://trigger.dev)

Your `.env.local` should look like this:
```env
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash
TELEGRAM_SESSION_STRING=your_session_string
TELEGRAM_CHANNEL_USERNAME=channel_username
GOOGLE_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
EMAIL_ONE=recipient1@example.com
EMAIL_TWO=recipient2@example.com
```

## Development

Start the development server:
```bash
bun run dev
```

The server will start on `http://localhost:3000` and handle Trigger.dev webhook events.

## Deployment

This project can be deployed to platforms that support Bun applications. The server component is necessary for handling Trigger.dev webhooks.

## How It Works

1. The bot connects to specified Telegram channels
2. It filters messages containing legal-related keywords
3. Gemini AI extracts job titles and creates summaries
4. Data is compiled into a CSV file
5. Email digest is sent to specified recipients
6. Process repeats hourly via Trigger.dev scheduling

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

MIT





