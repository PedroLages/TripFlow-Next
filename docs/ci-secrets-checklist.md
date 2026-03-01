# CI Secrets Configuration Checklist

## Overview

This document lists all required secrets and environment variables for the TripFlow CI/CD pipeline.

## Current Status

✅ **No secrets required** - The test pipeline runs entirely with public code and local test data.

## Future Secrets (When Needed)

### External Service Integration

If you add external service dependencies in the future, configure these secrets in GitHub:

**Location**: Repository Settings → Secrets and variables → Actions → New repository secret

| Secret Name | Purpose | When Needed | How to Get |
|-------------|---------|-------------|------------|
| `SUPABASE_URL` | Supabase API URL | When E2E tests need real database | Supabase dashboard → Project Settings → API |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | When E2E tests need real database | Supabase dashboard → Project Settings → API |
| `PERCY_TOKEN` | Visual regression testing | Already configured in percy.yml | Percy dashboard → Project Settings |

### Contract Testing Secrets

If you implement contract testing with Pact:

| Secret Name | Purpose | How to Get |
|-------------|---------|------------|
| `PACT_BROKER_BASE_URL` | Pact Broker URL | Your Pact Broker instance or PactFlow |
| `PACT_BROKER_TOKEN` | Authentication token | Pact Broker → Settings → API Tokens |

## Configuring Secrets

### GitHub Actions

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name (exactly as listed above)
5. Paste the secret value
6. Click **Add secret**

### Environment Variables (Non-Secret)

These can be added directly to the workflow file:

```yaml
env:
  NODE_VERSION: 24
  CI: true
```

Current environment variables are already configured in `.github/workflows/test.yml`.

## Verification

### Check if secrets are set correctly:

1. Go to **Actions** tab in GitHub
2. Click on any workflow run
3. Expand a job that uses secrets
4. Look for `***` in place of secret values (means it's working)

### Testing locally with secrets:

1. Create `.env.test.local` in `tripflow-next/` (gitignored)
2. Add secrets:
   ```bash
   SUPABASE_URL=your_url_here
   SUPABASE_ANON_KEY=your_key_here
   ```
3. Playwright will automatically load from `.env.test.local`

## Security Best Practices

✅ **Never commit secrets to git**
- Use `.gitignore` for `.env*` files
- Use GitHub Secrets for CI/CD
- Rotate secrets if accidentally committed

✅ **Use least-privilege access**
- Supabase: Use `anon` key for tests (not `service_role`)
- Pact Broker: Read/write access only

✅ **Separate environments**
- Use different secrets for test/staging/production
- Don't use production credentials in tests

## Troubleshooting

### Secret not found error in CI

```
Error: Secret SUPABASE_URL not found
```

**Solution**: Add the secret in GitHub Settings → Secrets and variables → Actions

### Secret value looks wrong

**Solution**: Secrets are **exact** - no trailing spaces, newlines, or quotes unless intended

### Tests work locally but fail in CI

**Solution**: Ensure the secret is configured in GitHub (not just your local `.env` file)

## Current Configuration

**Test Data Source**: All tests use mock data and local fixtures
**External Services**: None (Percy visual tests run in separate workflow)
**Authentication**: Not required for current test suite

## When to Update This Document

Update this checklist when:
- Adding new external service integrations
- Implementing contract testing
- Adding API testing with real endpoints
- Deploying to staging/production environments

## References

- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Playwright Environment Variables](https://playwright.dev/docs/test-configuration#environment-variables)
- [Pact Broker Authentication](https://docs.pact.io/pact_broker/administration/authentication)
