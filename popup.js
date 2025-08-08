const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = name + "=" + value + ";expires=" + expires.toUTCString() + ";path=/";
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

fetch("popup.html")
  .then(res => res.text())
  .then(html => {
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const popup = document.getElementById('privacy-popup');
    const agreeBtn = document.getElementById('agree-button');

    if (!getCookie('privacyAccepted')) {
      popup.style.display = 'flex';
      popup.style.position = 'fixed';
      popup.style.top = '0';
      popup.style.left = '0';
      popup.style.width = '100%';
      popup.style.height = '100%';
      popup.style.background = 'rgba(0, 0, 0, 0.6)';
      popup.style.zIndex = '9999';
      popup.style.alignItems = 'center';
      popup.style.justifyContent = 'center';
    }

    agreeBtn.addEventListener('click', () => {
      setCookie('privacyAccepted', 'true', 365);
      popup.style.display = 'none';
    });
  });
