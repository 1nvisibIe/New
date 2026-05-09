import './FormField.css'

export default function FormField({ label, id, error, children }) {
    return (
        <div className="form-field">
            <label className="form-label" htmlFor={id}>
                {label}
            </label>
            {children}
            {error && <p className="form-error">{error}</p>}
        </div>
    )
}
