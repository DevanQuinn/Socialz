const profileHeader = document.getElementById('profile-name');
let username = 'Devan';
let socials;

//const socials = [{name: 'Tiktok', link: 'https://tiktok.com/@devanthedank'}, {name: 'Twitch', link: 'https://twitch.tv/devanqueue'}]
const fetchSocials = async () =>
{
    const response = await fetch('/api/devan');
    socials = await response.json();
}

profileHeader.innerHTML = username;

const generateSocials = async (e, i) =>
{
    const list = document.getElementById('social-list');
    const button = document.createElement('button');
    list.appendChild(button);
    button.innerHTML = e.name;
    button.className = 'social-element';
    

    button.onclick = () => window.open(e.link, "_self");
}

const body = document.querySelector('body');
body.onload = async () =>
{
    await fetchSocials();
    socials.forEach(generateSocials);
}
