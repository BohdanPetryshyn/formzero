# FormZero

A free, open-source form backend handler that you can deploy to your own Cloudflare account in seconds. No monthly fees, no submission limits - just forms that work.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/BohdanPetryshyn/formzero)

## Features

- **Zero Cost**: Deploy to your Cloudflare account and use their generous free tier
- **Unlimited Submissions**: Store all your form submissions in a D1 database
- **Beautiful UI**: Modern dashboard to view and manage submissions
- **Multiple Forms**: Create and manage multiple forms from one deployment
- **REST API**: Simple endpoint to receive form submissions
- **One-Click Deploy**: Get started in seconds with the Deploy to Cloudflare button

## Quick Start

### Option 1: Deploy to Cloudflare (Recommended)

1. Click the "Deploy to Cloudflare" button above
2. Authorize Cloudflare to access your GitHub/GitLab account
3. Configure your deployment settings
4. Your form backend will be deployed automatically!

### Option 2: Manual Deployment

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/formzero.git
   cd formzero
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a D1 database:
   ```bash
   npx wrangler d1 create formzero
   ```

4. Update `wrangler.jsonc` with your database ID

5. Run migrations:
   ```bash
   npm run migrate
   ```

6. Deploy:
   ```bash
   npm run deploy
   ```

## Usage

### Creating Your First Form

1. Visit your deployed application at `https://your-worker.workers.dev`
2. Create a new form and give it a name (e.g., "Contact Form")
3. Copy the form endpoint URL

### Submitting to Your Form

Send a POST request to `/api/forms/{form-id}/submissions`:

```bash
curl -X POST https://your-worker.workers.dev/api/forms/contact-form/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello!"
  }'
```

Or use a simple HTML form:

```html
<form action="https://your-worker.workers.dev/api/forms/contact-form/submissions" method="POST">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <textarea name="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send</button>
</form>
```

### Viewing Submissions

Navigate to `/forms/{form-id}/submissions` in your dashboard to view all submissions in a clean table format.

## Tech Stack

- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless runtime
- [Cloudflare D1](https://developers.cloudflare.com/d1/) - SQLite database
- [React Router v7](https://reactrouter.com/) - Full-stack framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components

## Development

```bash
# Install dependencies
npm install

# Run migrations locally
npm run migrate

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare
npm run deploy
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
