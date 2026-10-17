export default {
  async fetch(request, env) {
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin":
        "https://yasrpwrnsyr-creator.github.io",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Use POST" }),
        { status: 405, headers }
      );
    }

    try {
      const data = await request.json();

      if (!data.message || typeof data.message !== "string") {
        return new Response(
          JSON.stringify({ error: "Invalid message" }),
          { status: 400, headers }
        );
      }

      const result = await env.AI.run(
        "@cf/meta/llama-3.1-8b-instruct",
        {
          messages: [
            {
              role: "system",
              content:
                "You are AI KING WORLD. Reply in Persian when the user writes in Persian. Be helpful and accurate."
            },
            {
              role: "user",
              content: data.message.slice(0, 2000)
            }
          ]
        }
      );

      return new Response(
        JSON.stringify({
          answer: result.response
        }),
        { headers }
      );

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "AI service unavailable"
        }),
        { status: 500, headers }
      );
    }
  }
};
