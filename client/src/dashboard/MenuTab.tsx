import React, { useState, useMemo } from "react";
import {
  useBakeryStore,
  MenuItem,
  MenuItemCategory,
} from "@/lib/bakeryStore";
import { formatCurrency } from "./dashboardUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Minus,
  RotateCcw,
  Edit,
  Trash2,
  Sparkles,
  Layers,
  AlertTriangle,
  Search,
  CheckCircle2,
  Package,
} from "lucide-react";
import BakeryMark from "@/components/BakeryMark";
import { toast } from "sonner";

export default function MenuTab() {
  const { menuItems, updateMenuItem, addMenuItem, deleteMenuItem, updateStock, toggleSoldOut, resetMenu } =
    useBakeryStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newModalOpen, setNewModalOpen] = useState(false);

  // Form states for Edit / Add
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [priceNum, setPriceNum] = useState<number>(54);
  const [category, setCategory] = useState<MenuItemCategory>("Cakes");
  const [serves, setServes] = useState("Serves 8–10");
  const [allergensText, setAllergensText] = useState("Wheat, Dairy, Eggs");
  const [story, setStory] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState<number>(10);

  // Filter menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDetail = item.detail.toLowerCase().includes(q);
        const matchStory = item.story.toLowerCase().includes(q);
        if (!matchTitle && !matchDetail && !matchStory) return false;
      }
      return true;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDetail(item.detail);
    setPriceNum(item.priceNum);
    setCategory(item.category);
    setServes(item.serves);
    setAllergensText(item.allergens.join(", "));
    setStory(item.story);
    setImage(item.image);
    setStock(item.stock);
    setEditModalOpen(true);
  };

  const handleOpenNew = () => {
    setTitle("");
    setDetail("");
    setPriceNum(65);
    setCategory("Cakes");
    setServes("Serves 10–12");
    setAllergensText("Wheat, Dairy, Eggs");
    setStory("");
    setImage("/images/photo-1578985545062-69928b1d9587.jpg");
    setStock(8);
    setNewModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const allergens = allergensText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    updateMenuItem(editingItem.id, {
      title,
      detail,
      priceNum: Number(priceNum),
      priceLabel: `from $${priceNum}`,
      category,
      serves,
      allergens,
      story,
      image,
      stock: Number(stock),
      isSoldOut: Number(stock) <= 0,
    });

    setEditModalOpen(false);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const allergens = allergensText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    addMenuItem({
      title,
      detail,
      priceNum: Number(priceNum),
      priceLabel: `from $${priceNum}`,
      category,
      serves,
      allergens,
      story,
      image: image || "/images/photo-1578985545062-69928b1d9587.jpg",
      stock: Number(stock),
      isSoldOut: Number(stock) <= 0,
    });

    setNewModalOpen(false);
  };

  const handleResetCatalog = () => {
    if (window.confirm("Reset all menu items, stock counts, and prices back to studio defaults?")) {
      resetMenu();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search/Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--terra)]">
              Storefront Catalog
            </span>
            <span className="text-xs text-[var(--ink-mute)]">·</span>
            <span className="text-xs font-semibold text-[var(--ink-mute)]">
              Live Real-Time Inventory
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--ink)] mt-0.5">
            Menu Items &amp; Stock Steppers
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetCatalog}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[oklch(0.88_0.03_60)] bg-white text-xs font-bold text-[var(--ink-soft)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-colors"
            title="Reset catalog to studio defaults"
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--terra)] hover:bg-[var(--terra-deep)] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus size={14} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[var(--hairline)] pb-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[var(--ink-mute)]" />
          <input
            type="text"
            placeholder="Search cakes, shortbread, cupcakes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-[oklch(0.88_0.03_60)] bg-white text-xs focus:outline-none focus:border-[var(--terra)]"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["all", "Cakes", "Cupcakes", "Cookies", "Seasonal"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                selectedCategory === cat
                  ? "bg-[var(--ink)] text-white"
                  : "bg-[var(--paper)] text-[var(--ink-soft)] border border-[oklch(0.89_0.025_62)] hover:border-[var(--ink)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 bg-[var(--paper)] overflow-hidden flex flex-col justify-between shadow-xs ${
                item.isSoldOut
                  ? "border-dashed border-[oklch(0.88_0.03_60)] opacity-85"
                  : "border-[var(--hairline)] hover:shadow-md"
              }`}
            >
              {/* Product Image & Badges */}
              <div className="relative h-44 w-full bg-[var(--cream)] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder image if url fails
                    (e.target as HTMLImageElement).src = "/images/photo-1578985545062-69928b1d9587.jpg";
                  }}
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs text-[10.5px] font-extrabold uppercase tracking-wide text-[var(--ink)] shadow-xs">
                    {item.category}
                  </span>
                  {item.isSoldOut && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10.5px] font-extrabold uppercase tracking-wide shadow-xs">
                      Sold Out
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[var(--ink)]/80 backdrop-blur-xs text-white text-xs font-bold shadow-xs">
                    {formatCurrency(item.priceNum)}
                  </span>
                </div>
              </div>

              {/* Product Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-[var(--ink)] line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--ink-soft)] mt-1 line-clamp-2">
                    {item.detail}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[var(--ink-mute)]">
                    <span className="font-semibold">{item.serves}</span>
                    <span>·</span>
                    <span className="truncate max-w-[170px]">
                      {item.allergens.join(", ")}
                    </span>
                  </div>
                </div>

                {/* Stock Controls & Actions */}
                <div className="pt-3 border-t border-[var(--hairline)] space-y-3">
                  {/* Stock Stepper & Availability Switch */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 bg-[var(--cream)] rounded-full p-1 border border-[var(--hairline)]">
                      <button
                        type="button"
                        onClick={() => updateStock(item.id, Math.max(0, item.stock - 1))}
                        className="size-7 rounded-full bg-white grid place-items-center text-[var(--ink)] shadow-xs hover:bg-[var(--terra)] hover:text-white transition-colors"
                        title="Decrease stock"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-xs font-extrabold text-[var(--ink)]">
                        {item.stock}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateStock(item.id, item.stock + 1)}
                        className="size-7 rounded-full bg-white grid place-items-center text-[var(--ink)] shadow-xs hover:bg-[var(--terra)] hover:text-white transition-colors"
                        title="Increase stock"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[var(--ink-soft)]">
                        {item.isSoldOut ? "Sold Out" : "In Stock"}
                      </span>
                      <Switch
                        checked={!item.isSoldOut}
                        onCheckedChange={() => toggleSoldOut(item.id)}
                      />
                    </div>
                  </div>

                  {/* Edit and Delete Actions */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="inline-flex items-center gap-1 font-bold text-[var(--terra)] hover:underline"
                    >
                      <Edit size={12} />
                      <span>Edit Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete ${item.title} from the menu?`)) {
                          deleteMenuItem(item.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 text-[var(--ink-mute)] hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={12} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Item Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--paper)] p-6 sm:p-7 border border-[var(--hairline)] text-[var(--ink)] rounded-2xl">
          <DialogHeader className="border-b border-[var(--hairline)] pb-3">
            <DialogTitle className="font-display text-xl font-bold text-[var(--ink)]">
              Edit Menu Product
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--ink-mute)]">
              Modify catalog copy, prices, allergens, and inventory levels.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Product Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white focus:outline-none focus:border-[var(--terra)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[var(--ink-soft)] block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MenuItemCategory)}
                  className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
                >
                  <option value="Cakes">Cakes</option>
                  <option value="Cupcakes">Cupcakes</option>
                  <option value="Cookies">Cookies</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[var(--ink-soft)] block mb-1">Base Price ($)</label>
                <input
                  type="number"
                  min="0"
                  value={priceNum}
                  onChange={(e) => setPriceNum(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[var(--ink-soft)] block mb-1">Serving Size</label>
                <input
                  type="text"
                  placeholder="e.g. Serves 12–16"
                  value={serves}
                  onChange={(e) => setServes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--ink-soft)] block mb-1">Stock Units</label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Subtitle / Short Detail</label>
              <input
                type="text"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">
                Allergens (comma-separated)
              </label>
              <input
                type="text"
                value={allergensText}
                onChange={(e) => setAllergensText(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Description / Story</label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white min-h-[70px]"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Image URL / Path</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--hairline)]">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[oklch(0.88_0.03_60)] font-bold text-[var(--ink-soft)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[var(--terra)] hover:bg-[var(--terra-deep)] text-white font-bold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add New Product Modal */}
      <Dialog open={newModalOpen} onOpenChange={setNewModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--paper)] p-6 sm:p-7 border border-[var(--hairline)] text-[var(--ink)] rounded-2xl">
          <DialogHeader className="border-b border-[var(--hairline)] pb-3">
            <DialogTitle className="font-display text-xl font-bold text-[var(--ink)]">
              Add New Bakery Product
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--ink-mute)]">
              Introduce a new seasonal creation or signature pastry to the menu.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveNew} className="mt-4 space-y-4 text-xs">
            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Product Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Vanilla Garden Layer Cake"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white focus:outline-none focus:border-[var(--terra)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[var(--ink-soft)] block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MenuItemCategory)}
                  className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
                >
                  <option value="Cakes">Cakes</option>
                  <option value="Cupcakes">Cupcakes</option>
                  <option value="Cookies">Cookies</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[var(--ink-soft)] block mb-1">Base Price ($)</label>
                <input
                  type="number"
                  min="0"
                  value={priceNum}
                  onChange={(e) => setPriceNum(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[var(--ink-soft)] block mb-1">Serving Size</label>
                <input
                  type="text"
                  placeholder="e.g. Serves 10–14"
                  value={serves}
                  onChange={(e) => setServes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--ink-soft)] block mb-1">Initial Stock Units</label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Short Detail / One-Liner</label>
              <input
                type="text"
                placeholder="e.g. Tender vanilla bean crumb with organic floral crown"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">
                Allergens (comma-separated)
              </label>
              <input
                type="text"
                value={allergensText}
                onChange={(e) => setAllergensText(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-[var(--ink-soft)] block mb-1">Story &amp; Flavor Description</label>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Describe flavor notes, artisan ingredients, and inspiration..."
                className="w-full p-2.5 rounded-lg border border-[oklch(0.88_0.03_60)] bg-white min-h-[70px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--hairline)]">
              <button
                type="button"
                onClick={() => setNewModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[oklch(0.88_0.03_60)] font-bold text-[var(--ink-soft)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[var(--terra)] hover:bg-[var(--terra-deep)] text-white font-bold"
              >
                Create Product
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
