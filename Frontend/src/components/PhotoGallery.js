import { useState, useEffect } from "react";

export default function PhotoGallery(articlePhotos) {
  const [photos, setPhotos] = null;

  useEffect(() => {
    const photos = articlePhotos
      ?.filter((e) => !e.isThumbnail)
      .map((photo) => {
        const byteString = atob(photo.bytes);
        const byteArray = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          byteArray[i] = byteString.charCodeAt(i);
        }

        return (imageUrl = `data:image/jpeg;base64,${photo.bytes}`);
      });

    setPhotos(photos);
  }, [photos]);

  return photos.length === 1 ? (
    <img src={photos[0].preview} className="img-fluid" alt="Full Size" />
  ) : photos.length >= 2 ? (
    <div className="container">
      <div className="position-relative">
        <img src={photos[0].preview} className="img-fluid" alt="Full Size" />
        <img
          src={photos[1].preview}
          className="img-fluid position-absolute top-0 start-50 translate-middle"
          style={{ zIndex: 1, opacity: 0.7 }}
          alt="Full Size"
        />
      </div>
    </div>
  ) : null;
}
