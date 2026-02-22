export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { password } = await request.json();
    
    if (!password || password !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate a simple token (in production: use JWT)
    const token = Buffer.from(password + Date.now()).toString("base64");
    
    return new Response(JSON.stringify({ 
      token,
      message: "Authenticated"
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Auth Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
