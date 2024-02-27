import { forwardRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const BodyTextInput = ({ article, id, onChange }) => {
  return (
    <div className="form-floating">
      <CKEditor
        editor={ClassicEditor}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange(data);
        }}
        className="form-control"
        type="body"
        name="bodyText"
        id={id}
        placeholder="Article Body"
        data={article ? article.body : ""}
      />
    </div>
  );
};

export default BodyTextInput;
