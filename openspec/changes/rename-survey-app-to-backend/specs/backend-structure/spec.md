## ADDED Requirements

### Requirement: Combined Backend Directory
The repository SHALL place the combined Node backend in a directory named `backend/`.

#### Scenario: Developer inspects repository layout
- **WHEN** a developer lists top-level project directories
- **THEN** the Node service code is located under `backend/`
- **AND** no tracked source files remain under `jscx_survey_app/`
- **AND** package metadata describes the service as the JSCX backend rather than survey-only.

### Requirement: Public Route Stability
The refactor SHALL NOT change public website or API routes.

#### Scenario: Existing survey link is used
- **WHEN** a visitor opens `/contact/`
- **THEN** the questionnaire remains available.

#### Scenario: Existing survey admin link is used
- **WHEN** an admin opens `/contact/admin`
- **THEN** the survey admin remains available.

#### Scenario: Website requests dynamic content
- **WHEN** the website requests `/api/content`
- **THEN** the backend returns dynamic services and cases.

### Requirement: Runtime State Stays Local
The repository SHALL continue to exclude backend runtime state from Git.

#### Scenario: Server-local runtime files exist
- **WHEN** `backend/.env`, `backend/data/`, or `backend/public/uploads/` exists
- **THEN** Git ignores those files
- **AND** `.env.example` remains tracked as the template.
