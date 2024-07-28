import { useState } from "react";

function Checkbox({ label }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <label style={{ display: 'flex', alignItems: 'center' }}>
      <input
        id={label}
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <span
        className={`checkbox ${isChecked ? "checkbox--active" : ""}`}
        aria-hidden="true"
      />
    </label>
  );
}
export default Checkbox;