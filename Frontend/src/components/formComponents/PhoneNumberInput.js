import { forwardRef } from "react";

function PhoneNumberInput({ user, id }, ref) {
  return (
    <div className="form-floating">
      <input
        ref={ref}
        className="form-control"
        type="tel"
        name="phoneNumberInput"
        id={id}
        placeholder="Phone Number"
        defaultValue={user?.phoneNumber}
        required
      />
      <label for={id}>Phone Number</label>
    </div>
  );
}

export default forwardRef(PhoneNumberInput);
