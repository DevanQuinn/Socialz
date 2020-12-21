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
    // if (!socialImages.loaded)
    // {
    //     await fetch('/dashboard/api/image').then(async res =>
    //     {
    //         const resJson = await res.json();
    //         socialImages.images = resJson.images;
    //         socialImages.path = resJson.path;
    //         socialImages.loaded = true;
    //     })
    //     // socialImages.images.forEach(e =>
    //     // {
    //     //     const image = document.createElement('img');
            
    //     //     imageCard.appendChild(image);
    //     // })
    // }
    await fetch('/dashboard/api/image').then(res => res.blob()).then(image =>
    {
        const imageNode = document.createElement('img');
        imageCard.appendChild(imageNode);
        imageNode.setAttribute('src', URL.createObjectURL(image));
    })
}


const addSocialForm = (index = 1) =>
{
    const formContainer = document.createElement('form');
    formContainer.setAttribute('id', 'form' + index.toString());
    const form = document.createElement('div');
    formContainer.appendChild(form);
    form.setAttribute('id', 'div' + index.toString());
    socialContainer.appendChild(formContainer);
    
    const order = document.createElement('input');
    let orderIndex = index;
    order.setAttribute('type', 'number');
    order.setAttribute('id', 'order' + index.toString())
    order.setAttribute('value', index);
    order.setAttribute('step', '0');
    order.addEventListener('input', e =>
    {
        const orderValue = e.target.value >= orderIndex ? orderIndex - 1 : orderIndex + 1;
        const formThis = document.getElementById('form' + orderIndex.toString());
        const orderAlt = document.getElementById('order' + orderValue.toString());
        const formAlt = document.getElementById('form' + orderValue.toString());
        const divAlt = document.getElementById('div' + orderValue.toString());

        const div = document.getElementById('div' + orderIndex);
            console.log('dijaw')
        if (orderAlt)
        {
            formThis.removeChild(div);
            formAlt.removeChild(divAlt);
            formAlt.appendChild(div);
            formThis.appendChild(divAlt);

            div.setAttribute('id', 'div' + (orderValue).toString());
            divAlt.setAttribute('id', 'div' + orderIndex.toString())


            orderAlt.setAttribute('value', orderIndex);
            orderAlt.setAttribute('id', 'order' + orderIndex.toString());
        }
        
        orderIndex = orderValue;
        e.target.id = 'order' + (orderIndex).toString();
        e.target.value = orderIndex;
    });

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

    form.appendChild(order);
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
            location.replace('/p/login');
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
        }).catch((err) => location.replace('/p/login'));
    }).catch(err => location.replace('/p/login'));
}
fetchSocials();

addProfileButton.addEventListener('click', () =>
{
    user.profiles.push({});
    const index = user.profiles.length;
    addSocialForm(index);
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