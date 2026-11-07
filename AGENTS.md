# Contribution and agent guidelines

## Project

- This repository contains Przemysław Kleszcz's personal website, built with Astro 7, TypeScript, Markdown, and CSS.
- Refer to the project as a "personal website" in documentation and user-facing copy.
- Keep site content, documentation, and commit messages in English.
- The site is statically generated. Preserve ordinary link navigation and avoid adding client-side frameworks, hydration, or executable browser JavaScript unless the task requires them.
- Use Node.js >= 22.23.4 and npm. Install dependencies with `npm ci` and keep `package-lock.json` in sync when changing dependencies.

## Project structure

- `src/config.ts`: profile, resume, contact details, and navigation. Keep personal data here rather than duplicating it across pages.
- `src/pages/`: Astro pages, blog routes, RSS, robots.txt, and the custom 404 page.
- `src/layouts/Layout.astro`: shared layout and SEO metadata.
- `src/styles/global.css`: shared styles, responsive layouts, motion, and print rules.
- `src/content/blog/`: Markdown posts; `src/content.config.ts` validates their frontmatter.
- `src/lib/blog.ts`: published-post filtering and date formatting.
- `config/site-origin.mjs`: loads and validates `SITE_URL`.
- `src/assets/`: images processed by Astro. `public/`: files copied directly to the output.
- `tests/output.test.mjs`: tests against the generated `dist/` files.
- `docs/images/`: README screenshots.
- Do not edit or commit generated `dist/`, `.astro/`, or `node_modules/` files.

## Branches

- Do not implement or publish changes directly on `main`.
- Before editing, create a session branch from local `main`, or continue the existing session branch for related work. Preserve existing uncommitted changes; never discard them to switch branches.
- Name branches `Session-DD-MM-YY`, using the session date in Europe/Warsaw (for example, `Session-07-11-26`). If that name is already used for completed work, append a numeric suffix.
- Keep session branches after merging.

## Commits and merging

- Commit only when requested. Split independent concerns into small, logical commits; do not split a coherent change artificially.
- Use short English commit subjects. Prefer lowercase Conventional Commit subjects, such as `docs: update contribution guidelines` or `feat: add looping typing animation`.
- Do not mix unrelated cleanup or formatting with functional changes. Stage specific files and inspect the staged diff before committing.
- When asked to merge or publish locally, commit on the session branch and merge into local `main` with `--no-ff`; do not squash or fast-forward.
- Use `MERGE N: Description` for merge commits. Determine the next number from existing matching merge subjects; start at 1 if none exist.
- Before merging, complete the relevant verification and ensure all intended changes are committed. After merging, verify the merge commit and working-tree status.
- Do not push to `origin` unless the user explicitly requests it. A request to edit files alone does not authorize a commit, merge, or deployment.

## Verification

- Run `git diff --check` for every change.
- For changes to Astro, TypeScript, CSS, content, dependencies, or build configuration, run these commands in order:

  ```sh
  npm run check
  npm run build
  npm test
  ```

- Tests read `dist/`, so always build before running them. Address errors and warnings introduced by the change before merging or pushing.
- For documentation-only changes, verify commands, links, and file paths against the repository; a full application build is not required.
- For visual or animation changes, check the affected page in a browser, including a narrow viewport where relevant. Respect `prefers-reduced-motion` and print styles.
- Keep meaningful output checks intact: required routes, internal links, metadata, image sizes, and the absence of executable client JavaScript. Update tests when intended behavior changes; do not weaken unrelated assertions to get a passing run.

## Implementation and content

- Follow existing Astro, TypeScript, and CSS conventions. Reuse the shared layout and configuration.
- Preserve semantic headings, keyboard navigation, visible focus states, and descriptive image alternative text.
- Keep decorative cursors and animation out of the accessibility tree. Animated text must retain a complete accessible name, and reduced-motion users must receive readable static content.
- Prefer CSS for simple visual effects. Avoid unnecessary dependencies and remote assets or fonts.
- Use clear names and comments only for non-obvious decisions. Remove commented-out code.
- Preserve the terminal-inspired design and responsive behavior when changing components.
- Blog posts need valid frontmatter. Drafts and future-dated posts stay out of routes, the index, and RSS; scheduled publication requires a new build. Display dates in UTC.
- Do not invent personal details, professional experience, or contact information. Keep example blog posts visibly labeled.

## Configuration and deployment

- `SITE_URL` is the public HTTP(S) origin without a path, query, fragment, or credentials. Set it at build time and rebuild after changing it.
- Preserve the `example.invalid` fallback and its noindex/crawl-blocking behavior when no public origin is configured.
- Keep canonical URLs, RSS, sitemap, and sharing metadata consistent with `SITE_URL`.
- Railway hosts the `PersonalWebsite` project and service, connected to `pk-dev-cs/PersonalWebsite` on `main`. Pushing to `main` automatically triggers a production deployment.
- Current Railway build/start commands and environment settings are documented in README.md and configured in Railway; do not assume they are stored in this repository.
- Static hosting must resolve directory URLs and return the custom `404.html` with HTTP status 404 for missing routes.
- Never commit secrets, credentials, or a local `.env` file. Keep `.env.example` suitable for public documentation.

## Git safety

- Never use `git reset --hard` or discard uncommitted changes without an explicit user request.
- Preserve unrelated user changes. Do not overwrite, stage, or commit them as part of another task.
- Do not rewrite shared history or force-push without an explicit user request.
- Before any history-changing operation, inspect the current branch, working tree, and relevant commits. Prefer ordinary follow-up commits for corrections.
