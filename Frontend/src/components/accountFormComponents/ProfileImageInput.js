import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useMemo, useCallback, useState, useEffect } from "react";

import Alert from "../Alert";
import DefaultURL from "../../usefull/DefaultURL";

export default function ProfileImageInput({ userId }) {
  const [photo, setPhoto] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);
  const [showImageOrNot, setShowImageOrNot] = useState(false);

  const [photoPreview, setPhotoPreview] = useState(
    "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
  );

  useEffect(() => {
    if (userId) {
      const fetchCurrentUser = async () => {
        try {
          const responseUser = await axios.get(`${DefaultURL}/user/${userId}`);
          setUserPhoto(responseUser.data.profilePhoto);
          setShowImageOrNot(true);
        } catch (err) {
          console.log(err);
        }
      };

      fetchCurrentUser();
    }
  }, []);

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
    const file = acceptedFiles[0];

    if (file.type.substring(0, 6) === "image/") {
      const image = new Image();

      image.onload = function () {
        if (this.width <= 800 && this.height <= 800) {
          setPhoto(file);
          setPhotoPreview(URL.createObjectURL(file));
        } else {
          setShowAlert(true);
          setAlertInfos([
            "Be Careful!",
            "Please Select An Image With Maximum Resolution Of 800 x 800 Pixels.",
            "danger",
          ]);
          setTimeout(() => {
            setShowAlert(false);
          }, 3000);
        }
      };
    } else {
      setShowAlert(true);
      setAlertInfos([
        "Be Careful!",
        "The File You Selected Is Not an Image. Try Again!",
        "danger",
      ]);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
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
    <>
      {showAlert ? (
        <Alert
          type={alertInfos[0]}
          message={alertInfos[1]}
          color={alertInfos[2]}
        />
      ) : null}
      <div className="container mt-4">
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p className="mb-0">Select a Profile Image</p>
        </div>

        <img
          src={photoPreview}
          className="mt-4 img-fluid rounded-circle border border-4"
          style={{ borderColor: "white", width: "150px" }} //250 cand e mare,140 cand e mic. 250 va fi default
          alt="ProfileImage"
        />
      </div>
    </>
  );
}
