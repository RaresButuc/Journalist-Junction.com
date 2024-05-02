import axios from "axios";
import { useState, useEffect } from "react";
import ImageGallery from "react-image-gallery";
import { useParams, useNavigate } from "react-router-dom";
import "react-image-gallery/styles/css/image-gallery.css";

import ErrorPage from "./ErrorPage";
import DefaultURL from "../usefull/DefaultURL";

export default function PhotosGallery() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [galleryPhotos, setArticlePhotos] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchArticlePhotos = async () => {
        try {
          const responseIsPublished = await axios.get(
            `${DefaultURL}/article/ispublished/${id}`
          );
          if (responseIsPublished.data) {
            // Get Article Thumbnail
            const reponseThumbnailArticlePhoto = await axios.get(
              `${DefaultURL}/article/get-article-thumbnail/${id}`
            );

            const thumbnailImageUrl = {
              original: `data:image/jpeg;base64,${reponseThumbnailArticlePhoto.data.bytes}`,
              thumbnail: `data:image/jpeg;base64,${reponseThumbnailArticlePhoto.data.bytes}`,
            };

            // Get Article Non-Thumbnail Photos

            const reponseNonThumbnailArticlePhoto = await axios.get(
              `${DefaultURL}/article/get-nonThumbnail-article-photos/${id}`
            );
            const nonThumbnails = reponseNonThumbnailArticlePhoto.data.map(
              (photo) => {
                return {
                  original: `data:image/jpeg;base64,${photo.bytes}`,
                  thumbnail: `data:image/jpeg;base64,${photo.bytes}`,
                };
              }
            );
            nonThumbnails.push(thumbnailImageUrl);

            setArticlePhotos(nonThumbnails);
          } else {
            navigate("/an-error-has-occured");
          }
        } catch (error) {
          navigate("/an-error-has-occured");
        }
      };

      fetchArticlePhotos();
    }
  }, [id]);

  return galleryPhotos ? (
    <div className="contianer-xl ps-5 pe-5 ms-5 me-5">
      <ImageGallery items={galleryPhotos} showPlayButton={false} />
    </div>
  ) : (
    <ErrorPage message={"The Photos Are Loading.."} />
  );
}
