import { forwardRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const BodyTextInput = forwardRef(({ article, id }, ref) => (
  <div className="form-floating">
    <CKEditor
      editor={ClassicEditor}
      ref={ref}
      className="form-control"
      type="body"
      name="bodyText"
      id={id}
      placeholder="Article Body"
      data={article?.body}
      required
    />
  </div>
));

export default BodyTextInput;
