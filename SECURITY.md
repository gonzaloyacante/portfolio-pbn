# Security Policy

## Supported Versions

Security fixes are applied to the active branches:

- `main` (production)
- `develop` (pre-production)

## Reporting a Vulnerability

If you discover a security issue, please report it privately.

- Preferred channel: GitHub Security Advisories (private report)
- Alternative: open a private communication channel with the maintainer

Please do **not** publish exploit details, credentials, or proof-of-concept code in public issues.

## Scope

This repository is public and includes a web platform (`web/`) and a Flutter admin app (`app/`).

Out of scope:

- Requests for private deployment credentials
- Social engineering attempts for infrastructure access
- Disclosure of environment variable values

## Secret Handling Rules

- Never commit `.env*`, service account files, keys, or certificates.
- Rotate credentials immediately if accidental exposure is suspected.
- Use Vercel Sensitive Environment Variables for production/preview secrets.
