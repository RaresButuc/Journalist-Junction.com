import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useMemo, useCallback, useState, useEffect, forwardRef } from "react";

import Alert from "../Alert";
import ViewPhoto from "../ViewPhoto";
import DefaultURL from "../../usefull/DefaultURL";

const ArticlePhotosInput = forwardRef(({ article, reload }, ref) => {
  const [photos, setPhotos] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [viewPhotoData, setViewPhotoData] = useState(null);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);
  const [viewPhotoVisible, setViewPhotoVisible] = useState(false);

  useEffect(() => {
    if (article) {
      const fetchCurrentArticle = async () => {
        try {
          const responseArticle = await axios.get(
            `${DefaultURL}/article/${article.id}`
          );

          if (responseArticle.data.photos.length !== 0) {
            const reponseArticlePhotos = await axios.get(
              `${DefaultURL}/article/get-article-photos/${article.id}`
            );

            const photos = reponseArticlePhotos?.data.map((photo) => {
              const byteString = atob(photo.bytes);
              const byteArray = new Uint8Array(byteString.length);
              for (let i = 0; i < byteString.length; i++) {
                byteArray[i] = byteString.charCodeAt(i);
              }

              const imageUrl = `data:image/jpeg;base64,${photo.bytes}`;

              return {
                data: photo.articlePhoto,
                preview: imageUrl,
                posted: true,
                isThumbnail: photo.articlePhoto.thumbnail,
              };
            });

            setPhotos(photos);
          } else {
            setPhotos([]);
          }
        } catch (err) {
          console.log(err);
        }
      };

      fetchCurrentArticle();
    }
  }, [article, reload]);

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

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (photos.length + acceptedFiles.length > 10) {
        setShowAlert(true);
        setAlertInfos([
          "Error Occurred!",
          "You Can't Add More Than 10 Photos",
          "danger",
        ]);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        return;
      }

      acceptedFiles.forEach((file) => {
        if (file.type.substring(0, 6) === "image/") {
          const image = new Image();

          image.onload = function () {
            setPhotos((prevPhotos) => [
              ...prevPhotos,
              {
                data: file,
                preview: URL.createObjectURL(file),
                posted: false,
                isThumbnail: false,
              },
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
      });
    },
    [photos]
  );

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

  const deleteImage = (e, index) => {
    e.preventDefault();

    const newArray = [...photos];
    newArray.splice(index, 1);

    setPhotos(newArray);
  };

  const setIsThumbnail = (e, key) => {
    const updatedPhotos = photos.map((photo, index) => {
      if (index === key && !photo.isThumbnail) {
        return {
          ...photo,
          isThumbnail: true,
        };
      } else if (index === key && photo.isThumbnail) {
        return {
          ...photo,
          isThumbnail: false,
        };
      } else {
        return {
          ...photo,
          isThumbnail: false,
        };
      }
    });
    setPhotos(updatedPhotos);
  };

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
              <div className="col-xl-6 col-md-12 mx-auto mt-4 " key={index}>
                <div className="d-flex justify-content-center">
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="flexSwitchCheckDefault"
                      checked={photo.isThumbnail}
                      onClick={(e) => setIsThumbnail(e, index)}
                    />
                  </div>
                  <h5>Thumbnail</h5>
                </div>

                <img
                  src={photo.preview}
                  className="img-fluid border border-2 border-danger"
                  style={{
                    maxWidth: "200px",
                    maxHeight: "200px",
                  }}
                  alt={`Preview Image_${index}`}
                />
                <br />
                <div className="mt-2">
                  <button
                    className="btn btn-outline-success ml-2 mx-1"
                    onClick={() => viewImage(index)}
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
