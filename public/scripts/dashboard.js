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

//TODO: submit form update to database
const updateSocials = () =>
{
    const socialsToSubmit = {
        id: user.id,
        socials: user.socials
    }
    fetch('/dashboard/api/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(socialsToSubmit)
    }).then(res => console.log(res.status)).catch(res => console.log(err))
};
const socialsSubmit = document.getElementById('socials-submit');
socialsSubmit.onclick = () => updateSocials();

//Adds a form with appropriate input fields and order functionality
const addSocialForm = (index = 1, nameText = '', linkText = '') =>
{
    //Container to deal with order of forms
    const formContainer = document.createElement('form');
    formContainer.setAttribute('id', 'form' + index.toString());
    //Used to outline the current positioning
    const form = document.createElement('div');
    form.setAttribute('id', 'div' + index.toString());
    socialContainer.appendChild(formContainer);
    
    const indexView = document.createElement('p');
    indexView.innerText = index;
    formContainer.appendChild(indexView);
    formContainer.appendChild(form);

    const orderContainer = document.createElement('div');
    const orderUp = document.createElement('button');
    orderUp.setAttribute('class', 'up');
    orderUp.innerText = 'up';
    const orderDown = document.createElement('button');
    orderDown.setAttribute('class', 'down');
    orderDown.innerText = 'down';
    
    form.appendChild(orderContainer);
    orderContainer.appendChild(orderUp);
    orderContainer.appendChild(orderDown);

    let orderIndex = index;
    const changeOrder = e =>
    {
        e.preventDefault();
        const orderValue = e.target.className == 'up' ? orderIndex - 1 : orderIndex + 1;
        const formThis = document.getElementById('form' + orderIndex.toString());
        const divThis = document.getElementById('div' + orderIndex.toString());

        const formAlt = document.getElementById('form' + orderValue.toString());
        const divAlt = document.getElementById('div' + orderValue.toString());
        if (divAlt)
        {
            formThis.removeChild(divThis);
            formAlt.removeChild(divAlt);
            formAlt.appendChild(divThis);
            formThis.appendChild(divAlt);

            divThis.setAttribute('id', 'div' + orderValue.toString());
            divAlt.setAttribute('id', 'div' + orderIndex.toString());
            const tempSocial = user.socials[orderIndex - 1];
            user.socials[orderIndex - 1] = user.socials[orderValue - 1];
            user.socials[orderValue - 1] = tempSocial;

            orderIndex = orderValue;
        }
        
    };
    orderUp.addEventListener('click', changeOrder);
    orderDown.addEventListener('click', changeOrder);

    const formName = document.createElement('input');
    formName.setAttribute('class', 'social-name');
    formName.setAttribute('name', 'name');
    formName.setAttribute('value', nameText);
    formName.disabled = true;
    const formNameLabel = document.createElement('label');
    formNameLabel.setAttribute('for', 'name');
    formNameLabel.innerText = 'Name';

    const formLink = document.createElement('input');
    formLink.setAttribute('class', 'social-link');
    formLink.setAttribute('name', 'link');
    formLink.setAttribute('value', linkText);
    formLink.disabled = true;
    const formLinkLabel = document.createElement('label');
    formLinkLabel.setAttribute('for', 'link');
    formLinkLabel.innerText = 'Link';

    const formImg = document.createElement('button');
    formImg.setAttribute('class', 'social-img-button');
    formImg.innerText = 'Set Image';
    formImg.setAttribute('type', 'button');
    formImg.addEventListener('click', showImageCard);

    const saveBtn = document.createElement('button');
    saveBtn.innerText = 'Edit';
    const editSocial = e =>
    {
        e.preventDefault();
        e.target.innerText = 'Save';
        formName.disabled = false;
        formLink.disabled = false;
        e.target.onclick = saveSocial;
    }
    const saveSocial = e =>
    {
        e.preventDefault();
        e.target.innerText = 'Edit';
        user.socials[index - 1].name = formName.value;
        user.socials[index - 1].link = formLink.value;
        formName.disabled = true;
        formLink.disabled = true;
        e.target.onclick = editSocial;
    };
    saveBtn.onclick = editSocial;

    form.appendChild(orderContainer);
    form.appendChild(formNameLabel);
    form.appendChild(formName);
    form.appendChild(formLinkLabel);
    form.appendChild(formLink);
    form.appendChild(formImg);
    form.appendChild(saveBtn);
}

const refreshProfiles = () =>
{
    user.socials.forEach((e, i) =>
    {
        addSocialForm(i + 1, e.name, e.link);
    })
}

//Fetch user info on page load
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
            user.id = profile._id;
            user.displayName.value = profile.displayName;
            user.location.value = profile.location;
            user.bio.value = profile.bio;
            user.socials = profile.socials;
            refreshProfiles();
        }).catch((err) => location.replace('/p/login'));
    }).catch(err => location.replace('/p/login'));
}
document.querySelector('body').onload = async () =>
{
    fetchSocials();
    fetch('/dashboard/api/username').then(res =>
    {
        res.json().then(resJson =>
        {
            const username = resJson.username;
            const userLink = document.getElementById('user-link');
            userLink.setAttribute('href', '/' + username);
        })
    })
}

addProfileButton.addEventListener('click', () =>
{
    user.socials.push({
        name: '',
        link: '',
    });
    const index = user.socials.length;
    addSocialForm(index);
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