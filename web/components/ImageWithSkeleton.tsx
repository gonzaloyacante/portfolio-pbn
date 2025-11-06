"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import clsx from "clsx";

type Props = Omit<ImageProps, "onLoad" | "onError"> & {
  containerClassName?: string;
};

export default function ImageWithSkeleton({
  containerClassName,
  className,
  ...imgProps
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={clsx("relative overflow-hidden", containerClassName)}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40" />
      )}
      <Image
        {...imgProps}
        className={clsx(
          "transition-opacity duration-500 object-contain",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        onLoadingComplete={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}
