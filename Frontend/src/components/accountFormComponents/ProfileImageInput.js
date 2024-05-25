import axios from "axios";
import CropEasy from "../CropEasy";
import { useDropzone } from "react-dropzone";
import { useMemo, useCallback, useState, useEffect, forwardRef } from "react";

import Alert from "../Alert";
import DefaultURL from "../../usefull/DefaultURL";
import noProfileImage from "../../photos/default-profile-image.png";

const ProfileImageInput = forwardRef(({ userId }, ref) => {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [photoData, setPhotoData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [cropingView, setCropingView] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);
  const [photoPreview, setPhotoPreview] = useState(noProfileImage);
  const [description, setDescription] = useState("No Profile Image Selected");

  useEffect(() => {
    if (userId) {
      const fetchCurrentUser = async () => {
        try {
          const reponseUserProfilePhoto = await axios.get(
            `${DefaultURL}/user/get-profile-photo/${userId}`,
            {
              responseType: "arraybuffer",
            }
          );

          const imageUrl = `data:image/jpeg;base64,
        ${btoa(
          new Uint8Array(reponseUserProfilePhoto.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )}`;

          setPhotoData(
            reponseUserProfilePhoto.data.byteLength === 0 ? null : imageUrl
          );
          setPhotoPreview(
            reponseUserProfilePhoto.data.byteLength === 0
              ? noProfileImage
              : imageUrl
          );
          setDescription(
            reponseUserProfilePhoto.data.byteLength === 0
              ? "No Profile Image Selected"
              : "Current Profile Image"
          );
        } catch (err) {
          console.log(err);
        }
      };

      fetchCurrentUser();
    }
  }, [userId]);

  const deleteImage = (e) => {
    e.preventDefault();
    setPhotoData(null);
    setDescription("No Profile Image Selected");
    setPhotoPreview(noProfileImage);
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
        setPhotoData(file);
        setDescription(file.name);
        setPhotoPreview(URL.createObjectURL(file));

        if (this.width > 1400 || this.height > 1400) {
          setWidth(this.width);
          setHeight(this.height);
          setCropingView(true);
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
          style={{ borderColor: "white", width: "150px", height: "150px" }}
          alt="ProfileImage"
        />
        <br />
        <div className="mt-2">
          <h5 className="me-2 d-inline" style={{ wordBreak: "break-all" }}>
            <b>
              <u>{description}</u>
            </b>
          </h5>
          {photoPreview !== noProfileImage ? (
            <button
              className="btn btn-danger rounded-circle "
              onClick={deleteImage}
            >
              X
            </button>
          ) : null}
        </div>
      </div>
      {cropingView && (
        <div
          className="modal modal-show"
          onClick={() => {
            setCropingView(false);
            setPhotoData(null);
            setPhotoPreview(noProfileImage);
            setDescription("No Profile Image Selected");
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CropEasy
              width={width}
              height={height}
              profile={true}
              setFile={setPhotoData}
              photoURL={photoPreview}
              setOpenCrop={setCropingView}
              setPhotoURL={setPhotoPreview}
              setDescription={setDescription}
            />
          </div>
        </div>
      )}
    </>
  );
});

export default ProfileImageInput;
