export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname.replace("/api/categories", "");

  console.log(`[DEBUG] URL: ${request.url}, Method: ${method}, Path: ${path}`);
  // Helper to consistently return JSON with CORS headers
  const jsonResponse = (body, status = 200) => {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
      },
    });
  };

  try {
    // Handle CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
        },
      });
    }

    // GET /api/categories - List all categories
    if (method === "GET") {
      return handleGetCategories(context, jsonResponse);
    }

    // POST /api/categories - Create new category
    if (method === "POST") {
      return handlePostCategory(context, jsonResponse);
    }

    // PUT /api/categories/reorder - Reorder categories
    if (method === "PUT" && path === "/reorder") {
      return handleReorderCategories(context, jsonResponse);
    }

    // PUT /api/categories/:id - Update category
    if (method === "PUT") {
      return handlePutCategory(context, jsonResponse);
    }

    // DELETE /api/categories/:id - Delete category
    if (method === "DELETE") {
      return handleDeleteCategory(context, jsonResponse);
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  } catch (error) {
    console.error("Categories API error:", error);
    return jsonResponse({ error: error.message }, 500);
  }
}

async function handleGetCategories(context, jsonResponse) {
  const { env } = context;
  
  try {
    const value = await env.CATEGORIES.get("categories");
    
    if (!value) {
      return jsonResponse([], 200);
    }

    const categories = JSON.parse(value);
    // Sort by order field
    const sorted = categories.sort((a, b) => (a.order || 0) - (b.order || 0));
    return jsonResponse(sorted, 200);
  } catch (error) {
    console.error("Get categories error:", error);
    return jsonResponse([], 200);
  }
}

async function handlePostCategory(context, jsonResponse) {
  const { request, env } = context;

  // Validate token
  const token = request.headers.get("X-Admin-Token");
  if (!token || !token.trim()) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const data = await request.json();
  const { name } = data;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return jsonResponse({ error: "Category name is required" }, 400);
  }

  // Get existing categories
  let categories = [];
  try {
    const value = await env.CATEGORIES.get("categories");
    if (value) {
      categories = JSON.parse(value);
    }
  } catch {
    categories = [];
  }

  const newCategory = {
    id: Date.now().toString(),
    name: name.trim(),
    order: categories.length,
    createdAt: new Date().toISOString(),
  };

  categories.push(newCategory);
  await env.CATEGORIES.put("categories", JSON.stringify(categories));

  return jsonResponse(newCategory, 201);
}

async function handlePutCategory(context, jsonResponse) {
  const { request, env } = context;

  // Validate token
  const token = request.headers.get("X-Admin-Token");
  if (!token || !token.trim()) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  const data = await request.json();
  const { name } = data;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return jsonResponse({ error: "Category name is required" }, 400);
  }

  let categories = [];
  try {
    const value = await env.CATEGORIES.get("categories");
    if (value) {
      categories = JSON.parse(value);
    }
  } catch {
    categories = [];
  }

  const index = categories.findIndex((cat) => cat.id === id);
  if (index === -1) {
    return jsonResponse({ error: "Category not found" }, 404);
  }

  categories[index].name = name.trim();
  categories[index].updatedAt = new Date().toISOString();

  await env.CATEGORIES.put("categories", JSON.stringify(categories));

  return jsonResponse(categories[index], 200);
}

async function handleDeleteCategory(context, jsonResponse) {
  const { request, env } = context;

  // Validate token
  const token = request.headers.get("X-Admin-Token");
  if (!token || !token.trim()) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  let categories = [];
  try {
    const value = await env.CATEGORIES.get("categories");
    if (value) {
      categories = JSON.parse(value);
    }
  } catch {
    categories = [];
  }

  const index = categories.findIndex((cat) => cat.id === id);
  if (index === -1) {
    return jsonResponse({ error: "Category not found" }, 404);
  }

  categories.splice(index, 1);

  // Also remove this category's items
  try {
    const itemsValue = await env.MENU_ITEMS.get("items");
    if (itemsValue) {
      let items = JSON.parse(itemsValue);
      items = items.filter((item) => item.category !== id);
      await env.MENU_ITEMS.put("items", JSON.stringify(items));
    }
  } catch {
    // Ignore item errors
  }

  await env.CATEGORIES.put("categories", JSON.stringify(categories));

  return jsonResponse({ success: true }, 200);
}

async function handleReorderCategories(context, jsonResponse) {
  const { request, env } = context;

  // Validate token
  const token = request.headers.get("X-Admin-Token");
  if (!token || !token.trim()) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const data = await request.json();
  const { orders } = data; // Array of { id, order }

  if (!Array.isArray(orders)) {
    return jsonResponse({ error: "orders must be an array" }, 400);
  }

  let categories = [];
  try {
    const value = await env.CATEGORIES.get("categories");
    if (value) {
      categories = JSON.parse(value);
    }
  } catch {
    categories = [];
  }

  // Update order values
  const orderMap = new Map(orders.map((o) => [o.id, o.order]));
  categories.forEach((cat) => {
    if (orderMap.has(cat.id)) {
      cat.order = orderMap.get(cat.id);
    }
  });

  await env.CATEGORIES.put("categories", JSON.stringify(categories));

  return jsonResponse(categories.sort((a, b) => (a.order || 0) - (b.order || 0)), 200);
}
