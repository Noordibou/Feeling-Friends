function Checkbox({ id, handleCheckboxChange, isChecked }) {
  return (
    <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      <span
        className={`checkbox ${isChecked ? "checkbox--active" : ""}`}
        aria-hidden="true"
      />
    </label>
  );
}
export default Checkbox;
