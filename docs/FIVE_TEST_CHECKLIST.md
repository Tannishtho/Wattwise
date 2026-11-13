# WATTWISE – Five-Test Checklist

## 1. Purpose

This document describes five manual test scenarios
designed to verify the core functionality of WATTWISE.

Each test includes the testing procedure and
expected outcome.

## 2. Test Cases

### TEST 01 – Dashboard Loading

Objective:
Verify that the application loads correctly.

Steps:
1. Open the WATTWISE application.
2. Wait for the dashboard to load.
3. Check the displayed electricity information.
4. Verify that the dashboard components are visible.

Expected Result:
The dashboard loads successfully and displays
the available electricity consumption information.

Status: To be verified.

---

### TEST 02 – Appliance ON/OFF Functionality

Objective:
Verify appliance status management.

Steps:
1. Open Appliance Management.
2. Select an available appliance.
3. Switch the appliance OFF.
4. Observe the updated consumption.
5. Switch the appliance ON again.

Expected Result:
The appliance status changes correctly.
An OFF appliance contributes zero consumption
to the calculated usage.

Status: To be verified.

---

### TEST 03 – Electricity Bill Recalculation

Objective:
Verify the electricity consumption and
estimated billing calculation.

Steps:
1. Open the Budget Planner.
2. Note the current estimated bill.
3. Modify the appliance usage inputs.
4. Observe the updated estimated bill.

Expected Result:
The application recalculates the estimated
electricity consumption and bill using the
updated inputs.

Status: To be verified.

---

### TEST 04 – Invalid Input Handling

Objective:
Verify how the application handles invalid inputs.

Steps:
1. Open a module containing editable numeric inputs.
2. Attempt to enter an invalid value, such as
   negative appliance wattage.
3. Observe the application's response.
4. Check whether the invalid value is rejected
   or handled safely.

Expected Result:
Invalid values should not produce misleading
electricity calculations or break the application.

Status: To be verified.

---

### TEST 05 – Emergency Mode and Reset

Objective:
Verify the simulated Power Cut functionality
and application state recovery.

Steps:
1. Open Emergency Mode.
2. Select three appliances for the simulated
   Power Cut scenario.
3. Attempt to select a fourth appliance.
4. Observe the application's selection restriction.
5. Reset the scenario.
6. Refresh the application and inspect the state.

Expected Result:
The simulated Power Cut scenario allows
exactly three of the six default appliances
to be selected.

A fourth selection should be blocked.

The reset operation should restore the scenario
to its initial state.

Status: To be verified.

---

## 3. Test Summary

| Test ID | Test Description | Status |
|---------|------------------|--------|
| TEST 01 | Dashboard Loading | Pending |
| TEST 02 | Appliance Management | Pending |
| TEST 03 | Bill Recalculation | Pending |
| TEST 04 | Invalid Input Handling | Pending |
| TEST 05 | Emergency Mode and Reset | Pending |

## 4. Testing Notes

- All tests are performed manually.
- Testing uses demonstration appliance data.
- Actual results should be recorded after execution.
- Any unexpected behaviour should be documented
  before the final project submission.

## 5. Conclusion

The five test scenarios cover the primary user
workflows, calculation behaviour, invalid input
handling and simulated emergency functionality
of the WATTWISE application.
