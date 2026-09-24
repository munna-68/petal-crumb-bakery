import { useState, useMemo } from "react";
import {
  Plus,
  Minus,
  Edit2,
  Trash2,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { useBakeryStore, type MenuItem, type MenuItemCategory } from "@/lib/bakeryStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function MenuTab() {
  const {
    menuItems,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    updateStock,
    toggleSoldOut,
    resetMenu,
    toast,
  } = useBakeryStore();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Item Form State
  const [newItem, setNewItem] = useState({
    title: "",
    detail: "",
    priceNum: 45,
    category: "Cakes" as MenuItemCategory,
    serves: "Serves 8–10",
    allergens: "Wheat, Dairy, Eggs",
    story: "",
    image: "/images/photo-1578985545062-69928b1d9587.jpg",
    stock: 12,
  });

  const categories: ("All" | MenuItemCategory)[] = ["All", "Cakes", "Cupcakes", "Cookies", "Seasonal"];

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return menuItems;
    return menuItems.filter((i) => i.category === activeCategory);
  }, [menuItems, activeCategory]);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateMenuItem(editingItem.id, {
      title: editingItem.title,
      detail: editingItem.detail,
      priceNum: editingItem.priceNum,
      priceLabel: `from $${editingItem.priceNum}`,
      category: editingItem.category,
      serves: editingItem.serves,
      allergens: editingItem.allergens,
      story: editingItem.story,
      image: editingItem.image,
      stock: editingItem.stock,
      isSoldOut: editingItem.stock <= 0,
    });

    toast.success(`Updated ${editingItem.title}`, {
      description: "Changes are live on the customer menu and homepage.",
    });
    setEditingItem(null);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title) {
      toast.error("Please enter a title for the sweet item");
      return;
    }

    addMenuItem({
      title: newItem.title,
      detail: newItem.detail || "Freshly baked to order in small batches.",
      priceNum: newItem.priceNum,
      priceLabel: `from $${newItem.priceNum}`,
      category: newItem.category,
      serves: newItem.serves,
      allergens: newItem.allergens.split(",").map((a) => a.trim()).filter(Boolean),
      story: newItem.story || newItem.detail,
      image: newItem.image,
      stock: newItem.stock,
      isSoldOut: newItem.stock <= 0,
    });

    toast.success(`Added ${newItem.title} to shop menu`, {
      description: "This item is now available for customers to order.",
    });

    setNewItem({
      title: "",
      detail: "",
      priceNum: 45,
      category: "Cakes",
      serves: "Serves 8–10",
      allergens: "Wheat, Dairy, Eggs",
      story: "",
      image: "/images/photo-1578985545062-69928b1d9587.jpg",
      stock: 12,
    });
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[oklch(0.89_0.025_62)] pb-5">
        <div>
          <span className="eyebrow">Counter &amp; shelf management</span>
          <h2 className="mt-1 font-display text-[28px] sm:text-[32px] font-semibold leading-none text-[var(--ink)]">
            Menu Catalog &amp; Live Stock
          </h2>
          <p className="mt-1.5 text-[13px] text-[var(--ink-mute)]">
            Adjust prices, steppers, or toggle items sold out. Syncs live with the storefront.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetMenu}
            className="button-ink px-4 py-2.5 text-[12px]"
            title="Reset to default catalog"
          >
            <RotateCcw size={14} /> Reset catalog
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="button-rose px-5 py-2.5 text-[12px]"
          >
            <Plus size={15} /> Add Sweet Item
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const count = cat === "All" ? menuItems.length : menuItems.filter((i) => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-[12.5px] font-extrabold transition-all ${
                activeCategory === cat
                  ? "bg-[var(--terra)] text-white shadow-xs"
                  : "bg-[var(--paper)] text-[var(--ink-soft)] hover:bg-[var(--blush)] hover:text-[var(--terra)]"
              }`}
            >
              {cat} <span className="opacity-70 text-[11px] tabular-nums">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Menu Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            className={`flex flex-col justify-between rounded-[1.75rem] border bg-[var(--paper)] p-5 transition-all shadow-xs hover:border-[oklch(0.78_0.045_50)] hover:shadow-sm ${
              item.isSoldOut ? "border-red-300 bg-red-50/20 opacity-85" : "border-[oklch(0.89_0.025_62)]"
            }`}
          >
            <div>
              {/* Image & Quick Badges */}
              <div className="relative aspect-[1.1] overflow-hidden rounded-2xl bg-[var(--cream)]">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink)] backdrop-blur-xs">
                  {item.category}
                </span>

                {item.isSoldOut ? (
                  <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-white shadow-sm">
                    Sold Out
                  </span>
                ) : (
                  <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-white shadow-sm">
                    In Stock
                  </span>
                )}
              </div>

              {/* Title & Serving */}
              <div className="mt-4 flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-[22px] font-semibold leading-tight text-[var(--ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-[var(--terra)]">
                    {item.serves}
                  </p>
                </div>
                <span className="font-display text-[22px] font-semibold text-[var(--ink)]">
                  ${item.priceNum}
                </span>
              </div>

              <p className="mt-2 text-[13px] leading-5 text-[var(--ink-mute)] line-clamp-2">
                {item.detail}
              </p>

              {/* Allergens */}
              <div className="mt-3 flex flex-wrap gap-1">
                {item.allergens.map((a) => (
                  <span key={a} className="rounded-full bg-[var(--cream)] px-2 py-0.5 text-[10.5px] text-[var(--ink-mute)]">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Stepper & Action Controls */}
            <div className="mt-5 border-t border-[oklch(0.92_0.016_68)] pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-mute)]">
                  On the rack:
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateStock(item.id, Math.max(0, item.stock - 1))}
                    className="grid h-8 w-8 place-items-center rounded-full border border-[oklch(0.85_0.035_58)] bg-white text-[var(--ink)] transition-colors hover:border-[var(--terra)] hover:bg-[var(--blush)]"
                    aria-label="Decrease stock"
                  >
                    <Minus size={13} />
                  </button>

                  <span className="min-w-[36px] text-center font-display text-[17px] font-semibold tabular-nums text-[var(--ink)]">
                    {item.stock}
                  </span>

                  <button
                    type="button"
                    onClick={() => updateStock(item.id, item.stock + 1)}
                    className="grid h-8 w-8 place-items-center rounded-full border border-[oklch(0.85_0.035_58)] bg-white text-[var(--ink)] transition-colors hover:border-[var(--terra)] hover:bg-[var(--blush)]"
                    aria-label="Increase stock"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleSoldOut(item.id)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] transition-all ${
                    item.isSoldOut
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-red-100 text-red-800 hover:bg-red-200"
                  }`}
                >
                  {item.isSoldOut ? "Mark Available" : "Mark Sold Out"}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-[oklch(0.85_0.035_58)] bg-white text-[var(--ink-soft)] transition-colors hover:border-[var(--terra)] hover:text-[var(--terra)]"
                    aria-label={`Edit ${item.title}`}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove "${item.title}" from the menu?`)) {
                        deleteMenuItem(item.id);
                      }
                    }}
                    className="grid h-9 w-9 place-items-center rounded-full border border-[oklch(0.85_0.035_58)] bg-white text-red-600 transition-colors hover:border-red-500 hover:bg-red-50"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={(o) => !o && setEditingItem(null)}>
        <DialogContent className="max-w-lg rounded-[2rem] border-[oklch(0.89_0.025_62)] bg-[var(--cream)] p-6 sm:p-8">
          {editingItem && (
            <form onSubmit={handleSaveEdit}>
              <DialogHeader>
                <span className="eyebrow">Edit item</span>
                <DialogTitle className="font-display text-[26px] font-semibold text-[var(--ink)]">
                  {editingItem.title}
                </DialogTitle>
                <DialogDescription className="text-[13px] text-[var(--ink-mute)]">
                  Updates will immediately reflect on the public menu and homepage.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                    Item Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="field-base mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                      Starting Price ($)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={editingItem.priceNum}
                      onChange={(e) => setEditingItem({ ...editingItem, priceNum: Number(e.target.value) })}
                      className="field-base mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                      Category
                    </label>
                    <select
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as MenuItemCategory })}
                      className="field-base mt-1.5"
                    >
                      <option value="Cakes">Cakes</option>
                      <option value="Cupcakes">Cupcakes</option>
                      <option value="Cookies">Cookies</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                      Servings / Box Count
                    </label>
                    <input
                      type="text"
                      value={editingItem.serves}
                      onChange={(e) => setEditingItem({ ...editingItem, serves: e.target.value })}
                      className="field-base mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editingItem.stock}
                      onChange={(e) => setEditingItem({ ...editingItem, stock: Number(e.target.value) })}
                      className="field-base mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.detail}
                    onChange={(e) => setEditingItem({ ...editingItem, detail: e.target.value })}
                    className="field-base mt-1.5"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                    Allergens (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingItem.allergens.join(", ")}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        allergens: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="field-base mt-1.5"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={editingItem.image}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    className="field-base mt-1.5"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingItem(null)} className="button-ink px-5 py-2.5 text-[12.5px]">
                  Cancel
                </button>
                <button type="submit" className="button-rose px-6 py-2.5 text-[12.5px]">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Item Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg rounded-[2rem] border-[oklch(0.89_0.025_62)] bg-[var(--cream)] p-6 sm:p-8">
          <form onSubmit={handleCreateItem}>
            <DialogHeader>
              <span className="eyebrow">New creation</span>
              <DialogTitle className="font-display text-[26px] font-semibold text-[var(--ink)]">
                Add to Menu Catalog
              </DialogTitle>
              <DialogDescription className="text-[13px] text-[var(--ink-mute)]">
                Create a seasonal cake, cookie box, or sweet treat for clients to order.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lavender Honey Petite Cake"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="field-base mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                    Starting Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newItem.priceNum}
                    onChange={(e) => setNewItem({ ...newItem, priceNum: Number(e.target.value) })}
                    className="field-base mt-1.5"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                    Category *
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as MenuItemCategory })}
                    className="field-base mt-1.5"
                  >
                    <option value="Cakes">Cakes</option>
                    <option value="Cupcakes">Cupcakes</option>
                    <option value="Cookies">Cookies</option>
                    <option value="Seasonal">Seasonal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                    Serving Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Serves 6–8"
                    value={newItem.serves}
                    onChange={(e) => setNewItem({ ...newItem, serves: e.target.value })}
                    className="field-base mt-1.5"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })}
                    className="field-base mt-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell clients what makes this sweet thing special..."
                  value={newItem.detail}
                  onChange={(e) => setNewItem({ ...newItem, detail: e.target.value })}
                  className="field-base mt-1.5"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                  Allergens (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Wheat, Dairy, Eggs"
                  value={newItem.allergens}
                  onChange={(e) => setNewItem({ ...newItem, allergens: e.target.value })}
                  className="field-base mt-1.5"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--ink-soft)]">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  className="field-base mt-1.5"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddOpen(false)} className="button-ink px-5 py-2.5 text-[12.5px]">
                Cancel
              </button>
              <button type="submit" className="button-rose px-6 py-2.5 text-[12.5px]">
                Add to Menu
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
