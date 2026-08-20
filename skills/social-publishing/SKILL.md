---
name: social-publishing
description: Create, schedule, duplicate, and manage social media posts across multiple platforms using RADAAR. Use when the user wants to publish content, schedule posts for later, manage post media and links, or work with the content pool. Covers Scheduler Posts and Pool Content operations including threads, polls, per-platform variations, and media attachments.
---

# Social Publishing

Use RADAAR's publishing tools to create and schedule social media posts across connected platforms.

## Prerequisites

- Get `workspace_id` via `subscriptions_list` first. Use the `id` field (integer), NOT the `key` field (UUID).
- Get available channels via `settings_channels_list`. Only channels with `PUBLISHING_SCHEDULER` in their features can be used.
- Date/time format: `YYYY-MM-DD HH:mm:ss` (UTC by default).

## Available Tools

### Scheduler Posts
- `publishing_scheduler_posts_list` — List/filter scheduled posts by status (DRAFT, SCHEDULED, PUBLISHED, ERROR), content type, channels, brands, labels, date range.
- `publishing_scheduler_post_create` — Create a new post as draft. Supports content types: SINGLE_IMAGE, PHOTO_ALBUM, CAROUSEL, VIDEO, REEL, STORY, TEXT, POLL, LINK. Supports per-platform `content_variations`, `floods` (threads), and `poll` config.
- `publishing_scheduler_post_update` — Update an existing post's content, channels, schedule time, or workflow status.
- `publishing_scheduler_post_schedule` — Move a draft post to SCHEDULED status for automated publishing.
- `publishing_scheduler_post_duplicate` — Clone a post to scheduler or content pool (`target_service`: PUBLISHING_SCHEDULER or PUBLISHING_POOL).
- `publishing_scheduler_post_delete` — Permanently delete a post (irreversible).
- `publishing_scheduler_post_media_file_upload` — Attach media via public URLs. Specify `group_type` (SINGLE_IMAGE, PHOTO_ALBUM, CAROUSEL, VIDEO, REEL, STORY).
- `publishing_scheduler_post_media_file_update` — Replace a specific media attachment by `media_key`.
- `publishing_scheduler_post_media_delete` — Remove a media attachment by `media_key`.
- `publishing_scheduler_post_media_link_add` — Attach a clickable website URL to a post.
- `publishing_scheduler_post_media_link_update` — Change the URL of an attached link.

### Content Pool
- `publishing_pool_contents_list` — List/filter pool content by type, status (DRAFT, APPROVED, PUBLISHED), brands, labels, favorites.
- `publishing_pool_content_create` — Save new content to the pool. Same content options as scheduler (variations, floods, poll).
- `publishing_pool_content_update` — Edit existing pool content.
- `publishing_pool_content_duplicate` — Clone to pool or scheduler.
- `publishing_pool_content_delete` — Permanently delete pool content.
- `publishing_pool_content_media_file_upload` — Attach media files via URLs.
- `publishing_pool_content_media_file_update` — Replace a specific media file.
- `publishing_pool_content_media_delete` — Remove a media attachment.
- `publishing_pool_content_media_link_add` — Attach a website URL.
- `publishing_pool_content_media_link_update` — Update an attached link URL.

### Best Times
- `publishing_utilities_best_times_to_post_list` — Get optimal posting times based on audience engagement. Accepts optional `timezone` (IANA format).

## Workflow

1. Get `workspace_id` from `subscriptions_list`.
2. Check best times with `publishing_utilities_best_times_to_post_list`.
3. Create a post with `publishing_scheduler_post_create` (saves as draft).
4. Attach media with `publishing_scheduler_post_media_file_upload` or link with `publishing_scheduler_post_media_link_add`.
5. Schedule with `publishing_scheduler_post_schedule`.

## Important Notes

- If a caption exceeds a platform's character limit, use `content_variations` to write platform-specific versions.
- For Twitter threads, use the `floods` array with each item as a separate thread post.
- For polls, set `content_type` to POLL and provide the `poll` object with question, duration, and 2-4 options.
- Media files are uploaded via public URLs — the server fetches and stores them.
