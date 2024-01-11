import { forwardRef, useState } from "react";

function ThumbnailDescription({ article, id }, ref) {
  const [warning, setWarning] = useState(false);
  const [charactersTextArea, setCharactersTextArea] = useState(0);
  const [colorOfText, setColorOfText] = useState("succes");

  const countingCharactersDescription = (e) => {
    setCharactersTextArea(e.target.value.length);

    if (e.target.value.length === 350) {
      setWarning(true);
      setColorOfText("danger");
    } else {
      setWarning(false);
      setColorOfText("success");
    }
  };

  return (
    <div className="form-floating">
      <textarea
        ref={ref}
        className="form-control"
        name="thumbnailDescription"
        id={id}
        maxLength={350}
        placeholder="Give The Article a Short Description for its Thumbnail.."
        defaultValue={article?.thumbnailDescription}
        required
        onChange={countingCharactersDescription}
      />
      <label for={id}>Thumbnail Description</label>

      <div id="Title-Help" className={`form-text text-${colorOfText}`}>
        {charactersTextArea} / 350
      </div>

      {warning ? (
        <div id="Title-Help" className="form-text text-danger">
          *You reached the maximum length of 350 characters
        </div>
      ) : null}
    </div>
  );
}

export default forwardRef(ThumbnailDescription);