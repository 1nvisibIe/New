import { Link } from '@inertiajs/react'
import './FormWrapper.css'

export default function FormWrapper({ title, children, onSubmit, processing, cancelHref, submitLabel = 'Сохранить' }) {
    return (
        <div className="form-wrapper">
            <div className="form-wrapper-header">
                <h2 className="form-wrapper-title">{title}</h2>
            </div>

            <form onSubmit={onSubmit}>
                <div className="form-wrapper-body">
                    {children}
                </div>

                <div className="form-wrapper-footer">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary"
                    >
                        {processing ? 'Сохранение...' : submitLabel}
                    </button>
                    {cancelHref && (
                        <Link href={cancelHref} className="btn-cancel">
                            Отмена
                        </Link>
                    )}
                </div>
            </form>
        </div>
    )
}
