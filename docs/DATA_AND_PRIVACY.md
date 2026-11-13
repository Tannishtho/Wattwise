# WATTWISE – Data and Privacy Note

## 1. Overview

WATTWISE is designed as a browser-based household
electricity monitoring and management prototype.

Version A primarily performs its calculations and
data management locally within the browser.

## 2. Data Used by the Application

The application may use the following information:

| Data Field | Purpose |
|------------|---------|
| Appliance Name | Identifies household appliances |
| Appliance Wattage | Calculates energy consumption |
| Operating Hours | Estimates daily energy usage |
| Appliance Status | Determines active consumption |
| Electricity Tariff | Estimates electricity bills |
| Budget Information | Supports budget calculations |
| Historical Data | Displays demonstration analytics |

## 3. Data Storage

Version A uses browser LocalStorage for supported
application data persistence.

This means that supported information can remain
available between browser sessions on the same
browser and device.

The application does not require a remote database
for its current demonstration functionality.

## 4. External Services and Integrations

Version A does not implement:

- Remote database integration.
- Physical IoT device connectivity.
- Paid third-party APIs.
- Live electricity meter integration.

The project is hosted through Render.

Normal website hosting and browser network requests
are separate from the application's local calculation
and storage functionality.

## 5. Demonstration Data

Some information displayed in WATTWISE is
demonstration or simulated data.

This includes historical consumption information
and simulated emergency scenarios.

Such information should not be interpreted as
real-time electricity meter readings.

## 6. Sensitive Information

Users should not enter:

- Passwords.
- Banking credentials.
- Personal identification numbers.
- Private API keys.
- Other confidential information.

The application does not require these details
for its current functionality.

## 7. Data Removal

Users can clear browser LocalStorage through
their browser's developer tools or site data settings.

Clearing stored data may reset saved application
preferences and demonstration information.

## 8. Privacy Limitations

This is a prototype and has not undergone
a formal security or privacy audit.

Users should understand that browser storage
is local to the browser environment and is
not equivalent to encrypted cloud storage.

## 9. Conclusion

WATTWISE Version A demonstrates a local-first
approach to household electricity monitoring.

Its current architecture avoids the need for
a remote database, physical IoT devices or
paid external APIs.
