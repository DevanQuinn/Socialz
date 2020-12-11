const user = {
    displayName: document.getElementById('display-name'),
    profilePicture: document.getElementById('profile-picture'),
    location: document.getElementById('location'),
    bio: document.getElementById('bio'),
    profiles: []
}


const generalForm = document.getElementById('general-info');
const addProfileButton = document.getElementById('add-profile');
const generalSubmitButton = document.getElementById('general-submit');
const socialContainer = document.getElementById('socials');

let socialImages = {
    loaded: false,
    images: []
}
const showImageCard = async () =>
{
    const backgroundCard = document.getElementById('background-card');
    const imageCard = document.getElementById('image-card');
    const cardClose = document.getElementById('card-close');
    backgroundCard.style.visibility = 'visible';
    cardClose.addEventListener('click', () => backgroundCard.style.visibility = 'hidden');
    if (!socialImages.loaded)
    {
        await fetch('/dashboard/api/image').then(async res =>
        {
            const resJson = await res.json();
            socialImages.images = resJson.images;
            socialImages.path = resJson.path;
            socialImages.loaded = true;
        })
        socialImages.images.forEach(e =>
        {
            const image = document.createElement('img');
            
            imageCard.appendChild(image);
        })
    }
}


const addSocialForm = (index = 0) =>
{
    const form = document.createElement('form');
    socialContainer.appendChild(form);

    const formName = document.createElement('input');
    formName.setAttribute('class', 'social-name');
    formName.setAttribute('name', 'name');
    const formNameLabel = document.createElement('label');
    formNameLabel.setAttribute('for', 'name');
    formNameLabel.innerText = 'Name';

    const formLink = document.createElement('input');
    formLink.setAttribute('class', 'social-link');
    formLink.setAttribute('name', 'link');
    const formLinkLabel = document.createElement('label');
    formLinkLabel.setAttribute('for', 'link');
    formLinkLabel.innerText = 'Link';

    const formImg = document.createElement('button');
    formImg.setAttribute('class', 'social-img-button');
    formImg.innerText = 'Set Image';
    formImg.setAttribute('type', 'button');
    formImg.addEventListener('click', showImageCard);

    const formButton = document.createElement('button');
    formButton.setAttribute('class', 'social-submit');
    formButton.innerText = 'Save';

    form.appendChild(formNameLabel);
    form.appendChild(formName);
    form.appendChild(formLinkLabel);
    form.appendChild(formLink);
    form.appendChild(formImg);
    form.appendChild(formButton);
}

const refreshProfiles = () =>
{
    Array.from(socialContainer.children).forEach(element => element.remove())
    console.log(user.profiles)
    user.profiles.forEach(element =>
    {
        const profileCard = document.createElement('div');
        profileCard.style.background = 'black';
        profileCard.style.height = '50px';
        profileCard.style.width = '50px';
        profileCard.style.margin = '10px';
        socialContainer.appendChild(profileCard);
    })
}

const fetchSocials = async () =>
{
    await fetch('/dashboard/api').then(res =>
    {
        if (res.status != 200)
        {
            location.href = '/p/login'
            return;
        }
        res.json().then(resJson =>
        {
            const profile = resJson.profile;
            user.displayName.value = profile.displayName;
            user.location.value = profile.location;
            user.bio.value = profile.bio;
            user.profiles = profile.socials;
            refreshProfiles();
        }).catch((err) => location.href = '/p/login');
    }).catch(err => location.href = '/p/login');
}
fetchSocials();

addProfileButton.addEventListener('click', () =>
{
    user.profiles.push({});
    const index = user.profiles.length - 1;
    addSocialForm();
    //refreshProfiles();
})
generalSubmitButton.addEventListener('click', (e) =>
{
    e.preventDefault();

    const newVals = {
        displayName: user.displayName.value,
        location: user.location.value,
        bio: user.bio.value
    }
    fetch('/dashboard/api', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newVals)
    }).then(res => console.log(res)).catch(err => console.log(err))
})