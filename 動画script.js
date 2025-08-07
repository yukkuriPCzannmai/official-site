const API_KEY = 'AIzaSyDIWSDYy2c0NPI_JAL9ISVMVbkhhcqk2ZM'; // YouTube Data APIのAPIキー
const CHANNEL_ID = 'UCSMJlaoba1qvXE5mjnajOkA'; // チャンネルID

const fetchLatestVideos = async () => {
    try {
        // チャンネル情報を取得してアップロードプレイリストIDを取得
        const channelResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
        );
        const channelData = await channelResponse.json();

        if (!channelData.items || channelData.items.length === 0) {
            throw new Error("チャンネル情報が見つかりませんでした");
        }

        const uploadPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        // 動画リストを取得
        let nextPageToken = ''; // 次のページのトークン
        const videoListContainer = document.getElementById('video-list');
        videoListContainer.innerHTML = ''; // 既存の内容をクリア
        let videoCount = 0;

        // ページネーション対応
        do {
            const videosResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadPlaylistId}&maxResults=50&pageToken=${nextPageToken}&key=${API_KEY}`
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
                        <img src="${thumbnailUrl}" alt="サムネイル">
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
fetchLatestVideos();
