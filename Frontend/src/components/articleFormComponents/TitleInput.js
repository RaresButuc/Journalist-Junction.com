import { forwardRef } from "react";

function TitleInput({ article, id,updateTitleLive }, ref) {
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
        onChange={updateTitleLive}
      />
      <label htmlFor={id}>Title *</label>
    </div>
  );
}

export default forwardRef(TitleInput);
