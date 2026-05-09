// resources/js/Pages/Admin/Products/Create.jsx
import Layout from '@/Pages/Admin/Layout/Layout.jsx'
import {useForm} from '@inertiajs/react'
import {useState} from 'react'
import {Link} from '@inertiajs/react'
import {ChevronRight} from 'lucide-react'
import FormField from "@/Components/Admin/FormField/FormField.jsx";
import FormWrapper from "@/Components/Admin/FormWrapper/FormWrapper.jsx";

export default function Create({products}) {
    const {data, setData, post, processing, errors} = useForm({
        name: '',
        product: '',
        price: '',
        old_price: '',
        is_active: false,
        mainImage: '',
        description: '',
    })
    const [preview, setPreview] = useState(products.image_url)
    const handleSubmit = (e) => {
        e.preventDefault()
        post('/admin/cards', {forceFormData: true})
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
        <Layout title="Новая карточка товара">

            <FormWrapper title="Создание карточки товара"
                         onSubmit={handleSubmit}
                         cancelHref="/admin/cards"
                         processing={processing}
                         submitLabel="Создать карточку товара"
            >

                <FormField label="Наименование" id="name" error={errors.name}>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        placeholder="Наименование"
                    />
                </FormField>

                <FormField label="Товар" id="product" error={errors.product}>
                    <select
                        id="product"
                        value={data.product}
                        onChange={e => setData('product', e.target.value)}
                        disabled={products.length === 0}
                        className={`form-input ${errors.product ? 'error' : ''}`}
                    >

                        {products.length > 0 ? (
                            <>
                                <option value="">— Выберите товар —</option>
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </>
                        ) : (
                            <option value="">
                                Все товары уже имеют карточку (сначала добавьте новый товар)
                            </option>
                        )}

                    </select>
                </FormField>

                <FormField label="Цена" id="price" error={errors.price}>
                    <input
                        id="price"
                        type="text"
                        value={data.price}
                        onChange={e => setData('price', e.target.value)}
                        className={`form-input ${errors.price ? 'error' : ''}`}
                        placeholder="Цена"
                    />
                </FormField>

                <FormField label="Старая цена" id="old_price" error={errors.old_price}>
                    <input
                        id="old_price"
                        type="text"
                        value={data.old_price}
                        onChange={e => setData('old_price', e.target.value)}
                        className={`form-input ${errors.old_price ? 'error' : ''}`}
                        placeholder="Старая цена"
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
