import { useEffect, useState } from 'react'
import { productApi } from '../api/productApi'
import { categoryApi } from '../api/categoryApi'
import { brandApi } from '../api/brandApi'
import { ProductCard } from '../components/product/ProductCard'
import type { ProductResponse, CategoryResponse, BrandResponse } from '../types/product.types'

export function ProductListPage() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [brands, setBrands] = useState<BrandResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>()
  const [selectedBrand, setSelectedBrand] = useState<number | undefined>()
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.data.data.content))
    brandApi.getAll().then((res) => setBrands(res.data.data.content))
  }, [])

  useEffect(() => {
    setIsLoading(true)

    const hasFilters = selectedCategory !== undefined || selectedBrand !== undefined

    const request = hasFilters
      ? productApi.filter({ categoryId: selectedCategory, brandId: selectedBrand, page, size: 12 })
      : productApi.getAll(page, 12)

    request
      .then((res) => {
        setProducts(res.data.data.content)
        setTotalPages(res.data.data.totalPages)
      })
      .finally(() => setIsLoading(false))
  }, [selectedCategory, selectedBrand, page])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-2xl text-ink mb-6">Products</h1>

      <div className="flex gap-3 mb-8 font-mono text-xs uppercase tracking-wider">
        <select
          value={selectedCategory ?? ''}
          onChange={(e) => {
            setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)
            setPage(0)
          }}
          className="border border-hairline bg-paper px-3 py-2 rounded-[4px] text-ink"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedBrand ?? ''}
          onChange={(e) => {
            setSelectedBrand(e.target.value ? Number(e.target.value) : undefined)
            setPage(0)
          }}
          className="border border-hairline bg-paper px-3 py-2 rounded-[4px] text-ink"
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p className="font-mono text-sm text-ink/50">Loading...</p>
      ) : products.length === 0 ? (
        <p className="font-mono text-sm text-ink/50">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex gap-2 mt-8 font-mono text-xs">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 border rounded-[4px] ${
                    i === page ? 'bg-forest text-paper border-forest' : 'border-hairline text-ink'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}