import { forwardRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const BodyTextInput = forwardRef(({ article, id }, ref) => (
  <div className="container-xl form-floating">
    <CKEditor
      editor={ClassicEditor}
      ref={ref}
      className="form-control"
      type="body"
      name="bodyText"
      id={id}
      placeholder="Article Body"
      defaultValue={article?.body}
      required
    />
  </div>
));

export default BodyTextInput;
