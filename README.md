# WATTWISE: Intelligent Household Energy Management System
### *Monitor. Optimise. Save. Decide.*

**Version:** Version A — Advanced Software Simulation  
**Category:** Smart Energy Management / Sustainable Technology / Intelligent Resource Optimisation  
**Target Environment:** Modern Web Browsers (React 18+, TypeScript, Tailwind CSS, Vite)

---

## 1. Project Introduction

**WATTWISE** is an intelligent, full-stack client-side household energy management platform. Engineered as a software-based advanced simulation, it equips homeowners with deep visibility into simulated electrical energy consumption, dynamic tariff billing projections, proactive budget management, explainable energy-saving recommendations, and an intelligent emergency power-outage decision advisor.

Rather than relying on generic mock data or static dashboards, WATTWISE is built on a centralized mathematical engine with strict separation of concerns, deterministic physics-based formulas, LocalStorage persistence, and a witty contextual assistant named **BIJLI BABA**.

---

## 2. Problem Statement

Residential electricity consumption is commonly shrouded in post-facto billing:
1. **Lack of Instantaneous Visibility:** Homeowners receive a consolidated bill at the end of the month without understanding which appliances are driving peak demand.
2. **Budget Blindness:** Without real-time tracking, households frequently cross comfortable expenditure thresholds without early warning.
3. **Power Outage Decision Fatigue:** During blackouts, inverter and battery backup systems face catastrophic sudden overloads or premature battery drain because occupants do not know which combination of appliances safely balances survival needs against electrical stress.
4. **Opaque Recommendations:** Conventional energy-saving tips are abstract ("save power"), failing to provide mathematically verifiable rupee savings.

---

## 3. Proposed Solution

WATTWISE provides an end-to-end, browser-based intelligent simulation platform:
- **Centralized Calculation Engine:** Instantaneous load (W), daily consumption (kWh), projected monthly energy (kWh), and dynamic tariff-based bills (₹) update synchronously across all modules.
- **Explainable Optimization Heuristics:** Actionable recommendations that directly calculate the exact monthly kWh and ₹ saved when adjusting duty cycles.
- **The Smart Emergency Advisor ($C(6, 3) = 20$ Combinations):** A combinatorial optimization engine that deterministically ranks all 20 possible 3-appliance trios during an outage, recommending the combination that maximizes life-support essentiality while preserving battery runtime.
- **Contextual Assistance (BIJLI BABA):** A responsive, rule-based assistant delivering witty Hinglish feedback across three configurable modes (`ROAST`, `NORMAL`, `SILENT`).

---

## 4. System Objectives

1. Enable real-time simulation and monitoring of household electrical equipment.
2. Provide a single source of truth for energy and billing calculations.
3. Implement multi-tiered budget threshold monitoring with proactive alerts at 75%, 90%, and 100%.
4. Enforce strict business logic rules for emergency backup operation (the Exact-Three rule).
5. Deliver transparent, explainable recommendations without external AI API dependencies.
6. Guarantee persistence across browser refreshes via versioned LocalStorage schemas.

---

## 5. System Architecture & Component Hierarchy

```
WATTWISE/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Main layout shell with Sidebar, Header & Toast
│   │   └── routes.tsx                 # React Router v6 routing across all 7 modules
│   ├── types/                         # Strict TypeScript interfaces
│   │   ├── appliance.ts               # Appliance, category, essentiality & duty cycle
│   │   ├── energy.ts                  # Power metrics, kWh, load profiles
│   │   ├── budget.ts                  # Budget targets, tiers, cost contribution
│   │   ├── emergency.ts               # Combinations, validation, score breakdowns
│   │   ├── notification.ts            # Baba dialogue types, moods, timestamps
│   │   └── settings.ts                # Application preferences and persistence schema
│   ├── engines/                       # Pure mathematical and algorithmic engines
│   │   ├── calculationEngine.ts       # Central source of truth for Watts, kWh, ₹
│   │   ├── budgetEngine.ts            # Utilisation percentage & threshold tiers
│   │   ├── recommendationEngine.ts    # Explainable savings heuristics
│   │   ├── emergencyEngine.ts         # Strict 3-appliance validator & C(6,3)=20 scoring
│   │   └── analyticsEngine.ts         # Time-series aggregation & chart transforms
│   ├── services/                      # Decoupled state and persistence services
│   │   ├── persistenceService.ts      # Versioned LocalStorage with deep cloning & fallback
│   │   ├── applianceService.ts        # Appliance CRUD & duty cycle updates
│   │   ├── notificationService.ts     # Baba event cooldown & deduplication registry
│   │   └── settingsService.ts         # Settings manager & factory reset
│   ├── context/
│   │   └── AppContext.tsx             # Global application state and event dispatchers
│   ├── hooks/                         # Specialized custom React hooks
│   ├── components/                    # Modular presentation & container components
│   │   ├── layout/                    # Sidebar, Header, MobileNav, PageContainer
│   │   ├── common/                    # MetricCard, ProgressBar, StatusBadge, Modals
│   │   ├── appliances/                # ApplianceCard, ApplianceModal
│   │   └── bijli-baba/                # BabaToast, dialogue selectors
│   ├── pages/                         # Exactly 7 primary module views
│   │   ├── DashboardPage.tsx          # Module 01: Overview Dashboard
│   │   ├── AppliancesPage.tsx         # Module 02: Appliance Management
│   │   ├── BudgetPage.tsx             # Module 03: Budget Planner
│   │   ├── AnalyticsPage.tsx          # Module 04: Energy Analytics
│   │   ├── RecommendationsPage.tsx    # Module 05: Smart Recommendations
│   │   ├── EmergencyPage.tsx          # Module 06: Emergency Mode & Advisor
│   │   └── SettingsPage.tsx           # Module 07: Settings & Configuration
│   └── styles/
│       └── globals.css                # Tailwind tokens, dark palette, animations
├── tests/                             # Vitest automated unit test suites
│   ├── calculationEngine.test.ts      # 8 unit tests for formulas & live reactivity
│   ├── budgetEngine.test.ts           # 6 unit tests for tiers & allocations
│   ├── emergencyEngine.test.ts        # 10 unit tests for exact-3 & 20 combinations
│   ├── recommendationEngine.test.ts   # 3 unit tests for savings heuristics
│   └── persistenceService.test.ts     # 4 unit tests for LocalStorage & recovery
├── AGENTS.md                          # Mandatory agent blueprint & architectural rules
└── package.json
```

---

## 6. The Seven Application Modules

### Module 01 — Overview Dashboard
Consolidates the entire household telemetry into an executive overview:
- **Top 4 KPI Cards:** Current Power Draw ($W$), Today's Energy ($kWh$), Projected Monthly Consumption ($kWh$), Projected Monthly Bill ($₹$).
- **24-Hour Diurnal Load Profile:** Simulated residential hourly demand showing morning and evening peak windows.
- **Budget Utilisation Indicator:** Multi-tiered visual gauge tracking pace toward target.
- **Active Appliance Status Grid:** Direct switches for toggling equipment.
- **Highest Consumer Card:** Highlights the single equipment placing the greatest strain on the monthly bill.
- **Recent Activity Log:** Live timestamped audit log of all system state changes.

### Module 02 — Appliance Management
Comprehensive control and lifecycle management of household equipment:
- **Default Equipment:** Pre-loaded with standard domestic appliances:
  1. *Air Conditioner:* $1500\text{ W}$, $6\text{ h/day}$, Optional, High Comfort.
  2. *Refrigerator:* $150\text{ W}$, $24\text{ h/day}$, Critical, Medium Comfort.
  3. *Ceiling Fan:* $75\text{ W}$, $8\text{ h/day}$, Essential, High Comfort.
  4. *Television:* $100\text{ W}$, $4\text{ h/day}$, Optional, Medium Comfort.
  5. *Washing Machine:* $500\text{ W}$, $1\text{ h/day}$, Optional, Low Comfort.
  6. *LED Lights:* $12\text{ W}$, $6\text{ h/day}$, Essential, High Comfort.
- **Interactive Controls:** Instant power toggling, power rating updates, daily duty cycle adjustments, custom appliance creation, and safe deletion with confirmation modals.
- **Validation:** Strict validation preventing negative wattages or runtimes outside $0 - 24\text{ hours}$.

### Module 03 — Budget Planner
Interactive financial forecasting tool:
- **Parameters:** User-configurable monthly bill target (default ₹2,500), electricity tariff (default ₹8/kWh), and billing cycle days (default 30 days).
- **Threshold State Classification:**
  - *Normal:* $< 75\%$ utilisation.
  - *Warning:* $75\% \le \text{Utilisation} < 90\%$.
  - *Critical:* $90\% \le \text{Utilisation} \le 100\%$.
  - *Over Budget:* $> 100\%$ utilisation (alert state).
- **Cost Contribution Table:** Tabulates appliance-wise energy demand, rupee cost, and percentage of total bill.
- **Suggested Allocation View:** Demonstrates an essentiality-weighted ideal distribution of the target budget.

### Module 04 — Energy Analytics
Data visualization suite powered by Recharts:
- **24-Hour Diurnal Load Profile (Area Chart):** Hourly simulated power demand highlighting peak evening hours ($18:00 - 22:00$).
- **Appliance-Wise Consumption (Bar Chart):** Comparative monthly kWh consumption across all household appliances.
- **Cost Contribution (Donut Chart):** Interactive slice breakdown of expenditure shares.
- **Cumulative Monthly Pace (Line Chart):** Day-by-day accumulation over the billing cycle compared with the linear budget pace.
- **30-Day Simulated Historical Demonstration:** Realistic historical trend with weekend occupancy variability.

### Module 05 — Smart Recommendations
Explainable, rule-based algorithmic heuristics:
- **High-Priority Runtime Adjustments:** Analyzes equipment wattage, current daily runtime, and comfort level to propose specific hourly reductions (e.g., trimming AC runtime by 2 hours).
- **Transparent Calculations:** Every recommendation computes and displays the exact kWh and ₹ saved per month.
- **One-Click Application:** "Apply Runtime" immediately adjusts the appliance configuration and recalculates household metrics.
- **Interactive "What-If" Savings Simulator:** Real-time slider allowing users to test hypothetical duty cycle adjustments and preview the financial impact before committing.

### Module 06 — Emergency Mode & Smart Advisor (The Project Twist)
A full-scale simulated power-outage decision management system:
- **Trigger Power Cut:** Simulates utility grid blackout, activates emergency status banner, and freezes normal operations.
- **The Exact-Three Rule:**
  - Users must select **exactly three** appliances to run on backup power.
  - Selections of $0/3$, $1/3$, or $2/3$ cannot be confirmed.
  - Selecting a 4th appliance is rejected by engine business logic with an error message and a Baba roast.
- **The Smart Emergency Advisor:**
  - Evaluates all $C(6, 3) = 20$ combinations of 3 appliances from the 6 default appliances.
  - Deterministic composite scoring algorithm evaluating Essentiality, Power Draw, and Comfort.
  - Recommends the #1 combination: **Refrigerator (150W) + Ceiling Fan (75W) + LED Lights (12W)** ($237\text{ W}$ total load, zero inverter overload risk).
  - Displays a complete ranked table of all 20 combinations with scores, power draws, and risk statuses.
- **Clean Grid Restoration:** Restores the exact pre-outage appliance states from snapshot with zero state leakage into normal mode.

### Module 07 — Settings & Configuration
Central configuration console:
- Adjust tariff rate, monthly target, billing days, and currency symbol.
- Switch BIJLI BABA modes (`ROAST`, `NORMAL`, `SILENT`) and toggle sound.
- Factory reset utility with confirmation modal to restore pristine competition demonstration defaults.

---

## 7. Mathematical Formulations

### 7.1 Energy & Cost Calculations (`calculationEngine.ts`)

$$\text{Daily Energy (kWh)} = \frac{\text{Rated Power (W)} \times \text{Daily Operating Hours (h)}}{1000}$$

$$\text{Monthly Energy (kWh)} = \frac{\text{Rated Power (W)} \times \text{Daily Operating Hours (h)} \times \text{Billing Days}}{1000}$$

$$\text{Monthly Cost (₹)} = \text{Monthly Energy (kWh)} \times \text{Tariff (₹/kWh)}$$

$$\text{Current Instantaneous Power Draw (W)} = \sum_{a \in \text{active appliances}} \text{Rated Power}(a)$$

$$\text{Projected Monthly Bill (₹)} = \left(\sum_{a \in \text{all appliances}} \text{Monthly Energy}(a)\right) \times \text{Tariff}$$

$$\text{Appliance Cost Contribution (\%)} = \left(\frac{\text{Appliance Monthly Cost}}{\text{Total Monthly Projected Cost}}\right) \times 100$$

### 7.2 Emergency Advisor Optimization Scoring (`emergencyEngine.ts`)

The total number of 3-appliance combinations from the 6 default appliances is:
$$C(6, 3) = \frac{6!}{3!(6 - 3)!} = 20 \text{ combinations}$$

For each combination $C$, the composite score $S \in [0, 100]$ is computed as:
$$S = 0.45 \cdot S_{\text{essential}} + 0.35 \cdot S_{\text{efficiency}} + 0.20 \cdot S_{\text{comfort}} - P_{\text{overload}}$$

Where:
- **$S_{\text{essential}}$ (0 - 100 pts):**
  - Refrigerator (Food & medicine preservation): 40 pts
  - LED Lights (Illumination & safety): 35 pts
  - Ceiling Fan (Ventilation & heatstroke prevention): 25 pts
  - Secondary equipment (AC, TV, Washer): 0 essentiality pts
- **$S_{\text{efficiency}}$ (0 - 100 pts):** Measures battery preservation:
  $$S_{\text{efficiency}} = \max\left(0, 100 \times \left(1 - \frac{P_{\text{total}}}{2150\text{ W}}\right)\right)$$
- **$S_{\text{comfort}}$ (0 - 100 pts):** Based on comfort levels (High = 15, Med = 10, Low = 5).
- **$P_{\text{overload}}$ (Inverter Trip Penalty):** If $P_{\text{total}} > 1000\text{ W}$, a penalty of $45\text{ points}$ is deducted to reflect severe inverter overload risk.

---

## 8. BIJLI BABA Assistant Architecture

BIJLI BABA is an integrated contextual mentor operating through pure rule-based reactive event watchers:
- **Triggers:** Budget crossing 75%, 90%, 100%; all appliances switched ON; high-wattage appliance active; savings applied; power cut triggered; 4th appliance rejected; normal power restored.
- **Cooldown & Anti-Spam:** A 45-second cooldown timestamp registry per trigger event prevents notification spam.
- **Three Modes:**
  - `ROAST`: Sarcastic, humorous Hinglish roasts (*"Bijli ka bill tera baap bharega kya?"*, *"AC ko Antarctica samajh ke chala raha hai kya?"*).
  - `NORMAL`: Polite, encouraging energy advice.
  - `SILENT`: No unsolicited toasts; advice is delivered on-demand via the "Ask Baba" button.

---

## 9. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript 5.7 |
| **Build & Dev Tooling** | Vite 6, WebAssembly Rollup (`@rollup/wasm-node`) |
| **Styling & Design System** | Tailwind CSS 3.4, PostCSS, Lucide React icons |
| **Data Visualisation** | Recharts 2.13 (Responsive Area, Bar, Line, Pie charts) |
| **Routing** | React Router DOM v6 |
| **Automated Testing** | Vitest 2.1 (Unit & Integration tests) |
| **Data Storage** | Browser LocalStorage (Key: `wattwise_v1_store`, Schema: `v1.0.0`) |

---

## 10. Installation & Setup Guide

### Prerequisites
- Node.js (v18.0.0 or higher, tested with LTS v22.11.0)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone or navigate to the project directory
cd C:\Users\tanni\.gemini\antigravity\scratch\wattwise

# Install dependencies
npm install
```

### Running Development Server
```bash
npm run dev
```
The application will launch locally at `http://localhost:3000`.

### Executing Automated Unit Tests
```bash
npm test
```
Executes all 31 unit tests across calculation, budget, emergency, recommendation, and persistence engines.

### Production Build
```bash
npm run build
```
Typechecks the TypeScript codebase via `tsc` and compiles optimized production assets to the `dist/` directory.

---

## 11. Judging Demonstration Walkthrough

1. **Normal Operation:** Open Dashboard. Review the 4 KPI metric cards. Navigate to Appliance Management, toggle the Air Conditioner OFF, and note the immediate live drop in current power draw and monthly projected bill.
2. **Budget Intelligence:** Navigate to Budget Planner. Lower the monthly target to ₹2,500. Observe the progress bar transition from Normal to Warning or Critical. Review the appliance contribution table.
3. **Energy Analytics:** Navigate to Energy Analytics. Inspect the 24-hour diurnal load curve, the appliance comparison bar chart, and the cost distribution donut.
4. **Smart Recommendations:** Navigate to Smart Recommendations. Locate the AC runtime recommendation, click "Apply Runtime", and observe the updated household calculations.
5. **Simulated Power Outage (The Exact-Three Rule):** Click "Trigger Power Cut" in the header or Emergency Mode page. Confirm the outage. Attempt to select 4 appliances and verify that the business logic rejects the 4th with a Baba roast. Select exactly 3 appliances and confirm.
6. **Smart Emergency Advisor (The Twist):** Switch to the "Smart Emergency Advisor" tab. View all 20 evaluated combinations. Note why Refrigerator + Fan + LED Lights (#1) beats AC + Fridge + Fan (which trips the inverter).
7. **Restoration:** Click "Restore Normal Power". Confirm that all appliances return to their exact pre-outage states.
8. **Bijli Baba Interaction:** Switch between Roast, Normal, and Silent modes in Settings or the Sidebar, and click "Ask Baba" for contextual advice.

---

## 12. Project Limitations & Future Scope

### Project Limitations (Version A)
- **Simulation Disclaimer:** Version A is an advanced software simulation. It does not interface with physical smart meters, current transformers, or IoT breakers.
- **Slab-Based Tariffs:** Calculations assume a single weighted tariff (default ₹8/kWh); progressive slab billing and state electricity duties are not included in Version A.

### Future Scope (Version B / Hardware Evolution)
- Integration with ESP32 / Arduino-based smart sub-meters via MQTT/WebSockets.
- Real-time weather API integration to correlate air conditioning runtime with ambient temperature.
- Mobile application build via React Native or Progressive Web App (PWA) with push notifications.
