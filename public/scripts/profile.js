const profileHeader = document.getElementById('profile-name');
let username = 'Username';
let socials;
let userData;

const camelCase = (str) =>
{
    const lowercase = str.slice(1);
    return str[0].toUpperCase() + lowercase;
}

const convertToBase64 = (buffer) =>
{
    const typed_array = new Uint8Array(buffer);
    const string_char = typed_array.reduce((data, byte) => data + String.fromCharCode(byte));
    const base64 = window.btoa(string_char);
    return base64;
}

const fetchSocials = async () =>
{
    // domain/:username
    username = window.location.href.split('/')[3];
    const response = await fetch('/api/' + username);
    const profile = await response.json();
    const avatar = fetch(`/api/files/${profile.avatar}`)
        .then(avatar => avatar.blob())
        .then(avatarBlob => URL.createObjectURL(avatarBlob))
        .then(avatarUrl =>
        {
            const avatarNode = document.getElementById('pfp');
            avatarNode.src = avatarUrl;
        })
    userData = {
        username: profile.username,
        displayName: profile.displayName,
        location: profile.location,
        bio: profile.bio,
        color: profile.color
    }
    socials = profile.socials;
    profileHeader.innerHTML = userData.displayName;
    // document.querySelector('title').innerText = userData.displayName + ' | Cherrylink';

    //User Data
    const profileName = document.getElementById('profile-name');
    const profileLocation = document.getElementById('profile-location');
    const profileBio = document.getElementById('profile-bio');

    profileName.innerText = userData.displayName;
    if (userData.location != '') profileLocation.innerText = '📍 ' + userData.location;
    if (userData.bio != '') profileBio.innerText = '💬 ' + userData.bio;
    document.body.style.backgroundColor = userData.color;
}

const generateSocials = async (e, i) =>
{
    //Whole List
    const list = document.getElementById('social-list');

    const linkOpener = document.createElement('a');
    linkOpener.href = e.link;
    linkOpener.target = '_self';
    list.appendChild(linkOpener);

    const button = document.createElement('div');
    button.className = 'social-element';
    linkOpener.appendChild(button);

    //  TODO: implement img storage w/ mongo
    // const img = document.createElement('img');
    // img.src = e.image;
    // img.className = 'social-img';
    // button.appendChild(img);

    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';
    button.appendChild(textContainer);

    const text = document.createElement('p');
    text.innerHTML = e.name;
    text.className = 'social-text';
    textContainer.appendChild(text);

    const desc = document.createElement('p');
    const linkUrl = new URL(e.link);
    const domain = linkUrl.hostname;
    desc.innerHTML = domain;
    desc.className = 'social-desc';
    textContainer.appendChild(desc);
}

const body = document.querySelector('body');
body.onload = async () =>
{
    await fetchSocials();
    if (socials) socials.forEach(generateSocials);
}
