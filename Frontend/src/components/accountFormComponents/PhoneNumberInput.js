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
        minLength="10" 
        maxLength="10"
        onChange={(e) => {
          e.target.value = e.target.value.replace(/\D/, '');
        }}
        required
      />
      <label htmlFor={id}>Phone Number</label>
    </div>
  );
}

export default forwardRef(PhoneNumberInput);
