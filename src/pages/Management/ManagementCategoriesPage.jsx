import { useState } from 'react'
import ManagementLayout from '../../components/management/ManagementLayout'
import CategoryItem from '../../components/management/CategoryItem'
import { useEmployee } from '../../context/useEmployee'
import { useRatingCategories } from '../../context/useRatingCategories'
import { isAdminUser } from '../../utils/roles'
import '../../components/auth/AuthLayout.css'
import '../../components/management/ManagementLayout.css'
import './ManagementDashboard.css'

function ManagementCategoriesPage() {
  const { employee } = useEmployee()
  const {
    allCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    loading,
  } = useRatingCategories()

  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [categoryError, setCategoryError] = useState('')
  const [categorySuccess, setCategorySuccess] = useState('')
  const [savingCategory, setSavingCategory] = useState(false)

  const isAdmin = isAdminUser(employee)

  const handleAddCategory = async (event) => {
    event.preventDefault()
    setCategoryError('')
    setCategorySuccess('')

    if (!categoryName.trim()) {
      setCategoryError('Category name is required.')
      return
    }

    setSavingCategory(true)

    const { error: saveError } = await addCategory({
      name: categoryName,
      description: categoryDescription,
    })

    setSavingCategory(false)

    if (saveError) {
      setCategoryError(saveError)
      return
    }

    setCategorySuccess('Category added successfully.')
    setCategoryName('')
    setCategoryDescription('')
    await refreshCategories()
  }

  const handleUpdateCategory = async (categoryId, payload) => {
    const result = await updateCategory(categoryId, payload)

    if (!result.error) {
      await refreshCategories()
    }

    return result
  }

  const handleDeleteCategory = async (categoryId) => {
    const result = await deleteCategory(categoryId)

    if (!result.error) {
      await refreshCategories()
    }

    return result
  }

  return (
    <ManagementLayout>
      <div className="management-panel">
        <header className="management-header">
          <p className="management-header__eyebrow">Rating Categories</p>
          <h1 className="management-header__title">Manage Feedback Categories</h1>
          <p className="management-header__text">
            You can add, edit, or delete custom categories shown in the employee feedback form.
          </p>
        </header>

        {loading ? (
          <div className="auth-loading management-loading" role="status" aria-live="polite">
            <div className="auth-loading__spinner" aria-hidden="true" />
            <p>Loading categories…</p>
          </div>
        ) : (
          <section className="management-section">
            <div className="management-section__header">
              <div>
                <h2 className="management-section__title">Active categories</h2>
                <p className="management-section__text">
                  {allCategories.length} categor{allCategories.length === 1 ? 'y' : 'ies'}{' '}
                  available to employees.
                </p>
              </div>
            </div>

            {allCategories.length === 0 ? (
              <div className="management-empty">No rating categories found.</div>
            ) : (
              <div className="management-category-list">
                {allCategories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    canManage={isAdmin}
                    onUpdate={handleUpdateCategory}
                    onDelete={handleDeleteCategory}
                  />
                ))}
              </div>
            )}

            {isAdmin ? (
              <form className="management-category-form auth-form" onSubmit={handleAddCategory}>
                <h3 className="management-category-form__title">Add category</h3>

                {categorySuccess && (
                  <div className="employee-success" role="status">
                    {categorySuccess}
                  </div>
                )}

                {categoryError && (
                  <div className="auth-alert" role="alert">
                    {categoryError}
                  </div>
                )}

                <div className="auth-field">
                  <label htmlFor="category-name">Category name</label>
                  <input
                    id="category-name"
                    type="text"
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    disabled={savingCategory}
                    placeholder="e.g. Career Growth"
                  />
                </div>

                <div className="auth-field">
                  <label htmlFor="category-description">Description (optional)</label>
                  <textarea
                    id="category-description"
                    value={categoryDescription}
                    onChange={(event) => setCategoryDescription(event.target.value)}
                    disabled={savingCategory}
                    placeholder="Describe what employees should rate."
                    rows={3}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={savingCategory}>
                  {savingCategory ? 'Saving…' : 'Add Category'}
                </button>
              </form>
            ) : (
              <p className="management-section__text">
                You do not have permission to manage rating categories.
              </p>
            )}
          </section>
        )}
      </div>
    </ManagementLayout>
  )
}

export default ManagementCategoriesPage
