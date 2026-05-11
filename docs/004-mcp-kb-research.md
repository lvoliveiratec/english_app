# MCP And Knowledge Base Research

## Current Local MCP Status

No MCP resources or resource templates are currently registered in this Codex environment.

That means we do not yet have an installed MCP connector for project knowledge, database access, file knowledge bases, payments, storage, or deployment.

## MCP Direction

MCP should be used when it gives the AI controlled access to external tools or knowledge sources. For FluentPath English, the most useful MCP categories are:

- Repository and issue tracking.
- Product documentation and knowledge bases.
- Database inspection and migration workflows.
- Object storage and media metadata.
- Payment and subscription records.
- Calendar/class scheduling.
- Observability and logs.
- AI provider documentation and model configuration.

## MCP Research Notes

Sources checked on 2026-05-11:

- Official MCP architecture: https://modelcontextprotocol.io/docs/learn/architecture
- Official MCP Registry: https://registry.modelcontextprotocol.io/
- MCP Registry documentation: https://modelcontextprotocol.io/registry/about
- Reference MCP servers: https://github.com/modelcontextprotocol/servers
- GitHub MCP Server: https://github.com/github/github-mcp-server
- Supabase MCP: https://supabase.com/docs/guides/getting-started/mcp
- Neon MCP Server: https://neon.com/docs/ai/neon-mcp-server

Useful candidates:

- GitHub MCP for repository, issues, PRs, code review, and workflow automation.
- Supabase MCP if we choose Supabase for Postgres, auth, storage, realtime, edge functions, and generated TypeScript types.
- Neon MCP if we choose Neon as the managed Postgres platform and want branch-based database workflows.
- Reference MCP servers for learning patterns only, not production defaults.

Important findings:

- The official MCP Registry is still in preview, so server discovery may change.
- Reference MCP servers are educational examples and should not be treated as production-ready without review.
- Database MCP access should start read-only in development.
- MCPs that can write data, run SQL, manage repositories, or access storage need explicit approval, scoped credentials, and audit logging.
- Production student data should not be exposed to broad MCP tooling.

Security stance:

- Prefer remote MCPs with clear authentication and scopes when available.
- Avoid unrestricted local STDIO servers for sensitive operations.
- Use separate development and production credentials.
- Never give an MCP broad access to raw student media or production student records by default.
- Treat MCP tools as privileged integrations, not harmless plugins.

## Knowledge Bases To Build

Global KBs:

- Curriculum structure: courses, units, lessons, objectives, vocabulary, grammar targets, rubrics.
- CEFR guidance: level expectations from A1 to C2.
- Correction style guide: tone, correction frequency, examples, and when to interrupt.
- Platform help: login, lessons, progress, subscriptions, teacher workflows.
- Privacy and consent policies.

Scoped KBs:

- Teacher materials by teacher, class, cohort, or institution.
- Student memory by student only.
- Class transcripts and summaries by student/class permission.
- Support history by user permission.

## Research Tasks

- Identify MCP servers/connectors for GitHub, Postgres, object storage, payments, and documentation.
- Decide which MCPs belong in development only and which could be used in production operations.
- Define which KBs are static documents and which are generated from app data.
- Define retention and deletion behavior for every KB.
- Ensure student-specific retrieval is enforced server-side, not only by prompt instructions.
