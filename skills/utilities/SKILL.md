---
name: utilities
description: Generate and discover content for social media posts using RADAAR's creative tools. Use when the user needs hashtag suggestions, caption templates, AI-generated images, stock photos or videos, web content extraction, Google search (web and image), or URL screenshots. Covers Hashtags, Captions, AI Image generation, Stock Library (Unsplash, Pexels, Pixabay, Giphy, etc.), and web utilities.
---

# Content Tools

Use RADAAR's content tools to research, generate, and enhance social media content.

## Prerequisites

- Get `workspace_id` via `subscriptions_list` first. Use the `id` field (integer), NOT the `key` field (UUID).
- For AI image generation, get integration key from `settings_integrations_list`. Only integrations with `UTILITIES_AI_ASSISTANT_TEXT_TO_IMAGE` in features can be used.

## Available Tools

### Hashtags
- `publishing_utilities_hashtags_search` — Search hashtags by keyword.
- `publishing_utilities_hashtags_relateds` — Find related hashtags for a given keyword.
- `publishing_utilities_hashtags_top` — Get trending/top hashtags.
- `publishing_utilities_hashtags_templates_list` — List saved hashtag template groups.

### Captions
- `publishing_utilities_caption_templates_list` — List saved caption templates.

### AI & Media
- `utilities_ai_assistant_image_generate` — Generate images from text prompts. Requires `integration_key` with `UTILITIES_AI_ASSISTANT_TEXT_TO_IMAGE` feature. Supports generating multiple images (`n` parameter).
- `utilities_stock_library_search_images` — Search stock images. Providers: UNSPLASH_COM, PEXELS_COM, PIXABAY_COM, GIPHY_COM, KLIPY_COM, IMGUR_COM, LEXICA_ART.
- `utilities_stock_library_search_videos` — Search stock videos. Providers: PEXELS_COM, PIXABAY_COM, GIPHY_COM, KLIPY_COM, IMGUR_COM.

### Web Utilities
- `utilities_google_search` — Google search for web pages or images. Supports `type` (WEB, IMAGE) and image-specific filters (image_type, image_size).
- `utilities_url_fetch` — Extract content from a URL.
- `utilities_screenshot_get` — Capture a screenshot of a webpage.

## Workflow

1. Research topics with `utilities_google_search` or `publishing_utilities_hashtags_top`.
2. Find hashtags with `publishing_utilities_hashtags_search` or `publishing_utilities_hashtags_relateds`.
3. Use `publishing_utilities_caption_templates_list` for proven caption formats.
4. Generate visuals with `utilities_ai_assistant_image_generate` or find stock media.
5. Use `utilities_url_fetch` to extract article content for post inspiration.
