import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";

export default function ProfileImageInput({ userId }) {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, []);

  const [underText, setUnderText] = useState("No Image Selected");
  const [imgSource, setImageSource] = useState(
    "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div
        {...getRootProps({
          className: "mt-4 dropzone border rounded border-danger border-3",
          style: { cursor: "pointer" },
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="mt-2">Drop the files here...</p>
        ) : (
          <p className="mt-2">Select Your Image Profile</p>
        )}
        
      </div>

      <img
        src={imgSource}
        className="img-fluid rounded-circle border border-4 mt-4"
        style={{ width: "170px" }} //250 cand e mare,140 cand e mic. 250 va fi default
        alt="No Attached Image"
      />
      <p className="mt-2">{underText}</p>
    </div>
  );
}
