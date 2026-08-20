---
name: task-management
description: Manage social media team tasks using RADAAR's built-in Kanban-style task manager. Use when the user wants to create, assign, track, or organize tasks with boards, lists (columns), and cards (tasks). Supports creating boards, organizing with lists, and tracking work with cards.
---

# Task Management

Use RADAAR's task manager to organize and track team workflows with Kanban boards.

## Prerequisites

- Get `workspace_id` via `subscriptions_list` first. Use the `id` field (integer), NOT the `key` field (UUID).

## Available Tools

### Boards
- `task_manager_boards_list` — List all task boards.
- `task_manager_board_create` — Create a new board.
- `task_manager_board_update` — Rename a board.
- `task_manager_board_delete` — Delete a board and all its lists and cards (destructive).

### Lists (Columns)
- `task_manager_lists_list` — List all lists within a board. Requires `board_key`.
- `task_manager_list_create` — Create a new list in a board (e.g., "To Do", "In Progress", "Done").
- `task_manager_list_update` — Rename a list.
- `task_manager_list_delete` — Delete a list and all its cards.

### Cards (Tasks)
- `task_manager_cards_list` — List cards in a specific list. Requires `board_key` and `list_key`.
- `task_manager_card_create` — Create a new card with `name` and optional `body` (rich text description).
- `task_manager_card_update` — Update a card's name, body, or move it to a different list by providing a new `list_key`.
- `task_manager_card_delete` — Permanently delete a card.

## Workflow

1. Get `workspace_id` from `subscriptions_list`.
2. Create or list boards with `task_manager_boards_list` / `task_manager_board_create`.
3. Add lists with `task_manager_list_create` (e.g., "To Do", "In Progress", "Done").
4. Add task cards with `task_manager_card_create`.
5. Move cards between lists with `task_manager_card_update` (change `list_key`).
