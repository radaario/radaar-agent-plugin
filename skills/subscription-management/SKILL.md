---
name: subscription-management
description: Manage RADAAR account settings including subscriptions, brands, channels, team members, labels, integrations, custom domains, activity logs, invoices, sessions, and user profile. Use when the user wants to list subscriptions, configure their RADAAR subscription, manage team access, connect social channels, or review account activity. The subscriptions_list tool is required as a first step for almost all RADAAR operations.
---

# Account Management

Use RADAAR's settings tools to manage subscriptions, brands, channels, team, and subscription configuration.

## Key Concept

**Subscriptions** are called "Workspaces" internally. Always call `subscriptions_list` first to get the `workspace_id` (use the `id` integer field, NOT the `key` UUID field). If there's only one subscription, use it directly. If multiple, ask the user which one.

## Available Tools

### Subscriptions
- `subscriptions_list` — List all subscriptions. Returns `id` (integer — use as `workspace_id`) and `key` (UUID — do NOT use as `workspace_id`). This is the entry point for all other operations.

### User Profile
- `user_profile_get` — Get the authenticated user's profile. Use `user.id` (integer) for `user_id`, NOT `.key`.

### Brands
- `settings_brands_list` — List all brands.
- `settings_brand_create` — Create a brand with name, color, and optional members/channels/integrations/custom domains associations.
- `settings_brand_update` — Update brand name, color, or associations.
- `settings_brand_delete` — Delete a brand (associations are unlinked, not deleted).

### Channels
- `settings_channels_list` — List all connected social media channels (Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube, etc.). Each channel has a `features` array indicating capabilities (PUBLISHING_SCHEDULER, INBOX, MONITORING, ANALYTICS, etc.).
- `settings_channel_delete` — Disconnect a channel (destructive).

### Team Members
- `settings_members_list` — List all team members.
- `settings_member_invite` — Invite by email with role: DEFAULT (Power User), COMMUNITY_MANAGER, CONTENT_MANAGER, RESEARCHER, ANALYST, TECHNICAL_ADMIN, ACCOUNTANT, GUEST. Optional `expires_at`.
- `settings_member_update` — Update role, expiration, or activation status.
- `settings_member_delete` — Remove a member (destructive).

### Labels
- `settings_labels_list` — List all labels.
- `settings_label_create` — Create a label with name and color.
- `settings_label_update` — Update label name or color.
- `settings_label_delete` — Delete a label (unlinked from all items).

### Integrations
- `settings_integrations_list` — List third-party integrations (Canva, Google Drive, Dropbox, AI services, etc.).
- `settings_integration_delete` — Disconnect an integration (destructive).

### Custom Domains
- `settings_custom_domains_list` — List custom domains for branded short URLs.
- `settings_custom_domain_connect` — Connect a new domain (requires CNAME DNS setup).
- `settings_custom_domain_update` — Update domain URL.
- `settings_custom_domain_delete` — Remove a domain (existing short links stop working).

### Account Activity
- `settings_activity_logs_list` — Audit trail of all actions.
- `settings_sessions_list` — Active login sessions.
- `settings_invoices_list` — Billing invoices.

## Color Options

Available for brands and labels: `grey-salsa`, `red-soft`, `yellow-soft`, `blue-soft`, `green-soft`, `purple-soft`, `red-haze`, `yellow-haze`, `purple-studio`, `yellow-casablanca`, `red-flamingo`, `yellow`.
