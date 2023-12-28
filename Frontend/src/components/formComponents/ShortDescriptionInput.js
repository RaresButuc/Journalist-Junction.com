import { forwardRef, useState } from "react";

function ShortDescriptionInput({ user, id }, ref) {
  const [warning, setWarning] = useState(false);
  const [charactersTextArea, setCharactersTextArea] = useState(0);
  const [colorOfText, setColorOfText] = useState("succes");

  const countingCharactersDescription = (e) => {
    setCharactersTextArea(e.target.value.length);

    e.target.value.length === 500
      ? (setWarning(true), setColorOfText("danger"))
      : (setWarning(false), setColorOfText("succes"));
  };

  return (
    <div className="form-floating">
      <textarea
        ref={ref}
        className="form-control"
        name="shortAutoDescriptionInput"
        id={id}
        maxLength={500}
        placeholder="Describe Yourself in 500 Characters.."
        defaultValue={user?.shortAutoDescription}
        required
        onChange={countingCharactersDescription}
      />
      <label for={id}>Self Description</label>

      <div id="Title-Help" className={`form-text text-${colorOfText}`}>
        {charactersTextArea} + / 500
      </div>

      {warning ? (
        <div id="Title-Help" className="form-text text-danger">
          *You reached the maximum length of 500 characters
        </div>
      ) : null}
    </div>
  );
}

export default forwardRef(NameInput);
