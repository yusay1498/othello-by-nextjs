# GitHub Copilot Instructions for Othello by Next.js

## Project Overview
This is an Othello (Reversi) game implementation using Next.js 16, React 19, TypeScript, and Tailwind CSS.

## Code Style & Standards

### TypeScript
- Use TypeScript for all new files
- Prefer type inference where possible, but add explicit types for function parameters and return values
- Use interfaces for object shapes and types for unions/primitives
- Enable strict mode compliance

### React & Next.js
- Use React Server Components (RSC) by default
- Add 'use client' directive only when necessary (hooks, browser APIs, event handlers)
- Follow Next.js 16 App Router conventions
- Use the `app/` directory structure
- Prefer functional components with hooks

### Styling
- Use Tailwind CSS utility classes for styling
- Follow mobile-first responsive design
- Keep utility classes organized and readable

### File Organization
- Components: Create in appropriate directories under `app/` or a `components/` directory
- Types: Define in separate `.types.ts` files or inline when simple
- Utils: Place utility functions in a `lib/` or `utils/` directory

## Game Logic Guidelines

### Othello Game Rules
- 8x8 board with alternating black and white pieces
- Valid moves must flip at least one opponent piece
- Game ends when no valid moves remain for both players
- Winner is determined by piece count

### State Management
- Use React hooks (useState, useReducer) for game state
- Consider context for global game state if needed
- Keep game logic separate from UI components

## Testing
- Write tests for game logic functions
- Test edge cases (board boundaries, no valid moves, game end conditions)
- Follow existing test patterns in the repository

## Performance
- Memoize expensive calculations
- Use React.memo for pure components
- Optimize re-renders in game state updates

## Commit Messages
- Use conventional commits format: `type(scope): message`
- Types: feat, fix, docs, style, refactor, test, chore
- Keep messages clear and concise
- Can be written in Japanese or English
- When generating commit messages, analyze the staged changes and provide context-aware suggestions
- Include the scope when it's clear which part of the system is affected (game, board, ai, ui, docs)
- For Japanese commits, use polite form (ですます調) in the body if present

## Best Practices
- Keep functions small and focused
- Extract reusable logic into custom hooks
- Add comments for complex game logic
- Ensure accessibility (ARIA labels, keyboard navigation)
- Handle error states gracefully
