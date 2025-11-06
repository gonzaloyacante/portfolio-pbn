import dynamic from 'next/dynamic';

// Importación dinámica del componente ImageGallery
const DynamicImageGallery = dynamic(
  () => import('./ImageGallery'),
  {
    loading: () => (
      <div className="w-full h-64 bg-background-light dark:bg-background-dark animate-pulse rounded-md flex items-center justify-center">
        <p className="text-foreground opacity-60">Cargando galería...</p>
      </div>
    ),
    ssr: false, // Deshabilita el SSR para este componente ya que depende de window
  }
);

export default DynamicImageGallery;
