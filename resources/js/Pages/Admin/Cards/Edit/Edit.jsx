import Layout from '@/Pages/Admin/Layout/Layout.jsx'
import {useForm, Link} from '@inertiajs/react'
import {useState} from 'react'
import FormWrapper from '@/Components/Admin/FormWrapper/FormWrapper.jsx'
import FormField from '@/Components/Admin/FormField/FormField.jsx'
import './Edit.css'

export default function Edit({cards, product}) {
    const {data, setData, put, processing, errors} = useForm({
        name: cards.name || '',
        price: cards.price || '',
        old_price: cards.old_price || '',
        stock: product.stock || '',
        is_active: cards.is_active || false,
        mainImage: null,
        description: cards.description || '',
    })
    const [preview, setPreview] = useState(cards.product.image_url)
    const handleSubmit = (e) => {
        e.preventDefault()
        put(`/admin/cards/${cards.id}`, {forceFormData: true})
    }
    const handleImage = (e) => {
        const file = e.target.files[0]
        if (!file) return

        setData('mainImage', file)

        // Создаём временный URL для превью
        const url = URL.createObjectURL(file)
        setPreview(url)
    }

    return (
        <Layout title="Редактирование карточки">
            <FormWrapper
                title={`Карточка ${cards.name}`}
                onSubmit={handleSubmit}
                processing={processing}
                cancelHref="/admin/cards"
                submitLabel="Обновить карточку"
            >
                <FormField label="Наименование карточки" id="name" error={errors.name}>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                    />
                </FormField>

                <FormField label="Цена" id="price" error={errors.price}>
                    <input
                        id="price"
                        type="text"
                        value={data.price}
                        onChange={e => setData('price', e.target.value)}
                        className={`form-input ${errors.price ? 'error' : ''}`}
                    />
                </FormField>

                <FormField label="Старая цена" id="old_price" error={errors.old_price}>
                    <input
                        id="old_price"
                        type="text"
                        value={data.old_price}
                        onChange={e => setData('old_price', e.target.value)}
                        className={`form-input ${errors.old_price ? 'error' : ''}`}
                    />
                </FormField>

                <FormField label="Наличие" id="stock" error={errors.stock}>
                    <input
                        id="stock"
                        type="text"
                        value={data.stock}
                        onChange={e => setData('stock', e.target.value)}
                        className={`form-input ${errors.stock ? 'error' : ''}`}
                    />
                </FormField>

                <FormField label="Актуальность" id="is_active" error={errors.is_active}>
                    <div className={"checkbox-layout"}>
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={data.is_active}
                            onChange={e => setData('is_active', e.target.checked)}
                        />
                    </div>
                </FormField>

                <div className="image-field">
                    <label className="form-label">Изображение</label>
                    <div className="image-field-inner">
                        <input
                            type="file"
                            id="mainImage"
                            className="file-input"
                            onChange={handleImage}
                        />
                        <label htmlFor="mainImage" className="file-label">
                            Выберите изображение
                        </label>

                        <div className="image-preview">
                            <img
                                src={preview}
                                alt="Фото товара"
                                className="preview-img"
                            />
                        </div>
                    </div>
                </div>

                <FormField label="Описание" id="description" error={errors.description}>
                    <input
                        id="description"
                        type="text"
                        value={data.description}
                        onChange={e => setData('price', e.target.value)}
                        className={`form-input ${errors.description ? 'error' : ''}`}
                    />
                </FormField>

            </FormWrapper>
        </Layout>
    )
}
