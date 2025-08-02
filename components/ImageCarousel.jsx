'use client'
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";


const imageFiles = [
  "building.jpg",
  "bulldozer.jpg",
  "crane-construction-site.jpg",
  // Add more filenames here if you upload more images
];

export default function ImageCarousel(){
    return(
        <Carousel showThumbs={false} autoPlay infiniteLoop>
            {imageFiles.map((filename, i) => (
        <div key={i}>
          <Image
            src={`/${filename}`}
            alt={`Slide ${i + 1}`}
            width={800}
            height={500}
            className="rounded-xl"
            unoptimized
          />
        </div>
      ))}
        </Carousel>
    )
}