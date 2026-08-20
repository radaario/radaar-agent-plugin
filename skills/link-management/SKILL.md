---
name: link-management
description: Create and manage shortened URLs using RADAAR's URL shortener. Use when the user wants to shorten links, track link clicks, manage branded short URLs, or use custom domains for social media posts. Supports custom suffixes and custom domains.
---

# Link Management

Use RADAAR's URL shortener to create trackable short links for social media.

## Prerequisites

- Get `workspace_id` via `subscriptions_list` first. Use the `id` field (integer), NOT the `key` field (UUID).
- For custom domains, get domain keys from `settings_custom_domains_list`.

## Available Tools

- `utilities_url_shortener_links_list` — List all shortened URLs. Supports pagination and search.
- `utilities_url_shortener_link_create` — Create a short link. Options: `custom_domain_key` (DEFAULT or a custom domain key), `custom_suffix` (custom slug), `name` (label).
- `utilities_url_shortener_link_update` — Update URL, name, domain, or suffix.
- `utilities_url_shortener_link_delete` — Permanently delete a short link (stops redirecting immediately).

## Workflow

1. Get `workspace_id` from `subscriptions_list`.
2. Create a short link with `utilities_url_shortener_link_create`.
3. Optionally use a custom domain and suffix for branded links.
4. List and manage links with `utilities_url_shortener_links_list`.
