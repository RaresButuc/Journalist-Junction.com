import { forwardRef } from "react";

function NameInput({ user, id }, ref) {
  return (
    <div className="form-floating">
      <input
        ref={ref}
        className="form-control"
        type="name"
        name="nameInput"
        id={id}
        placeholder="Username"
        defaultValue={user?.name}
        required
      />
      <label htmlFor={id}>Username</label>
    </div>
  );
}

export default forwardRef(NameInput);
