export default function DateTimeRangePicker({
  startTime,
  endTime,
  onStartChange,
  onEndChange,
  label = "Time range",
}) {
  return (
    <div className="dtrp">
      <strong className="dtrp-label">{label}:</strong>

      {/* Start date/time input */}
      <label className="field-inline">
        <span>Start</span>
        <input
          className="control"
          type="datetime-local"
          value={startTime}
          onChange={(e) => onStartChange(e.target.value)}
        />
      </label>

      {/* End date/time input */}
      <label className="field-inline">
        <span>End</span>
        <input
          className="control"
          type="datetime-local"
          value={endTime}
          onChange={(e) => onEndChange(e.target.value)}
        />
      </label>
    </div>
  );
}
