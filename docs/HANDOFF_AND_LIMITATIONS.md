# WATTWISE – Technical Handoff and Limitations

## 1. Project Overview

WATTWISE is a browser-based household electricity
monitoring and budget management application.

The project demonstrates energy consumption
calculations, appliance management, budget
estimation and simulated emergency scenarios.

## 2. Technology Stack

The application uses the following technologies:

| Technology | Purpose |
|------------|---------|
| React | User interface development |
| TypeScript | Type-safe application development |
| Vite | Development server and build tooling |
| Tailwind CSS | Interface styling |
| Recharts | Data visualisation |
| Lucide React | Icons and interface elements |
| LocalStorage | Browser-side data persistence |
| GitHub | Source code repository |
| Render | Application hosting |

## 3. Application Architecture

WATTWISE follows a frontend-oriented architecture.

The React interface manages the application's
screens, user interactions and visual components.

The TypeScript logic handles electricity
calculations, appliance states and application
decision-making.

LocalStorage provides browser-side persistence
for supported application data.

There is no remote database in Version A.

## 4. Main Application Modules

### 4.1 Overview Dashboard

Displays the main electricity consumption
and estimated billing information.

### 4.2 Appliance Management

Allows users to explore and manage household
appliance information and operating states.

### 4.3 Budget Planner

Calculates estimated electricity expenses
using consumption and tariff information.

### 4.4 Energy Analytics

Visualises available electricity consumption
and demonstration history.

### 4.5 Smart Recommendations

Provides energy-saving suggestions based on
the application's available information.

### 4.6 Emergency Mode

Demonstrates a simulated Power Cut scenario.

The selection logic restricts the scenario
to exactly three out of six default appliances.

The application evaluates all 20 possible
three-appliance combinations using their
power consumption values.

### 4.7 Settings

Provides access to available application
configuration and preferences.

## 5. Default Demonstration Appliance Data

The initial demonstration configuration includes:

| Appliance | Power | Daily Usage |
|-----------|-------|-------------|
| Air Conditioner | 1500 W | 6 hours |
| Refrigerator | 150 W | 24 hours |
| Fan | 75 W | 8 hours |
| Television | 100 W | 4 hours |
| Washing Machine | 500 W | 1 hour |
| LED Lights | 12 W | 6 hours |

These are demonstration values and may be
modified according to application inputs.

## 6. Electricity Calculation Logic

Daily energy consumption is calculated using:

Energy (kWh) =
(Power in Watts × Operating Hours) / 1000

Estimated billing-period consumption:

Total Energy =
Daily Energy × Number of Billing Days

Estimated Bill =
Total Energy × Configured Tariff

An appliance switched OFF contributes zero
consumption to the calculation.

## 7. Data Persistence

The application uses browser LocalStorage
for supported saved information.

Data may persist after refreshing the browser.

Clearing LocalStorage can reset stored
application information.

Historical demonstration information is not
equivalent to actual electricity meter records.

## 8. Important Limitations

The current version has the following limitations:

1. No physical IoT device integration.
2. No real-time electricity meter readings.
3. No remote database or cloud synchronisation.
4. Historical analytics may use simulated data.
5. Electricity bills are estimates rather than
   official utility billing calculations.
6. Emergency Mode does not control real electrical
   circuits or appliances.
7. Smart recommendations operate using the
   application's available information.

## 9. Future Improvements

Three major improvements for future development:

### Improvement 1 – IoT Integration

Integrate smart energy meters and IoT sensors
to obtain actual electricity consumption data.

### Improvement 2 – Cloud Infrastructure

Introduce a secure backend and database to
support user accounts, cloud synchronisation
and long-term consumption history.

### Improvement 3 – Intelligent Energy Optimisation

Introduce advanced machine learning models
to improve consumption forecasting,
personalised recommendations and energy
optimisation.

## 10. Developer Handoff

To continue development:

1. Clone the WATTWISE GitHub repository.
2. Install the required Node.js dependencies.
3. Start the Vite development server.
4. Explore the React components and TypeScript logic.
5. Review the calculation and persistence logic.
6. Run the application and verify its modules.

Typical commands:

    npm install
    npm run dev

To generate a production build:

    npm run build

The actual project scripts can be verified
in package.json.

## 11. Conclusion

WATTWISE Version A is a demonstration prototype
that combines household electricity monitoring,
estimated billing, appliance management and
simulated energy management.

Its architecture provides a foundation for
future development into a more comprehensive
smart energy management platform.
