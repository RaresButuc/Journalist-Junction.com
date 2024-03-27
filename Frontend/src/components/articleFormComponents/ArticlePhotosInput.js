import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useMemo, useCallback, useState, useEffect, forwardRef } from "react";
import ViewPhoto from "../ViewPhoto";
import Alert from "../Alert";
import DefaultURL from "../../usefull/DefaultURL";

const ArticlePhotosInput = forwardRef(({ articleId }, ref) => {
  const [photos, setPhotos] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);
  const [viewPhotoData, setViewPhotoData] = useState(null);
  const [viewPhotoVisible, setViewPhotoVisible] = useState(false);

  useEffect(() => {
    if (articleId) {
      const fetchCurrentArticle = async () => {
        try {
          const responseArticle = await axios.get(
            `${DefaultURL}/article/${articleId}`
          );
          setPhotos(
            responseArticle.data.photos.map((e) => ({
              data: e,
              preview: e.key,
              posted: true,
            }))
          );
        } catch (err) {
          console.log(err);
        }
      };

      fetchCurrentArticle();
    }
  }, [articleId]);

  const deleteImage = (e, index) => {
    e.preventDefault();

    const newArray = [...photos];
    newArray.splice(index, 1);

    setPhotos(newArray);
  };

  const viewImage = (index) => {
    setViewPhotoData(photos[index]);
    setViewPhotoVisible(true);
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
        setPhotos((prevPhotos) => [
          ...prevPhotos,
          { data: file, preview: URL.createObjectURL(file), posted: false },
        ]);
      };

      image.src = URL.createObjectURL(file);
    } else {
      setShowAlert(true);
      setAlertInfos([
        "Be Careful!",
        "The Selected File Is Not an Image. Try Again!",
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
      ref.current = photos;
    }
  }, [ref, photos]);

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
          <p className="mb-0">Select Images For This Article</p>
        </div>
        <div className="row">
          {photos?.length === 0 ? (
            <h3 className="text-danger mt-3">No Photos Selected</h3>
          ) : (
            photos.map((photo, index) => (
              <div className="col-xl-6 col-md-12 mx-auto" key={index}>
                <img
                  src={photo.preview}
                  className="mt-4 img-fluid border border-2 border-danger"
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "200px",
                    maxHeight: "200px",
                  }}
                  alt={`Preview Image_${index}`}
                />
                <br />
                <div className="mt-2">
                  <button
                    className="btn btn-outline-success ml-2 mx-1"
                    onClick={() => viewImage(index)} // La clic pe buton, se apelează funcția viewImage
                  >
                    View
                  </button>

                  <button
                    className="btn btn-outline-danger ml-2 mx-1"
                    onClick={(e) => deleteImage(e, index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {viewPhotoVisible && (
        <ViewPhoto
          photoData={viewPhotoData}
          onClose={() => setViewPhotoVisible(false)}
        />
      )}
    </>
  );
});

export default ArticlePhotosInput;
