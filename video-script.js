document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");

    if (menuToggle && menu) {
        menuToggle.addEventListener("click", () => {
            menu.classList.toggle("active");
        });
    }
});

// YouTube Data API をサーバーサイドプロキシ経由で呼び出し（APIキー隠蔽）
const CHANNEL_ID_VIDEOS = 'UCSMJlaoba1qvXE5mjnajOkA';

const fetchAllVideos = async () => {
    try {
        // チャンネル情報を取得してアップロードプレイリストIDを取得
        const channelResponse = await fetch(
            `/api/youtube?action=channel&channelId=${CHANNEL_ID_VIDEOS}`
        );
        const channelData = await channelResponse.json();

        if (!channelData.items || channelData.items.length === 0) {
            throw new Error("チャンネル情報が見つかりませんでした");
        }

        const uploadPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        // 動画リストを取得
        let nextPageToken = '';
        const videoListContainer = document.getElementById('video-list');
        if (!videoListContainer) return;
        videoListContainer.innerHTML = '';
        let videoCount = 0;

        // ページネーション対応
        do {
            const videosResponse = await fetch(
                `/api/youtube?action=playlist&playlistId=${uploadPlaylistId}&maxResults=50&pageToken=${nextPageToken}`
            );
            const videosData = await videosResponse.json();

            if (!videosData.items || videosData.items.length === 0) {
                break;
            }

            // 動画リストをHTMLに追加
            videosData.items.forEach(item => {
                const videoTitle = item.snippet.title;
                const videoId = item.snippet.resourceId.videoId;
                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
                const thumbnailUrl = item.snippet.thumbnails.medium.url;

                const videoInfo = document.createElement('div');
                videoInfo.classList.add('video-info');
                videoInfo.innerHTML = `
                    <a href="${videoUrl}" target="_blank">
                        <img src="${thumbnailUrl}" alt="${videoTitle}のサムネイル">
                    </a>
                    <h2>${videoTitle}</h2>
                `;
                videoListContainer.appendChild(videoInfo);
            });

            // 次のページトークンがあればセット
            nextPageToken = videosData.nextPageToken || '';
            videoCount += videosData.items.length;
        } while (nextPageToken);

        console.log(`合計取得動画数: ${videoCount}`);
    } catch (error) {
        console.error('Error fetching latest videos:', error);
    }
};

// 最新の動画情報を取得
fetchAllVideos();
