import Image from 'next/image'

interface ProjectThumbnailProps {
  image?: {
    url: string
    publicId: string
  } | null
  title: string
}

export default function ProjectThumbnail({ image, title }: ProjectThumbnailProps) {
  return (
    <div className="bg-accent relative aspect-square overflow-hidden rounded-lg">
      {image ? (
        <Image
          src={image.url}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <div className="text-primary/50 flex h-full w-full items-center justify-center">
          <span className="text-xs">{title}</span>
        </div>
      )}
    </div>
  )
}
