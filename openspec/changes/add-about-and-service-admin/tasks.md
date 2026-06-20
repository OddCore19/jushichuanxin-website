## 1. OpenSpec Planning

- [x] 1.1 Initialize OpenSpec for the repository.
- [x] 1.2 Create proposal, task list, and requirement deltas.
- [x] 1.3 Validate the OpenSpec change.

## 2. About Page

- [x] 2.1 Review available company material/context; the PDF is image-based locally, so use stable existing company copy rather than unsupported OCR.
- [x] 2.2 Add the About page route, navigation link, and footer link.
- [x] 2.3 Style the page with an animated title and skyline background.

## 3. Content Admin

- [x] 3.1 Add persistent content storage and authenticated admin APIs to the Node app.
- [x] 3.2 Add an admin entry point from the service overview page.
- [x] 3.3 Render dynamic service cards on the service overview page without syncing them to the homepage.
- [x] 3.4 Render optional dynamic case studies and uploaded material links on case pages/dropdowns.

## 4. Verification

- [x] 4.1 Run frontend build.
- [x] 4.2 Run Node syntax checks.
- [x] 4.3 Exercise content API behavior with local requests or equivalent tests.

## 5. Route Cleanup

- [x] 5.1 Move the content management UI to `/services/admin`.
- [x] 5.2 Add neutral `/api` aliases for content management while keeping `/contact/api` compatibility.
- [x] 5.3 Redirect the old `/contact/admin/content` route to `/services/admin`.
