# RADAAR plugin for OpenClaw

Social media management from inside OpenClaw — publish, schedule, analyze
performance, manage inbox conversations, monitor keywords, shorten links,
manage tasks, and more.

## Install

```bash
openclaw plugins install clawhub:radaar
openclaw plugins enable radaar
openclaw gateway restart
```

Then add your API key:

```json5
{
  plugins: {
    entries: {
      "radaar": {
        enabled: true,
        config: { apiKey: "YOUR_API_KEY" }
      }
    }
  }
}
```

## Tools

94 tools across 8 categories, all forwarded to RADAAR's MCP server:

| Category | Examples |
|---|---|
| **Account & Settings** | `subscriptions_list`, `settings_channels_list`, `settings_members_list` |
| **Publishing** | `publishing_scheduler_post_create`, `publishing_scheduler_post_schedule`, `publishing_pool_content_create` |
| **Analytics** | `analytics_boards_list`, `analytics_data_get` |
| **Inbox** | `inbox_conversations_list`, `inbox_conversation_message_send` |
| **Monitoring** | `monitoring_query_create`, `monitoring_results_list` |
| **Link Management** | `utilities_url_shortener_link_create` |
| **Content Tools** | `publishing_utilities_hashtags_search`, `utilities_stock_library_search_images`, `utilities_ai_assistant_image_generate` |
| **Task Management** | `task_manager_board_create`, `task_manager_card_create` |

### Typical workflow

1. `subscriptions_list` — get your workspace id.
2. `settings_channels_list` — see connected social channels.
3. `publishing_utilities_best_times_to_post_list_according_to_timezone` — find optimal posting times by timezone.
4. `publishing_utilities_best_times_to_post_list_according_to_channel` — find optimal posting times by channel.
5. `publishing_scheduler_post_create` — create a draft post.
6. `publishing_scheduler_post_media_file_upload` — attach media.
7. `publishing_scheduler_post_schedule` — schedule it.

## Architecture

Unlike REST-based plugins, this plugin bridges OpenClaw to RADAAR's
**MCP (Model Context Protocol) streamable-http** server at `mcp.radaar.io`.
Each tool call is forwarded as an MCP `tools/call` JSON-RPC request.
Parameter validation is handled by the MCP server.

## Notes for anyone building an OpenClaw plugin

Three things the published SDK docs get wrong, each found by building against
OpenClaw's own type definitions and then actually installing the result:

1. `registerTool` takes a SINGLE object, not `({id, inputSchema}, {handler})`.
   Its `parameters` field is a **TypeBox** schema, not JSON Schema.
2. `definePluginEntry` requires `id`, `name` and `description` alongside
   `register`. The docs example passes `register` alone and does not compile.
3. `package.json` must contain `openclaw.extensions` pointing at the built
   entry, for example `["./dist/index.js"]`. This appears nowhere in the SDK
   docs and only surfaces as an install-time error.

## Develop

```bash
npm install
npm run build
openclaw plugins install --link . --force --accept-capabilities
openclaw plugins inspect radaar --runtime --json
```

MIT licensed. Source: [radaar/agent-plugin](https://github.com/radaar/agent-plugin)
