import { useState, useRef } from 'react'
import { Trash2, Star, GripVertical } from 'lucide-react'
import './ImageGallery.css'

export default function ImageGallery({ productId, initialImages = [] }) {

    // Изображения уже загруженные на сервер
    const [images, setImages] = useState(initialImages)

    // Флаг загрузки
    const [uploading, setUploading] = useState(false)

    // Превью новых файлов ДО загрузки на сервер
    const [previews, setPreviews] = useState([])

    // Drag & Drop — id перетаскиваемого элемента
    const dragItem = useRef(null)
    const dragOverItem = useRef(null)

    // Получаем CSRF токен из meta тега (Laravel добавляет его в blade)
    const getCsrf = () => document.querySelector('meta[name="csrf-token"]')?.content

    // ─── Выбор файлов ───────────────────────────────────────────────

    const handleFileSelect = async (files) => {
        // Array.from конвертирует FileList в обычный массив
        const fileArray = Array.from(files)

        // Фильтруем — только фото и видео
        const valid = fileArray.filter(f =>
            f.type.startsWith('image/') || f.type.startsWith('video/')
        )

        if (valid.length === 0) return

        // Создаём превью для каждого файла
        const newPreviews = valid.map(file => ({
            id: `temp_${Date.now()}_${Math.random()}`, // временный уникальный id
            file,
            // URL.createObjectURL — создаёт временный blob URL для превью
            preview: URL.createObjectURL(file),
            type: file.type.startsWith('video/') ? 'video' : 'image',
        }))

        setPreviews(prev => [...prev, ...newPreviews])

        // Сразу загружаем на сервер
        await uploadFiles(valid)
    }

    // ─── Загрузка на сервер ─────────────────────────────────────────

    const uploadFiles = async (files) => {
        setUploading(true)

        // FormData — специальный объект для отправки файлов
        const formData = new FormData()

        // Добавляем каждый файл в FormData
        // images[] — имя поля, [] говорит что это массив
        files.forEach(file => formData.append('images[]', file))

        try {
            const response = await fetch(`/admin/products/${productId}/images`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': getCsrf(),

                },
                body: formData,
            })

            // response.json() — парсит JSON ответ от сервера
            const uploaded = await response.json()

            // Добавляем загруженные изображения в список
            setImages(prev => [...prev, ...uploaded])

            // Очищаем превью — теперь они в images
            setPreviews([])

        } catch (error) {
            console.error('Ошибка загрузки:', error)
        } finally {
            // finally выполняется всегда — и при успехе и при ошибке
            setUploading(false)
        }
    }

    // ─── Удаление изображения ────────────────────────────────────────

    const handleDelete = async (imageId) => {
        if (!confirm('Удалить изображение?')) return

        try {
            await fetch(`/admin/images/${imageId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': getCsrf(),
                    'Content-Type': 'application/json',

                },
            })

            // filter — возвращает новый массив без удалённого элемента
            setImages(prev => prev.filter(img => img.id !== imageId))

        } catch (error) {
            console.error('Ошибка удаления:', error)
        }
    }

    // ─── Назначить главным ───────────────────────────────────────────

    const handleSetMain = async (imageId) => {
        // map — создаёт новый массив, у каждого элемента меняем is_main
        const updated = images.map(img => ({
            ...img,
            is_main: img.id === imageId, // true только у выбранного
        }))

        setImages(updated)

        // Отправляем новый порядок и главное фото на сервер
        await saveOrder(updated)
    }

    // ─── Drag & Drop ─────────────────────────────────────────────────

    const handleDragStart = (e, index) => {
        // Запоминаем индекс перетаскиваемого элемента
        dragItem.current = index
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e, index) => {
        // Запрещаем дефолтное поведение — иначе drop не сработает
        e.preventDefault()
        dragOverItem.current = index
    }

    const handleDrop = async () => {
        const from = dragItem.current
        const to = dragOverItem.current

        if (from === to) return

        // Создаём копию массива
        const reordered = [...images]

        // splice(from, 1) — удаляет 1 элемент с индекса from и возвращает его
        const [moved] = reordered.splice(from, 1)

        // splice(to, 0, moved) — вставляет moved на позицию to не удаляя ничего
        reordered.splice(to, 0, moved)

        // Обновляем sort_order по новым позициям
        const withOrder = reordered.map((img, index) => ({
            ...img,
            sort_order: index + 1,
        }))

        setImages(withOrder)
        dragItem.current = null
        dragOverItem.current = null

        await saveOrder(withOrder)
    }

    // ─── Сохранить порядок ───────────────────────────────────────────

    const saveOrder = async (imgs) => {
        await fetch(`/admin/products/${productId}/images/order`, {
            method: 'PUT',
            headers: {
                'X-CSRF-TOKEN': getCsrf(),
                'Content-Type': 'application/json',

            },
            // JSON.stringify — конвертирует объект в JSON строку
            body: JSON.stringify({
                images: imgs.map(img => ({
                    id: img.id,
                    sort_order: img.sort_order,
                    is_main: img.is_main,
                }))
            }),
        })
    }

    // ─── Drag & Drop зона ────────────────────────────────────────────

    const handleDragEnter = (e) => {
        e.preventDefault()
        e.currentTarget.classList.add('drag-over')
    }

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('drag-over')
    }

    const handleDropZone = (e) => {
        e.preventDefault()
        e.currentTarget.classList.remove('drag-over')
        // e.dataTransfer.files — файлы перетащенные из файлового менеджера
        handleFileSelect(e.dataTransfer.files)
    }

    // ─── Рендер ──────────────────────────────────────────────────────

    return (
        <div className="gallery">

            {/* Зона загрузки — drag & drop или клик */}
            <div
                className="upload-zone"
                onDragEnter={handleDragEnter}
                onDragOver={e => e.preventDefault()}
                onDragLeave={handleDragLeave}
                onDrop={handleDropZone}
                onClick={() => document.getElementById('gallery-input').click()}
            >
                <input
                    id="gallery-input"
                    type="file"
                    multiple                    // разрешает выбор нескольких файлов
                    accept="image/*,video/*"    // фильтр типов файлов
                    className="gallery-input-hidden"
                    onChange={e => handleFileSelect(e.target.files)}
                />
                {uploading ? (
                    <p className="upload-hint">Загрузка...</p>
                ) : (
                    <>
                        <p className="upload-icon">📁</p>
                        <p className="upload-hint">
                            Перетащите файлы или нажмите для выбора
                        </p>
                        <p className="upload-sub">до 20 файлов, фото и видео</p>
                    </>
                )}
            </div>

            {/* Превью новых файлов ДО загрузки */}
            {previews.length > 0 && (
                <div className="previews-uploading">
                    {previews.map(p => (
                        <div key={p.id} className="preview-uploading">
                            {p.type === 'video' ? (
                                <video src={p.preview} className="preview-media" />
                            ) : (
                                <img src={p.preview} className="preview-media" alt="" />
                            )}
                            <div className="preview-uploading-overlay">
                                <span>Загрузка...</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Галерея загруженных изображений */}
            {images.length > 0 && (
                <div className="gallery-grid">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className={`gallery-item ${image.is_main ? 'is-main' : ''}`}
                            draggable                           // делаем элемент перетаскиваемым
                            onDragStart={e => handleDragStart(e, index)}
                            onDragOver={e => handleDragOver(e, index)}
                            onDrop={handleDrop}
                        >
                            {/* Медиа контент */}
                            {image.type === 'video' ? (
                                <video
                                    src={image.url}
                                    className="gallery-media"
                                    preload="metadata"

                                />
                            ) : (
                                <img
                                    src={image.url}
                                    alt=""
                                    className="gallery-media"
                                />
                            )}

                            {/* Оверлей с кнопками — появляется при наведении */}
                            <div className="gallery-overlay">

                                {/* Иконка перетаскивания */}
                                <div className="gallery-drag-handle">
                                    <GripVertical size={20} />
                                </div>

                                {/* Кнопка главного фото */}
                                <button
                                    type="button"
                                    className={`gallery-btn btn-main ${image.is_main ? 'active' : ''}`}
                                    onClick={() => handleSetMain(image.id)}
                                    title="Сделать главным"
                                >
                                    <Star size={16} />
                                </button>

                                {/* Кнопка удаления */}
                                <button
                                    type="button"
                                    className="gallery-btn btn-delete"
                                    onClick={() => handleDelete(image.id)}
                                    title="Удалить"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Бейдж главного фото */}
                            {image.is_main && (
                                <span className="main-badge">Главное</span>
                            )}

                            {/* Номер порядка */}
                            <span className="sort-badge">{index + 1}</span>
                        </div>
                    ))}
                </div>
            )}

            {images.length === 0 && previews.length === 0 && (
                <p className="gallery-empty">Изображений пока нет</p>
            )}
        </div>
    )
}
