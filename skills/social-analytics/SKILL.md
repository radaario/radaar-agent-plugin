---
name: social-analytics
description: Retrieve and analyze social media performance data from RADAAR. Use when the user wants analytics reports, performance metrics, engagement data, reach statistics, or insights about their social media channels. Covers Analytics Boards (CHANNEL and CUSTOM types), Sections, Widgets, and Data with predefined or custom date ranges.
---

# Social Analytics

Use RADAAR's analytics tools to measure social media performance and generate insights.

## Prerequisites

- Get `workspace_id` via `subscriptions_list` first. Use the `id` field (integer), NOT the `key` field (UUID).

## Available Tools

- `analytics_boards_list` — List analytics boards. Requires `type`: `CHANNEL` (pre-built per-channel dashboards) or `CUSTOM` (user-created dashboards).
- `analytics_sections_list` — List sections/tabs within a board. Requires `board_key` and `board_type`.
- `analytics_widgets_list` — List widgets (charts, metrics) within a section. Requires `board_key`, `board_type`, and `section_key`.
- `analytics_data_get` — Fetch actual data for a widget. Requires `board_key`, `board_type`, `section_key`, `widget_key`, and `date_range`.

## Date Range Options

`YESTERDAY`, `LAST_7_DAYS`, `LAST_14_DAYS`, `THIS_WEEK`, `LAST_WEEK`, `THIS_MONTH`, `LAST_MONTH`, `LAST_1_MONTHS`, `LAST_3_MONTHS`, `LAST_6_MONTHS`, `LAST_12_MONTHS`, or `CUSTOM` (with `since_at` and `until_at` in YYYY-MM-DD format).

## Workflow

1. Get `workspace_id` from `subscriptions_list`.
2. List boards with `analytics_boards_list` (specify CHANNEL or CUSTOM type).
3. Browse sections with `analytics_sections_list`.
4. Discover metrics with `analytics_widgets_list`.
5. Fetch data with `analytics_data_get` for the desired widget and date range.

## Tips

- Combine data from multiple widgets to build comprehensive performance reports.
- Use CHANNEL boards for per-platform analytics, CUSTOM boards for cross-platform views.
