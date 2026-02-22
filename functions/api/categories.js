export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname.replace("/api/categories", "");

  try {
    // GET /api/categories - List all categories
    if (method === "GET") {
      return handleGetCategories(context);
    }

    // POST /api/categories - Create new category
    if (method === "POST") {
      return handlePostCategory(context);
    }

    // PUT /api/categories/:id - Update category
    if (method === "PUT" && path.includes("/")) {
      if (path === "/reorder") {
        return handleReorderCategories(context);
      }
      return handlePutCategory(context);
    }

    // DELETE /api/categories/:id - Delete category
    if (method === "DELETE") {
      return handleDeleteCategory(context);
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  } catch (error) {
    console.error("Categories API error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

async function handleGetCategories(context) {
  const { env } = context;
  const { value } = await env.CATEGORIES.getWithMetadata("categories");

  if (!value) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const categories = JSON.parse(value);
    // Sort by order field
    const sorted = categories.sort((a, b) => (a.order || 0) - (b.order || 0));
    return new Response(JSON.stringify(sorted), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handlePostCategory(context) {
  const { request, env } = context;

  // Validate token
  const token = request.headers.get("X-Admin-Token");
  if (!token || token !== btoa(env.ADMIN_PASSWORD + token.split(":")[1])) {
    if (!validateToken(token, env.ADMIN_PASSWORD)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
  }

  const data = await request.json();
  const { name } = data;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return new Response(JSON.stringify({ error: "Category name is required" }), { status: 400 });
  }

  // Get existing categories
  const { value } = await env.CATEGORIES.getWithMetadata("categories");
  let categories = [];
  if (value) {
    try {
      categories = JSON.parse(value);
    } catch {
      categories = [];
    }
  }

  const newCategory = {
    id: Date.now().toString(),
    name: name.trim(),
    order: categories.length,
    createdAt: new Date().toISOString(),
  };

  categories.push(newCategory);
  await env.CATEGORIES.put("categories", JSON.stringify(categories));

  return new Response(JSON.stringify(newCategory), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

async function handlePutCategory(context) {
  const { request, env } = context;

  // Validate token
  const token = request.headers.get("X-Admin-Token");
  if (!validateToken(token, env.ADMIN_PASSWORD)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  const data = await request.json();
  const { name } = data;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return new Response(JSON.stringify({ error: "Category name is required" }), { status: 400 });
  }

  const { value } = await env.CATEGORIES.getWithMetadata("categories");
  let categories = [];
  if (value) {
    try {
      categories = JSON.parse(value);
    } catch {
      categories = [];
    }
  }

  const index = categories.findIndex((cat) => cat.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: "Category not found" }), { status: 404 });
  }

  categories[index].name = name.trim();
  categories[index].updatedAt = new Date().toISOString();

  await env.CATEGORIES.put("categories", JSON.stringify(categories));

  return new Response(JSON.stringify(categories[index]), {
    headers: { "Content-Type": "application/json" },
  });
}

async function handleDeleteCategory(context) {
  const { request, env } = context;

  // Validate token
  const token = request.headers.get("X-Admin-Token");
  if (!validateToken(token, env.ADMIN_PASSWORD)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  const { value } = await env.CATEGORIES.getWithMetadata("categories");
  let categories = [];
  if (value) {
    try {
      categories = JSON.parse(value);
    } catch {
      categories = [];
    }
  }

  const index = categories.findIndex((cat) => cat.id === id);
  if (index === -1) {
    return new Response(JSON.stringify({ error: "Category not found" }), { status: 404 });
  }

  categories.splice(index, 1);

  // Also remove this category's items
  const { value: itemsValue } = await env.MENU_ITEMS.getWithMetadata("items");
  if (itemsValue) {
    try {
      let items = JSON.parse(itemsValue);
      items = items.filter((item) => item.category !== id);
      await env.MENU_ITEMS.put("items", JSON.stringify(items));
    } catch {
      // Ignore parsing errors
    }
  }

  await env.CATEGORIES.put("categories", JSON.stringify(categories));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}

async function handleReorderCategories(context) {
  const { request, env } = context;

  // Validate token
  const token = request.headers.get("X-Admin-Token");
  if (!validateToken(token, env.ADMIN_PASSWORD)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const data = await request.json();
  const { orders } = data; // Array of { id, order }

  if (!Array.isArray(orders)) {
    return new Response(JSON.stringify({ error: "orders must be an array" }), { status: 400 });
  }

  const { value } = await env.CATEGORIES.getWithMetadata("categories");
  let categories = [];
  if (value) {
    try {
      categories = JSON.parse(value);
    } catch {
      categories = [];
    }
  }

  // Update order values
  const orderMap = new Map(orders.map((o) => [o.id, o.order]));
  categories.forEach((cat) => {
    if (orderMap.has(cat.id)) {
      cat.order = orderMap.get(cat.id);
    }
  });

  await env.CATEGORIES.put("categories", JSON.stringify(categories));

  return new Response(JSON.stringify(categories.sort((a, b) => (a.order || 0) - (b.order || 0))), {
    headers: { "Content-Type": "application/json" },
  });
}

// Helper function to validate token
function validateToken(token, adminPassword) {
  if (!token) return false;
  const parts = token.split(":");
  if (parts.length !== 2) return false;
  const [password, timestamp] = parts;
  const expectedToken = btoa(password + timestamp);
  return expectedToken === token;
}
