import Cropper from "react-easy-crop";
import { Cancel } from "@mui/icons-material";
import CropIcon from "@mui/icons-material/Crop";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Slider,
  Typography,
} from "@mui/material";

import getCroppedImg from "../usefull/CropImage";
import noProfileImage from "../photos/default-profile-image.png";
import defaultbackgroundprofile from "../photos/defaultbackgroundprofile.png";

export default function CropEasy({
  width,
  height,
  setFile,
  profile,
  photoURL,
  background,
  setOpenCrop,
  setPhotoURL,
  setDescription,
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 1, y: 1 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [profileCropSize, setProfileCropSize] = useState(width / 1500);
  const [backgroundCropWidth, setBackgroundCropWidth] = useState(width / 2100);
  const [backgroundCropHeight, setBackgroundCropHeight] = useState(height / 423);

  const [adjustedWidth, setAdjustedWidth] = useState(width);
  const [adjustedHeight, setAdjustedHeight] = useState(height);

  useEffect(() => {
    const adjustDimensions = () => {
      const maxWidth = window.innerWidth * 0.6;
      const maxHeight = window.innerHeight * 0.6;

      let ratio;

      if (profile) {
        ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        const profileSmallestSize = Math.min(width, height);
        const cropSizer = profileSmallestSize / 1400;

        setProfileCropSize((profileSmallestSize / cropSizer) * ratio);
      } else if (background) {
        ratio = Math.min(
          maxWidth / (700 * (width / 700)),
          maxHeight / (141 * (height / 141)),
          1
        );
        setBackgroundCropWidth(2100 * ratio);
        setBackgroundCropHeight(423 * ratio);
      }

      setAdjustedWidth(width * ratio);
      setAdjustedHeight(height * ratio);
    };

    adjustDimensions();
    window.addEventListener("resize", adjustDimensions);

    return () => {
      window.removeEventListener("resize", adjustDimensions);
    };
  }, [width, height, profile, background]);

  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const zoomPercent = (value) => {
    return `${Math.round(value * 100)}%`;
  };

  const cropImage = async () => {
    try {
      const { file, url } = await getCroppedImg(
        photoURL,
        croppedAreaPixels,
        rotation
      );

      setFile(file);
      setPhotoURL(url);
      setOpenCrop(false);
      setCrop({ x: 1, y: 1 })
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modal modal-show">
      <div className="modal-content" style={{ maxWidth: adjustedWidth + 25,padding:15 }}>
        <DialogContent
          dividers
          sx={{
            background: "#333",
            position: "relative",
            height: adjustedHeight,
            width: adjustedWidth,
            minWidth: { sm: 300 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Cropper
            aspect={1}
            zoom={zoom}
            crop={crop}
            showGrid={false}
            image={photoURL}
            rotation={rotation}
            onZoomChange={setZoom}
            onCropChange={setCrop}
            onCropComplete={cropComplete}
            onRotationChange={setRotation}
            cropShape={profile ? "round" : "rect"}
            cropSize={{
              width: profile ? profileCropSize : backgroundCropWidth,
              height: profile ? profileCropSize : backgroundCropHeight,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column", mx: 3, my: 2 }}>
          <Box sx={{ width: "100%", mb: 1 }}>
            <Box>
              <Typography>Zoom: {zoomPercent(zoom)}</Typography>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={zoomPercent}
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                color="info"
                onChange={(e, zoom) => setZoom(zoom)}
              />
            </Box>
            <Box>
              <Typography>Rotation: {rotation + "°"}</Typography>
              <Slider
                valueLabelDisplay="auto"
                color="info"
                min={0}
                max={360}
                value={rotation}
                onChange={(e, rotation) => setRotation(rotation)}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={() => {
                setFile(null);
                setOpenCrop(false);
                setPhotoURL(
                  profile ? noProfileImage : defaultbackgroundprofile
                );
                setCrop({ x: 1, y: 1 })
                setDescription("No Profile Image Selected");
              }}
            >
              <b>Cancel</b>
            </Button>
            <Button
              color="success"
              variant="contained"
              startIcon={<CropIcon />}
              onClick={cropImage}
            >
              <b>Crop</b>
            </Button>
          </Box>
        </DialogActions>
      </div>
    </div>
  );
}
