# Property Management Platform — a Zite Template

**Built by [Prospect Automations](https://prospectautomations.com) · Powered by [Zite](https://zite.com)**

---

## What is this?

This is a **ready-to-use, white-label template for property management companies.** It gives any property manager (residential, single-family, multifamily, or mixed portfolios) a full operating system: a back-office dashboard for your team **and** a branded portal for your tenants, owners, applicants, and vendors.

It runs entirely on **Zite** as the backend. Zite provides the database, user sign-in, server logic, file storage, email, and hosting, so there are no servers to manage and no separate database to set up.

> **In one sentence:** clone this template, add your company name, logo and colours, connect your accounts (Stripe, email, AI), and you have your own property management software and tenant portal.

---

## Who it's for

| Audience | What they get |
|---|---|
| **Property management companies** | A complete internal dashboard to run the business |
| **Tenants / residents** | A self-service portal to pay rent, request repairs, sign leases, and message the office |
| **Property owners** | An owner portal with statements, cash flow, documents, and approvals |
| **Rental applicants** | Public listings plus an online application with fee payment |
| **Vendors / contractors** | A vendor portal for work orders, invoices, and payment status |

---

## What's included

The workspace contains **two apps** that share one database.

### 1. Dashboard (internal, for your team)
`apps/dashboard`

- **Portfolio:** properties, units, owners, and bulk unit generation
- **Leasing:** listings, vacancies, leads and inquiries, showings, applications with a screening checklist, and approve/deny decisions
- **Leases:** new leases, renewals, move-outs, recurring charges, and security deposit settlement
- **Residents:** tenant profiles, ledgers, documents, and history
- **Maintenance:** work orders (list, board and saved views), vendors, inspections with walkthroughs and PDF reports, and preventive maintenance schedules
- **Accounting:** full double-entry books, including the chart of accounts, receivables, payables and bill pay, banking, reconciliation, journal entries, owner contributions and distributions, and management fees
- **Reports:** rent roll, income statement, balance sheet, cash flow, trial balance, general ledger, aging, occupancy, vacancy, lease expirations, deposits, leasing funnel, vendor spend, work orders, and owner statements, all exportable to PDF and CSV
- **Communications:** a unified inbox, resident/owner/vendor messaging, announcements (including scheduled ones), and email templates
- **Tasks, notifications, a command palette (⌘K), and keyboard shortcuts**
- **Settings:** organization branding, team members and roles, rent and late fees, leasing rules, portal options, and automations

### 2. Property Portal (external, for tenants and everyone outside your team)
`apps/property-portal`

- **Public site:** browse available homes, photo galleries, inquiry forms, and an online rental application with autosave and application fee payment
- **Tenant Portal:** home overview, pay rent online, payment history and receipts, lease details and e-signing, renewals and notices to vacate, maintenance requests with photos and ratings, documents, and messages
- **Owner Portal:** portfolio overview, property performance, cash-flow charts, monthly statements (PDF), documents, messages, and approval of repairs or expenses
- **Vendor Portal:** assigned work orders, status updates, invoice submission, payment history, and a profile with insurance/W-9 uploads

Sign-in uses an emailed one-time code or Google. Each person sees only their own data.

---

## Integrations

| Integration | What it's used for |
|---|---|
| **Zite Database** | All data: properties, leases, ledgers, work orders, messages, and more |
| **Zite Auth** | Sign-in for tenants, owners, applicants and vendors (email code and Google) |
| **Email** (Zite email, Gmail, Outlook or SMTP) | Sign-in codes, rent reminders, late notices, announcements, receipts, and notifications |
| **Stripe** | Online rent payments and application fees, paid straight into your own Stripe account |
| **Anthropic (Claude AI)** | AI-written listing descriptions and automatic work-order triage |
| **PDF generation** | Owner statements, reports, inspection reports, and receipts |
| **File uploads** | Photos, leases, IDs, invoices, and insurance documents |
| **Scheduled jobs** | Recurring charges, late fees, scheduled announcements, and maintenance schedules |

---

## Getting started

1. **Clone the template** into your own Zite workspace.
2. **Brand it.** In the Dashboard, open **Settings → Organization** and set your company name, logo, and brand colour. The portal picks these up automatically.
3. **Connect your accounts:**
   - **Email:** used to send sign-in codes and notifications
   - **Stripe:** add your keys in Settings to accept online rent payments
   - **Anthropic:** optional, turns on the AI features
4. **Load your data.** Add properties, units, owners and tenants, or start from the built-in **sample data** (Settings → Demo data) to explore first.
5. **Invite your team** from Settings → Team, then **publish** both apps.

---

## Project structure

```
apps/
  dashboard/         Internal staff dashboard (React + Zite endpoints)
  property-portal/   Public site + Tenant, Owner, Applicant and Vendor portals
packages/
  components/        Shared UI component library (shadcn/ui)
  shared/            Shared business logic: ledger, money, dates, email, settings
zite.config.json     Workspace-level integrations
```

**Tech stack:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and ZiteJS (database, auth, endpoints, email, PDF, schedules).

---

## About

This template was created by **Prospect Automations** so property management companies can launch modern, fully featured software on Zite in days instead of months.

For setup help, customization, or a fully managed rollout, contact **Prospect Automations**. Email: sean@prospectautomations.com
