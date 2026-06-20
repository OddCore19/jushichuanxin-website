## Why

The website needs a stronger company story and a lightweight way to keep the service overview current after deployment. The current site has no "About Us" route, and the service overview/case pages are compiled from static TypeScript data, so adding new offerings or optional case studies requires a code change and redeploy.

## What Changes

- Add an "About Us" page with an editorial/reportage-style company narrative based on current company materials, with an animated title treatment and a city skyline background.
- Add navigation and footer links to the new About route.
- Add a service content API to the existing Node app so deployed admins can add service overview cards without changing the homepage.
- Add an admin-facing content entry page at `/services/admin` that lets an admin create a service card with title, subtitle, description, and tags.
- Allow the admin to optionally create a linked case study with uploaded supporting material metadata/file and have that case appear in the cases experience.
- Keep existing static service cards and case pages as defaults, while merging in dynamic service cards/cases from server-side JSON at runtime.

## Capabilities

### New Capabilities

- `about-page`: Public company story page with editorial copy, animated headline, and skyline visual treatment.
- `content-admin`: Admin-managed service overview cards and optional linked case studies stored by the Node app.

### Modified Capabilities

- None.

## Impact

- Frontend routes, navigation, service overview, and case detail rendering.
- Existing `backend` Express server for authenticated content management APIs and persistent JSON/file storage.
- Deployment keeps one static Vite site plus one Node app; the Node app continues serving the survey under `/contact/` and exposes neutral content APIs under `/api/`.
