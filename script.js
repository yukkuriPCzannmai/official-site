// 今のドメインが github.io を含んでいるかチェック

// 1. GitHub Pages (github.io) にいるときだけ実行
if (window.location.hostname.includes("git")) {

  // 2. 今のパス（例: /official-site/index.html）を取得
  let path = window.location.pathname;

  // 3. 先頭の "/official-site" を空文字に置き換えて削る
  // これで "/official-site/page.html" が "/page.html" になる
  let newPath = path.replace(/^\/official-site/, "");

  // 4. 新しいドメインに、掃除したパスをくっつけてリダイレクト
  window.location.replace("https://ypz-official-site.pages.dev" + newPath);
}

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
  }
});
window.onload = function () {
  // YouTube登録ボタンの表示処理
  if (typeof gapi !== 'undefined' && gapi.ytsubscribe) {
    gapi.ytsubscribe.render();
  }
}
function onLoadCallback() {
  if (typeof gapi !== 'undefined' && gapi.ytsubscribe) {
    gapi.ytsubscribe.render();
  }
}

// YouTube Data API をサーバーサイドプロキシ経由で呼び出し（APIキー隠蔽）
const CHANNEL_ID = 'UCSMJlaoba1qvXE5mjnajOkA';

const fetchLatestVideos = async () => {
  try {
    // チャンネル情報を取得してアップロードプレイリストIDを取得
    const channelResponse = await fetch(
      `/api/youtube?action=channel&channelId=${CHANNEL_ID}`
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

    // 最大3つの動画だけを取得する
    let maxVideos = 3;

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
      for (const item of videosData.items) {
        if (videoCount >= maxVideos) {
          break;
        }

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

        videoCount++;
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

const articlesPerPage = 3;
let currentPage = 1;

function filterByCategory(category) {
  const articles = document.querySelectorAll('.blog-preview');
  articles.forEach(article => {
    const cat = article.dataset.category;
    if (category === 'すべて' || cat === category) {
      article.style.display = 'block';
    } else {
      article.style.display = 'none';
    }
  });
}

function filterByTags(input) {
  const keyword = input.toLowerCase();
  const articles = document.querySelectorAll('.blog-preview');
  articles.forEach(article => {
    const tags = article.dataset.tags.toLowerCase();
    article.style.display = tags.includes(keyword) ? 'block' : 'none';
  });
}

function showPage(page) {
  const articles = document.querySelectorAll('.blog-preview');
  const start = (page - 1) * articlesPerPage;
  const end = start + articlesPerPage;

  articles.forEach((article, index) => {
    article.style.display = (index >= start && index < end) ? 'block' : 'none';
  });

  currentPage = page;
  updatePagination(articles.length);
}

function updatePagination(totalArticles) {
  const totalPages = Math.ceil(totalArticles / articlesPerPage);
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `<button onclick="showPage(${i})">${i}</button>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const articles = document.querySelectorAll('.blog-preview');
  if (articles.length > 0) {
    showPage(1);
  }
});

// 修正：ページが読み込まれたら、自動的に「すべて」のフィルタリングを実行する
document.addEventListener('DOMContentLoaded', () => {
  filterByCategory('すべて');
});

// --- スクロールフェードインアニメーション ---
document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll(
    '.character-button, .new.video, #news, .Navigator.in.home, .button-container'
  );

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  targets.forEach(el => observer.observe(el));
});
