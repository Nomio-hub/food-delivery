"use client";
import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type OrderItem = {
  id: string;
  quantity: number;
  food: { name: string; image: string };
};
type Order = {
  id: string;
  user: { email: string };
  foodOrderItems: OrderItem[];
  totalPrice: number;
  address: string;
  status: "PENDING" | "DELIVERED" | "CANCELED";
  createdAt: string;
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  DELIVERED: "Delivered",
  CANCELED: "Canceled",
};
const STATUS_COLOR: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELED: "bg-red-100 text-red-600 border-red-200",
};

const PAGE_SIZE = 10;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showDialog, setShowDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<
    "PENDING" | "DELIVERED" | "CANCELED"
  >("PENDING");
  const [saving, setSaving] = useState(false);

  // Date filter
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get("/api/admin/orders").then((res) => setOrders(res.data));
  }, []);

  // Filter by date
  const filtered = orders.filter((o) => {
    const d = new Date(o.createdAt);
    if (dateFrom && d < new Date(dateFrom)) return false;
    if (dateTo && d > new Date(dateTo + "T23:59:59")) return false;
    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      )
        pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const toggleAll = () => {
    setSelected(
      selected.size === paginated.length
        ? new Set()
        : new Set(paginated.map((o) => o.id)),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch("/api/admin/orders", {
        ids: Array.from(selected),
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) => (selected.has(o.id) ? { ...o, status: newStatus } : o)),
      );
      setSelected(new Set());
      setShowDialog(false);
    } catch {
      alert("Алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";
  const dateLabel =
    dateFrom || dateTo
      ? `${dateFrom ? formatDate(dateFrom) : "…"} – ${dateTo ? formatDate(dateTo) : "…"}`
      : "13 June 2023 – 14 July 2023";

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Orders</h1>
          <p className="text-sm text-zinc-400">{filtered.length} items</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date range picker */}
          <div className="relative">
            <button
              onClick={() => setShowDatePicker((v) => !v)}
              className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm hover:bg-zinc-50"
            >
              <Calendar className="size-4 text-zinc-400" />
              {dateLabel}
            </button>

            {showDatePicker && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowDatePicker(false)}
                />
                <div className="absolute right-0 top-11 z-40 w-72 rounded-2xl border bg-white p-4 shadow-xl">
                  <p className="mb-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                    Date range
                  </p>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">
                        From
                      </label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => {
                          setDateFrom(e.target.value);
                          setPage(1);
                        }}
                        className="w-full rounded-xl border px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-accent-soft"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">
                        To
                      </label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => {
                          setDateTo(e.target.value);
                          setPage(1);
                        }}
                        className="w-full rounded-xl border px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-accent-soft"
                      />
                    </div>
                    {(dateFrom || dateTo) && (
                      <button
                        onClick={() => {
                          setDateFrom("");
                          setDateTo("");
                          setPage(1);
                        }}
                        className="text-xs text-red-400 hover:text-red-600 text-left"
                      >
                        Clear filter
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Change delivery state */}
          <button
            onClick={() => {
              if (selected.size > 0) setShowDialog(true);
            }}
            disabled={selected.size === 0}
            className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-40"
          >
            Change delivery state
            {selected.size > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-accent-soft text-[11px] font-bold text-white">
                {selected.size}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-zinc-50 text-left text-xs font-medium text-zinc-400">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    selected.size === paginated.length && paginated.length > 0
                  }
                  onChange={toggleAll}
                  className="rounded"
                />
              </th>
              <th className="px-4 py-3">№</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Food</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Delivery Address</th>
              <th className="px-4 py-3">Delivery state</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((order, idx) => (
              <Fragment key={order.id}>
                <tr className="border-b transition hover:bg-zinc-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(order.id)}
                      onChange={() => toggleSelect(order.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td className="px-4 py-3 font-medium text-zinc-800">
                    {order.user?.email}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="flex items-center gap-1 text-zinc-500 hover:text-zinc-800"
                    >
                      <span>{order.foodOrderItems.length} foods</span>
                      {expanded.has(order.id) ? (
                        <ChevronUp className="size-3.5" />
                      ) : (
                        <ChevronDown className="size-3.5" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-zinc-800">
                    ${order.totalPrice?.toFixed(2)}
                  </td>
                  <td className="max-w-[160px] truncate px-4 py-3 text-zinc-500">
                    {order.address}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[order.status]}`}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                  </td>
                </tr>

                {expanded.has(order.id) && (
                  <tr className="bg-zinc-50">
                    <td colSpan={8} className="px-8 py-3">
                      <div className="flex flex-col gap-2">
                        {order.foodOrderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3"
                          >
                            {item.food?.image && (
                              <img
                                src={item.food.image}
                                alt={item.food.name}
                                className="size-9 rounded-lg object-cover"
                              />
                            )}
                            <span className="text-sm font-medium text-zinc-700">
                              {item.food?.name}
                            </span>
                            <span className="text-xs text-zinc-400">
                              ×{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex size-8 items-center justify-center rounded-full border bg-white text-zinc-500 hover:bg-zinc-50 disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>

          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="flex size-8 items-center justify-center text-sm text-zinc-400"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`flex size-8 items-center justify-center rounded-full text-sm font-medium transition ${
                  page === p
                    ? "bg-accent-soft text-white"
                    : "border bg-white text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {p}
              </button>
            ),
          )}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex size-8 items-center justify-center rounded-full border bg-white text-zinc-500 hover:bg-zinc-50 disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}

      {/* Change status dialog */}
      {showDialog && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setShowDialog(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowDialog(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600"
            >
              <X className="size-4" />
            </button>
            <h3 className="mb-4 text-base font-semibold text-zinc-800">
              Change delivery state
            </h3>
            <div className="flex gap-2">
              {(["DELIVERED", "PENDING", "CANCELED"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setNewStatus(s)}
                  className={`flex-1 rounded-full border py-2 text-xs font-semibold transition ${
                    newStatus === s
                      ? STATUS_COLOR[s]
                      : "text-zinc-500 hover:bg-zinc-50"
                  }`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 w-full rounded-full bg-zinc-900 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50"
            >
              {saving ? "Хадгалж байна…" : "Save"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
