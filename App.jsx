import { useState } from "react";

const DEFAULT_EVENTS = [
  {
    id: "event-1",
    name: "サンプルイベント",
    date: "2026-05-17",
    categories: [
      {
        id: "cat-5",
        name: "🎌 ファサード",
        items: [
          { id: "item-20", name: "横断幕", qty: 1, checked: false },
          { id: "item-21", name: "腰巻き", qty: 1, checked: false },
          { id: "item-22", name: "のぼり", qty: 2, checked: false },
          { id: "item-23", name: "物干し竿", qty: 1, checked: false },
          { id: "item-24", name: "LED照明", qty: 2, checked: false },
        ],
      },
      {
        id: "cat-3",
        name: "📦 備品・消耗品",
        items: [
          { id: "item-11", name: "ラミパック30", qty: 1, checked: false },
          { id: "item-12", name: "ラミパック40", qty: 1, checked: false },
          { id: "item-13", name: "レジ袋S", qty: 1, checked: false },
          { id: "item-14", name: "レジ袋M", qty: 1, checked: false },
          { id: "item-15", name: "ゴミ袋45ℓ", qty: 1, checked: false },
          { id: "item-25", name: "ポリグローブ", qty: 1, checked: false },
          { id: "item-26", name: "ゴム手袋", qty: 1, checked: false },
          { id: "item-27", name: "ラップ", qty: 1, checked: false },
          { id: "item-28", name: "ペーパータオル", qty: 1, checked: false },
        ],
      },
      {
        id: "cat-4",
        name: "💰 販売・会計",
        items: [
          { id: "item-16", name: "釣銭50,000円", qty: 1, checked: false },
          { id: "item-17", name: "レジ端末", qty: 1, checked: false },
          { id: "item-18", name: "メニュー表", qty: 1, checked: false },
          { id: "item-19", name: "各種POP", qty: 1, checked: false },
        ],
      },
      {
        id: "cat-1",
        name: "🍳 調理器具",
        items: [
          { id: "item-1",  name: "フライヤー23ℓ", qty: 1, checked: false },
          { id: "item-2",  name: "フライヤーはね", qty: 1, checked: false },
          { id: "item-3",  name: "揚げザル", qty: 1, checked: false },
          { id: "item-4",  name: "カス用ザル小", qty: 1, checked: false },
          { id: "item-5",  name: "揚げ用トング", qty: 1, checked: false },
          { id: "item-6",  name: "粉用番重", qty: 1, checked: false },
          { id: "item-7",  name: "粉用ザル", qty: 1, checked: false },
          { id: "item-8",  name: "揚げ用ボウル", qty: 1, checked: false },
          { id: "item-9",  name: "粉ふるいザル", qty: 1, checked: false },
          { id: "item-10", name: "バット", qty: 1, checked: false },
          { id: "item-29", name: "ボウル", qty: 1, checked: false },
          { id: "item-30", name: "唐揚げ用トング", qty: 1, checked: false },
          { id: "item-31", name: "その他", qty: 1, checked: false },
        ],
      },
      {
        id: "cat-2",
        name: "🧄 食材",
        items: [
          { id: "item-32", name: "鶏むね肉", qty: 1, checked: false },
          { id: "item-33", name: "ぼんじり", qty: 1, checked: false },
          { id: "item-34", name: "むねトロ", qty: 1, checked: false },
          { id: "item-35", name: "岩塩", qty: 1, checked: false },
          { id: "item-36", name: "マヨ", qty: 1, checked: false },
          { id: "item-37", name: "片栗粉", qty: 1, checked: false },
          { id: "item-38", name: "油", qty: 1, checked: false },
          { id: "item-39", name: "その他", qty: 1, checked: false },
        ],
      },
    ],
  },
];

function generateId() {
  return "id-" + Math.random().toString(36).substr(2, 9);
}

export default function App() {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem("gotchi-events");
      return saved ? JSON.parse(saved) : DEFAULT_EVENTS;
    } catch {
      return DEFAULT_EVENTS;
    }
  });
  const [activeEventId, setActiveEventId] = useState(() => events[0]?.id || null);
  const [view, setView] = useState("checklist");
  const [editingItem, setEditingItem] = useState(null);
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [addingItem, setAddingItem] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);
  const [newCatName, setNewCatName] = useState("");
  const [addingCat, setAddingCat] = useState(false);
  const [flame, setFlame] = useState(false);
  const [sortMode, setSortMode] = useState(false);
  const [copyFromId, setCopyFromId] = useState("");

  function save(updated) {
    setEvents(updated);
    try { localStorage.setItem("gotchi-events", JSON.stringify(updated)); } catch {}
  }

  const activeEvent = events.find((e) => e.id === activeEventId);
  const totalItems = activeEvent?.categories.flatMap((c) => c.items).length || 0;
  const checkedItems = activeEvent?.categories.flatMap((c) => c.items).filter((i) => i.checked).length || 0;
  const progress = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);

  function updateEvent(updater) {
    save(events.map((ev) => ev.id !== activeEventId ? ev : updater(ev)));
  }

  function toggleItem(catId, itemId) {
    setFlame(true);
    setTimeout(() => setFlame(false), 600);
    updateEvent((ev) => ({
      ...ev,
      categories: ev.categories.map((cat) =>
        cat.id !== catId ? cat : {
          ...cat,
          items: cat.items.map((item) =>
            item.id !== itemId ? item : { ...item, checked: !item.checked }
          ),
        }
      ),
    }));
  }

  function updateItemQty(catId, itemId, delta) {
    updateEvent((ev) => ({
      ...ev,
      categories: ev.categories.map((cat) =>
        cat.id !== catId ? cat : {
          ...cat,
          items: cat.items.map((item) =>
            item.id !== itemId ? item : { ...item, qty: Math.max(0, item.qty + delta) }
          ),
        }
      ),
    }));
  }

  function deleteItem(catId, itemId) {
    updateEvent((ev) => ({
      ...ev,
      categories: ev.categories.map((cat) =>
        cat.id !== catId ? cat : { ...cat, items: cat.items.filter((i) => i.id !== itemId) }
      ),
    }));
  }

  function saveEditItem() {
    if (!editingItem) return;
    updateEvent((ev) => ({
      ...ev,
      categories: ev.categories.map((cat) =>
        cat.id !== editingItem.catId ? cat : {
          ...cat,
          items: cat.items.map((item) =>
            item.id !== editingItem.id ? item : { ...item, name: editingItem.name, qty: editingItem.qty }
          ),
        }
      ),
    }));
    setEditingItem(null);
  }

  function addItem(catId) {
    if (!newItemName.trim()) return;
    const newItem = { id: generateId(), name: newItemName.trim(), qty: newItemQty, checked: false };
    updateEvent((ev) => ({
      ...ev,
      categories: ev.categories.map((cat) =>
        cat.id !== catId ? cat : { ...cat, items: [...cat.items, newItem] }
      ),
    }));
    setNewItemName(""); setNewItemQty(1); setAddingItem(null);
  }

  function addCategory() {
    if (!newCatName.trim()) return;
    const newCat = { id: generateId(), name: newCatName.trim(), items: [] };
    updateEvent((ev) => ({ ...ev, categories: [...ev.categories, newCat] }));
    setNewCatName(""); setAddingCat(false);
  }

  function deleteCategory(catId) {
    const cat = activeEvent?.categories.find((c) => c.id === catId);
    if (!window.confirm(`「${cat?.name}」を削除しますか？`)) return;
    updateEvent((ev) => ({ ...ev, categories: ev.categories.filter((c) => c.id !== catId) }));
  }

  function moveCategory(catId, direction) {
    updateEvent((ev) => {
      const cats = [...ev.categories];
      const idx = cats.findIndex((c) => c.id === catId);
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= cats.length) return ev;
      [cats[idx], cats[newIdx]] = [cats[newIdx], cats[idx]];
      return { ...ev, categories: cats };
    });
  }

  function addEvent() {
    if (!newEventName.trim()) return;
    // copyFromId が指定されていればカテゴリ・アイテムを複製（checkedはリセット）
    let categories = [];
    if (copyFromId) {
      const src = events.find((e) => e.id === copyFromId);
      if (src) {
        categories = src.categories.map((cat) => ({
          ...cat,
          id: generateId(),
          items: cat.items.map((item) => ({ ...item, id: generateId(), checked: false })),
        }));
      }
    }
    const newEv = { id: generateId(), name: newEventName.trim(), date: newEventDate, categories };
    const updated = [...events, newEv];
    save(updated);
    setActiveEventId(newEv.id);
    setNewEventName(""); setNewEventDate(""); setCopyFromId("");
    setView("checklist");
  }

  function deleteEvent(id) {
    const ev = events.find((e) => e.id === id);
    if (!window.confirm(`「${ev?.name}」を削除しますか？\nチェックデータもすべて消えます。`)) return;
    const remaining = events.filter((e) => e.id !== id);
    save(remaining);
    if (activeEventId === id) setActiveEventId(remaining[0]?.id || null);
  }

  function resetChecks() {
    updateEvent((ev) => ({
      ...ev,
      categories: ev.categories.map((cat) => ({
        ...cat,
        items: cat.items.map((item) => ({ ...item, checked: false })),
      })),
    }));
  }

  const S = {
    app: { minHeight: "100vh", background: "#1a0a00", fontFamily: "'Noto Sans JP', sans-serif", color: "#fff", overflowX: "hidden" },
    header: { background: "linear-gradient(135deg, #c0392b 0%, #e74c3c 40%, #f39c12 100%)", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(231,76,60,0.6)" },
    headerInner: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" },
    logoText: { fontSize: "20px", fontWeight: "900", letterSpacing: "-0.5px", textShadow: "0 2px 8px rgba(0,0,0,0.4)", lineHeight: 1.1 },
    logoSub: { fontSize: "10px", fontWeight: "500", opacity: 0.85, letterSpacing: "1px" },
    progressBar: { height: "6px", background: "rgba(0,0,0,0.3)" },
    progressFill: { height: "100%", background: "#fff", transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)", borderRadius: "0 3px 3px 0" },
    nav: { display: "flex", background: "#2d0e00", borderBottom: "2px solid #c0392b" },
    navBtn: (a) => ({ flex: 1, padding: "12px 8px", background: a ? "#c0392b" : "transparent", border: "none", color: a ? "#fff" : "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.5px", transition: "all 0.2s" }),
    content: { padding: "16px", maxWidth: "600px", margin: "0 auto" },
    eventSelector: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", background: "#2d0e00", borderRadius: "12px", padding: "12px", border: "1px solid #c0392b44" },
    select: { flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: "15px", fontWeight: "700", outline: "none", cursor: "pointer" },
    statsRow: { display: "flex", gap: "8px", marginBottom: "16px" },
    statCard: (c) => ({ flex: 1, background: `${c}22`, border: `1px solid ${c}55`, borderRadius: "12px", padding: "10px", textAlign: "center" }),
    statNum: (c) => ({ fontSize: "24px", fontWeight: "900", color: c, lineHeight: 1 }),
    statLabel: { fontSize: "10px", opacity: 0.7, marginTop: "2px", fontWeight: "600", letterSpacing: "0.5px" },
    catBlock: (sort) => ({ background: "#2d0e00", borderRadius: "16px", marginBottom: "12px", border: sort ? "1px solid #f39c1266" : "1px solid #c0392b33", overflow: "hidden", transition: "border 0.2s" }),
    catHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "linear-gradient(90deg, #c0392b22, transparent)", borderBottom: "1px solid #c0392b22" },
    catName: { fontSize: "14px", fontWeight: "800" },
    iconBtn: (c) => ({ background: "transparent", border: "none", color: c || "#fff", cursor: "pointer", fontSize: "16px", padding: "2px 6px", opacity: 0.7 }),
    sortArrow: (disabled) => ({
      background: disabled ? "transparent" : "#3d1500",
      border: `1px solid ${disabled ? "#333" : "#f39c12"}`,
      color: disabled ? "#333" : "#f39c12",
      cursor: disabled ? "default" : "pointer",
      borderRadius: "6px",
      width: "30px",
      height: "30px",
      fontSize: "14px",
      fontWeight: "900",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    sortModeBtn: (active) => ({
      background: active ? "#f39c12" : "transparent",
      border: `1px solid ${active ? "#f39c12" : "#f39c1288"}`,
      color: active ? "#1a0a00" : "#f39c12",
      borderRadius: "8px",
      padding: "6px 12px",
      fontWeight: "800",
      cursor: "pointer",
      fontSize: "11px",
      letterSpacing: "0.5px",
      whiteSpace: "nowrap",
    }),
    itemRow: (checked) => ({ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: checked ? "rgba(46,204,113,0.08)" : "transparent", borderBottom: "1px solid #ffffff08", transition: "background 0.3s" }),
    checkbox: (checked) => ({ width: "22px", height: "22px", borderRadius: "6px", border: `2px solid ${checked ? "#2ecc71" : "#c0392b"}`, background: checked ? "#2ecc71" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.2s", fontSize: "12px" }),
    itemName: (checked) => ({ flex: 1, fontSize: "14px", fontWeight: "600", textDecoration: checked ? "line-through" : "none", opacity: checked ? 0.5 : 1 }),
    qtyControl: { display: "flex", alignItems: "center", gap: "6px", background: "#1a0a0055", borderRadius: "8px", padding: "2px" },
    qtyBtn: { background: "#c0392b", border: "none", color: "#fff", width: "22px", height: "22px", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center" },
    qtyNum: { fontSize: "13px", fontWeight: "800", minWidth: "28px", textAlign: "center", color: "#f39c12" },
    addItemBtn: { width: "100%", padding: "10px", background: "transparent", border: "1px dashed #c0392b55", borderRadius: "0 0 12px 12px", color: "#c0392b", fontSize: "12px", fontWeight: "700", cursor: "pointer", letterSpacing: "1px" },
    addCatBtn: { width: "100%", padding: "14px", background: "transparent", border: "2px dashed #c0392b55", borderRadius: "16px", color: "#c0392b", fontSize: "13px", fontWeight: "700", cursor: "pointer", letterSpacing: "1px", marginBottom: "12px" },
    inputRow: { display: "flex", gap: "8px", padding: "10px 14px", background: "#1a0a00", borderTop: "1px solid #c0392b22" },
    input: { flex: 1, background: "#2d0e00", border: "1px solid #c0392b55", borderRadius: "8px", color: "#fff", padding: "8px 12px", fontSize: "13px", outline: "none" },
    smallInput: { width: "60px", background: "#2d0e00", border: "1px solid #c0392b55", borderRadius: "8px", color: "#f39c12", padding: "8px", fontSize: "13px", outline: "none", textAlign: "center", fontWeight: "800" },
    confirmBtn: { background: "#c0392b", border: "none", color: "#fff", borderRadius: "8px", padding: "8px 14px", fontWeight: "800", cursor: "pointer", fontSize: "13px" },
    cancelBtn: { background: "transparent", border: "1px solid #ffffff33", color: "#fff", borderRadius: "8px", padding: "8px 10px", fontWeight: "700", cursor: "pointer", fontSize: "13px" },
    resetBtn: { background: "#2d0e00", border: "1px solid #c0392b", color: "#c0392b", borderRadius: "10px", padding: "10px 12px", fontWeight: "800", cursor: "pointer", fontSize: "11px", whiteSpace: "nowrap" },
    modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "20px" },
    modalBox: { background: "#2d0e00", border: "2px solid #c0392b", borderRadius: "20px", padding: "24px", width: "100%", maxWidth: "360px" },
    modalTitle: { fontSize: "16px", fontWeight: "900", marginBottom: "16px", color: "#f39c12" },
    eventCard: { background: "#2d0e00", borderRadius: "14px", padding: "14px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "12px" },
    emptyState: { textAlign: "center", padding: "40px 20px", opacity: 0.5 },
  };

  const renderChecklist = () => (
    <div style={S.content}>
      {/* Event selector */}
      <div style={S.eventSelector}>
        <span style={{ fontSize: "20px" }}>📍</span>
        <select style={S.select} value={activeEventId || ""} onChange={(e) => setActiveEventId(e.target.value)}>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id} style={{ background: "#1a0a00" }}>
              {ev.name}{ev.date ? `　${ev.date}` : ""}
            </option>
          ))}
        </select>
        <button style={S.resetBtn} onClick={resetChecks}>↺ リセット</button>
      </div>

      {/* Stats */}
      <div style={S.statsRow}>
        <div style={S.statCard("#e74c3c")}><div style={S.statNum("#e74c3c")}>{totalItems}</div><div style={S.statLabel}>TOTAL</div></div>
        <div style={S.statCard("#2ecc71")}><div style={S.statNum("#2ecc71")}>{checkedItems}</div><div style={S.statLabel}>CHECKED</div></div>
        <div style={S.statCard("#f39c12")}><div style={S.statNum("#f39c12")}>{totalItems - checkedItems}</div><div style={S.statLabel}>REMAINING</div></div>
      </div>

      {!activeEvent && (
        <div style={S.emptyState}>
          <div style={{ fontSize: "40px" }}>🍗</div>
          <div>イベントがありません</div>
          <div style={{ fontSize: "12px", marginTop: "8px" }}>「イベント」タブからイベントを追加してください</div>
        </div>
      )}

      {/* 並び替えモード切り替えボタン */}
      {activeEvent && activeEvent.categories.length > 1 && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <button style={S.sortModeBtn(sortMode)} onClick={() => setSortMode(!sortMode)}>
            {sortMode ? "✓ 並び替え完了" : "⇅ カテゴリ並び替え"}
          </button>
        </div>
      )}

      {/* Categories */}
      {activeEvent?.categories.map((cat, catIdx) => {
        const catTotal = cat.items.length;
        const catChecked = cat.items.filter((i) => i.checked).length;
        const isFirst = catIdx === 0;
        const isLast = catIdx === activeEvent.categories.length - 1;

        return (
          <div key={cat.id} style={S.catBlock(sortMode)}>
            <div style={S.catHeader}>
              <div>
                <div style={S.catName}>{cat.name}</div>
                <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "2px" }}>
                  {sortMode ? `${catTotal} アイテム` : `${catChecked}/${catTotal} 完了`}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {sortMode && (
                  <>
                    <button style={S.sortArrow(isFirst)} disabled={isFirst} onClick={() => moveCategory(cat.id, -1)}>▲</button>
                    <button style={S.sortArrow(isLast)} disabled={isLast} onClick={() => moveCategory(cat.id, 1)}>▼</button>
                  </>
                )}
                <button style={S.iconBtn("#ff6b6b")} onClick={() => deleteCategory(cat.id)}>🗑</button>
              </div>
            </div>

            {/* 並び替えモード中はアイテム非表示 */}
            {!sortMode && (
              <>
                {cat.items.map((item) => (
                  <div key={item.id} style={S.itemRow(item.checked)}>
                    <div style={S.checkbox(item.checked)} onClick={() => toggleItem(cat.id, item.id)}>
                      {item.checked && "✓"}
                    </div>
                    <div style={S.itemName(item.checked)} onClick={() => setEditingItem({ ...item, catId: cat.id })}>
                      {item.name}
                    </div>
                    <div style={S.qtyControl}>
                      <button style={S.qtyBtn} onClick={() => updateItemQty(cat.id, item.id, -1)}>−</button>
                      <span style={S.qtyNum}>{item.qty}</span>
                      <button style={S.qtyBtn} onClick={() => updateItemQty(cat.id, item.id, 1)}>＋</button>
                    </div>
                    <button style={S.iconBtn("#ff6b6b")} onClick={() => deleteItem(cat.id, item.id)}>×</button>
                  </div>
                ))}
                {addingItem === cat.id ? (
                  <div style={S.inputRow}>
                    <input
                      style={S.input}
                      placeholder="アイテム名"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addItem(cat.id)}
                      autoFocus
                    />
                    <input
                      style={S.smallInput}
                      type="number"
                      min="0"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(Number(e.target.value))}
                    />
                    <button style={S.confirmBtn} onClick={() => addItem(cat.id)}>追加</button>
                    <button style={S.cancelBtn} onClick={() => setAddingItem(null)}>✕</button>
                  </div>
                ) : (
                  <button style={S.addItemBtn} onClick={() => { setAddingItem(cat.id); setNewItemName(""); setNewItemQty(1); }}>
                    ＋ アイテムを追加
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}

      {activeEvent && !sortMode && (
        addingCat ? (
          <div style={{ ...S.catBlock(false), padding: "14px" }}>
            <div style={{ fontSize: "13px", fontWeight: "800", color: "#f39c12", marginBottom: "10px" }}>新しいカテゴリ</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                style={S.input}
                placeholder="例: 🧃 ドリンク類"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
                autoFocus
              />
              <button style={S.confirmBtn} onClick={addCategory}>追加</button>
              <button style={S.cancelBtn} onClick={() => setAddingCat(false)}>✕</button>
            </div>
          </div>
        ) : (
          <button style={S.addCatBtn} onClick={() => setAddingCat(true)}>＋ カテゴリを追加</button>
        )
      )}
    </div>
  );

  const renderEvents = () => (
    <div style={S.content}>
      <div style={{ fontSize: "16px", fontWeight: "900", color: "#f39c12", marginBottom: "16px" }}>📅 イベント管理</div>
      {events.map((ev) => {
        const total = ev.categories.flatMap((c) => c.items).length;
        const checked = ev.categories.flatMap((c) => c.items).filter((i) => i.checked).length;
        return (
          <div key={ev.id} style={{ ...S.eventCard, border: ev.id === activeEventId ? "2px solid #e74c3c" : "1px solid #c0392b33" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "800", fontSize: "15px" }}>{ev.name}</div>
              {ev.date && <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "2px" }}>{ev.date}</div>}
              <div style={{ fontSize: "11px", color: "#f39c12", marginTop: "4px" }}>{checked}/{total} チェック済み</div>
            </div>
            <button
              style={{ background: ev.id === activeEventId ? "#c0392b" : "#2d0e00", border: "1px solid #c0392b", color: "#fff", borderRadius: "8px", padding: "6px 12px", fontWeight: "700", cursor: "pointer", fontSize: "12px" }}
              onClick={() => { setActiveEventId(ev.id); setView("checklist"); }}
            >
              {ev.id === activeEventId ? "✓ 選択中" : "選択"}
            </button>
            {events.length > 1 && (
              <button style={S.iconBtn("#ff6b6b")} onClick={() => deleteEvent(ev.id)}>🗑</button>
            )}
          </div>
        );
      })}
      <div style={{ ...S.catBlock(false), padding: "16px" }}>
        <div style={{ fontSize: "14px", fontWeight: "800", color: "#f39c12", marginBottom: "12px" }}>＋ 新しいイベントを追加</div>
        <input
          style={{ ...S.input, width: "100%", boxSizing: "border-box", marginBottom: "8px" }}
          placeholder="イベント名（例: 夏祭り2026）"
          value={newEventName}
          onChange={(e) => setNewEventName(e.target.value)}
        />
        <input
          style={{ ...S.input, width: "100%", boxSizing: "border-box", marginBottom: "8px" }}
          type="date"
          value={newEventDate}
          onChange={(e) => setNewEventDate(e.target.value)}
        />
        <div style={{ marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", color: "#f39c12", fontWeight: "700", marginBottom: "6px", letterSpacing: "0.5px" }}>
            📋 荷物リストを流用する（任意）
          </div>
          <select
            style={{ ...S.input, width: "100%", boxSizing: "border-box" }}
            value={copyFromId}
            onChange={(e) => setCopyFromId(e.target.value)}
          >
            <option value="">― 空のリストで始める ―</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id} style={{ background: "#1a0a00" }}>
                {ev.name}{ev.date ? `　${ev.date}` : ""}
              </option>
            ))}
          </select>
          {copyFromId && (
            <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px", paddingLeft: "4px" }}>
              ✓ チェックはすべてリセットされます
            </div>
          )}
        </div>
        <button style={{ ...S.confirmBtn, width: "100%", padding: "12px", fontSize: "14px" }} onClick={addEvent}>
          {copyFromId ? "📋 流用してイベントを追加" : "イベントを追加"}
        </button>
      </div>
    </div>
  );

  const renderEditModal = () =>
    editingItem && (
      <div style={S.modal} onClick={() => setEditingItem(null)}>
        <div style={S.modalBox} onClick={(e) => e.stopPropagation()}>
          <div style={S.modalTitle}>✏️ アイテムを編集</div>
          <input
            style={{ ...S.input, width: "100%", boxSizing: "border-box", marginBottom: "12px" }}
            value={editingItem.name}
            onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>数量</span>
            <input
              style={{ ...S.smallInput, flex: 1 }}
              type="number"
              min="0"
              value={editingItem.qty}
              onChange={(e) => setEditingItem({ ...editingItem, qty: Number(e.target.value) })}
            />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{ ...S.confirmBtn, flex: 1, padding: "12px" }} onClick={saveEditItem}>保存</button>
            <button style={{ ...S.cancelBtn, flex: 1, padding: "12px" }} onClick={() => setEditingItem(null)}>キャンセル</button>
          </div>
        </div>
      </div>
    );

  return (
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #1a0a00; }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; }
        select option { background: #1a0a00; }
        @keyframes flamePop { 0%{transform:scale(1)} 50%{transform:scale(1.15)} 100%{transform:scale(1)} }
      `}</style>

      <div style={S.header}>
        <div style={S.headerInner}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "28px", animation: flame ? "flamePop 0.6s ease" : "none" }}>🔥</span>
            <div>
              <div style={S.logoText}>からあげ！ごっち</div>
              <div style={S.logoSub}>EVENT CHECKLIST</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "22px", fontWeight: "900" }}>{progress}%</div>
            <div style={{ fontSize: "10px", opacity: 0.8 }}>{checkedItems}/{totalItems}</div>
          </div>
        </div>
        <div style={S.progressBar}>
          <div style={{ ...S.progressFill, width: `${progress}%` }} />
        </div>
      </div>

      <div style={S.nav}>
        <button style={S.navBtn(view === "checklist")} onClick={() => { setView("checklist"); setSortMode(false); }}>
          📋 チェックリスト
        </button>
        <button style={S.navBtn(view === "events")} onClick={() => { setView("events"); setSortMode(false); }}>
          📅 イベント
        </button>
      </div>

      {view === "checklist" && renderChecklist()}
      {view === "events" && renderEvents()}
      {renderEditModal()}
    </div>
  );
}
