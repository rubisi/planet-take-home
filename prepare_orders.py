"""
This script cleans and converts the raw bubble tea orders CSV file into a clean JSON file that can be consumed by the React frontend.

Each order row contains:
  - customerId
  - a point [lat, lon]
  - a timestamp (sometimes with 24:00 edge case)

Output:
  public/orders.json  -> This will be used by the React app to render orders on a map
"""

import json
import re
from ast import literal_eval
from datetime import datetime, timedelta
from pathlib import Path
import pandas as pd

# File paths
SRC = Path("fullstack-sample-orders.csv") # input CSV
OUT = Path("bubbletea-orders/public/orders.json") # output JSON

# parse [lat, lon] from the "point" column
def parse_point(val):
    s = str(val).strip()
    try:
        pair = literal_eval(s) # literal_eval safely parses Python-style lists/tuples
        if isinstance(pair, (list, tuple)) and len(pair) == 2: # convert point column to lat/long tuple
            return float(pair[0]), float(pair[1])
    except Exception:
        pass

    # Fall back to regex parsing if the format isn't clean JSON/Python syntax
    m = re.findall(r"[-+]?\d*\.\d+|\d+", s)
    if len(m) >= 2:
        return float(m[0]), float(m[1])
    
    # If we can't parse it, return empty coords
    return None, None

# Parse timestamps safely with 24:..:.. edge case handling
def parse_ts(ts_str):
    s = str(ts_str).strip()

    # Detect and handle "24:.." timestamps
    m = re.match(r"(\d{4}-\d{2}-\d{2})\s+24:(\d{2}):(\d{2})$", s)
    if m:
        day = datetime.strptime(m.group(1), "%Y-%m-%d").date()
        return (datetime.combine(day, datetime.min.time())
                + timedelta(hours=24, minutes=int(m.group(2)), seconds=int(m.group(3))))
    
    # Normal timestamp (should cover most rows)
    return datetime.strptime(s, "%Y-%m-%d %H:%M:%S")

# Main conversion logic
def main():
    # Step 1: Load the raw CSV into a DataFrame
    df = pd.read_csv(SRC)

    # Step 2: Standardize column names in case they differ (for example, "time" vs "timestamp")
    df = df.rename(columns={
        "time": "timestamp",
        "customer_id": "customerId",
        "customerId": "customerId",
        "point": "point",
        "timestamp": "timestamp",
    })

    # Step 3: Parse each order's point -> lat/lon and timestamp -> datetime
    df["lat"], df["lon"] = zip(*df["point"].map(parse_point))
    df["dt"] = df["timestamp"].map(parse_ts)
    df["iso"] = df["dt"].dt.strftime("%Y-%m-%dT%H:%M:%S")

    # Step 4: Quick sanity checks in the terminal
    dup_times = df["iso"][df["iso"].duplicated()].unique().tolist()
    print(f"Rows: {len(df)} | Unique customers: {df['customerId'].nunique()}")
    print(f"Missing lat: {df['lat'].isna().sum()} | Missing lon: {df['lon'].isna().sum()} | Missing dt: {df['dt'].isna().sum()}")
    print(f"Duplicate timestamps (should be none): {dup_times}")

    # Step 5: Select only the relevant columns for the frontend
    records = (
        df.sort_values("dt")[["customerId", "lat", "lon", "iso"]]
          .rename(columns={"iso": "timestamp"})
          .to_dict(orient="records")
    )

    # Step 6: Write the cleaned data to a JSON file
    with OUT.open("w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(records)} rows to {OUT.resolve()}")

# Run the main function
if __name__ == "__main__":
    main()
