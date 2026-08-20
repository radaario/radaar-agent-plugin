---
name: social-media-monitoring
description: Monitor social media for keywords, brand mentions, and competitor activity using RADAAR. Use when the user wants to track keywords, monitor brand mentions, analyze sentiment, or watch competitor activity across social platforms. Supports language filtering, excluded/banned keywords, and result management with labels, assignments, and sentiment ratings.
---

# Social Monitoring

Use RADAAR's monitoring tools to track keywords, brand mentions, and industry trends.

## Prerequisites

- Get `workspace_id` via `subscriptions_list` first. Use the `id` field (integer), NOT the `key` field (UUID).
- Get channels with `settings_channels_list`. Only channels with `MONITORING` in their features can be used.

## Available Tools

### Monitoring Queries
- `monitoring_queries_list` — List all monitoring queries. Supports search filtering.
- `monitoring_query_create` — Create a new query with keyword, channel keys, optional excluded/banned keywords, and language filter (en, tr, de, fr, es, it, nl, ru, zh, iw, ko).
- `monitoring_query_update` — Update keyword, channels, exclusions, banned words, or languages.
- `monitoring_query_delete` — Delete a query. Optional `with_results` flag to also delete associated results.

### Monitoring Results
- `monitoring_results_list` — List results with filters: folder (all, pending, favorited, archived, deleted), queries, channels, labels, assigned users, date range, search.
- `monitoring_result_update` — Update labels, assigned users, sentiment rate (1=Positive, 0=Neutral, -1=Negative), is_reviewed, is_favorited, is_muted, status (0=Inbox, -1=Archived, -2=Deleted).
- `monitoring_result_delete_permanently` — Permanently delete a result (irreversible).

## Workflow

1. Get `workspace_id` from `subscriptions_list`.
2. List existing queries with `monitoring_queries_list` or create one with `monitoring_query_create`.
3. Retrieve results with `monitoring_results_list`.
4. Review and manage results with `monitoring_result_update`.
