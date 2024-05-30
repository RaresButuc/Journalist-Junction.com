import axios from "axios";
import CropEasy from "../CropEasy";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useMemo, useCallback, useState, useEffect, forwardRef } from "react";

import Alert from "../Alert";
import DefaultURL from "../../usefull/DefaultURL";
import CurrentUserInfos from "../../usefull/CurrentUserInfos";
import defaultbackgroundprofile from "../../photos/defaultbackgroundprofile.png";

const ProfileBackgroundImageInput = forwardRef(({ userId }, ref) => {
  const navigate = useNavigate();
  const currentUser = CurrentUserInfos();

  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [photoData, setPhotoData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [cropingView, setCropingView] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);
  const [description, setDescription] = useState(
    "No Background Image Selected"
  );

  useEffect(() => {
    if (userId && currentUser) {
      const fetchCurrentUserBackground = async () => {
        try {
          const reponseUserBackgroundPhoto = await axios.get(
            `${DefaultURL}/user/get-background-photo/${userId}`,
            {
              responseType: "arraybuffer",
            }
          );

          const imageUrl = `data:image/jpeg;base64,
        ${btoa(
          new Uint8Array(reponseUserBackgroundPhoto.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )}`;

          setPhotoData(
            reponseUserBackgroundPhoto.data.byteLength === 0 ? null : imageUrl
          );
          setPhotoPreview(
            reponseUserBackgroundPhoto.data.byteLength === 0
              ? defaultbackgroundprofile
              : imageUrl
          );
          setDescription(
            reponseUserBackgroundPhoto.data.byteLength === 0
              ? "No Profile Background Image Selected"
              : "Current Profile Background Image"
          );
        } catch (err) {
          navigate("an-eror-has-occurred");
        }
      };

      fetchCurrentUserBackground();
    }
  }, [userId, currentUser]);

  const deleteImage = (e) => {
    e.preventDefault();
    setPhotoData(null);
    setPhotoPreview(defaultbackgroundprofile);
    setDescription("No Background Image Selected");
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
        if (this.width >= 2100 && this.height >= 423) {
          setPhotoData(file);
          setDescription(file.name);
          setPhotoPreview(URL.createObjectURL(file));

          setWidth(this.width);
          setHeight(this.height);
          setCropingView(true);
        } else if (this.width < 2100 || this.height < 423) {
          setShowAlert(true);
          setAlertInfos([
            "Be Careful!",
            "The Selected Image Should Have the Minimum Size of 2100px x 423 px!",
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
          <p className="mb-0">Select a Background Profile Image</p>
        </div>
        {userId || photoPreview ? (
          <img
            src={photoPreview}
            className="mt-4 img-fluid border border-4"
            style={{ borderColor: "white" }}
            alt="ProfileImage"
          />
        ) : null}

        <br />
        <div className="mt-2">
          <h5 className="me-2 d-inline" style={{ wordBreak: "break-all" }}>
            <b>
              <u>{description}</u>
            </b>
          </h5>
          {photoData !== null ? (
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
            setPhotoPreview(null);
            setDescription("No Background Image Selected");
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CropEasy
              width={width}
              height={height}
              background={true}
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

export default ProfileBackgroundImageInput;
