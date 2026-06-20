// resources/js/Components/Admin/AttributeList/AttributeList.jsx
import { Plus, X } from 'lucide-react'
import './AttributeList.css'

export default function AttributeList({ attributes, onChange }) {
    // attributes — массив атрибутов от родителя
    // onChange — функция которую вызываем когда что-то изменилось

    // Добавить новое пустое поле
    const handleAdd = () => {
        onChange([
            ...attributes,
            { id: null, name: '' }  // новый пустой атрибут
        ])
    }

    // Изменить имя атрибута по индексу
    const handleChange = (index, value) => {
        // map создаёт новый массив
        // меняем только нужный элемент
        const updated = attributes.map((attr, i) =>
            i === index ? { ...attr, name: value } : attr
        )
        onChange(updated)
    }

    // Удалить атрибут по индексу
    const handleRemove = (index) => {
        // filter убирает элемент с нужным индексом
        const updated = attributes.filter((_, i) => i !== index)
        onChange(updated)
    }

    return (
        <div className="attribute-list">
            <div className="attribute-list-header">
                <label className="form-label">Характеристики</label>
                <button
                    type="button"  // важно! иначе сабмитит форму
                    onClick={handleAdd}
                    className="btn-add-attribute"
                >
                    <Plus size={14} />
                    Добавить характеристику
                </button>
            </div>

            {attributes.length === 0 && (
                <p className="attribute-empty">
                    Характеристик пока нет
                </p>
            )}

            <div className="attribute-fields">
                {attributes.map((attr, index) => (
                    <div key={index} className="attribute-field">
                        <input
                            type="text"
                            value={attr.name}
                            onChange={e => handleChange(index, e.target.value)}
                            placeholder="Название характеристики"
                            className="form-input"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="btn-remove-attribute"
                            title="Удалить"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
