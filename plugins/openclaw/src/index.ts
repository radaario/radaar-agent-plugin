import { Type } from "@sinclair/typebox";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { jsonResult } from "openclaw/plugin-sdk/tool-results";

// RADAAR plugin for OpenClaw.
//
// Bridges RADAAR's MCP (streamable-http) server into OpenClaw tools.
// Every tool forwards its call to the MCP endpoint at mcp.radaar.io,
// so parameter schemas are intentionally open — the MCP server validates.

const DEFAULT_MCP_URL = "https://mcp.radaar.io";

type PluginConfig = { apiKey?: string; baseUrl?: string };

function readConfig(api: any): PluginConfig {
  return (api?.config?.plugins?.entries?.["radaar"]?.config ?? {}) as PluginConfig;
}

// ── MCP streamable-http client ───────────────────────────────

let sessionId: string | undefined;
let initDone = false;

async function mcpPost(
  url: string,
  apiKey: string,
  body: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
    Authorization: `Bearer ${apiKey}`,
  };
  if (sessionId) headers["Mcp-Session-Id"] = sessionId;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal,
  });

  const sid = res.headers.get("mcp-session-id");
  if (sid) sessionId = sid;

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RADAAR MCP ${res.status}: ${text}`);
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("text/event-stream")) {
    const text = await res.text();
    for (const line of text.split("\n").reverse()) {
      if (line.startsWith("data: ")) {
        const msg = JSON.parse(line.slice(6));
        if (msg.error) throw new Error(JSON.stringify(msg.error));
        return msg.result ?? msg;
      }
    }
    return null;
  }

  const json = await res.json();
  if (json.error) throw new Error(JSON.stringify(json.error));
  return json.result ?? json;
}

async function ensureInit(cfg: PluginConfig): Promise<void> {
  if (initDone) return;
  if (!cfg.apiKey) {
    throw new Error(
      "No RADAAR API key configured. Set plugins.entries.radaar.config.apiKey — get your key at https://dash.radaar.io/v2/user/credentials",
    );
  }
  const url = cfg.baseUrl || DEFAULT_MCP_URL;
  await mcpPost(url, cfg.apiKey, {
    jsonrpc: "2.0",
    id: "init",
    method: "initialize",
    params: {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "radaar-openclaw", version: "1.0.0" },
    },
  });
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${cfg.apiKey}`,
  };
  if (sessionId) headers["Mcp-Session-Id"] = sessionId;
  await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
  });
  initDone = true;
}

async function callTool(
  cfg: PluginConfig,
  name: string,
  args: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<any> {
  await ensureInit(cfg);
  return mcpPost(
    cfg.baseUrl || DEFAULT_MCP_URL,
    cfg.apiKey!,
    {
      jsonrpc: "2.0",
      id: `${name}-${Date.now()}`,
      method: "tools/call",
      params: { name, arguments: args },
    },
    signal,
  );
}

// Parameters forwarded to MCP as-is; the server validates.
const Params = Type.Unsafe<Record<string, unknown>>({ type: "object" });

interface ToolDef {
  name: string;
  label: string;
  desc: string;
  snippet?: string;
  guidelines?: string[];
}

const TOOLS: ToolDef[] = [
  // ── Account & Settings ─────────────────────────────────────
  { name: "subscriptions_list", label: "List workspaces", desc: "List subscriptions. Returns workspace_id (the id integer, NOT key UUID) needed by every other tool." },
  { name: "user_profile_get", label: "User profile", desc: "Get the authenticated user's profile. Use user.id (integer) for user_id." },
  { name: "settings_brands_list", label: "List brands", desc: "List all brands in the workspace." },
  { name: "settings_brand_create", label: "Create brand", desc: "Create a brand with name, color, and optional member/channel associations." },
  { name: "settings_brand_update", label: "Update brand", desc: "Update brand name, color, or associations." },
  { name: "settings_brand_delete", label: "Delete brand", desc: "Delete a brand (associations are unlinked, not deleted)." },
  { name: "settings_channels_list", label: "List channels", desc: "List connected social channels with their features array (PUBLISHING_SCHEDULER, INBOX, MONITORING, ANALYTICS)." },
  { name: "settings_channel_delete", label: "Delete channel", desc: "Disconnect a social channel." },
  { name: "settings_members_list", label: "List members", desc: "List all team members." },
  { name: "settings_member_invite", label: "Invite member", desc: "Invite by email with role: DEFAULT, COMMUNITY_MANAGER, CONTENT_MANAGER, RESEARCHER, ANALYST, TECHNICAL_ADMIN, ACCOUNTANT, GUEST." },
  { name: "settings_member_update", label: "Update member", desc: "Update member role, expiration, or activation status." },
  { name: "settings_member_delete", label: "Delete member", desc: "Remove a team member." },
  { name: "settings_labels_list", label: "List labels", desc: "List all labels." },
  { name: "settings_label_create", label: "Create label", desc: "Create a label with name and color." },
  { name: "settings_label_update", label: "Update label", desc: "Update label name or color." },
  { name: "settings_label_delete", label: "Delete label", desc: "Delete a label." },
  { name: "settings_integrations_list", label: "List integrations", desc: "List third-party integrations (Canva, Google Drive, AI services, etc.)." },
  { name: "settings_integration_delete", label: "Delete integration", desc: "Disconnect an integration." },
  { name: "settings_custom_domains_list", label: "List custom domains", desc: "List custom domains for branded short URLs." },
  { name: "settings_custom_domain_connect", label: "Connect domain", desc: "Connect a custom domain (requires CNAME DNS)." },
  { name: "settings_custom_domain_update", label: "Update domain", desc: "Update custom domain URL." },
  { name: "settings_custom_domain_delete", label: "Delete domain", desc: "Remove a custom domain." },
  { name: "settings_activity_logs_list", label: "Activity logs", desc: "View audit trail of workspace actions." },
  { name: "settings_sessions_list", label: "Active sessions", desc: "List active login sessions." },
  { name: "settings_invoices_list", label: "Invoices", desc: "List billing invoices." },

  // ── Publishing: Scheduler ──────────────────────────────────
  { name: "publishing_scheduler_posts_list", label: "List posts", desc: "List scheduled posts. Filter by status (DRAFT, WAITING_TO_BE_APPROVED, SCHEDULED, IN_PROGRESS, PUBLISHED, ERROR), content type, channels, brands, labels, date range." },
  {
    name: "publishing_scheduler_post_create",
    label: "Create post",
    desc: "Create a new post (saved as draft). Content types: SINGLE_IMAGE, PHOTO_ALBUM, CAROUSEL, VIDEO, REEL, STORY, TEXT, POLL, LINK. Supports content_variations, floods (threads), poll config, and wr_process_status (DRAFT, WAITING_TO_BE_APPROVED, SCHEDULED).",
    guidelines: [
      "Always call subscriptions_list and settings_channels_list first.",
      "If a caption exceeds a platform's character limit, use content_variations for platform-specific versions.",
      "For Twitter/X threads, use the floods array with each item as a separate thread post.",
      "Prefer scheduling over publishing everything at once — bunching posts causes platform restrictions.",
    ],
  },
  { name: "publishing_scheduler_post_update", label: "Update post", desc: "Update a post's content, channels, schedule time, or workflow status (wr_process_status: DRAFT, WAITING_TO_BE_APPROVED, SCHEDULED)." },
  { name: "publishing_scheduler_post_schedule", label: "Schedule post", desc: "Move a draft post to SCHEDULED status for automated publishing." },
  { name: "publishing_scheduler_post_duplicate", label: "Duplicate post", desc: "Clone a post. target_service: PUBLISHING_SCHEDULER or PUBLISHING_POOL." },
  { name: "publishing_scheduler_post_delete", label: "Delete post", desc: "Permanently delete a post." },
  { name: "publishing_scheduler_post_media_file_upload", label: "Upload post media", desc: "Attach media via public URLs. group_type: SINGLE_IMAGE, PHOTO_ALBUM, CAROUSEL, VIDEO, REEL, STORY." },
  { name: "publishing_scheduler_post_media_file_update", label: "Update post media", desc: "Replace a specific media attachment by media_key." },
  { name: "publishing_scheduler_post_media_delete", label: "Delete post media", desc: "Remove a media attachment by media_key." },
  { name: "publishing_scheduler_post_media_link_add", label: "Add post link", desc: "Attach a clickable website URL to a post." },
  { name: "publishing_scheduler_post_media_link_update", label: "Update post link", desc: "Change the URL of an attached link." },

  // ── Publishing: Content Pool ───────────────────────────────
  { name: "publishing_pool_contents_list", label: "List pool content", desc: "List pool items. Filter by type, status (DRAFT, APPROVED, PUBLISHED), brands, labels, favorites." },
  { name: "publishing_pool_content_create", label: "Create pool content", desc: "Save new content to the pool. Same content options as scheduler posts." },
  { name: "publishing_pool_content_update", label: "Update pool content", desc: "Edit existing pool content." },
  { name: "publishing_pool_content_duplicate", label: "Duplicate pool content", desc: "Clone pool content to pool or scheduler." },
  { name: "publishing_pool_content_delete", label: "Delete pool content", desc: "Permanently delete pool content." },
  { name: "publishing_pool_content_media_file_upload", label: "Upload pool media", desc: "Attach media files via URLs to pool content." },
  { name: "publishing_pool_content_media_file_update", label: "Update pool media", desc: "Replace a specific media file in pool content." },
  { name: "publishing_pool_content_media_delete", label: "Delete pool media", desc: "Remove a media attachment from pool content." },
  { name: "publishing_pool_content_media_link_add", label: "Add pool link", desc: "Attach a website URL to pool content." },
  { name: "publishing_pool_content_media_link_update", label: "Update pool link", desc: "Update an attached link URL in pool content." },

  // ── Publishing: Utilities ──────────────────────────────────
  { name: "publishing_utilities_best_times_to_post_list_according_to_timezone", label: "Best times to post (timezone)", desc: "Get recommended best times to post based on a timezone's audience engagement data. Provide an IANA timezone identifier (e.g. America/New_York, Europe/Istanbul)." },
  { name: "publishing_utilities_best_times_to_post_list_according_to_channel", label: "Best times to post (channel)", desc: "Get recommended best times to post based on a specific channel's audience engagement data. Requires channel_key with PUBLISHING_SCHEDULER_BEST_TIMES_TO_POST feature." },
  { name: "publishing_utilities_hashtags_search", label: "Search hashtags", desc: "Search hashtags by keyword." },
  { name: "publishing_utilities_hashtags_relateds", label: "Related hashtags", desc: "Find related hashtags for a keyword." },
  { name: "publishing_utilities_hashtags_top", label: "Top hashtags", desc: "Get trending/top hashtags." },
  { name: "publishing_utilities_hashtags_templates_list", label: "Hashtag templates", desc: "List saved hashtag template groups." },
  { name: "publishing_utilities_caption_templates_list", label: "Caption templates", desc: "List saved caption templates." },

  // ── Analytics ──────────────────────────────────────────────
  { name: "analytics_boards_list", label: "List analytics boards", desc: "List analytics boards. type: CHANNEL (per-platform) or CUSTOM (user-created)." },
  { name: "analytics_sections_list", label: "List board sections", desc: "List sections within an analytics board. Requires board_key and board_type." },
  { name: "analytics_widgets_list", label: "List widgets", desc: "List widgets in a section. Requires board_key, board_type, section_key." },
  { name: "analytics_data_get", label: "Get analytics data", desc: "Fetch data for a widget. Date ranges: YESTERDAY, LAST_7_DAYS, LAST_14_DAYS, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, LAST_3_MONTHS, LAST_6_MONTHS, LAST_12_MONTHS, or CUSTOM with since_at/until_at." },

  // ── Inbox ──────────────────────────────────────────────────
  { name: "inbox_conversations_list", label: "List conversations", desc: "List inbox conversations. Filter by folder (all, pending, favorited, archived, muted, replied, deleted), types (message, sms, post, comment, review, mention), channels, priority, labels." },
  { name: "inbox_conversation_update", label: "Update conversation", desc: "Update priority, labels, assigned users, sentiment (1=Positive, 0=Neutral, -1=Negative), status (0=Inbox, -1=Archived, -2=Deleted)." },
  { name: "inbox_conversation_delete_permanently", label: "Delete conversation", desc: "Permanently delete a conversation." },
  { name: "inbox_conversation_messages_list", label: "List messages", desc: "List all messages within a conversation." },
  { name: "inbox_conversation_message_send", label: "Send reply", desc: "Send a reply. Supports threaded replies via parent_key (only if parent has ch_can_reply = true)." },
  { name: "inbox_conversation_message_update", label: "Update message", desc: "Like/unlike, hide/unhide, or delete a message. Check ch_can_like, ch_can_hide, ch_can_delete capabilities." },
  { name: "inbox_contacts_list", label: "List contacts", desc: "List contacts. Filter by folder (all, touched, untouched, favorited, blocked, deleted), channels, labels." },
  { name: "inbox_contact_update", label: "Update contact", desc: "Update contact labels, is_favorited, is_blocked, is_deleted." },

  // ── Monitoring ─────────────────────────────────────────────
  { name: "monitoring_queries_list", label: "List queries", desc: "List monitoring queries." },
  { name: "monitoring_query_create", label: "Create query", desc: "Create a monitoring query with keyword, channels, optional excluded/banned keywords, and language filter." },
  { name: "monitoring_query_update", label: "Update query", desc: "Update keyword, channels, exclusions, or languages." },
  { name: "monitoring_query_delete", label: "Delete query", desc: "Delete a monitoring query. Optional with_results flag to also delete results." },
  { name: "monitoring_results_list", label: "List monitoring results", desc: "List results. Filter by folder, queries, channels, labels, assigned users, date range." },
  { name: "monitoring_result_update", label: "Update result", desc: "Update labels, assigned users, sentiment rate, review status." },
  { name: "monitoring_result_delete_permanently", label: "Delete result", desc: "Permanently delete a monitoring result." },

  // ── Link Management ────────────────────────────────────────
  { name: "utilities_url_shortener_links_list", label: "List short links", desc: "List all shortened URLs." },
  { name: "utilities_url_shortener_link_create", label: "Create short link", desc: "Create a short link. Options: custom_domain_key, custom_suffix, name." },
  { name: "utilities_url_shortener_link_update", label: "Update short link", desc: "Update URL, name, domain, or suffix." },
  { name: "utilities_url_shortener_link_delete", label: "Delete short link", desc: "Delete a short link (stops redirecting immediately)." },

  // ── Content & Media Tools ──────────────────────────────────
  { name: "utilities_ai_assistant_image_generate", label: "Generate AI image", desc: "Generate images from text prompts. Requires integration_key with UTILITIES_AI_ASSISTANT_TEXT_TO_IMAGE feature." },
  { name: "utilities_stock_library_search_images", label: "Search stock images", desc: "Search stock images. Providers: UNSPLASH_COM, PEXELS_COM, PIXABAY_COM, GIPHY_COM, KLIPY_COM, IMGUR_COM, LEXICA_ART." },
  { name: "utilities_stock_library_search_videos", label: "Search stock videos", desc: "Search stock videos. Providers: PEXELS_COM, PIXABAY_COM, GIPHY_COM, KLIPY_COM, IMGUR_COM." },
  { name: "utilities_google_search", label: "Google search", desc: "Google search for web pages or images. type: WEB or IMAGE." },
  { name: "utilities_url_fetch", label: "Fetch URL content", desc: "Extract content from a URL." },
  { name: "utilities_screenshot_get", label: "Screenshot URL", desc: "Capture a screenshot of a webpage." },

  // ── Task Management ────────────────────────────────────────
  { name: "task_manager_boards_list", label: "List task boards", desc: "List all Kanban task boards." },
  { name: "task_manager_board_create", label: "Create task board", desc: "Create a new task board." },
  { name: "task_manager_board_update", label: "Update task board", desc: "Rename a task board." },
  { name: "task_manager_board_delete", label: "Delete task board", desc: "Delete a board and all its lists and cards." },
  { name: "task_manager_lists_list", label: "List task lists", desc: "List all lists (columns) within a board. Requires board_key." },
  { name: "task_manager_list_create", label: "Create task list", desc: "Create a new list in a board (e.g. To Do, In Progress, Done)." },
  { name: "task_manager_list_update", label: "Update task list", desc: "Rename a task list." },
  { name: "task_manager_list_delete", label: "Delete task list", desc: "Delete a list and all its cards." },
  { name: "task_manager_cards_list", label: "List task cards", desc: "List cards in a list. Requires board_key and list_key." },
  { name: "task_manager_card_create", label: "Create task card", desc: "Create a card with name and optional body (rich text)." },
  { name: "task_manager_card_update", label: "Update task card", desc: "Update card name, body, or move to another list (change list_key)." },
  { name: "task_manager_card_delete", label: "Delete task card", desc: "Permanently delete a task card." },
];

export default definePluginEntry({
  id: "radaar",
  name: "RADAAR",
  description:
    "Social media management — publish, schedule, analyze, manage inbox, monitor keywords, shorten links, manage tasks, and more.",
  register(api: any) {
    for (const t of TOOLS) {
      api.registerTool({
        name: t.name,
        label: `RADAAR: ${t.label}`,
        description: t.desc,
        ...(t.snippet ? { promptSnippet: t.snippet } : {}),
        ...(t.guidelines ? { promptGuidelines: t.guidelines } : {}),
        parameters: Params,
        async execute(_toolCallId: string, params: any, signal?: AbortSignal) {
          return jsonResult(
            await callTool(readConfig(api), t.name, params || {}, signal),
          );
        },
      });
    }
  },
});
