import Layout from '@/Pages/Admin/Layout/Layout.jsx'
import { useForm, Link } from '@inertiajs/react'
import FormWrapper from '@/Components/Admin/FormWrapper/FormWrapper.jsx'
import FormField from '@/Components/Admin/FormField/FormField.jsx'

export default function Edit({ products, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        sku: products.sku || '',
        name: products.name || '',
        stock: products.stock || '',
        category: products.category?.id || '',
        price: products.price || '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        put(`/admin/products/${products.id}`)
    }

    return (
        <Layout title="Редактирование товара">
            <FormWrapper
                title={`Товар ${products.name}`}
                onSubmit={handleSubmit}
                processing={processing}
                cancelHref="/admin/products"
                submitLabel="Обновить товар"
            >
                <FormField label="SKU" id="sku" error={errors.sku}>
                    <input
                        id="sku"
                        type="text"
                        value={data.sku}
                        onChange={e => setData('sku', e.target.value)}
                        className={`form-input ${errors.sku ? 'error' : ''}`}
                    />
                </FormField>

                <FormField label="Наименование" id="name" error={errors.name}>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className={`form-input ${errors.name ? 'error' : ''}`}
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

                <FormField label="Категория" id="category" error={errors.category}>
                    <select
                        id="category"
                        value={data.category}
                        onChange={e => setData('category', e.target.value)}
                        className={`form-input ${errors.category ? 'error' : ''}`}
                    >
                        <option value="" >Нет</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id} >{cat.name}</option>
                        ))}

                    </select>
                </FormField>

                <FormField label="Себестоимость" id="price" error={errors.price}>
                    <input
                        id="price"
                        type="text"
                        value={data.price}
                        onChange={e => setData('price', e.target.value)}
                        className={`form-input ${errors.price ? 'error' : ''}`}
                    />
                </FormField>

            </FormWrapper>
        </Layout>
    )
}
