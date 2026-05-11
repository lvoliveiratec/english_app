# FluentPath English Architecture

This folder describes the current and planned architecture for FluentPath English.

It is meant to be the place where we keep the project's structural drawings, service boundaries, data flows, agent responsibilities, and implementation direction.

## Files

- `01-system-overview.md`: product and system overview.
- `02-project-structure.md`: current repository structure and future structure.
- `03-agent-architecture.md`: frontend, backend, database, AI Coach, and AI Teacher agent roles.
- `04-data-and-rag-architecture.md`: structured data, media, student memory, KBs, and RAG.
- `05-student-flow.md`: public visitor flow and authenticated student flow.
- `06-diagrams.md`: Mermaid diagrams for the project.
- `07-implementation-roadmap.md`: practical next build phases.

## Architecture Principles

- The product experience is English-only.
- Student-specific memory must be isolated per student.
- Raw media is sensitive and should not be exposed broadly.
- The AI Teacher should receive authorized, compact context assembled server-side.
- The first production backend should be modular, but not split into too many services too early.
- Documentation should evolve with the code.
