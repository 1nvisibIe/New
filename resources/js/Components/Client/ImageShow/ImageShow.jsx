// resources/js/Components/Client/ShowCard/ImageShow.jsx
import { useState } from 'react'
import './ImageShow.css'
import { ChevronLeft, ChevronRight, PlayCircle, X } from 'lucide-react'

const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'ogg']

function isVideo(path) {
    const ext = path.split('.').pop().toLowerCase()
    return VIDEO_EXTENSIONS.includes(ext)
}

function mediaUrl(path) {
    return `/uploads/${path}`
}

export function ImageShow({ images = [] }) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [lightboxOpen, setLightboxOpen] = useState(false)

    if (images.length === 0) {
        return (
            <div className="gallery-empty">
                Нет изображений
            </div>
        )
    }

    const active = images[activeIndex]

    const goPrev = () => {
        setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goNext = () => {
        setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
    }

    return (
        <div className="image-list">

            {/* Колонка миниатюр */}
            <div className="gallery-thumbs">
                {images.map((img, index) => (
                    <button
                        key={img.id ?? index}
                        className={`gallery-thumb ${index === activeIndex ? 'gallery-thumb--active' : ''}`}
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Материал ${index + 1}`}
                    >
                        {isVideo(img.path) ? (
                            <>
                                <video src={mediaUrl(img.path)} muted />
                                <span className="gallery-thumb-play">
                                    <PlayCircle size={18} />
                                </span>
                            </>
                        ) : (
                            <img src={mediaUrl(img.path)} alt="" />
                        )}
                    </button>
                ))}
            </div>

            {/* Свайпер */}
            <div className="gallery-viewer">
                <div className="gallery-viewer-frame">
                    {isVideo(active.path) ? (
                        <video
                            key={active.id ?? activeIndex}
                            src={mediaUrl(active.path)}
                            controls
                            className="gallery-viewer-media"
                        />
                    ) : (
                        <img
                            key={active.id ?? activeIndex}
                            src={mediaUrl(active.path)}
                            alt=""
                            className="gallery-viewer-media gallery-viewer-media--clickable"
                            onClick={() => setLightboxOpen(true)}
                        />
                    )}

                    {images.length > 1 && (
                        <>
                            <button
                                className="gallery-nav gallery-nav--prev"
                                onClick={goPrev}
                                aria-label="Предыдущее"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                className="gallery-nav gallery-nav--next"
                                onClick={goNext}
                                aria-label="Следующее"
                            >
                                <ChevronRight size={32} />
                            </button>

                            <div className="gallery-dots">
                                {images.map((img, index) => (
                                    <span
                                        key={img.id ?? index}
                                        className={`gallery-dot ${index === activeIndex ? 'gallery-dot--active' : ''}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Лайтбокс — полноэкранный просмотр активного фото */}
            {lightboxOpen && !isVideo(active.path) && (
                <div className="gallery-lightbox" onClick={() => setLightboxOpen(false)}>
                    <button
                        className="gallery-lightbox-close"
                        onClick={() => setLightboxOpen(false)}
                        aria-label="Закрыть"
                    >
                        <X size={28} />
                    </button>

                    <img
                        src={mediaUrl(active.path)}
                        alt=""
                        className="gallery-lightbox-media"
                        onClick={(e) => e.stopPropagation()}
                        onError={(e) => console.error('Не загрузилось изображение:', e.target.src)}
                    />

                    {images.length > 1 && (
                        <>
                            <button
                                className="gallery-nav gallery-nav--prev gallery-lightbox-nav"
                                onClick={(e) => { e.stopPropagation(); goPrev() }}
                                aria-label="Предыдущее"
                            >
                                <ChevronLeft size={36} />
                            </button>
                            <button
                                className="gallery-nav gallery-nav--next gallery-lightbox-nav"
                                onClick={(e) => { e.stopPropagation(); goNext() }}
                                aria-label="Следующее"
                            >
                                <ChevronRight size={36} />
                            </button>
                        </>
                    )}
                </div>
            )}

        </div>
    )
}
