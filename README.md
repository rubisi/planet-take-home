# Bubble Tea Orders – Take Home Assignment

This project visualizes bubble tea delivery orders on an interactive map.
It includes:
- A **Python preprocessing script** (`prepare_orders.py`) to convert the raw CSV into JSON.
- A **React + Leaflet frontend** (`bubbletea-orders/`) to display and filter orders.

## Folder structure
planet-take-home/
    - fullstack-sample-orders.csv   -> the provided raw input data  
    - prepare_orders.py             -> converts CSV to orders.json(saves in bubbletea-orders/public)
    - bubbletea-orders/             -> React frontend project

## How to run
1. From `planet-take-home/`:
   ```bash
    python prepare_orders.py 
    ```

2. Start the frontend:
   ```bash
    cd bubbletea-orders
    npm install
    npm run dev 
    ```
    Open http://localhost:5173 in your browser

## Features
- **Interactive map view**: Displays all customer orders as markers using React Leaflet
- **Customer filter**: Dropdown menu lets us view either all customers or a single customer’s orders
- **Date & time filters**: Two datetime-local pickers allow selecting any time range to show only relevant orders
- **Reset button**: Quickly clears all filters and restores the full dataset
- **Order counter**: Displays the number of currently visible orders that match the selected filters
- **Marker details**: Clicking a marker opens a popup showing customerID, lat, long and order timestamp
- **Responsive UI**: Layout and map scale adjust smoothly across desktop, tablet, and mobile screen widths

## Notes
- In the current version of `prepare_orders.py`, helper functions such as `parse_point()` and `parse_ts()` are kept in the same file for simplicity and readability.
For larger or more complex projects, it would be recommended to separate reusable logic (eg. parsing, validation, I/O helpers) into dedicated modules for example in a `data_utils/` package.

- I used native JavaScript Date comparisons (>=, <=) instead of the date-fns helpers (isBefore, isAfter) for simplicity. They provide equivalent behavior for this dataset and keep the app lightweight and dependency free.

## Possible improvements to this application
- Persistent filters stored in localStorage
- Color coded markers per customer so that we can visually tell which orders belong to whom
- Summary sidebar with per-customer order counts
- We could use a **date/time picker component** (for example, `react-datepicker` or MUI’s `DateTimePicker`) for a richer and more consistent user experience