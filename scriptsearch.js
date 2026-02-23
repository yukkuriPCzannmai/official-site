// 検索対象となるデータ（例えば、ブログ投稿）
const posts = [
    { title: "PCの最適化方法について", content: "PCのパフォーマンスを最大化する方法..." },
    { title: "Windowsのメモリ管理", content: "Windowsのメモリ管理方法について解説..." },
    { title: "ネットワークトラブルシューティング", content: "ネットワークの問題解決方法について..." }
];

// 検索フォームと結果表示エリアの参照
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

// 検索処理
searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // フォーム送信のデフォルト動作を防ぐ

    const query = searchInput.value.toLowerCase();
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query)
    );

    // 結果表示
    searchResults.innerHTML = "";
    if (filteredPosts.length > 0) {
        filteredPosts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("search-result");
            postElement.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
            searchResults.appendChild(postElement);
        });
    } else {
        searchResults.innerHTML = "<p>一致する結果はありません。</p>";
    }
});
<script>
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



