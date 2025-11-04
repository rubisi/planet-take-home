import DateTimeRangePicker from "./DateTimeRangePicker.jsx";

export default function FilterBar({
  customers,
  customerFilter, // all or specific ID
  onCustomerChange, // function to call when customer filter changes
  startTime,
  endTime,
  onStartChange,
  onEndChange,
  onReset,
  visibleCount, // number of orders currently visible on the map
}) {
  return (
    <div className="filterbar">
      {/* Customer filter: */}
      <label className="field-inline">
        <strong>Customer:</strong>
        <select
          className="control"
          value={customerFilter}
          onChange={(e) => onCustomerChange(e.target.value)}
        >
          {/* Default to show all customers */}
          <option value="all">All</option> 

          {/* Render a list of customer IDs */}
          {customers.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </label>

      {/* Date time range filter: */}
      <DateTimeRangePicker
        startTime={startTime}
        endTime={endTime}
        onStartChange={onStartChange}
        onEndChange={onEndChange}
      />

      {/* Clear all selected filters */}
      <button className="btn" onClick={onReset}>Reset</button>

      <span className="chip">{visibleCount} orders shown</span>
    </div>
  );
}
