document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");

    menuToggle.addEventListener("click", () => {
        menu.classList.toggle("active");
    });
});
window.onload = function() {
    // YouTube登録ボタンの表示処理
    gapi.ytsubscribe.render();
}
function onLoadCallback() {
    gapi.ytsubscribe.render();
}
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

        // 最大3つの動画だけを取得する
        let maxVideos = 3;

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
            for (const item of videosData.items) {
                if (videoCount >= maxVideos) {
                    break; // 3つの動画だけを表示
                }

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

                videoCount++; // 取得した動画数をカウント
            }

            // 次のページトークンがあればセット
            nextPageToken = videosData.nextPageToken || '';
        } while (nextPageToken && videoCount < maxVideos);

        console.log(`取得した動画数: ${videoCount}`);
    } catch (error) {
        console.error('Error fetching latest videos:', error);
    }
};

// 最新の動画情報を取得
fetchLatestVideos();


    const popup = document.getElementById('privacy-popup');
    const agreeBtn = document.getElementById('agree-button');

    // クッキーに保存（有効期限：365日）
    function setCookie(name, value, days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    // クッキーの読み取り
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // 初回だけ表示
    if (!getCookie('privacyAccepted')) {
      popup.style.display = 'flex';
    }

    agreeBtn.addEventListener('click', () => {
      setCookie('privacyAccepted', 'true', 365);
      popup.style.display = 'none';
    });



