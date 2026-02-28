export async function onRequest(context) {
  const apiKey = context.env.MICROCMS_API_KEY;

  const response = await fetch(
    "https://yukkuripczanmai.microcms.io/api/v1/blogs",
    {
      headers: {
        "X-MICROCMS-API-KEY": apiKey,
      },
    }
  );

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
