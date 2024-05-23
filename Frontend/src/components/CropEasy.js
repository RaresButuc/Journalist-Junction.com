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

export default function CropEasy({
  width,
  height,
  setFile,
  photoURL,
  setOpenCrop,
  setPhotoURL,
  setDescription,
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [cropSize, setCropSize] = useState(width / 1500);

  const [adjustedWidth, setAdjustedWidth] = useState(width);
  const [adjustedHeight, setAdjustedHeight] = useState(height);

  useEffect(() => {
    const adjustDimensions = () => {
      const maxWidth = window.innerWidth * 0.6;
      const maxHeight = window.innerHeight * 0.6;

      const ratio = Math.min(maxWidth / width, maxHeight / height, 1);

      const smallestSize = Math.min(width, height);
      const cropSizer = smallestSize / 1400;

      setCropSize((smallestSize / cropSizer) * ratio);
      setAdjustedWidth(width * ratio);
      setAdjustedHeight(height * ratio);
    };

    adjustDimensions();
    window.addEventListener("resize", adjustDimensions);

    return () => {
      window.removeEventListener("resize", adjustDimensions);
    };
  }, [width, height]);

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
      setPhotoURL(url);
      setFile(file);
      setOpenCrop(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modal modal-show">
      <div className="modal-content">
        <DialogContent
          dividers
          sx={{
            background: "#333",
            position: "relative",
            height: adjustedHeight,
            width: adjustedWidth,
            minWidth: { sm: 400 },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Cropper
            cropSize={{ width: cropSize, height: cropSize }}
            showGrid={false}
            cropShape="round"
            image={photoURL}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropChange={setCrop}
            onCropComplete={cropComplete}
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
                setPhotoURL(noProfileImage);
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
