const profileHeader = document.getElementById('profile-name');
let username = 'Username';
let socials;
let userData;

const camelCase = (str) =>
{
    const lowercase = str.slice(1);
    return str[0].toUpperCase() + lowercase;
}

const fetchSocials = async () =>
{
    // domain/:username
    username = window.location.href.split('/')[3];
    const response = await fetch('/api/' + username);
    const profile = await response.json();
    userData = {
        username: profile.username,
        displayName: profile.displayName,
        location: profile.location,
        bio: profile.bio
    }
    socials = profile.socials;
    profileHeader.innerHTML = userData.displayName;
    document.querySelector('title').innerText = userData.displayName + ' | Cherrylink';

    //User Data
    const pfp = document.getElementById('pfp');
    const profileName = document.getElementById('profile-name');
    const profileLocation = document.getElementById('profile-location');
    const profileBio = document.getElementById('profile-bio');

    //TODO: Profile Picture (User Data)
    // pfp.src = userData.pfp;
    // const srcSplit = userData.pfp.split('/');
    // pfp.alt = srcSplit[srcSplit.length];

    profileName.innerText = userData.displayName;
    if (userData.location) profileLocation.innerText = '📍 ' + userData.location;
    profileBio.innerText = '💬 ' + userData.bio;
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
    desc.innerHTML = e.link.split('/')[2];
    desc.className = 'social-desc';
    textContainer.appendChild(desc);
}

const body = document.querySelector('body');
body.onload = async () =>
{
    await fetchSocials();
    if (socials) socials.forEach(generateSocials);
}
