import { forwardRef } from "react";

function TitleInput({ article, id }, ref) {
  return (
    <div className="form-floating">
      <input
        ref={ref}
        className="form-control"
        type="title"
        name="titleInput"
        id={id}
        placeholder="Title"
        defaultValue={article?.title}
        required
      />
      <label for={id}>Title</label>
    </div>
  );
}

export default forwardRef(TitleInput);
