
import Layout from '@/Pages/Admin/Layout/Layout.jsx'
import {useForm} from '@inertiajs/react'
import {Link} from '@inertiajs/react'
import FormField from "@/Components/Admin/FormField/FormField.jsx";
import FormWrapper from "@/Components/Admin/FormWrapper/FormWrapper.jsx";
export default function Create({categories}) {
    const {data, setData, post, processing, errors} = useForm({
        sku: '',
        name: '',
        stock: '',
        category: '',
        price: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        post('/admin/products')
    }

    return (
        <Layout title="Новый товар">

            <FormWrapper title="Создание товара"
                         onSubmit={handleSubmit}
                         cancelHref="/admin/products"
                         processing={processing}
                         submitLabel="Создать товар"
            >

                <FormField label="SKU" id="sku" error={errors.sku}>
                    <input
                        id="sku"
                        type="text"
                        value={data.sku}
                        onChange={e => setData('sku', e.target.value)}
                        className={`form-input ${errors.sku ? 'error' : ''}`}
                        placeholder="SKU"
                    />
                </FormField>

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

                <FormField label="Наличие" id="stock" error={errors.stock}>
                    <input
                        id="stock"
                        type="text"
                        value={data.stock}
                        onChange={e => setData('stock', e.target.value)}
                        className={`form-input ${errors.stock ? 'error' : ''}`}
                        placeholder="Наличие"
                    />
                </FormField>

                <FormField label="Категория" id="category" error={errors.category}>
                    <select
                        id="category"
                        value={data.category}
                        onChange={e => setData('category', e.target.value)}
                        className={`form-input ${errors.category ? 'error' : ''}`}
                    >
                        <option value="">— Выберите категорию —</option>
                        <option value="">Нет</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                        placeholder="Себестоимость"
                    />
                </FormField>

            </FormWrapper>
        </Layout>
    )
}
