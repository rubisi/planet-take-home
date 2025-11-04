import { useEffect, useMemo, useState } from "react";
import FilterBar from "./components/FilterBar.jsx";
import OrdersMap from "./components/OrdersMap.jsx";

export default function App() {
  // State
  const [orders, setOrders] = useState([]);
  // User selected filters
  const [customerFilter, setCustomerFilter] = useState("all");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    fetch("/orders.json")
      .then((r) => r.json())
      .then((data) => setOrders(data))
      .catch((e) => console.error("Failed to load orders.json", e));
  }, []);

  // Filtered orders based on user selections
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      // Filter by customer if not selected "all"
      const matchCustomer =
        customerFilter === "all" || String(o.customerId) === String(customerFilter);
      // Convert timestamps to Date objects for comparisons
      const t = o.timestamp ? new Date(o.timestamp) : null;
      // Filter by time range
      const matchStart = !startTime || (t && t >= new Date(startTime));
      const matchEnd = !endTime || (t && t <= new Date(endTime));
      
      return matchCustomer && matchStart && matchEnd;
    });
  }, [orders, customerFilter, startTime, endTime]);

  // Get sorted list of unique customer IDs for the dropdown
  const uniqueCustomers = useMemo(
    () => [...new Set(orders.map(o => o.customerId))].sort((a,b)=>a-b),
    [orders]
  );

  // Reset handling
  const resetFilters = () => {
    setCustomerFilter("all");
    setStartTime("");
    setEndTime("");
  };

  return (
    <div>
      <FilterBar
        customers={uniqueCustomers}
        customerFilter={customerFilter}
        onCustomerChange={setCustomerFilter}
        startTime={startTime}
        endTime={endTime}
        onStartChange={setStartTime}
        onEndChange={setEndTime}
        onReset={resetFilters}
        visibleCount={filtered.length} // shows how many orders match filters
      />

      {/* Display the filtered orders on the map */}
      <OrdersMap orders={filtered} />
    </div>
  );
}
