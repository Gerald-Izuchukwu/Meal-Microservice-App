import { useState, useEffect } from "react";
import {
  getToken, storeToken, clearToken, getUser, storeUser, clearUser,
  register, callSaveUser, saveUser, login as loginApi, resetPassword,
  logoutApi, getFood, getFoodByType,
  buyFood, addFood, addToCart,
  getOrders, deleteOrder, deleteAllOrders, receivedOrder,
  getDeliveryQueue, acceptOrder, deliveryComplete,
} from "./api.js";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600&display=swap');`;

const FOOD_TYPES = [
  // { label: "All",         value: "all" },
  { label: "Soup",        value: "soup" },
  { label: "Snacks",      value: "snacks" },
  { label: "Swallow",     value: "swallow" },
  { label: "Single food", value: "singlefood" },
  { label: "Protein",     value: "protien" },
  { label: "Dish",        value: "dish" },
  { label: "Drinks",      value: "drinks" },
];

function formatNGN(n) { return "₦" + Number(n || 0).toLocaleString(); }

function Spinner({ size = 16, color = "#fff" }) {
  return <span style={{ display: "inline-block", width: size, height: size, border: `2px solid rgba(255,255,255,.3)`, borderTopColor: color, borderRadius: "50%", animation: "spin .7s linear infinite" }} />;
}

function ErrorBanner({ msg, onDismiss }) {
  if (!msg) return null;
  return (
    <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontFamily: "Inter", fontSize: 13, color: "#7F1D1D", display: "flex", justifyContent: "space-between", gap: 8 }}>
      <span>{msg}</span>
      <button onClick={onDismiss} style={{ background: "none", border: "none", cursor: "pointer", color: "#7F1D1D", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
    </div>
  );
}

function SuccessBanner({ msg }) {
  if (!msg) return null;
  return <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontFamily: "Inter", fontSize: 13, color: "#166534" }}>{msg}</div>;
}

function Badge({ text, color = "#E8A020" }) {
  return <span style={{ background: color + "22", color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, fontFamily: "Inter" }}>{text}</span>;
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, maxHeight: "92vh", overflowY: "auto", padding: "24px 22px 36px" }}>
        {children}
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontFamily: "Inter", fontSize: 14, color: "#0D3D2B", outline: "none", boxSizing: "border-box", marginBottom: 10 };
const btnPrimary = (loading) => ({ width: "100%", padding: "13px", background: loading ? "#888" : "#0D3D2B", color: "#fff", border: "none", borderRadius: 12, fontFamily: "Inter", fontWeight: 600, fontSize: 15, cursor: loading ? "default" : "pointer", marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 });
const btnAmber   = (loading) => ({ ...btnPrimary(loading), background: loading ? "#888" : "#E8A020" });

// ─── AUTH MODAL ──────────────────────────────────────────────────────────────

function AuthModal({ mode, onClose, onSuccess }) {
  const [tab,     setTab]     = useState(mode);
  const [step,    setStep]    = useState("form");
  const [form,    setForm]    = useState({ name: "", email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleRegister() {
    if (!form.name || !form.email || !form.password) { setError("All fields required."); return; }
    setLoading(true); setError("");
    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role });
      setStep("verify");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleSaveUser() {
    if (loading) return;
    setLoading(true); setError(""); setSuccess("");
    try {
      const check = await callSaveUser();
      if (check?.verified === false) { setError("Email not verified yet. Check your inbox."); return; }
      await saveUser();
      setSuccess("Account activated! You can now log in.");
      setStep("done");
    } catch (e) { setError(e.message || "Not verified yet — check your inbox."); }
    finally { setLoading(false); }
  }

  async function handleLogin() {
    if (!form.email || !form.password) { setError("Email and password required."); return; }
    setLoading(true); setError("");
    try {
      const data = await loginApi({ email: form.email, password: form.password });
      const tok = data.token || data.accessToken || data.access_token || data.data?.token || data.data?.accessToken;
      const usr = data.user || data.data?.user || { email: form.email };
      if (!tok) throw new Error("No token in response. Keys: " + Object.keys(data).join(", "));
      storeToken(tok); storeUser(usr);
      onSuccess(usr, tok);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleReset() {
    if (!form.email) { setError("Enter your email."); return; }
    setLoading(true); setError("");
    try { await resetPassword({ email: form.email }); setSuccess("Reset link sent."); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  const H = ({ children }) => <div style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 700, color: "#0D3D2B", marginBottom: 16 }}>{children}</div>;

  if (step === "verify" || step === "done") return (
    <div>
      <H>{step === "done" ? "You're in! 🎉" : "Verify your email"}</H>
      {step !== "done" && (
        <div style={{ fontFamily: "Inter", fontSize: 14, color: "#6B7280", lineHeight: 1.6, marginBottom: 16 }}>
          We sent a link to <strong style={{ color: "#0D3D2B" }}>{form.email}</strong>. Click it then come back.
        </div>
      )}
      <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontFamily: "Inter", fontSize: 12, color: "#7C2D12", lineHeight: 1.6 }}>
        <strong>v1 flow:</strong> Details in RabbitMQ USER queue. After verifying, clicking below calls <code>GET /saveuser</code> then <code>POST /saveuser</code> to persist to MongoDB.
      </div>
      <ErrorBanner msg={error} onDismiss={() => setError("")} />
      <SuccessBanner msg={success} />
      {step !== "done"
        ? <button style={btnPrimary(loading)} onClick={handleSaveUser} disabled={loading}>{loading ? <Spinner /> : null}{loading ? "Checking…" : "I've verified — activate my account"}</button>
        : <button style={btnPrimary(false)} onClick={() => { setTab("login"); setStep("form"); }}>Go to login →</button>
      }
    </div>
  );

  if (tab === "forgot") return (
    <div>
      <H>Reset password</H>
      <ErrorBanner msg={error} onDismiss={() => setError("")} />
      <SuccessBanner msg={success} />
      <input style={inputStyle} placeholder="Your email" type="email" value={form.email} onChange={set("email")} />
      <button style={btnPrimary(loading)} onClick={handleReset} disabled={loading}>{loading ? <Spinner /> : null}{loading ? "Sending…" : "Send reset link"}</button>
      <div style={{ fontFamily: "Inter", fontSize: 12, color: "#9CA3AF", textAlign: "center", marginTop: 12, cursor: "pointer" }} onClick={() => setTab("login")}>← Back to login</div>
    </div>
  );

  return (
    <div>
      <H>{tab === "login" ? "Welcome back" : "Create account"}</H>
      <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 10, padding: 3, marginBottom: 18 }}>
        {["login", "register"].map(t => (
          <button key={t} onClick={() => { setTab(t); setError(""); }}
            style={{ flex: 1, padding: "8px", border: "none", borderRadius: 8, fontFamily: "Inter", fontWeight: 600, fontSize: 13, cursor: "pointer", background: tab === t ? "#fff" : "transparent", color: tab === t ? "#0D3D2B" : "#9CA3AF", boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,.08)" : "none", transition: "all .2s" }}>
            {t === "login" ? "Log in" : "Register"}
          </button>
        ))}
      </div>
      <ErrorBanner msg={error} onDismiss={() => setError("")} />
      {tab === "register" && <input style={inputStyle} placeholder="Full name" value={form.name} onChange={set("name")} />}
      <input style={inputStyle} placeholder="Email" type="email" value={form.email} onChange={set("email")} />
      <input style={inputStyle} placeholder="Password" type="password" value={form.password} onChange={set("password")}
        onKeyDown={e => e.key === "Enter" && (tab === "login" ? handleLogin() : handleRegister())} />
      {tab === "register" && (
        <select style={{ ...inputStyle, marginBottom: 10 }} value={form.role} onChange={set("role")}>
          <option value="user">Customer</option>
          <option value="delivery-agent">Delivery agent</option>
        </select>
      )}
      <button style={btnPrimary(loading)} onClick={tab === "login" ? handleLogin : handleRegister} disabled={loading}>
        {loading ? <Spinner /> : null}
        {loading ? (tab === "login" ? "Logging in…" : "Registering…") : (tab === "login" ? "Log in" : "Create account")}
      </button>
      {tab === "login" && (
        <div style={{ fontFamily: "Inter", fontSize: 12, color: "#E8A020", textAlign: "center", marginTop: 10, cursor: "pointer" }} onClick={() => setTab("forgot")}>
          Forgot password?
        </div>
      )}
    </div>
  );
}

// ─── FOOD CARD ───────────────────────────────────────────────────────────────

function FoodCard({ food, onAdd }) {
  const [adding, setAdding] = useState(false);
  const handle = async () => {
    setAdding(true);
    try { await onAdd(food); } finally { setTimeout(() => setAdding(false), 600); }
  };
  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #EDE9E3", display: "flex", flexDirection: "column", transition: "box-shadow .2s" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(13,61,43,.10)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
      <div style={{ background: "linear-gradient(135deg,#0D3D2B,#1a5c40)", height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46 }}>
        {food.emoji || "🍽️"}
      </div>
      <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Badge text={food.type || "Food"} color="#0D3D2B" />
          {food.discount > 0 && <Badge text={`${food.discount}% off`} color="#C85A3A" />}
        </div>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 600, color: "#0D3D2B", lineHeight: 1.3 }}>{food.name}</div>
        <div style={{ fontFamily: "Inter", fontSize: 12, color: "#6B7280", lineHeight: 1.4, flex: 1 }}>{food.description}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <div>
            <span style={{ fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 700, color: "#0D3D2B" }}>{formatNGN(food.price)}</span>
            {food.discount > 0 && (
              <span style={{ fontFamily: "Inter", fontSize: 11, color: "#9CA3AF", marginLeft: 6, textDecoration: "line-through" }}>
                {formatNGN(Math.round(food.price / (1 - food.discount / 100)))}
              </span>
            )}
          </div>
          <button onClick={handle} style={{ background: adding ? "#E8A020" : "#0D3D2B", color: "#fff", border: "none", borderRadius: 10, padding: "7px 14px", fontFamily: "Inter", fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "background .3s" }}>
            {adding ? "Added ✓" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CART ITEM ───────────────────────────────────────────────────────────────

function CartItem({ item, onInc, onDec }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #EDE9E3" }}>
      <span style={{ fontSize: 22 }}>{item.emoji || "🍽️"}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 13, fontWeight: 600, color: "#0D3D2B" }}>{item.name}</div>
        <div style={{ fontFamily: "Inter", fontSize: 12, color: "#6B7280" }}>{formatNGN(item.price)}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => onDec(item._id)} style={{ width: 27, height: 27, borderRadius: 7, border: "1.5px solid #D1D5DB", background: "none", cursor: "pointer", fontSize: 15, color: "#0D3D2B", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
        <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 14, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
        <button onClick={() => onInc(item._id)} style={{ width: 27, height: 27, borderRadius: 7, border: "1.5px solid #0D3D2B", background: "#0D3D2B", cursor: "pointer", fontSize: 15, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
      </div>
    </div>
  );
}

// ─── ORDER CARD ──────────────────────────────────────────────────────────────

function deriveStatus(order) {
  if (order.isCanceled)  return "cancelled";
  if (order.delivered)   return "delivered";
  if (order.isAssigned)  return "assigned";
  return "pending";
}

function OrderCard({ order, token, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const statusColor = { pending: "#E8A020", confirmed: "#3B8BD4", delivered: "#1D9E75", cancelled: "#C85A3A" };
  // const color = statusColor[order.status] || "#6B7280";
  const status = deriveStatus(order);
  const color = statusColor[status] || "#6B7280";

  async function handleReceived() {
    setLoading(true);
    try { await receivedOrder(order._id, token); onRefresh(); }
    catch (e) { alert(e.message); }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    setLoading(true);
    try { await deleteOrder(order._id, token); onRefresh(); }
    catch (e) { alert(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDE9E3", padding: "14px 16px", marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontFamily: "Fraunces, serif", fontSize: 14, fontWeight: 600, color: "#0D3D2B" }}>
          Order #{(order._id || "").slice(-6).toUpperCase()}
        </div>
        <Badge text={status} color={color} />
      </div>
      <div style={{ fontFamily: "Inter", fontSize: 12, color: "#6B7280", marginBottom: 8 }}>
        {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : ""}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Inter", fontSize: 13 }}>
        <span style={{ color: "#374151" }}>{order.food?.length || 0} item(s)</span>
        <span style={{ fontWeight: 600, color: "#0D3D2B" }}>{formatNGN(order.totalPrice)}</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {order.status === "confirmed" && (
          <button onClick={handleReceived} disabled={loading}
            style={{ flex: 1, padding: "8px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, fontFamily: "Inter", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
            {loading ? <Spinner size={12} /> : "Mark received"}
          </button>
        )}
        <button onClick={handleDelete} disabled={loading}
          style={{ flex: 1, padding: "8px", background: "none", border: "1.5px solid #FECACA", color: "#C85A3A", borderRadius: 8, fontFamily: "Inter", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
          Remove
        </button>
      </div>
    </div>
  );
}

// ─── DELIVERY PANEL ──────────────────────────────────────────────────────────

function DeliveryPanel({ token }) {
  const [queue,   setQueue]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await getDeliveryQueue(token);
      setQueue(Array.isArray(data) ? data : data.orders ?? data.data ?? []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleAccept(id) {
    try { await acceptOrder(id, token); setSuccess("Order accepted!"); load(); }
    catch (e) { setError(e.message); }
  }

  async function handleComplete(id) {
    try { await deliveryComplete(id, token); setSuccess("Delivery complete!"); load(); }
    catch (e) { setError(e.message); }
  }

  return (
    <div style={{ padding: "20px 20px 100px" }}>
      <div style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 700, color: "#0D3D2B", marginBottom: 4 }}>Delivery queue</div>
      <div style={{ fontFamily: "Inter", fontSize: 12, color: "#9CA3AF", marginBottom: 16 }}>
        <code style={{ fontSize: 11, background: "#F3F4F6", padding: "1px 5px", borderRadius: 4 }}>GET /meal-api/v1/delivery/getPendingOrder</code>
      </div>
      <ErrorBanner msg={error} onDismiss={() => setError("")} />
      <SuccessBanner msg={success} />
      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}><Spinner size={28} color="#0D3D2B" /></div>
      ) : queue.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", color: "#9CA3AF" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, color: "#0D3D2B" }}>No pending deliveries</div>
        </div>
      ) : queue.map(order => (
        <div key={order._id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #EDE9E3", padding: "14px 16px", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 14, fontWeight: 600, color: "#0D3D2B" }}>Order #{(order._id || "").slice(-6).toUpperCase()}</div>
            <Badge text={order.status} color="#E8A020" />
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 12, color: "#6B7280", marginBottom: 10 }}>
            {formatNGN(order.totalPrice)} · {order.food?.length || 0} item(s)
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {order.status === "pending" && (
              <button onClick={() => handleAccept(order._id)}
                style={{ flex: 1, padding: "8px", background: "#0D3D2B", color: "#fff", border: "none", borderRadius: 8, fontFamily: "Inter", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                Accept delivery
              </button>
            )}
            {order.status === "accepted" && (
              <button onClick={() => handleComplete(order._id)}
                style={{ flex: 1, padding: "8px", background: "#1D9E75", color: "#fff", border: "none", borderRadius: 8, fontFamily: "Inter", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                Mark delivered
              </button>
            )}
          </div>
        </div>
      ))}
      <button onClick={load} style={{ width: "100%", marginTop: 8, padding: "10px", background: "none", border: "1.5px solid #E5E7EB", borderRadius: 10, fontFamily: "Inter", fontSize: 13, color: "#6B7280", cursor: "pointer" }}>
        Refresh queue
      </button>
    </div>
  );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [user,  setUser]  = useState(() => getUser());
  const [token, setToken] = useState(() => getToken());

  const [foods,        setFoods]        = useState([]);
  const [foodsLoading, setFoodsLoading] = useState(true);
  const [activeType,   setActiveType]   = useState("all");

  const [cart, setCart] = useState([]);
  const [view, setView] = useState("menu");
  const [modal, setModal] = useState(null);

  const [orders,        setOrders]        = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderError,    setOrderError]    = useState("");
  const [placingOrder,  setPlacingOrder]  = useState(false);

  const [addFoodForm,    setAddFoodForm]    = useState({ name: "", description: "", type: "", discount: 0, price: "" });
  const [addFoodLoading, setAddFoodLoading] = useState(false);
  const [addFoodError,   setAddFoodError]   = useState("");

  const isAgent = user?.role === "delivery-agent";
  const isAdmin = user?.role === "admin";
  const activeToken = token || getToken();

  // ── Load food ──────────────────────────────────────────────────────────────
  useEffect(() => {
    setFoodsLoading(true);
    const fn = activeType === "all" ? getFood : () => getFoodByType(activeType);
    fn()
      .then(data => {
        if (Array.isArray(data)) { setFoods(data); return; }
        const list = data[activeType] ?? data.foods ?? data.data ?? data.result
          ?? Object.values(data).find(v => Array.isArray(v)) ?? [];
        setFoods(list);
      })
      .catch(() => {})
      .finally(() => setFoodsLoading(false));
  }, [activeType]);

  // ── Load orders ────────────────────────────────────────────────────────────
  // GET /meal-api/v1/food/myOrders — proxied through product service → order service
  async function loadOrders(tok) {
    const t = tok ?? activeToken;
    if (!t) return;
    setOrdersLoading(true); setOrderError("");
    try {
      const data = await getOrders(t);
      const list = Array.isArray(data) ? data : data.orders ?? data.data ?? data.result ?? [];
      setOrders(list);
    } catch (e) { setOrderError(e.message); }
    finally { setOrdersLoading(false); }
  }
  useEffect(() => { if (view === "orders" && activeToken) loadOrders(); }, [view, token]);

  // ── Cart helpers ───────────────────────────────────────────────────────────
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  async function handleAddToCart(food) {
    if (activeToken) {
      try { await addToCart({ foodId: food._id }, activeToken); } catch {}
    }
    setCart(c => {
      const ex = c.find(i => i._id === food._id);
      return ex ? c.map(i => i._id === food._id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...food, qty: 1 }];
    });
  }

  const incCart = id => setCart(c => c.map(i => i._id === id ? { ...i, qty: i.qty + 1 } : i));
  const decCart = id => setCart(c => {
    const item = c.find(i => i._id === id);
    return item.qty === 1 ? c.filter(i => i._id !== id) : c.map(i => i._id === id ? { ...i, qty: i.qty - 1 } : i);
  });

  // ── Place order ────────────────────────────────────────────────────────────
  async function handlePlaceOrder() {
    if (!activeToken) { setModal("auth"); return; }
    setPlacingOrder(true); setOrderError("");
    try {
      const ids = cart.map(i => i._id);
      await buyFood({ ids }, activeToken);
      setCart([]);
      setView("orders");
      await loadOrders();
    } catch (e) { setOrderError(e.message); }
    finally { setPlacingOrder(false); }
  }

  // ── Add food (admin) ───────────────────────────────────────────────────────
  async function handleAddFood() {
    setAddFoodLoading(true); setAddFoodError("");
    try {
      await addFood(addFoodForm, activeToken);
      setModal(null);
      setAddFoodForm({ name: "", description: "", type: "", discount: 0, price: "" });
      setActiveType("all");
    } catch (e) { setAddFoodError(e.message); }
    finally { setAddFoodLoading(false); }
  }

  // ── Auth ───────────────────────────────────────────────────────────────────
  function onAuthSuccess(userData, tok) {
    storeToken(tok); storeUser(userData);
    setUser(userData); setToken(tok); setModal(null);
    loadOrders(tok);
  }

  async function handleLogout() {
    try { if (activeToken) await logoutApi(activeToken); } catch {}
    clearToken(); clearUser();
    setUser(null); setToken(null); setCart([]);
  }

  return (
    <>
      <style>{FONTS}{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F7F3ED; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F7F3ED", fontFamily: "Inter, sans-serif", maxWidth: 480, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ background: "#0D3D2B", padding: "14px 18px 12px", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: 19, fontWeight: 700, color: "#F7F3ED" }}>
                Chop Chop <span style={{ fontSize: 11, background: "rgba(232,160,32,.2)", color: "#E8A020", padding: "1px 6px", borderRadius: 6, fontFamily: "Inter", fontWeight: 600, verticalAlign: "middle" }}>v1</span>
              </div>
              <div style={{ fontSize: 11, color: "#6EAF8A" }}>📍 Lagos Island · RabbitMQ + MongoDB</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {isAdmin && (
                <button onClick={() => setModal("addFood")}
                  style={{ padding: "6px 12px", background: "#E8A020", border: "none", borderRadius: 8, color: "#fff", fontFamily: "Inter", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                  + Add food
                </button>
              )}
              {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: isAgent ? "#C85A3A" : "#E8A020", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 13 }}>
                    {(user.name || user.email || "U")[0].toUpperCase()}
                  </div>
                  <button onClick={handleLogout} style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 7, padding: "4px 9px", color: "#F7F3ED", fontSize: 11, fontFamily: "Inter", cursor: "pointer" }}>Out</button>
                </div>
              ) : (
                <button onClick={() => setModal("auth")} style={{ padding: "7px 14px", background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 10, color: "#F7F3ED", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter" }}>Log in</button>
              )}
            </div>
          </div>
        </div>

        {/* ── Hero ── */}
        {view === "menu" && (
          <div style={{ background: "#0D3D2B", padding: "0 18px 20px" }}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 26, fontWeight: 700, color: "#F7F3ED", lineHeight: 1.2, marginBottom: 4 }}>
              Real food,<br /><em style={{ color: "#E8A020" }}>delivered fast.</em>
            </div>
            <div style={{ fontSize: 12, color: "#6EAF8A", marginBottom: 14 }}>Powered by RabbitMQ · MongoDB · Node.js</div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {FOOD_TYPES.map(t => (
                <button key={t.value} onClick={() => setActiveType(t.value)}
                  style={{ padding: "6px 14px", borderRadius: 20, border: "none", background: activeType === t.value ? "#E8A020" : "rgba(255,255,255,.12)", color: activeType === t.value ? "#fff" : "rgba(255,255,255,.7)", fontFamily: "Inter", fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Nav ── */}
        <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #EDE9E3", position: "sticky", top: 64, zIndex: 99 }}>
          {[
            { key: "menu",     label: "Menu" },
            { key: "cart",     label: `Cart${cartCount ? ` (${cartCount})` : ""}` },
            { key: "orders",   label: "My orders" },
            ...(isAgent ? [{ key: "delivery", label: "Deliveries" }] : []),
          ].map(t => (
            <button key={t.key} onClick={() => setView(t.key)}
              style={{ flex: 1, padding: "12px 6px", border: "none", borderBottom: view === t.key ? "2.5px solid #E8A020" : "2.5px solid transparent", background: "none", fontFamily: "Inter", fontWeight: 600, fontSize: 12, color: view === t.key ? "#0D3D2B" : "#9CA3AF", cursor: "pointer" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Menu view ── */}
        {view === "menu" && (
          <div style={{ padding: "16px 14px 100px" }}>
            {foodsLoading ? (
              <div style={{ textAlign: "center", padding: 50 }}><Spinner size={28} color="#0D3D2B" /></div>
            ) : foods.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 20px", color: "#9CA3AF" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🍽️</div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, color: "#0D3D2B" }}>No food found</div>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {foods.map((f, i) => (
                  <FoodCard key={f._id || f.id || i} food={f}
                    onAdd={activeToken ? handleAddToCart : () => setModal("auth")} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Cart view ── */}
        {view === "cart" && (
          <div style={{ padding: "18px 18px 100px" }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 20px" }}>
                <div style={{ fontSize: 44, marginBottom: 10 }}>🛒</div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 18, color: "#0D3D2B", marginBottom: 6 }}>Cart is empty</div>
                <button onClick={() => setView("menu")} style={{ padding: "10px 22px", background: "#0D3D2B", color: "#fff", border: "none", borderRadius: 10, fontFamily: "Inter", fontWeight: 600, fontSize: 13, cursor: "pointer", marginTop: 8 }}>Browse menu</button>
              </div>
            ) : (
              <>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 19, fontWeight: 700, color: "#0D3D2B", marginBottom: 14 }}>Your order</div>
                {cart.map(item => <CartItem key={item._id} item={item} onInc={incCart} onDec={decCart} />)}
                <div style={{ marginTop: 16, background: "#fff", borderRadius: 12, padding: "14px", border: "1px solid #EDE9E3" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Fraunces, serif", fontSize: 17, fontWeight: 700, color: "#0D3D2B" }}>
                    <span>Total</span><span>{formatNGN(cartTotal)}</span>
                  </div>
                </div>
                <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 10, padding: "10px 14px", marginTop: 10, fontFamily: "Inter", fontSize: 12, color: "#7C2D12", lineHeight: 1.6 }}>
                  <strong>v1 flow:</strong> <code>POST /meal-api/v1/food/buy-food</code> with food IDs → RabbitMQ ORDER queue → Order service
                </div>
                <ErrorBanner msg={orderError} onDismiss={() => setOrderError("")} />
                <button onClick={handlePlaceOrder} disabled={placingOrder} style={btnAmber(placingOrder)}>
                  {placingOrder ? <Spinner /> : null}
                  {placingOrder ? "Placing order…" : `Place order · ${formatNGN(cartTotal)}`}
                </button>
              </>
            )}
          </div>
        )}

        {/* ── Orders view ── */}
        {view === "orders" && (
          <div style={{ padding: "18px 18px 100px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: 19, fontWeight: 700, color: "#0D3D2B" }}>My orders</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => loadOrders()}
                  style={{ background: "none", border: "1.5px solid #E5E7EB", color: "#6B7280", borderRadius: 8, padding: "5px 10px", fontFamily: "Inter", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  Refresh
                </button>
                {orders.length > 0 && (
                  <button onClick={async () => { await deleteAllOrders(activeToken); loadOrders(); }}
                    style={{ background: "none", border: "1.5px solid #FECACA", color: "#C85A3A", borderRadius: 8, padding: "5px 10px", fontFamily: "Inter", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <ErrorBanner msg={orderError} onDismiss={() => setOrderError("")} />
            {!activeToken ? (
              <div style={{ textAlign: "center", padding: "50px 20px" }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, color: "#0D3D2B", marginBottom: 10 }}>Log in to see your orders</div>
                <button onClick={() => setModal("auth")} style={{ padding: "10px 22px", background: "#0D3D2B", color: "#fff", border: "none", borderRadius: 10, fontFamily: "Inter", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Log in</button>
              </div>
            ) : ordersLoading ? (
              <div style={{ textAlign: "center", padding: 50 }}><Spinner size={28} color="#0D3D2B" /></div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "50px 20px", color: "#9CA3AF" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📦</div>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 16, color: "#0D3D2B", marginBottom: 6 }}>No orders yet</div>
                <div style={{ fontSize: 13 }}>Place an order from the menu to see it here</div>
              </div>
            ) : orders.map(o => (
              <OrderCard key={o._id} order={o} token={activeToken} onRefresh={loadOrders} />
            ))}
          </div>
        )}

        {/* ── Delivery view (agents only) ── */}
        {view === "delivery" && isAgent && <DeliveryPanel token={activeToken} />}

        {/* ── Floating cart button ── */}
        {cartCount > 0 && view === "menu" && (
          <div style={{ position: "fixed", bottom: 22, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 36px)", maxWidth: 444, zIndex: 200 }}>
            <button onClick={() => setView("cart")}
              style={{ width: "100%", padding: "14px 18px", background: "#0D3D2B", color: "#F7F3ED", border: "none", borderRadius: 14, fontFamily: "Inter", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 8px 28px rgba(13,61,43,.35)" }}>
              <span style={{ background: "#E8A020", borderRadius: 7, padding: "2px 8px", fontSize: 12, fontWeight: 700 }}>{cartCount}</span>
              <span>View cart</span>
              <span style={{ fontFamily: "Fraunces, serif", fontWeight: 700 }}>{formatNGN(cartTotal)}</span>
            </button>
          </div>
        )}

        {/* ── Auth modal ── */}
        {modal === "auth" && (
          <Modal onClose={() => setModal(null)}>
            <AuthModal mode="login" onClose={() => setModal(null)} onSuccess={onAuthSuccess} />
          </Modal>
        )}

        {/* ── Add food modal (admin) ── */}
        {modal === "addFood" && (
          <Modal onClose={() => setModal(null)}>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 700, color: "#0D3D2B", marginBottom: 16 }}>Add food item</div>
            <ErrorBanner msg={addFoodError} onDismiss={() => setAddFoodError("")} />
            {["name", "description", "type"].map(k => (
              <input key={k} style={inputStyle} placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
                value={addFoodForm[k]} onChange={e => setAddFoodForm(f => ({ ...f, [k]: e.target.value }))} />
            ))}
            <input style={inputStyle} placeholder="Price (₦)" type="number"
              value={addFoodForm.price} onChange={e => setAddFoodForm(f => ({ ...f, price: e.target.value }))} />
            <input style={inputStyle} placeholder="Discount (%)" type="number"
              value={addFoodForm.discount} onChange={e => setAddFoodForm(f => ({ ...f, discount: e.target.value }))} />
            <button style={btnPrimary(addFoodLoading)} onClick={handleAddFood} disabled={addFoodLoading}>
              {addFoodLoading ? <Spinner /> : null}
              {addFoodLoading ? "Adding…" : "Add to menu"}
            </button>
          </Modal>
        )}
      </div>
    </>
  );
}
