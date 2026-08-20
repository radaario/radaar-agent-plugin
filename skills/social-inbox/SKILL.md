---
name: social-inbox
description: Manage social media inbox conversations, messages, and contacts through RADAAR. Use when the user wants to read, reply to, or manage direct messages, comments, mentions, reviews, or SMS conversations. Supports filtering by folder, type, channel, priority, labels, and assigned users. Covers Inbox Conversations, Messages, and Contacts.
---

# Social Inbox

Use RADAAR's unified inbox to manage all social media conversations in one place.

## Prerequisites

- Get `workspace_id` via `subscriptions_list` first. Use the `id` field (integer), NOT the `key` field (UUID).
- Get channels with `settings_channels_list`. Only channels with `INBOX` in their features can be used for inbox filtering.

## Available Tools

### Conversations
- `inbox_conversations_list` — List conversations with filters: folder (all, pending, favorited, archived, muted, replied, deleted), types (message, sms, post, comment, review, mention), channels, priority (1=Urgent to 5=Not Important), labels, assigned users, date range, search.
- `inbox_conversation_update` — Update priority, labels, assigned users, followers, sentiment rate (1=Positive, 0=Neutral, -1=Negative), is_reviewed, is_favorited, is_muted, status (0=Inbox, -1=Archived, -2=Deleted).
- `inbox_conversation_delete_permanently` — Permanently delete a conversation (irreversible).

### Messages
- `inbox_conversation_messages_list` — List all messages within a conversation.
- `inbox_conversation_message_send` — Send a reply. Supports threaded replies via `parent_key` (only if parent has `ch_can_reply = true`).
- `inbox_conversation_message_update` — Like/unlike (`is_liked`, requires `ch_can_like`), hide/unhide (`is_hided`, requires `ch_can_hide`), or delete (`is_deleted`, requires `ch_can_delete`).

### Contacts
- `inbox_contacts_list` — List contacts with filters: folder (all, touched, untouched, favorited, blocked, deleted), channels, labels, order_by (name, received_at), search.
- `inbox_contact_update` — Update labels, is_favorited, is_blocked (requires `ch_can_block`), is_deleted.

## Workflow

1. Get `workspace_id` from `subscriptions_list`.
2. List conversations with `inbox_conversations_list` to see pending messages.
3. Read messages with `inbox_conversation_messages_list`.
4. Reply with `inbox_conversation_message_send`.
5. Update status with `inbox_conversation_update` (e.g., archive, assign, label).
