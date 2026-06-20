import Layout from '@/Pages/Admin/Layout/Layout.jsx'
import { useForm, Link } from '@inertiajs/react'
import FormWrapper from '@/Components/Admin/FormWrapper/FormWrapper.jsx'
import FormField from '@/Components/Admin/FormField/FormField.jsx'
import AttributeList from '@/Components/Admin/AttributeList/AttributeList.jsx'
export default function Edit({category ,categories }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || '',
        parent: category.parent_id || '',

        attributes: category.attributes?.map(attr => ({
            id:   attr.id,
            name: attr.name,
        })) ?? [],
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        put(`/admin/categories/${category.id}`)
    }

    return (
        <Layout title="Редактирование категории">
            <FormWrapper
                title={`Категория ${data.name}`}
                onSubmit={handleSubmit}
                processing={processing}
                cancelHref="/admin/categories"
                submitLabel="Обновить Категорию"
            >

                <FormField label="Наименование" id="name" error={errors.name}>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                    />
                </FormField>

                <FormField label="Родительская категория" id="parent" error={errors.parent}>
                    <select
                        id="parent"
                        value={data.parent}
                        onChange={e => setData('parent', e.target.value)}
                        className={`form-input ${errors.parent ? 'error' : ''}`}
                    >
                        <option value="" >Нет</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id} >{cat.name}</option>
                        ))}

                    </select>
                </FormField>

                <AttributeList
                    attributes={data.attributes}
                    onChange={attrs => setData('attributes', attrs)}
                />
            </FormWrapper>
        </Layout>
    )
}
