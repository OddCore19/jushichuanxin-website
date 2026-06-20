## ADDED Requirements

### Requirement: Public About Page
The site SHALL provide a public About page reachable from primary navigation and footer navigation.

#### Scenario: Visitor opens About page
- **WHEN** a visitor navigates to `/about`
- **THEN** the site displays an About page instead of a not-found page
- **AND** the page includes an editorial/reportage-style company narrative based on available company materials
- **AND** the primary navigation exposes an "关于我们" entry

### Requirement: Editorial Visual Treatment
The About page SHALL use a polished visual treatment with an animated title and a suitable metropolitan skyline background.

#### Scenario: About page loads
- **WHEN** the About page is rendered
- **THEN** the page displays a prominent animated title treatment
- **AND** the hero section uses a city skyline visual background with readable overlay text
- **AND** the layout remains readable on desktop and mobile viewport widths
