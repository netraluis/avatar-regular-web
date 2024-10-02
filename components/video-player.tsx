import React from "react";

interface VideoPlayerProps {
  src: string;
  width?: string;
  height?: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  fullScreen?: boolean; // Nueva propiedad para pantalla completa
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  width = "600px",
  height = "auto",
  autoPlay = false,
  controls = true,
  loop = false,
  fullScreen = false, // Valor por defecto: no ocupa toda la pantalla
}) => {
  return (
    <div
      style={{
        width: fullScreen ? "100%" : width, // Si es pantalla completa, 100% de ancho
        height: fullScreen ? "100vh" : height, // Si es pantalla completa, 100% de la altura de la pantalla
        position: "relative",
        overflow: "hidden",
      }}
    >
      <video
        src={src}
        autoPlay={autoPlay}
        controls={controls}
        loop={loop}
        muted
        style={{
          width: fullScreen ? "100%" : width,
          height: fullScreen ? "100%" : height,
          objectFit: fullScreen ? "cover" : "contain", // Si es pantalla completa, usa 'cover', de lo contrario 'contain'
          position: fullScreen ? "absolute" : "relative", // Si es pantalla completa, ajusta posición absoluta
          top: fullScreen ? 0 : "auto",
          left: fullScreen ? 0 : "auto",
        }}
      >
        Tu navegador no soporta el video.
      </video>
    </div>
  );
};

export default VideoPlayer;
