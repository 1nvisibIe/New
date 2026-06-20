// resources/js/Components/Admin/ProductAttributeList/ProductAttributeList.jsx
import { Plus, X } from 'lucide-react'
import './ProductAttributeList.css'

export default function ProductAttributeList({ attributes, onChange }) {

    const handleAdd = () => {
        onChange([
            ...attributes,
            { attribute_id: null, name: '', value: '', from_category: false }
        ])
    }

    const handleNameChange = (index, value) => {
        const updated = attributes.map((attr, i) =>
            i === index ? { ...attr, name: value } : attr
        )
        onChange(updated)
    }

    const handleValueChange = (index, value) => {
        const updated = attributes.map((attr, i) =>
            i === index ? { ...attr, value } : attr
        )
        onChange(updated)
    }

    const handleRemove = (index) => {
        // Нельзя удалить атрибут из категории
        const updated = attributes.filter((_, i) => i !== index)
        onChange(updated)
    }

    return (
        <div className="product-attribute-list">
            <div className="attribute-list-header">
                <label className="form-label">Характеристики</label>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="btn-add-attribute"
                >
                    <Plus size={14} />
                    Добавить характеристику
                </button>
            </div>

            {attributes.length === 0 && (
                <p className="attribute-empty">Характеристик пока нет</p>
            )}

            <div className="attribute-fields">
                {attributes.map((attr, index) => (
                    <div key={index} className="product-attribute-field">

                        {/* Название атрибута */}
                        <input
                            type="text"
                            value={attr.name}
                            onChange={e => handleNameChange(index, e.target.value)}
                            placeholder="Название"
                            className="form-input"
                            // Атрибуты из категории нельзя переименовать
                            readOnly={attr.from_category}
                        />

                        {/* Значение атрибута */}
                        <input
                            type="text"
                            value={attr.value}
                            onChange={e => handleValueChange(index, e.target.value)}
                            placeholder="Значение"
                            className="form-input"
                        />

                        {/* Кнопка удаления — только для специфических */}
                        {!attr.from_category ? (
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="btn-remove-attribute"
                                title="Удалить"
                            >
                                <X size={16} />
                            </button>
                        ) : (
                            // Заглушка для выравнивания
                            <div className="btn-placeholder" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
