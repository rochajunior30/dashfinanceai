'use client';

import { useState, useEffect } from 'react';

export default function VideoBackground() {
  const videos = ['/bg-login.mp4', '/bg-login2.mp4']; // Lista de vídeos
  const [currentVideo, setCurrentVideo] = useState(videos[0]); // Vídeo inicial
  const switchInterval = 10000; // Tempo para alternar (em milissegundos)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) =>
        prev === videos[0] ? videos[1] : videos[0] // Alterna entre os vídeos
      );
    }, switchInterval);

    return () => clearInterval(interval); // Limpa o intervalo quando o componente desmonta
  }, []);

  return (
    <div className="relative w-full h-full">
      <video
        key={currentVideo} // Força a atualização ao trocar de vídeo
        src={currentVideo}
        autoPlay
        loop
        muted
        className="absolute inset-0 object-cover w-full h-full"
      >
        Seu navegador não suporta o vídeo.
      </video>
    </div>
  );
}
