# Design Guidelines: AI-Powered Product Manager Data Analysis Platform

## Design Approach

**Selected Approach:** Design System - Linear/Vercel Dashboard Inspiration
**Justification:** This is a utility-focused, data-intensive productivity tool where efficiency, clarity, and learnability are paramount. Drawing inspiration from Linear's clean interface and Vercel's dashboard aesthetics ensures a professional, trustworthy environment for serious data analysis work.

**Key Design Principles:**
- Data-first visibility: Information hierarchy prioritizes insights and visualizations
- Progressive disclosure: Complex features revealed contextually
- Intelligent whitespace: Balance density with breathing room
- Trust through clarity: Transparent AI interactions with visible reasoning

## Core Design Elements

### Typography
- **Primary Font:** Inter (via Google Fonts CDN)
- **Monospace Font:** JetBrains Mono (for data tables, code, metrics)

**Hierarchy:**
- Hero Headlines: text-4xl lg:text-5xl font-bold
- Section Headers: text-2xl lg:text-3xl font-semibold
- Card Titles: text-lg font-semibold
- Body Text: text-base font-normal
- Data Labels: text-sm font-medium
- Metadata/Timestamps: text-xs font-normal text-muted
- Numerical Data: text-lg font-mono tracking-tight

### Layout System
**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing (within components): space-2, gap-2, p-2
- Standard spacing (between elements): space-4, gap-4, p-4, m-4
- Section spacing: space-8, gap-8, py-8, px-8
- Major sections: py-12, px-12, gap-12
- Large breakpoints: py-16, space-16

**Grid System:**
- Dashboard layout: 12-column grid with sidebar (col-span-2 for sidebar, col-span-10 for main)
- Data cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Chart grid: grid-cols-1 lg:grid-cols-2 for dual visualization

## Component Library

### Core Navigation
**Top Navigation Bar:**
- Fixed height (h-16), full-width with subtle bottom border
- Logo left, primary actions center, user profile/settings right
- Upload button, AI Assistant toggle, Share button as primary CTAs

**Sidebar Navigation:**
- Collapsible (w-64 expanded, w-16 collapsed)
- Sections: Datasets, Visualizations, AI Insights, Shared Reports
- Icon + label pattern with active state indicators

### Data Upload Zone
**File Drop Area:**
- Large, centered card (max-w-2xl) with dashed border
- Generous padding (p-12)
- Icon-driven: large upload icon at top, supporting text below
- Supported formats badge: "CSV, JSON, Excel"
- Drag-active state with visual feedback

**File Preview Card:**
- Table preview with scrollable container
- First 10 rows visible with "Show more" expansion
- Column headers sticky with data type indicators
- Quick stats: row count, column count, file size

### AI Interaction Components
**Natural Language Query Bar:**
- Prominent search-style input (h-12) with rounded corners
- Positioned at top of analysis workspace
- AI sparkle icon prefix, submit arrow suffix
- Placeholder: "Ask anything about your data..."
- Auto-suggest dropdown with query examples

**AI Insight Cards:**
- Clean white cards with subtle shadow
- AI badge indicator at top-right corner
- Insight headline (font-semibold), supporting explanation below
- Confidence indicator (subtle progress bar or percentage)
- Action buttons: "Visualize this" or "Deep dive"

### Visualization Components
**Chart Container:**
- Full-bleed visualization area with minimal chrome
- Chart type selector (tabs: Line, Bar, Pie, Scatter, Table)
- Customization panel (collapsible): axis labels, colors, aggregations
- Export button group: PNG, PDF, Share link

**Chart Types:**
- Line Charts: Time-series data, trend analysis
- Bar Charts: Categorical comparisons, rankings
- Pie Charts: Composition, percentage breakdowns
- Scatter Plots: Correlation analysis, distributions
- Data Tables: Sortable, filterable, with inline sparklines

**Dashboard Grid:**
- Masonry-style or fixed grid layout
- Draggable chart cards for custom arrangement
- Each card: chart title, mini controls, expand/remove actions
- Add chart button (dashed outline card) positioned in grid flow

### Data Display Components
**Metric Cards:**
- Grid of 3-4 key metrics at dashboard top
- Large numerical value (text-3xl font-mono)
- Metric label above, trend indicator (↑↓) with percentage below
- Compact design (p-4 to p-6)

**Data Tables:**
- Striped rows for readability
- Column headers sticky with sort indicators
- Inline filters per column
- Pagination or infinite scroll for large datasets
- Row selection with bulk action toolbar

### Sharing & Export
**Share Modal:**
- Center-screen overlay with backdrop
- Public link generator with copy button
- Permission toggles: View-only, Allow downloads, Expiration date
- Password protection option
- Preview of shared view

**Export Options:**
- Dropdown menu with format options
- Chart exports: PNG (high-res), SVG, PDF
- Data exports: CSV, JSON, Excel
- Full report: PDF with insights + visualizations

### Form Elements
**Consistent Input Styling:**
- All inputs: h-10, rounded borders, px-4
- Focus states with ring indicator
- Labels above inputs (text-sm font-medium)
- Helper text below (text-xs)
- Error states with red accent and icon

## Page Layouts

### Dashboard View
**Structure:**
- Top nav (h-16)
- Sidebar (w-64) + Main content area
- Main area: Metrics row → AI insights → Visualization grid
- Empty state: Large illustration + "Upload your first dataset" CTA

### Analysis Workspace
**Structure:**
- Full-width top bar: Query input + dataset selector
- Three-column layout: Data preview (col-span-3), Chart area (col-span-6), AI insights sidebar (col-span-3)
- Tabbed interface for multiple analyses
- Bottom panel: Data quality checks, processing logs

### Shared Report View
**Structure:**
- Clean, minimal chrome (no sidebar)
- Report header: Title, description, author, timestamp
- Scrollable content: Insights + visualizations in single column
- Fixed footer: "Create your own analysis" CTA

## Images

**Dashboard Empty State:**
- Modern abstract data visualization illustration
- Placement: Center of main content area when no datasets uploaded
- Style: Geometric, colorful, professional (not cartoony)

**AI Assistant Visual:**
- Subtle AI assistant icon/illustration for empty query state
- Placement: Center of analysis workspace before first query
- Style: Minimal, tech-forward, approachable

**No Hero Image Required:** This is an application interface, not a marketing page. Focus on functional UI elements rather than decorative imagery.

## Animations

Use sparingly for functional feedback only:
- Loading states: Skeleton screens for data fetching
- Chart transitions: Smooth data updates (300ms ease)
- Modal entry/exit: Fade + scale (200ms)
- NO scroll-triggered animations or decorative motion