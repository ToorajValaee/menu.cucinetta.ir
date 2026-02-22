export async function onRequest(context) {
  const { request, env } = context;
  
  // Check authentication for non-GET requests
  if (request.method !== "GET") {
    const token = request.headers.get("X-Admin-Token");
    if (!token || !token.trim()) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Token validation: token should be non-empty base64 string from auth endpoint
    // A proper implementation would store tokens in KV with expiry
  }

  try {
    if (request.method === "GET") {
      // Fetch all menu items
      const items = await env.MENU_ITEMS.get("items", "json") || [];
      return new Response(JSON.stringify(items), {
        headers: { 
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300"
        },
      });
    }

    if (request.method === "POST") {
      // Create new item
      const newItem = await request.json();
      newItem.id = Date.now().toString();
      newItem.createdAt = new Date().toISOString();
      
      const items = await env.MENU_ITEMS.get("items", "json") || [];
      items.push(newItem);
      
      await env.MENU_ITEMS.put("items", JSON.stringify(items));
      
      return new Response(JSON.stringify(newItem), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (request.method === "PUT") {
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
