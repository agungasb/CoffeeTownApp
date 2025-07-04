# BakeWise Application - Calculation Formulas

This document outlines the key formulas and logic used for calculations throughout the BakeWise application.

## 1. Production Calculator Tab

### 1.1. Calculation Results

The "Calculation Results" section displays various metrics based on the production quantities you enter.

#### **Product-Specific Metrics (e.g., Total Loyang)**

For products that have a defined `calculation` object (managed in the "Product Management" tab), a specific metric is calculated.

- **Formula:** `(Product Quantity / Divisor) * Multiplier`
- **Example:** If "Abon Sosis" has a `divisor` of 15 and a `unit` of 'loyang', and you enter a quantity of 30, the result will be `(30 / 15) = 2 loyang`.

---

#### **Total Roti**

This is the simplest metric, representing the total number of individual items to be produced for the selected department.

- **Formula:** `SUM(All Product Quantities Entered)`
- **Example:** If you enter 30 "Abon Sosis" and 20 "Cheese Roll", Total Roti will be `30 + 20 = 50 pcs`.

---

#### **Total Loyang**

This metric aggregates the "loyang" calculation from all relevant products.

- **Formula:** `SUM(Individual Product Loyang Calculations)`
- **Example:** If "Abon Sosis" results in `2 loyang` and "Hot Sosis" results in `1 loyang`, the Total Loyang will be `3 loyang`.

---

#### **Base Recipe Requirements (e.g., Adonan Roti Manis)**

The app calculates how many batches of a base recipe are needed.

1.  **Calculate Total Dough Needed:** For each product linked to the recipe, it multiplies the `Product Quantity` by the `Dough Weight` defined in that product's settings. It then sums these values.
    - `Total Dough Needed = SUM(Product Quantity * Dough Weight per Product)`
2.  **Calculate Recipe Multiplier:** It divides the `Total Dough Needed` by the `Base Weight` of the recipe itself. (The recipe's `Base Weight` is either a manual override or the sum of its own ingredients).
    - **Formula:** `Recipes Needed = Total Dough Needed / Recipe Base Weight`

---

### 1.2. Ingredient Summary

This section shows the total amount of every single ingredient required for the entire production run.

- **Formula:** The summary is an aggregation of ingredients from two sources:
    1.  **From Base Recipes:** For each required base recipe, the app takes the `Recipes Needed` multiplier (calculated above) and multiplies it by the amount of each ingredient within that recipe.
    2.  **From Products (Additional Ingredients):** For each product you are making, the app takes the `Product Quantity` you entered and multiplies it by the amount of each "additional ingredient" listed for that product.

All identical ingredients (e.g., "Tepung" from three different recipes) are then summed up into a single total.

---

## 2. Recipe Scaler Tab

This calculation is straightforward.

- **Formula:** `Scaled Amount = Original Ingredient Amount * Multiplier`
- **Example:** If a recipe calls for 100g of flour and you enter a multiplier of `1.5`, the scaled amount will be `100 * 1.5 = 150g`.

---

## 3. Inventory Management Tab (Order CUK)

The "Order CUK" (Order Recommendation Calculator) uses historical data to forecast needs.

### 3.1. Average Daily Usage

This is calculated for the specific day of the week you select for the forecast (e.g., Monday).

- **Logic:** The app finds the **last 4 saved usage records** for that specific day of the week (e.g., the last 4 Mondays). It then calculates the average amount used for each ingredient across those days.
- **Formula:** `Average Usage = SUM(Ingredient Amount from last 4 relevant days) / 4` (or divided by the number of records found, if less than 4).

### 3.2. Recommended Order Amount

This formula determines how much of an ingredient you need to order to meet the forecast and replenish your stock to its minimum safe level.

- **Formula:** `Amount to Order = (Minimum Stock + Average Daily Usage for Forecast Day) - Current Stock`

- **Notes:**
    - If the result is zero or negative, it means you have enough stock, and no recommendation is shown for that item.
    - If an ingredient has an "Order Unit" defined (e.g., ordering a "sak" of 25,000g), the final recommendation is converted to that larger unit for convenience.
