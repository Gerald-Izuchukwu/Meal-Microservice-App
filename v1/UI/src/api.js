const BASE = import.meta.env.VITE_API_BASE_URL || "";

export function getToken()    { return sessionStorage.getItem("v1_token") || null; }
export function storeToken(t) { sessionStorage.setItem("v1_token", t); }
export function clearToken()  { sessionStorage.removeItem("v1_token"); }
export function getUser()     { try { return JSON.parse(sessionStorage.getItem("v1_user")); } catch { return null; } }
export function storeUser(u)  { sessionStorage.setItem("v1_user", JSON.stringify(u)); }
export function clearUser()   { sessionStorage.removeItem("v1_user"); }

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `Error ${res.status}`);
  return data;
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const register        = (body)              => request("POST",   "/meal-api/v1/auth/register",      body);
export const callSaveUser    = ()                  => request("GET",    "/meal-api/v1/auth/saveuser");
export const saveUser        = ()                  => request("POST",   "/meal-api/v1/auth/saveuser");
export const login           = (body)              => request("POST",   "/meal-api/v1/auth/login",         body);
export const resetPassword   = (body)              => request("POST",   "/meal-api/v1/auth/resetpassword", body);
export const logoutApi       = (token)             => request("DELETE", "/meal-api/v1/auth/logout",  null, token);
export const getUserById     = (id, token)         => request("GET",    `/meal-api/v1/auth/${id}`,   null, token);
export const updatePassword  = (id, body, token)   => request("PUT",    `/meal-api/v1/auth/${id}`,   body, token);

// ─── FOOD ────────────────────────────────────────────────────────────────────
export const getFood            = ()                    => request("GET",    "/meal-api/v1/food/get-food");
export const getFoodByType      = (type)                => request("GET",    `/meal-api/v1/food/get-food-type?type=${encodeURIComponent(type)}`);
export const getDiscountedFoods = ()                    => request("GET",    "/meal-api/v1/food/discountedFoods");
export const buyFood            = (body, token)         => request("POST",   "/meal-api/v1/food/buy-food",    body, token);
export const addFood            = (body, token)         => request("POST",   "/meal-api/v1/food/add-food",    body, token);
export const addToCart          = (body, token)         => request("POST",   "/meal-api/v1/food/add-to-cart", body, token);
export const getAFood           = (id, type, token)     => request("GET",    `/meal-api/v1/food/${id}?type=${encodeURIComponent(type)}`, null, token);
export const updateFood         = (id, type, body, token) => request("PUT",  `/meal-api/v1/food/${id}?type=${type}`, body, token);
export const deleteFood         = (id, type, token)     => request("DELETE", `/meal-api/v1/food/${id}?type=${type}`, null, token);

// ─── ORDER (proxied through product service) ─────────────────────────────────
export const getOrders       = (token)          => request("GET",    "/meal-api/v1/food/myOrders",              null, token);
export const deleteAllOrders = (token)          => request("DELETE", "/meal-api/v1/food/myOrders",              null, token);
export const getAnOrder      = (id, token)      => request("GET",    `/meal-api/v1/food/myOrders/${id}`,        null, token);
export const deleteOrder     = (id, token)      => request("DELETE", `/meal-api/v1/food/myOrders/${id}`,        null, token);
export const receivedOrder   = (id, token)      => request("POST",   `/meal-api/v1/food/receivedOrder/${id}`,   null, token);
export const getPendingOrder = (token)          => request("GET",    "/meal-api/v1/food/getPendingOrder",       null, token);

// ─── DELIVERY ────────────────────────────────────────────────────────────────
export const getDeliveryQueue = (token)    => request("GET",  "/meal-api/v1/delivery/getPendingOrder",      null, token);
export const acceptOrder      = (id, token) => request("PUT",  `/meal-api/v1/delivery/acceptOrder/${id}`,   null, token);
export const saveOrderToDb    = (body, token) => request("POST", "/meal-api/v1/delivery/saveOrder",         body, token);
export const deliveryComplete = (id, token) => request("POST", `/meal-api/v1/delivery/deliveryComplete/${id}`, null, token);
