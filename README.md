# RADAAR Agent Plugin

A portable [Agent Plugin](https://agent-plugins.org) for the [RADAAR](https://www.radaar.io) social media management platform. Conforms to the Agent Plugins Specification v1.0.0.

## Overview

This plugin connects AI agents to RADAAR's MCP server, enabling social media management through natural language. It provides both an MCP server configuration and Agent Skills that guide agents through common workflows.

## Structure

```
radaar/
├── plugin.json                          # Plugin manifest (v26.8.20)
├── mcp.json                             # MCP server config (streamable-http)
├── skills/
│   ├── subscription-management/SKILL.md # Subscriptions, brands, channels, team, settings
│   ├── social-inbox/SKILL.md            # Conversations, messages, contacts
│   ├── social-media-monitoring/SKILL.md # Keyword & brand monitoring
│   ├── social-media-publishing/SKILL.md  # Post creation, scheduling, content pool
│   ├── social-media-analytics/SKILL.md   # Performance analytics & reporting
│   ├── link-management/SKILL.md         # URL shortener with custom domains
│   ├── task-management/SKILL.md         # Kanban boards, lists, cards
│   └── utilities/SKILL.md                # Hashtags, AI images, stock media, web tools

├── LICENSE
└── README.md
```

## MCP Server

The plugin connects to RADAAR's remote MCP server via Streamable HTTP:

- **URL:** `https://mcp.radaar.io`
- **Transport:** `streamable-http`
- **Auth:** OAuth 2.0 or API Key

## Skills

| Skill | Description |
|---|---|
| `social-media-publishing` | Create, schedule, and manage posts with media, threads, polls, and per-platform variations |
| `social-media-analytics` | Retrieve performance data from channel and custom analytics boards |
| `social-inbox` | Manage conversations, messages, and contacts across DMs, comments, mentions |
| `social-media-monitoring` | Track keywords and brand mentions with language filtering and sentiment |
| `utilities` | Hashtags, captions, AI image generation, stock media, Google search, web scraping |
| `task-management` | Kanban boards with lists and cards for team task tracking |
| `link-management` | URL shortener with custom domains and branded slugs |
| `subscription-management` | Subscriptions, brands, channels, team members, labels, integrations, domains |

## Available Tools (80+)

| Category | Tools |
|---|---|
| **Subscriptions** | List subscriptions, get user profile |
| **Publishing** | Create/update/schedule/duplicate/delete posts; media upload/update/delete; links; content pool; best times |
| **Analytics** | Boards (channel & custom), sections, widgets, data with date ranges |
| **Inbox** | Conversations, messages (send/like/hide/delete), contacts |
| **Monitoring** | Queries (create/update/delete with language filters), results (sentiment, labels, assign) |
| **Content** | Hashtag search/related/top/templates, caption templates, AI image generation, stock images & videos |
| **Tasks** | Boards, lists (columns), cards (tasks) — full CRUD |
| **Links** | URL shortener with custom domains and suffixes |
| **Settings** | Brands, channels, team members, labels, integrations, custom domains, activity logs, sessions, invoices |
| **Utilities** | Google search (web & image), URL fetch, URL screenshot |

## Authentication

RADAAR's MCP server supports two authentication methods. Credentials are managed on the RADAAR dashboard under **[My Account → Credentials](https://dash.radaar.io/v2/user/credentials)**.

### API Key (Recommended)

The simplest way to connect. The API key is sent as a Bearer token in the `Authorization` header. See [`mcp.example_for_api_key.json`](mcp.example_for_api_key.json) for a ready-to-use config example.

1. Log in to [RADAAR](https://dash.radaar.io/).
2. Go to **[My Account → Credentials](https://dash.radaar.io/v2/user/credentials)**.
3. Click **New** and create an **API Key**.
4. Copy the key and configure it in your AI client (see [Client Setup](#client-setup) below).

### OAuth 2.0

For clients that support OAuth 2.0 (e.g., Claude). RADAAR's MCP server supports [RFC 8414](https://datatracker.ietf.org/doc/html/rfc8414) OAuth metadata discovery — compatible clients will automatically discover the authorization flow.

1. Log in to [RADAAR](https://dash.radaar.io/).
2. Go to **[My Account → Credentials](https://dash.radaar.io/v2/user/credentials)**.
3. Click **New** and create an **OAuth 2.0 Client**.
4. Copy the **Client ID** and **Secret Key**.
5. Configure them in your AI client (see [Client Setup](#client-setup) below).

> Authentication is handled by the MCP client at connection time per the Agent Plugins specification. Credentials are not stored in the plugin configuration.

## Client Setup

### Claude (Web, Desktop & Code)

Claude supports OAuth 2.0 natively via Connectors.

1. Go to **Settings → Connectors** in your Claude account.
2. Click **Add → Add Custom Connector**.
3. Enter a name and set the MCP address to `https://mcp.radaar.io`.
4. Enter the **Client ID** and **Secret Key** from your RADAAR OAuth 2.0 credentials.
5. Click **Add**, then **Connect** and authorize on the RADAAR page.
6. Click **Refresh Tools List** if tools haven't loaded, then allow access to all tools.

> **Note:** Once connected on any Claude product (Web, Desktop, or Code), it works across all of them.

### VS Code / GitHub Copilot

Add to your VS Code settings (`.vscode/mcp.json` or user settings):

```json
{
  "servers": {
    "radaar": {
      "type": "streamable-http",
      "url": "https://mcp.radaar.io",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Replace `YOUR_API_KEY` with your RADAAR API key.

### Cursor

Add to your Cursor MCP settings (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "radaar": {
      "type": "streamable-http",
      "url": "https://mcp.radaar.io",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### Windsurf

Add to your Windsurf MCP configuration (`~/.windsurf/mcp.json`):

```json
{
  "mcpServers": {
    "radaar": {
      "type": "streamable-http",
      "url": "https://mcp.radaar.io",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### ChatGPT (Web, Desktop & Codex)

1. Sign in to your RADAAR account, go to **[My Account → Credentials](https://dash.radaar.io/v2/user/credentials)**, click **New** and create an **OAuth 2.0 Client**. Copy the generated client ID and secret key.
2. In your ChatGPT account, go to **Settings → Plugins**, enable **Developer Mode**, then click **Browse Plugins → New Plugin**.
3. Name your plugin, enter `https://mcp.radaar.io` as the connection URL.
4. Click **Advanced OAuth Settings** and paste the client ID and secret key into the matching fields. Check the box and click **Create**.
5. Click **Sign In with RADAAR** and hit **Connect** on the page that pops up.
6. If you don't see "Connected" status right away, refresh your ChatGPT page. Grant all permissions for your new plugin and click **Refresh** if the action list hasn't loaded yet.

Start a new chat, enable your plugin, and tell it what you want — e.g. *"Prepare a post praising London for tomorrow at 2 PM, find a suitable image, and schedule it for my Facebook, Instagram, and X accounts."*

To disconnect, delete the plugin on ChatGPT's end and optionally delete the OAuth 2.0 Client in RADAAR.

> **Note:** Once added to ChatGPT web, the plugin is also available in ChatGPT Desktop and Codex. Just restart those apps to see it.

### Grok

1. Sign in to your RADAAR account, go to **[My Account → Credentials](https://dash.radaar.io/v2/user/credentials)**, click **New** and create an **OAuth 2.0 Client**. Copy the generated client ID and secret key.
2. In Grok, go to **Settings → MCP Servers** and add a new server.
3. Enter `https://mcp.radaar.io` as the URL.
4. Select **OAuth 2.0** as the authentication method and paste your client ID and secret key.
5. Complete the authorization flow when prompted.

## License

[MIT](LICENSE)
