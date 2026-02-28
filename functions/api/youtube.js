export async function onRequest(context) {
  const { searchParams } = new URL(context.request.url);
  const action = searchParams.get('action');
  const channelId = searchParams.get('channelId');
  const playlistId = searchParams.get('playlistId');
  const pageToken = searchParams.get('pageToken') || '';
  
  const API_KEY = context.env.YOUTUBE_API_KEY;

  let url = "";
  if (action === 'channel') {
    url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`;
  } else if (action === 'playlist') {
    url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${pageToken}&key=${API_KEY}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
