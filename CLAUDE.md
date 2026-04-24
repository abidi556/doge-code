# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development commands

- `bun install` — install dependencies and local shim packages.
- `bun run dev` — start the Doge Code CLI/TUI through the normal bootstrap entry.
- `bun run start` — alias of the main development entrypoint.
- `bun run version` — verify the CLI boots and prints the current version.
- `bun run dev:restore-check` — run the restoration workspace check entrypoint.

There is currently no first-class root `lint` script or automated `test` script in `package.json`. There is also no documented single-test command at the repository root, so validation is primarily targeted manual smoke testing of the affected flow.

## Project-specific runtime notes

- This repository is a restored and modified fork of Claude Code, not a pristine upstream source checkout.
- The fork uses `~/.doge` as its default config/data root rather than the upstream Claude directories.
- The linked global CLI command is `doge` (`bun link` registers `@doge-code/cli`).
- Expected local runtime versions are Bun 1.3.5+ and Node.js 24+.

## High-level architecture

### CLI startup flow

- `src/bootstrap-entry.ts` is the executable bin entrypoint. It sets up the bootstrap macro and then hands off to the CLI entry.
- `src/entrypoints/cli.tsx` is the fast-path dispatcher. It handles lightweight flags and specialized modes first (`--version`, MCP/native-host entrypoints, daemon/bridge/background/worktree fast paths) before loading the full app.
- `src/main.tsx` is the main CLI/TUI runtime. It assembles config, auth, policy, telemetry, plugins, MCP state, session state, and interactive rendering.

### Session and context wiring

- `src/setup.ts` performs early session setup before the main interactive flow: cwd initialization, hook snapshotting, file-change watcher setup, session memory setup, and optional worktree/tmux creation.
- `src/context.ts` builds the conversation context that gets injected into each session, including the startup git snapshot, discovered `CLAUDE.md` content / memory files, and the current local date.

### Command and tool architecture

- `src/commands.ts` is the central slash-command registry. Built-in commands are assembled here, with many entries feature-gated or lazily required.
- `src/tools.ts` is the central tool registry. It defines which tools exist in the current environment and applies feature-gated availability.

### Repository structure

Most feature implementation lives under:

- `src/commands/` for slash commands and command handlers
- `src/tools/` for tool implementations
- `src/services/` for longer-lived subsystems such as API, MCP, analytics, and policy integration
- `src/utils/` for shared runtime helpers used across the CLI
- `shims/` and `vendor/` for restored compatibility layers and local package replacements

## Working in this repo

- Prefer minimal, auditable changes. Some behavior exists because this is a restored source tree with shims and compatibility layers, not a clean upstream checkout.
- When validating changes, favor smoke tests around the specific command, tool, service, or UI path you touched, plus a quick boot check with `bun run version` when relevant.
- Keep architecture notes in this file high-level; use the source files above for exact implementation details.