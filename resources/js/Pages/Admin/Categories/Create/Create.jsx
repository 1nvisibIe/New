// resources/js/Pages/Admin/Products/Create.jsx
import Layout from '@/Pages/Admin/Layout/Layout.jsx'
import {useForm} from '@inertiajs/react'
import {Link} from '@inertiajs/react'
import {ChevronRight} from 'lucide-react'
import FormWrapper from "@/Components/Admin/FormWrapper/FormWrapper.jsx";
import FormField from "@/Components/Admin/FormField/FormField.jsx";

export default function Create({categories}) {
    const {data, setData, post, processing, errors} = useForm({

        name:  '',
        parent: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        post('/admin/categories')
    }

    return (
        <Layout title="Новая Категория">

            <FormWrapper title="Создание категории"
                         onSubmit={handleSubmit}
                         cancelHref="/admin/categories"
                         processing={processing}
                         submitLabel="Создать Категорию"
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

                <FormField label="Родительская категория" id="parent" error={errors.parent}>
                    <select
                        id="parent"
                        value={data.parent}
                        onChange={e => setData('parent', e.target.value)}
                        className={`form-input ${errors.parent ? 'error' : ''}`}
                    >
                        <option value="">— Выберите категорию —</option>
                        <option value="">Нет</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}

                    </select>
                </FormField>

            </FormWrapper>

        </Layout>
    )
}
