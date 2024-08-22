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
        <h1 className="article-title mt-5">Photos Gallery</h1>
        <div className="container-xl mt-3 p-3 d-flex justify-content-center border-end border-top border-danger">
          <a href={`/view-photos/${articleId}`}>
            <div className="photo-grid">
              <div className="photo-large">
                <img src={photos[0]} className="img-fluid" alt="Full Size" />
              </div>
              <div className="photo-small">
                <img src={photos[1]} className="img-fluid" alt="Full Size" />
              </div>
              {photos.length > 2 && (
                <div className="photo-small">
                  <div className="photo-overlay">
                    <img
                      src={photos[2]}
                      className="img-fluid"
                      alt="Full Size"
                    />
                    <div className="overlay-text">+{photos.length - 2}</div>
                  </div>
                </div>
              )}
            </div>
          </a>
        </div>
      </>
    ) : null
  ) : null;
}
