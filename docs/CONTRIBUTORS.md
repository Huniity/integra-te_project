# Contributors — INTEGRA-TE

> **Project II · Web Programming · ETIC_Algarve · 2025/26**
> Client: **Fundação António Aleixo** · Group A

---

## Team

| Name | Role | Areas |
|------|------|--------|
| [Adrien](#adrien--lead--frontend--backend) | **Lead · Frontend + Backend** | Architecture, DevOps, React, Search, Voice |
| [Cristian](#cristian--backend) | **Backend** | Django, REST API, Database, Testing |
| [Diogo](#diogo--frontend--backend) | **Frontend + Backend** | Content Sections, CMS, Responsive, CI |
| [Giulio](#giulio--frontend) | **Frontend** | UI Pages, Docs, Accessibility, Compliance |

---

## Adrien · Lead · Frontend + Backend

**Project lead and primary decision-maker across all areas.**

### Project Management & Architecture
- Overall project coordination, scope definition, and planning
- System architecture design and all major technical decisions
- Repository setup, Git workflow, and branch protection strategy
- Phase deliverables and documentation oversight
- Lead presenter for final presentation

### Infrastructure & DevOps
- Docker and Docker Compose configuration (DEV and PROD)
- `entrypoint.sh` — automated migrations and startup sequencing
- Nginx configuration for production static file serving and API proxying
- `.env.example` and environment documentation
- CORS and security settings

### Frontend
- React 18 + Vite project bootstrap and configuration
- React Router setup and route structure
- Tailwind CSS integration and design token definitions
- API service layer (fetch helpers and client abstraction)
- `<StickyHeader>` and burger menu navigation
- `<HeroBanner>` with gradient
- `<AreaCards>` section
- Learn section (`/learn`) and Practice section (`/practice`)
- `<YearFilter>` and `<DisciplineCard>` components
- `<VideoEmbed>` and `<DownloadButton>` components
- Global search page (`/search`) with `<TypeFilters>` and `<SubjectFilters>`
- `<VoiceSearchButton>` — Web Speech API (`lang='pt-PT'`)
- Privacy policy page (`/privacy`) and `<CookieBanner>` component
- React component unit tests

### Documentation
- Scope document
- Roles & Responsibilities matrix
- Technical Plan document
- Architecture diagram
- `README.md` (including AI Usage section)
- `CONTRIBUTING.md` and commit convention

---

## Cristian · Backend

**Owns the Django backend end-to-end.**

### Backend — Django Setup & Configuration — (lead)
- Django 5 project setup and settings
- PostgreSQL database configuration and connection management
- Database models and migrations
- Django REST Framework (DRF) setup and serialisers
- API input validation and error handling

### Backend — API Endpoints — (lead)
- `GET /api/disciplines/`
- `GET /api/topics/`
- `GET /api/topics/:slug/`
- `GET /api/games/`
- `GET /api/books/`
- `GET /api/search/`
- `POST /api/exercises/`
- OpenAPI / Swagger documentation via `drf-spectacular`

### Backend — CMS & Admin
- Django Admin configuration (localised to `pt-PT`) — (lead)
- `ModelAdmin` classes per model — (lead)
- File upload and `MEDIA_ROOT` setup (contributor)
- GDPR contact form and consent checkbox — (lead)

### Testing & Quality
- Unit tests — Django models — (lead)
- Unit tests — API endpoints — (lead)
- Backend logging setup — (lead)

### Documentation & Delivery
- Technical Plan (contributor)
- Architecture diagram (contributor)
- `README.md` (contributor)
- Installation and operations docs (contributor)
- Presentation deck structure — (lead)

---

## Diogo · Frontend + Backend

**Leads content-heavy sections and the full CI pipeline.**

### Frontend — Content Sections
- Learn section (`/learn`) — full ownership (frontend + API integration)
- Practice section (`/practice`) — full ownership (frontend + API integration)
- Play section (`/play`) — frontend lead
- Read section (`/read`) — frontend lead
- `<YearFilter>` and `<DisciplineCard>` (contributor)
- `<VideoEmbed>` and `<DownloadButton>` (contributor)
- Contact page (`/contact`) — (contributor)

### Backend — CMS & Admin
- Django Admin customisation and CMS configuration — (lead)
- `ModelAdmin` classes per model (contributor)

### Quality & Accessibility
- Responsive and mobile-first CSS — (lead)
- Cross-browser testing — (lead)
- WCAG AA accessibility checks — (lead)

### Infrastructure & CI
- GitHub Actions CI configuration (with Adrien) — automated lint and test runs on every PR

### Documentation & Delivery
- Product demo recording — (contributor)
- Final presentation — (contributor)

---

## Giulio · Frontend

**UI ownership for key pages and lead for all written documentation.**

### Frontend — Pages & UI
- About page (`/about`) — full UI ownership
- Contact page (`/contact`) — full UI ownership
- Play section (`/play`) — UI ownership (shared with Diogo)
- Read section (`/read`) — UI ownership (shared with Diogo)
- "Sobre o Projeto" section and FAQ accordion — lead
- Footer with EU / Portugal 2030 logos — lead
- Lead reviewer of all frontend code

### Styling & Accessibility
- Tailwind CSS and responsive CSS contributions — (lead)
- WCAG AA accessibility checks — (contributor)

### Compliance
- EU visibility and Portugal 2030 logo compliance — (lead)
- `<CookieBanner>` — (contributor)
- Privacy policy page — (contributor)

### Documentation
- `README.md` (contributor)
- `CONTRIBUTING.md` (contributor)
- CMS user guide — (lead)
- Installation and operations docs — (lead)
- `.env.example` and environment docs — (contributor)
- Architecture diagram — (contributor)

---

## Contribution Legend

| Role | Meaning |
|--------|---------|
| **Lead** | Primary contributor, makes final decisions |
| **Contributor** | Active development and implementation |
| **Reviewer** | Code review and quality assurance |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Backend | Django 5 + Django REST Framework |
| Frontend | React 18 + Vite |
| Database | PostgreSQL 18 |
| Styling | Tailwind CSS |
| Admin / CMS | Django Admin (customised, `pt-PT`) |
| Containerisation | Docker + Docker Compose |
| Web Server | Nginx (production) |
| CI | GitHub Actions |
| API Docs | drf-spectacular (OpenAPI / Swagger) |
| Voice Search | Web Speech API (`pt-PT`) |
| Version Control | Git + GitHub |

---

*INTEGRA-TE · Group A · ETIC_Algarve · 2025/26*
