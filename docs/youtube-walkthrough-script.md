# Movie UI Dashboard YouTube Walkthrough Script

Target length: about 10 minutes

Audience: recruiters, hiring managers, and engineering teams

Style reference: adapted from the DevAssist AI script structure with timed chapters, screen cues, "say" lines, pauses, and strong transition moments.

## Recording Goal

Show that this project is more than a movie table. The core story is a polished React and TypeScript dashboard that compares REST and GraphQL behavior from the same UI, uses TanStack Query for server state, uses TanStack Router for app structure, and makes API behavior visible through diagnostics.

## Quick Setup Before Recording

- Start the app and backend API before recording.
- Keep the browser on the Movie Listings page.
- Keep DevTools ready on the Network tab.
- Have these files open in the editor: `package.json`, `src/main.tsx`, `src/pages/MoviesPage.tsx`, `src/features/movies/hooks/useMovies.ts`, `src/features/movies/api/movie-graphql-api.ts`, `src/lib/api.ts`, and `src/components/ApiDiagnosticsDrawer.tsx`.
- Plan to spend the most time on the REST versus GraphQL switch. That is the strongest differentiator.

## Chapter 1: Intro and Project Positioning

### 0:00-0:20 - Authority and Identity

**On screen:** Movie UI Dashboard running at full desktop width.

**Say:**

"Hi, I’m Steven Wickers, a Senior Frontend Engineer focused on React, TypeScript, API design, and full-stack application architecture."

"In this video, I’m going to walk through my Movie UI Dashboard project."

"This is a React and TypeScript dashboard for browsing, filtering, sorting, and maintaining movie data through both REST and GraphQL APIs."

PAUSE

### 0:20-0:40 - What This Actually Proves

**On screen:** Slowly point to the table, filters, API mode switch, and API status button.

**Say:**

"This isn’t just a UI demo. It’s a frontend built around real API behavior: query parameters, server-state caching, GraphQL field selection, mutations, responsive layouts, and request diagnostics."

"The goal is to show how a frontend can be clean and usable while still making backend integration visible and understandable."

PAUSE

### 0:40-1:00 - Video Roadmap

**On screen:** Stay in the app.

**Say:**

"I’ll start with the app experience, then move into the tech stack and code structure."

"From there I’ll focus on TanStack Query, the REST and GraphQL implementations, the API diagnostics drawer, and the responsive styling."

"The main idea to watch for is this: the same dashboard can switch between REST and GraphQL, and the UI changes with the data contract."

## Chapter 2: Product Walkthrough

### 1:00-2:05 - Main Dashboard Experience

**On screen:** Use the live app.

**Demo actions:**

1. Point out the movie table.
2. Search for a movie.
3. Change the search type dropdown.
4. Open the date, revenue, and genre filters.
5. Sort by movie or a money column.
6. Change page size and pagination.

**Say:**

"The main experience is a table-first movie dashboard."

"Users can search movies, choose the search mode, filter by release date, genres, worldwide gross, production budget, and domestic gross, then sort and paginate through the results."

"I wanted this to feel like a real internal tool: compact enough for repeated use, but still readable and polished."

"The table supports sortable columns and desktop column resizing. On smaller screens, the listing turns into movie cards so the same data stays readable without forcing horizontal scrolling."

PAUSE

### 2:05-2:40 - Create, Edit, Delete, and Theme

**On screen:** Open create dialog, then edit/delete controls, then theme toggle if visible.

**Say:**

"The dashboard also supports create, edit, and delete workflows."

"In REST mode, those actions call the REST API directly. In GraphQL mode, update is implemented through a GraphQL mutation, while create and delete currently stay REST-only."

"That distinction is intentional for the walkthrough because it shows where the current GraphQL surface is implemented and where the REST API still owns the complete maintenance workflow."

"The app also supports light and dark mode through `next-themes`, with Tailwind and shadcn-style design tokens driving the visual system."

## Chapter 3: Stack and App Structure

### 2:40-3:15 - Tech Stack

**On screen:** Open `package.json`, then README badges.

**Say:**

"The stack is React 19, TypeScript, Vite, and Tailwind CSS."

"For routing, I’m using TanStack Router. For server state, I’m using TanStack Query. For small global UI state, like the current API mode and selected GraphQL fields, I’m using Redux Toolkit."

"The REST client is Axios, and the GraphQL client is `graphql-request`."

"The UI layer uses shadcn-style components, Radix primitives, Lucide icons, and `next-themes`."

"For quality, the project includes ESLint, Prettier, Vitest, Testing Library, and tests around utilities, GraphQL API behavior, and movie listing components."

### 3:15-4:00 - Composition Root and Routing

**On screen:** Show `src/main.tsx`, `src/router.tsx`, `src/routes/__root.tsx`, and `src/pages/MoviesPage.tsx`.

**Say:**

"The composition root is `main.tsx`."

"This is where React mounts, Redux is provided, the theme provider is configured, TanStack Query is initialized, TanStack Router is mounted, and toast notifications are added."

"Routing is handled by TanStack Router. The generated route tree connects the root route to the main index page, and the root route wraps the app in the shared layout."

"The index route renders `MoviesPage`, which is the primary screen for the dashboard."

### 4:00-4:30 - Feature Organization

**On screen:** Show the `src/features`, `src/components`, and `src/lib` folders.

**Say:**

"The project is organized around shared app infrastructure and feature modules."

"Shared UI lives in `src/components`. Shared utilities and API helpers live in `src/lib`."

"The movie feature owns its API calls, hooks, components, filters, constants, types, and utility functions."

"Genres have their own API and query hook, while API mode and GraphQL column selection are small Redux slices."

"That keeps domain-specific code close to the feature that owns it."

## Chapter 4: TanStack Query and Server State

### 4:30-5:20 - Movie Query Flow

**On screen:** Show `src/features/movies/hooks/useMovies.ts`.

**Say:**

"TanStack Query handles the server state for this dashboard."

"The main hook is `useMovies`."

"The query key includes four important pieces: the resource name, the current API mode, the active filters, and the selected GraphQL fields."

"That means REST and GraphQL results are cached separately, and each filter or field-selection change creates a predictable query state."

"The query function chooses between `getMovies` and `getGraphQlMovies` depending on whether the app is in REST mode or GraphQL mode."

PAUSE

**Strong line:**

"The UI does not need two separate dashboards. TanStack Query lets one dashboard coordinate two different transport layers."

### 5:20-5:55 - Smooth Loading and Mutations

**On screen:** Show `useUpsertMovie.ts`, then trigger a filter or pagination change in the app.

**Say:**

"The hook uses `keepPreviousData` as placeholder data, so when a user changes filters or pagination, the old result can stay visible while the next request settles."

"That makes the dashboard feel smoother."

"For create, update, and delete workflows, the mutation hooks invalidate the `movies` query key after a successful change."

"That keeps the table fresh without trying to manually patch every possible filtered result."

## Chapter 5: REST and GraphQL

### 5:55-6:35 - REST Path

**On screen:** Show `src/features/movies/api/movies-api.ts`, `src/features/movies/api/movie-query-params.ts`, and `src/lib/api.ts`.

**Say:**

"In REST mode, the dashboard calls the `/movies` endpoint."

"The current filter state is converted into query parameters, and Axios sends the request using the API base URL from the Vite environment configuration."

"The Axios client also tracks request start and finish times, reports status, and normalizes errors through toast messages."

"This is the standard REST path: the client asks for the movie resource with filters, sorting, and pagination attached as query parameters."

### 6:35-7:35 - GraphQL Field Selection

**On screen:** Switch the app to GraphQL mode, open GraphQL Columns, turn off a few fields, then show `movie-graphql-api.ts`.

**Say:**

"The GraphQL implementation is the main highlight of the project."

"In GraphQL mode, the user can choose which movie fields they want to request."

"The code builds the GraphQL query from that selected field list. It always includes required fields like `id` and `movieName`, then adds only the selected fields."

"The visible table columns are tied to that same selection."

"So when I turn off fields here, two things happen together: the GraphQL request asks for less data, and the UI shows fewer columns."

PAUSE

**Strong line:**

"That is the GraphQL value proposition made visible: ask for exactly what the screen needs, and let the interface reflect that contract."

### 7:35-8:05 - Variables and Sorting

**On screen:** Stay in `movie-graphql-api.ts`.

**Say:**

"Another important detail is that the selected fields change the query shape, but the filters still travel as structured variables."

"That means the query stays flexible without turning filters, sorting, and pagination into string concatenation."

"The app also maps UI sort fields into GraphQL movie sort fields, so the frontend language and backend contract stay aligned."

## Chapter 6: Diagnostics, Responsive UI, and Close

### 8:05-8:45 - API Diagnostics

**On screen:** Open DevTools Network tab, trigger REST request, open API status drawer, switch to GraphQL, trigger request again.

**Say:**

"For the walkthrough, the API diagnostics drawer is especially useful."

"It shows the latest request URL, HTTP method, status, duration, current API mode, and the TanStack Query state."

"In REST mode, you can see the `/movies` request. In GraphQL mode, the network call changes to `/graphql`, and the request body includes the query and variables."

"I added this so the dashboard explains what it is doing instead of hiding the API behavior."

### 8:45-9:20 - Responsive and Visual Design

**On screen:** Resize to mobile, show cards and wrapped filters.

**Say:**

"The styling is intentionally dashboard-focused."

"The app uses a sticky layout, compact filters, readable table density, genre badges, and responsive controls."

"On mobile, the movie listing changes into cards, and the filters wrap into a layout that is easier to use on a narrow screen."

"That matters because a dashboard should not only work at the perfect desktop width. It should keep its core workflow intact across real viewports."

### 9:20-10:00 - Final Summary

**On screen:** Return to full desktop app, preferably GraphQL mode with diagnostics visible.

**Say:**

"To summarize, this Movie UI Dashboard demonstrates a modern React and TypeScript frontend connected to real API patterns."

"It uses TanStack Router for routing, TanStack Query for server state and caching, Redux Toolkit for small global UI state, Axios for REST, GraphQL Request for GraphQL, and Tailwind plus shadcn-style components for the interface."

"The biggest win is the REST and GraphQL comparison."

"The same dashboard can show standard REST requests, then switch to GraphQL and request only the fields needed by the current UI."

"For a team, this project shows that I can build polished frontend experiences, organize code by feature, work with backend contracts, reason about API design, and make technical behavior visible to users."

"Thanks for watching."

## Optional Shorter Take

If the recording starts running long, skip the create/edit/delete dialog and shorten the stack section. Keep the time on GraphQL field selection, the network tab, and the API diagnostics drawer. That is the strongest part of the project.
