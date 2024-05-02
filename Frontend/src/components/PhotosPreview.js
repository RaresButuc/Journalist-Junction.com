import { useState, useEffect } from "react";

export default function PhotosPreview({ articleId, articlePhotos }) {
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    if (articlePhotos) {
      const nonThumbnailPhotos = articlePhotos.map((photo) => {
        return `data:image/jpeg;base64,${photo.bytes}`;
      });
      setPhotos(nonThumbnailPhotos);
    }
  }, [articlePhotos]);

  return photos ? (
    photos.length === 1 ? (
      <img src={photos[0]} className="img-fluid mt-5" alt="Full Size" />
    ) : photos.length >= 2 ? (
      <>
        <h1 className="article-title mt-5">Photos Gallery</h1>{" "}
        <div className="container-xl mt-3 p-3 d-flex justify-content-center">
          <a href={`/view-photos/${articleId}`}>
            <div className="row justify-content-center p-5 border-end border-top border-danger">
              <div className="col d-flex justify-content-end">
                <img
                  src={photos[0]}
                  className="img-fluid"
                  style={{
                    maxWidth: "550px",
                    maxHeight: "550px",
                    objectFit: "cover",
                  }}
                  alt="Full Size"
                />
              </div>
              <div className="col d-flex justify-content-center flex-column align-items-start">
                <img
                  src={photos[1]}
                  className="img-fluid mb-2"
                  style={{
                    maxWidth: "275px",
                    maxHeight: "275px",
                    objectFit: "cover",
                  }}
                  alt="Full Size"
                />
                {photos.length > 2 ? (
                  <div
                    style={{
                      position: "relative",
                      width: "250px",
                      height: "250px",
                    }}
                  >
                    <img
                      src={photos[2]}
                      className="img-fluid"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: "brightness(30%)",
                      }}
                      alt="Full Size"
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "white",
                        fontSize: "24px",
                        fontWeight: "bold",
                      }}
                    >
                      +{photos.length - 1}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      width: "200px",
                      height: "200px",
                      opacity: "0.8",
                      backgroundColor: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "24px",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    +1
                  </div>
                )}
              </div>
            </div>
          </a>
        </div>
      </>
    ) : null
  ) : null;
}
