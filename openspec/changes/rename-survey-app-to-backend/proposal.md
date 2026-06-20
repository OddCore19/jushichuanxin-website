## Why

The Node service now owns more than the questionnaire: it serves the public survey, survey admin, dynamic service/case content APIs, uploaded case material, and future scheduled jobs. The directory name `jscx_survey_app` is misleading for deployment and maintenance, especially in Baota where the Node project path must be selected manually.

## What Changes

- Rename the Node service directory from `jscx_survey_app/` to `backend/`.
- Keep all public URLs stable:
  - `/contact/` for the survey.
  - `/contact/admin` for the survey admin.
  - `/api/content` and `/api/admin/content/*` for dynamic website content.
  - `/services/admin` for the React content-admin UI.
- Update `.gitignore`, docs, scripts, package metadata, and deployment references to use `backend/`.
- Preserve runtime data and environment files as server-local state, not Git-managed state.
- Provide detailed Baota incremental deployment steps for moving from the existing `jscx_survey_app` deployment to `backend`.

## Capabilities

### New Capabilities

- `backend-structure`: Repository layout and backend naming conventions for the combined Node backend.
- `baota-deployment`: Incremental deployment procedure and operational checks for Baota.

### Modified Capabilities

- None.

## Impact

- Files move from `jscx_survey_app/` to `backend/`.
- Baota Node project configuration must point to the new backend directory after deployment.
- Nginx public routes remain unchanged, but backend project paths in docs and commands change.
- Existing server-local `.env`, `data/`, and uploads must be copied or moved during deployment.
