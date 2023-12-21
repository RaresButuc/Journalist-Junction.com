import { forwardRef } from "react";

function PasswordInput({ id }, ref) {
  return (
    <div class="form-floating">
      <input
        ref={ref}
        className="form-control"
        type="password"
        id={id}
        placeholder="Password"
        required
      />
      <label for={id}>Password</label>
    </div>
  );
}

export default forwardRef(PasswordInput);
