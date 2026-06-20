## ADDED Requirements

### Requirement: Admin Service Card Creation
The system SHALL let an authenticated admin create additional service overview cards after deployment.

#### Scenario: Admin creates a service card
- **WHEN** an authenticated admin submits a main title, subtitle, description, and tags
- **THEN** the system persists the service card in server-side storage
- **AND** the service overview page displays the new card after it loads dynamic content
- **AND** the homepage remains driven only by the existing static service modules

### Requirement: Optional Linked Case Study
The system SHALL let an admin optionally attach a case study to a newly created service card.

#### Scenario: Admin adds a service card with a case
- **WHEN** the admin includes case title, intro, story, execution highlights, results, and optional supporting material
- **THEN** the service card links to a detail page for that case
- **AND** the case appears in the public case navigation/dropdown
- **AND** the case detail page displays the stored case text and supporting material link or file reference

#### Scenario: Admin adds a service card without a case
- **WHEN** the admin leaves case creation disabled
- **THEN** the service overview page still displays the service card
- **AND** the card does not display a broken case link

### Requirement: Reuse Existing Admin Authentication
The content management interface SHALL be reachable at `/services/admin` and SHALL reuse the existing Node app admin authentication through neutral content API paths.

#### Scenario: Unauthenticated user accesses content admin API
- **WHEN** a request is made to create content without the admin cookie
- **THEN** the API responds with an unauthorized error

#### Scenario: Authenticated admin accesses content admin page
- **WHEN** an admin has logged in through the existing admin password flow
- **THEN** the admin can open the content management page and submit new service content

#### Scenario: Visitor opens content admin route
- **WHEN** a visitor navigates to `/services/admin`
- **THEN** the main site renders the service content management page
- **AND** the page uses `/api` content endpoints when available
- **AND** `/contact/admin/content` redirects to `/services/admin` for backward compatibility
