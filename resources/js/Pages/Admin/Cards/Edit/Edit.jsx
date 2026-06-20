import Layout from '@/Pages/Admin/Layout/Layout.jsx'
import {useForm, Link} from '@inertiajs/react'
import {useState} from 'react'
import FormWrapper from '@/Components/Admin/FormWrapper/FormWrapper.jsx'
import FormField from '@/Components/Admin/FormField/FormField.jsx'
import ImageGallery from '@/Components/Admin/ImageGallery/ImageGallery.jsx'
import ProductAttributeList from '@/Components/Admin/ProductAttributeList/ProductAttributeList.jsx'
import './Edit.css'

export default function Edit({cards, product, productImg, attributes}) {
    const {data, setData, put, processing, errors} = useForm({
        name: cards.name || '',
        price: cards.price || '',
        old_price: cards.old_price || '',
        stock: product.stock || '',
        is_active: cards.is_active || false,
        description: cards.description || '',
        attributes:  attributes ?? [],
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        put(`/admin/cards/${cards.id}`, {forceFormData: true})
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

                <ImageGallery
                    productId={productImg.id}
                    initialImages={productImg.images.map(img => ({
                        id: img.id,
                        url: img.url,          // image_url accessor
                        is_main: img.is_main,
                        sort_order: img.sort_order,
                        type: img.type ?? 'image', // если есть поле type
                    }))}
                />

                {/* Атрибуты товара */}
                <ProductAttributeList
                    attributes={data.attributes}
                    onChange={attrs => setData('attributes', attrs)}
                />

                <FormField label="Описание" id="description" error={errors.description}>
                    <input
                        id="description"
                        type="text"
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        className={`form-input ${errors.description ? 'error' : ''}`}
                    />
                </FormField>

            </FormWrapper>
        </Layout>
    )
}
