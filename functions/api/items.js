export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname.replace("/api/items", "");
  
  // JSON response helper with CORS
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
  
  // Check authentication for non-GET requests
  if (request.method !== "GET") {
    const token = request.headers.get("X-Admin-Token");
    if (!token || !token.trim()) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
  }

  try {
    if (request.method === "GET") {
      // Fetch all menu items
      const items = await env.MENU_ITEMS.get("items", "json") || [];
      // Sort by category order, then by item order
      const categoriesValue = await env.CATEGORIES.get("categories", "json") || [];
      const categoryOrderMap = new Map(
        categoriesValue.map((cat) => [cat.id, cat.order || 0])
      );
      
      const sorted = items.sort((a, b) => {
        const catA = categoryOrderMap.get(a.category) || 999;
        const catB = categoryOrderMap.get(b.category) || 999;
        if (catA !== catB) return catA - catB;
        return (a.order || 0) - (b.order || 0);
      });
      
      return new Response(JSON.stringify(sorted), {
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=300"
        },
      });
    }

    if (request.method === "POST") {
      const raw = await request.text();
      let data = {};
      try {
        if (raw && raw.length) data = JSON.parse(raw);
      } catch (e) {
        console.error("Failed to parse JSON body:", e);
      }
      const reqUrl = new URL(request.url);
      const action = (reqUrl.searchParams.get("action") || data.action || "").toLowerCase();

      // Check if this is a reorder action
      if (action === "reorder") {
        const orders = data.orders;
        if (!Array.isArray(orders)) return jsonResponse({ error: "orders must be an array" }, 400);

        const items = await env.MENU_ITEMS.get("items", "json") || [];
        const orderMap = new Map(orders.map((o) => [o.id, o.order]));

        items.forEach((item) => {
          if (orderMap.has(item.id)) {
            item.order = orderMap.get(item.id);
          }
        });

        await env.MENU_ITEMS.put("items", JSON.stringify(items));

        return jsonResponse(items, 200);
      }

      // Create new item (no action or action=create)
      const newItem = data;
      
      if (!newItem.category) {
        return jsonResponse({ error: "Category is required" }, 400);
      }
      
      newItem.id = Date.now().toString();
      newItem.createdAt = new Date().toISOString();
      
      const items = await env.MENU_ITEMS.get("items", "json") || [];
      // Set default order for new items
      const categoryItems = items.filter((item) => item.category === newItem.category);
      newItem.order = categoryItems.length;
      
      items.push(newItem);
      
      await env.MENU_ITEMS.put("items", JSON.stringify(items));
      
      return jsonResponse(newItem, 201);
    }

    if (request.method === "PUT") {
      // Update item
      const { id, ...updateData } = await request.json();
      const items = await env.MENU_ITEMS.get("items", "json") || [];
      
      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        return jsonResponse({ error: "Item not found" }, 404);
      }
      
      items[index] = { ...items[index], ...updateData };
      items[index].updatedAt = new Date().toISOString();
      
      await env.MENU_ITEMS.put("items", JSON.stringify(items));
      
      return jsonResponse(items[index], 200);
    }

    if (request.method === "DELETE") {
      // Delete item
      const { id } = await request.json();
      let items = await env.MENU_ITEMS.get("items", "json") || [];
      
      items = items.filter(item => item.id !== id);
      await env.MENU_ITEMS.put("items", JSON.stringify(items));
      
      return jsonResponse({ success: true }, 200);
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  } catch (error) {
    console.error("API Error:", error);
    return jsonResponse({ error: error.message }, 500);
  }
}

