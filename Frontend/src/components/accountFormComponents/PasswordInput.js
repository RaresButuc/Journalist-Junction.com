import { forwardRef } from "react";

function PasswordInput({ id }, ref) {
  return (
    <div className="form-floating">
      <input
        ref={ref}
        className="form-control"
        type="password"
        name="passwordInput"
        id={id}
        placeholder="Password"
        required
      />
      <label htmlFor={id}>Password</label>
    </div>
  );
}

export default forwardRef(PasswordInput);
