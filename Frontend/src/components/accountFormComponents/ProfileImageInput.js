import { useMemo, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function ProfileImageInput(props) {
  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#e03444",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#e03444",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  const focusedStyle = {
    borderColor: "#2196f3",
  };

  const acceptStyle = {
    borderColor: "#00e676",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
  };

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({ onDrop });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
      cursor: "pointer",
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div className="container mt-4">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p className="mb-0">Select a Profile Image</p>
      </div>
    </div>
  );
}
