import { useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface Photo {
    src: string;
    width: number;
    height: number;
    alt: string;
}

const photos: Photo[] = [
    {
        src: "/image/gallery/1.jpg",
        width: 600,
        height: 892,
        alt: "Image 1"
    },
    {
        src: "/image/gallery/2.jpg",
        width: 2795,
        height: 4192,
        alt: "Image 2"
    },
    {
        src: "/image/gallery/3.jpg",
        width: 1358,
        height: 1020,
        alt: "Image 3"
    },
    // Add more images here...
];

export default function Gallery() {
    const [index, setIndex] = useState(-1);

    return (
        <>
            <PhotoAlbum
                photos={photos}
                layout={'rows'}
                targetRowHeight={150}
                onClick={({ index }) => setIndex(index)}
            />

            <Lightbox
                slides={photos}
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
            />
        </>
    );
}