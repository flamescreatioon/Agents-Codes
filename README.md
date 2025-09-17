# Receptionist Agent API

A minimal Express + SQLite API for managing appointments.

## Local development

1. Install dependencies

```bash
npm install
```

2. Run the API

```bash
npm start
```

- Server listens on `PORT` env or 5000 by default.
- SQLite DB file defaults to `./agent.db` in repo root. You can override with `DATABASE_PATH`.

Optional: seed sample data

```bash
node src/seedData.js
```

## Deploy to Fly.io

Prerequisites:
- Install the Fly CLI and sign in: https://fly.io/docs/hands-on/install-flyctl/
- Have a Fly account with billing set up for volumes.

This repo already contains `Dockerfile` and `fly.toml` configured to:
- Run on port 8080 inside the container
- Mount a persistent volume at `/data` for the SQLite database
- Set `DATABASE_PATH=/data/agent.db`

### One-time app setup

```bash
# 1) Initialize the app (choose an app name or accept default)
fly launch --no-deploy

# 2) Create a volume for SQLite (adjust region if needed)
# List regions: fly platform regions
fly volumes create data --size 1 --region iad
```

Update `fly.toml` if you chose a different app name or region.

### Deploy

```bash
fly deploy
```

### Check status and logs

```bash
fly status
fly logs
```

### Test the API

```bash
# Root health
curl https://<your-app-name>.fly.dev/

# Create appointment
curl -X POST https://<your-app-name>.fly.dev/appointments \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","phone":"+1234567890","date":"2025-09-20","time":"10:00 AM","purpose":"Consultation"}'

# Query by phone
curl https://<your-app-name>.fly.dev/appointments/phone/%2B1234567890

# Query by date
curl https://<your-app-name>.fly.dev/appointments/date/2025-09-20
```

## CI/CD with GitHub Actions

This repo includes automated deployment to Fly.io when you push to the `main` branch.

### One-time setup for GitHub Actions

1. **Generate a Fly.io deploy token**
   ```bash
   fly tokens create deploy
   ```
   Copy the token that's printed.

2. **Add the token as a GitHub secret**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `FLY_API_TOKEN`
   - Value: paste the token from step 1
   - Click "Add secret"

3. **Trigger deployment**
   Push to `main` branch and the workflow will automatically deploy to Fly.io.
   
   You can also manually trigger deployment from GitHub Actions tab → "Deploy to Fly.io" → "Run workflow".

### Monitoring deployments

- Check the GitHub Actions tab in your repo for deployment status
- View logs with `fly logs` or in the Fly.io dashboard

## Notes
- If you see EADDRINUSE or port issues, ensure `PORT=8080` inside the container (set in Dockerfile) and `internal_port=8080` in `fly.toml`.
- SQLite file is persisted on the `data` volume; deploys will not wipe your data.
- GitHub Actions uses `flyctl deploy --remote-only` to build in Fly's infrastructure (faster, no local Docker needed).
- For multi-region or scale-to-many, consider moving to a managed database (e.g., Postgres with LiteFS) later.
