import { useState } from 'react'

function CategoryItem({ category, canManage, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [description, setDescription] = useState(category.description || '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSave = async () => {
    setError('')

    if (!name.trim()) {
      setError('Category name is required.')
      return
    }

    setSaving(true)

    const result = await onUpdate(category.id, { name, description })

    setSaving(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setEditing(false)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${category.name}"? Existing feedback will keep its stored ratings, but this category will no longer appear in the form.`,
    )

    if (!confirmed) {
      return
    }

    setDeleting(true)
    setError('')

    const result = await onDelete(category.id)

    if (result.error) {
      setError(result.error)
      setDeleting(false)
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setName(category.name)
    setDescription(category.description || '')
    setError('')
  }

  if (editing) {
    return (
      <div className="management-category-item management-category-item--editing">
        <div className="management-category-item__form">
          <div className="auth-field">
            <label htmlFor={`category-name-${category.id}`}>Category name</label>
            <input
              id={`category-name-${category.id}`}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={saving || deleting}
            />
          </div>
          <div className="auth-field">
            <label htmlFor={`category-description-${category.id}`}>Description (optional)</label>
            <textarea
              id={`category-description-${category.id}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={saving || deleting}
              rows={2}
            />
          </div>
          {error && (
            <div className="auth-alert" role="alert">
              {error}
            </div>
          )}
          <div className="management-category-item__actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving || deleting}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={saving || deleting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="management-category-item">
      <div>
        <span className="management-category-item__name">{category.name}</span>
        {category.description && (
          <p className="management-category-item__description">{category.description}</p>
        )}
        {error && (
          <div className="auth-alert management-category-item__alert" role="alert">
            {error}
          </div>
        )}
      </div>
      <div className="management-category-item__meta">
        <span className="management-category-item__badge">
          {category.isDefault ? 'Default' : 'Custom'}
        </span>
        {canManage && (
          <div className="management-category-item__actions">
            <button
              type="button"
              className="btn btn-secondary management-category-item__btn"
              onClick={() => setEditing(true)}
              disabled={deleting}
            >
              Edit
            </button>
            {!category.isDefault && (
              <button
                type="button"
                className="btn btn-secondary management-category-item__btn management-category-item__btn--delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryItem
