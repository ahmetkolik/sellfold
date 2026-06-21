# Claysign

**Proposals to paid, without the chase.** Claysign turns a proposal into a
signed contract and a paid invoice — one flow for freelancers and agencies,
with e-signatures, deposits and reminders built in.

## Quick start

```bash
npm install
npm run dev          # → http://localhost:3000  (demo mode, no keys needed)
```

## Make it yours

Open this folder in **Claude Code** and say **"set up this project"** (or run
**`/setup`**). It collects your brand, colors, and your **Stripe** + **Resend**
keys, then wires them in. By hand? See [`SETUP.md`](./SETUP.md).

## What it needs (all optional — demo mode works with none)

| Integration | Powers |
|---|---|
| **Stripe** (`STRIPE_SECRET_KEY`) | Deposits & invoice payments |
| **Resend** (`RESEND_API_KEY`) | Sending proposals, contracts, invoices, reminders |
| **Supabase** | Stores clients, proposals, contracts & invoices |

## Pages

`Proposals` (pipeline & dashboard) · `Contracts` (signature status) · `Invoices`
(table + invoice builder) · `Clients` (book of business) · `Settings`.

Built on the GoatStarter template — Next.js 16 · React 19 · Tailwind v4.
