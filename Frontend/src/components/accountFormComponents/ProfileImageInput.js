import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useMemo, useCallback, useState, useEffect, forwardRef } from "react";

import Alert from "../Alert";
import DefaultURL from "../../usefull/DefaultURL";

const ProfileImageInput = forwardRef(({ userId }, ref) => {
  const [photoData, setPhotoData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);
  const [description, setDescription] = useState("No Image Selected*");
  const [photoPreview, setPhotoPreview] = useState(
    "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
  );

  useEffect(() => {
    if (userId) {
      const fetchCurrentUser = async () => {
        try {
          const responseUser = await axios.get(`${DefaultURL}/user/${userId}`);
          setPhotoData(responseUser.data.profilePhoto);
          setDescription(responseUser.data.profilePhoto.description);
        } catch (err) {
          console.log(err);
        }
      };

      fetchCurrentUser();
    }
  }, []);

  const deleteImage = (e) => {
    e.preventDefault();
    setPhotoData(null);
    setDescription("No Image Selected*");
    setPhotoPreview(
      "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
    );
  };

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
          setPhotoData(file);
          setDescription(file.name);
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

      image.src = URL.createObjectURL(file);
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

  useEffect(() => {
    if (ref) {
      ref.current = photoData;
    }
  }, [ref, photoData]);

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
          style={{ borderColor: "white", width: "150px" }}
          alt="ProfileImage"
        />
        <br />
        <div className="mt-2">
          <h5 className="d-inline">{description} </h5>
          {photoData ? (
            <button className="btn btn-danger ml-2" onClick={deleteImage}>
              X
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
});

export default ProfileImageInput;
