# WATTWISE: Intelligent Household Energy Management System
## Agent Architecture & Engineering Blueprint

This document specifies the architectural conventions, business rules, mathematical models, and development constraints governing the WATTWISE codebase.

---

## 1. System Identity & Core Tenets

- **Name:** WATTWISE (Version A — Advanced Software Simulation)
- **Tagline:** Monitor. Optimise. Save. Decide.
- **Simulation Disclaimer:** All telemetry, load draws, power profiles, and billing estimates are deterministic software simulations. No physical smart meter, IoT hardware, or remote electrical breaker is monitored or actuated. Simulated data is explicitly marked as such.
- **Client-Side Architecture:** The application runs fully in the browser with zero external cloud API dependencies, zero API keys, and zero paid service tiers.

---

## 2. Directory & Component Conventions

```
wattwise/
├── public/                 # Static assets, icons, SVGs
├── src/
│   ├── app/                # App container, routes, providers
│   ├── types/              # Strict TypeScript models
│   ├── data/               # Default appliances, demo time-series, Baba dialogue tree
│   ├── utils/              # Formatting, currency (₹), validation, combinatorics
│   ├── engines/            # Pure calculation & evaluation engines (NO React hooks/DOM)
│   ├── services/           # LocalStorage persistence, notifications, settings
│   ├── context/            # Global React state (AppContext, NotificationContext)
│   ├── hooks/              # Custom React hooks exposing state & actions
│   ├── components/         # Modular, reusable presentation & container components
│   │   ├── layout/         # Header, Sidebar, MobileNavigation, PageContainer
│   │   ├── common/         # MetricCard, ProgressBar, StatusBadge, Modal, EmptyState
│   │   ├── dashboard/      # Overview modules and KPIs
│   │   ├── appliances/     # CRUD cards, edit forms, power toggles
│   │   ├── budget/         # Budget forms, gauges, allocation matrices
│   │   ├── analytics/      # Recharts visualizations
│   │   ├── recommendations/# Heuristic cards & savings simulator
│   │   ├── emergency/      # Power cut banner, 3-appliance selector, C(6,3) advisor
│   │   └── bijli-baba/     # Hinglish contextual assistant popup & console
│   ├── pages/              # Exactly 7 page views corresponding to navigation modules
│   └── styles/             # Tailwind CSS & global design tokens
└── tests/                  # Automated unit and integration tests (Vitest)
```

---

## 3. Strict Business Rules & Mathematical Models

### 3.1 Central Energy Calculation Formulas (`calculationEngine.ts`)
- **Daily Energy Consumption (kWh):**
  $$\text{Daily kWh} = \frac{\text{Rated Power (W)} \times \text{Daily Operating Hours (h)}}{1000}$$
- **Monthly Energy Consumption (kWh):**
  $$\text{Monthly kWh} = \frac{\text{Rated Power (W)} \times \text{Daily Operating Hours (h)} \times \text{Billing Days}}{1000}$$
- **Current Instantaneous Power Draw (W):**
  $$\text{Current Power Draw} = \sum_{\text{active appliances}} \text{Rated Power (W)}$$
- **Projected Monthly Bill (₹):**
  $$\text{Projected Bill (₹)} = \left(\sum_{\text{all appliances}} \text{Monthly kWh}\right) \times \text{Electricity Tariff (₹/kWh)}$$
- **Appliance Cost Contribution (%):**
  $$\text{Appliance Contribution \%} = \frac{\text{Appliance Monthly Cost}}{\text{Total Monthly Projected Cost}} \times 100$$

### 3.2 Budget Progress Tiers (`budgetEngine.ts`)
- **Normal:** $< 75\%$ utilisation (Emerald `#20C997`)
- **Warning:** $75\% \le \text{Utilisation} < 90\%$ (Amber `#F5B942`)
- **Critical:** $90\% \le \text{Utilisation} \le 100\%$ (Red `#F06464`)
- **Over Budget:** $> 100\%$ utilisation (Flashing Crimson / Alert state)
- Threshold alerts must be dispatched to **BIJLI BABA** with cooldown deduplication.

### 3.3 Emergency Mode & The Exact-Three Rule (`emergencyEngine.ts`)
1. **Trigger Outage:** Normal appliance states are snapshotted into `normalStateSnapshot` and normal operations are frozen.
2. **Selection Rule:** Exactly 3 appliances can be active during Emergency Mode.
   - $0/3$, $1/3$, $2/3$ selections CANNOT be confirmed.
   - Attempting to select a 4th appliance is rejected by engine validation and triggers a Baba roast.
   - Confirmed emergency state enforces active status on exactly the 3 chosen appliances; all others are forced OFF.
3. **Power Restoration:** Restores the exact pre-outage appliance states from snapshot. No emergency state leaks into normal mode.

### 3.4 Smart Emergency Advisor — All 20 Combinations ($C(6,3) = 20$)
The advisor algorithm evaluates all combinations of 3 appliances from the 6 defaults:
$$C(6,3) = \frac{6 \times 5 \times 4}{3 \times 2 \times 1} = 20$$
Every combination is scored deterministically based on:
- Essentiality Score ($w_E = 0.45$): Refrigerator (40 pts), Fan (25 pts), LED Lights (35 pts).
- Efficiency Score ($w_P = 0.35$): Inverter battery preservation (penalizes high total wattage).
- Comfort Score ($w_C = 0.20$): Secondary utility.
- Inverter Overload Penalty ($P = 45$ pts if total load $> 1000\text{ W}$, e.g. AC).
- Best combination: **Refrigerator (150 W) + Ceiling Fan (75 W) + LED Lights (12 W)** = $237\text{ W}$, maximum emergency survival score.

### 3.5 BIJLI BABA Assistant Engine (`notificationService.ts`)
- **Personality:** Witty, slightly sarcastic, Hinglish-speaking energy mentor.
- **Modes:** `NORMAL` (encouraging + advisory), `ROAST` (sarcastic + sharp), `SILENT` (minimal / manual only).
- **Triggers:** Budget $\ge 75\%$, $\ge 90\%$, $> 100\%$, all appliances ON simultaneously, high consumer running, emergency trigger, 4th appliance reject, power restore.
- **Cooldown:** Minimum 60-second cooldown per trigger type to prevent notification fatigue.

---

## 4. UI/UX Visual Tokens

- **Background:** `#0B1220` (Deep Space Navy)
- **Card Background:** `#141F30` (Muted Dark Slate)
- **Secondary Background:** `#172C39` (Teal-tinted Midnight)
- **Primary Accent:** `#20C997` (Emerald Energy Green)
- **Warning:** `#F5B942` (Amber Gold)
- **Danger:** `#F06464` (Vibrant Coral Red)
- **Primary Text:** `#F5F7FA` (Crisp Off-White)
- **Secondary Text:** `#A5B1C2` (Muted Steel Blue)
- **Typography:** Space Grotesk (Headings, Numerics), Inter (Body, UI elements)

---

## 5. Persistence Protocol (`persistenceService.ts`)

- **Key:** `wattwise_v1_store`
- **Schema Version:** `1.0.0`
- **Fields:**
  - `appliances`: Array of appliances with configurations and states
  - `budgetConfig`: Monthly target (default ₹2500), tariff (default ₹8/kWh), billingCycleDays (default 30)
  - `emergencyState`: InEmergency (boolean), selectedIds (tuple of 3 or empty), normalSnapshot
  - `babaSettings`: Mode (`NORMAL` | `ROAST` | `SILENT`), audioEnabled (boolean)
  - `activityLog`: Array of timestamped system events
- **Migration & Recovery:** Invalid, truncated, or unparseable LocalStorage data triggers a safe fallback to `defaultAppliances` and default settings without crashing the UI.
