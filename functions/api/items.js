export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/items", "");
  
  // Check authentication for non-GET requests
  if (request.method !== "GET") {
    const token = request.headers.get("X-Admin-Token");
    if (!token || !token.trim()) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
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
          "Cache-Control": "public, max-age=300"
        },
      });
    }

    if (request.method === "POST") {
      // Create new item
      const newItem = await request.json();
      
      if (!newItem.category) {
        return new Response(JSON.stringify({ error: "Category is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      newItem.id = Date.now().toString();
      newItem.createdAt = new Date().toISOString();
      
      const items = await env.MENU_ITEMS.get("items", "json") || [];
      // Set default order for new items
      const categoryItems = items.filter((item) => item.category === newItem.category);
      newItem.order = categoryItems.length;
      
      items.push(newItem);
      
      await env.MENU_ITEMS.put("items", JSON.stringify(items));
      
      return new Response(JSON.stringify(newItem), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method === "PUT") {
      if (path === "/reorder") {
        return handleReorderItems(context);
      }
      
      // Update item
      const { id, ...updateData } = await request.json();
      const items = await env.MENU_ITEMS.get("items", "json") || [];
      
      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        return new Response(JSON.stringify({ error: "Item not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      items[index] = { ...items[index], ...updateData };
      items[index].updatedAt = new Date().toISOString();
      
      await env.MENU_ITEMS.put("items", JSON.stringify(items));
      
      return new Response(JSON.stringify(items[index]), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method === "DELETE") {
      // Delete item
      const { id } = await request.json();
      let items = await env.MENU_ITEMS.get("items", "json") || [];
      
      items = items.filter(item => item.id !== id);
      await env.MENU_ITEMS.put("items", JSON.stringify(items));
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function handleReorderItems(context) {
  const { request, env } = context;
  
  // Validate token
  const token = request.headers.get("X-Admin-Token");
  if (!token || !token.trim()) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  const data = await request.json();
  const { orders } = data; // Array of { id, order }

  if (!Array.isArray(orders)) {
    return new Response(JSON.stringify({ error: "orders must be an array" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const items = await env.MENU_ITEMS.get("items", "json") || [];
  const orderMap = new Map(orders.map((o) => [o.id, o.order]));

  items.forEach((item) => {
    if (orderMap.has(item.id)) {
      item.order = orderMap.get(item.id);
    }
  });

  await env.MENU_ITEMS.put("items", JSON.stringify(items));

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
}

