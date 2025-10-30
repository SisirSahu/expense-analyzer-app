import { useState } from 'react'
import { X, Plus, Edit, Trash2, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { categoryService } from '../../services/categoryService'

function CategoryManager({ categories, onClose, onUpdate }) {
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' })
  const [editingCategory, setEditingCategory] = useState(null)
  const [isAdding, setIsAdding] = useState(false)

  const defaultCategories = categories?.filter(c => c.is_default) || []
  const customCategories = categories?.filter(c => !c.is_default) || []

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Please enter a category name')
      return
    }

    setIsAdding(true)
    const { error } = await categoryService.createCategory(newCategory)
    setIsAdding(false)

    if (error) {
      toast.error('Failed to add category')
      return
    }

    toast.success('Category added successfully!')
    setNewCategory({ name: '', type: 'expense' })
    onUpdate()
  }

  const handleEditCategory = async (category) => {
    if (!editingCategory.name.trim()) {
      toast.error('Please enter a category name')
      return
    }

    const { error } = await categoryService.updateCategory(category.id, {
      name: editingCategory.name,
      type: editingCategory.type
    })

    if (error) {
      toast.error('Failed to update category')
      return
    }

    toast.success('Category updated successfully!')
    setEditingCategory(null)
    onUpdate()
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    const { error } = await categoryService.deleteCategory(id)

    if (error) {
      toast.error('Failed to delete category')
      return
    }

    toast.success('Category deleted successfully!')
    onUpdate()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Manage Categories</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Add New Category */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-dashed border-purple-300">
            <h3 className="font-semibold text-gray-900 mb-3">Add New Category</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Category name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <select
                value={newCategory.type}
                onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <button
                onClick={handleAddCategory}
                disabled={isAdding}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* Default Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Default Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {defaultCategories.map((category) => (
                <div
                  key={category.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    category.type === 'income'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{category.type}</p>
                  </div>
                  <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                    Default
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Categories */}
          {customCategories.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Custom Categories</h3>
              <div className="space-y-2">
                {customCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      category.type === 'income'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    {editingCategory?.id === category.id ? (
                      // Edit Mode
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) =>
                            setEditingCategory({ ...editingCategory, name: e.target.value })
                          }
                          className="flex-1 px-3 py-1 border border-gray-300 rounded"
                        />
                        <select
                          value={editingCategory.type}
                          onChange={(e) =>
                            setEditingCategory({ ...editingCategory, type: e.target.value })
                          }
                          className="px-3 py-1 border border-gray-300 rounded"
                        >
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </select>
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      // View Mode
                      <>
                        <div>
                          <p className="font-medium text-gray-900">{category.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{category.type}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {customCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No custom categories yet</p>
              <p className="text-sm">Add your first custom category above!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryManager

