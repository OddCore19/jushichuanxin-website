## ADDED Requirements

### Requirement: Baota Incremental Migration Procedure
The project SHALL document a safe incremental Baota deployment procedure for moving from `jscx_survey_app` to `backend`.

#### Scenario: Existing Baota deployment is updated
- **WHEN** the server already has `jscx_survey_app/.env`, `jscx_survey_app/data/`, or `jscx_survey_app/public/uploads/`
- **THEN** the deployment procedure explains how to back up and copy these runtime files to `backend/`
- **AND** it explains how to change the Baota Node project directory to `backend`
- **AND** it keeps Nginx `/contact/` and `/api/` reverse proxies pointing to `127.0.0.1:3000`.

### Requirement: Baota Verification Checklist
The deployment docs SHALL include concrete verification checks after migration.

#### Scenario: Operator finishes migration
- **WHEN** the operator completes the Baota update
- **THEN** the docs tell them to verify `/`, `/contact/`, `/contact/admin`, `/services`, `/services/admin`, and `/api/content`
- **AND** the docs include checks for data persistence, uploads, backend logs, and rollback.
