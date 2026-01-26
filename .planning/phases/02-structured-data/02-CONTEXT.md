# Phase 2: Structured Data - Context

**Gathered:** 2026-01-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Add JSON-LD structured data to pages so they qualify for rich snippets in Google search results. Covers schema types for test pages and breadcrumb navigation. Does not include OpenGraph images (Phase 5) or page content changes.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
User delegated all technical decisions with these constraints:

**Schema type for test pages:**
- Choose the schema type that best represents HP test archive pages
- Must be a type Google recognizes for potential rich snippet eligibility
- Consider: ScholarlyArticle, EducationalMaterial, WebPage with appropriate properties

**Breadcrumbs:**
- Must be in Swedish (e.g., "Hem > Gamla prov > Vår 2024")
- Implement BreadcrumbList schema matching site navigation hierarchy

**Organization representation:**
- Decide whether to include Organization schema for Maxa
- If included, use name and logo; keep minimal

**General approach:**
- Prioritize schemas that Google actually uses for rich results
- Validate against Google Rich Results Test
- Keep implementation minimal — 80/20 principle applies

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User wants results that "look good in Google" without overengineering.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-structured-data*
*Context gathered: 2026-01-26*
