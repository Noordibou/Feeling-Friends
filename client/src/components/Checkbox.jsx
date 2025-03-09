function Checkbox({ id, handleCheckboxChange, isChecked, label }) {
  return (
    <label
      htmlFor={id}
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
    >
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        aria-label={label}
      />
      <span
        className={`checkbox ${isChecked ? "checkbox--active" : ""}`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </label>
  );
}
export default Checkbox;
