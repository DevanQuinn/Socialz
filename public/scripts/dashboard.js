const user = {
    displayName: document.getElementById('display-name'),
    profilePicture: document.getElementById('profile-picture'),
    location: document.getElementById('location'),
    bio: document.getElementById('bio'),
    profiles: []
}

const onReload = (e) => 
        {
            e.preventDefault();
            e.returnValue = '';
        };

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
    window.removeEventListener('beforeunload', onReload);
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
    }).then(res =>
    {
        document.getElementById('socials-submit').disabled = true;
    }).catch(res => console.log(err))
};
const socialsSubmit = document.getElementById('socials-submit');
socialsSubmit.onclick = () => updateSocials();

//Adds a form with appropriate input fields and order functionality
const addSocialForm = (index = 1, nameText = '', linkText = '') =>
{
    //Container to deal with order of forms
    const formContainer = document.createElement('form');
    formContainer.setAttribute('id', 'form' + index);
    formContainer.className = 'form-container';
    //Used to outline the current positioning
    const form = document.createElement('div');
    form.setAttribute('id', 'div' + index);
    form.className = 'form-div';
    socialContainer.appendChild(formContainer);
    
    const indexView = document.createElement('p');
    indexView.innerText = index;
    indexView.setAttribute('id', 'index' + index);
    // formContainer.appendChild(indexView);
    formContainer.appendChild(form);

    const orderContainer = document.createElement('div');
    orderContainer.setAttribute('id', 'order ' + index);
    const orderUp = document.createElement('button');
    orderUp.setAttribute('class', 'up');
    orderUp.innerText = 'up';
    const orderDown = document.createElement('button');
    orderDown.setAttribute('class', 'down');
    orderDown.innerText = 'down';
    
    // form.appendChild(orderContainer);
    orderContainer.appendChild(orderUp);
    orderContainer.appendChild(orderDown);

    let orderIndex = index;
    form.addEventListener('index-increase', () =>
    {
        orderIndex++;
        console.log(orderIndex);
        console.log(formContainer.id)
    });
    form.addEventListener('index-decrease', () =>
    {
        orderIndex--
        console.log(orderIndex);
        console.log(formContainer.id)
    });

    const changeOrder = e =>
    {
        e.preventDefault();
        const orderValue = e.target.className == 'up' ? orderIndex - 1 : orderIndex + 1;
        const formThis = document.getElementById('form' + orderIndex);
        const divThis = document.getElementById('div' + orderIndex);

        const formAlt = document.getElementById('form' + orderValue);
        const divAlt = document.getElementById('div' + orderValue);
        if (divAlt)
        {
            formThis.removeChild(divThis);
            formAlt.removeChild(divAlt);
            formAlt.appendChild(divThis);
            formThis.appendChild(divAlt);

            divThis.setAttribute('id', 'div' + orderValue);
            divAlt.setAttribute('id', 'div' + orderIndex);
            const tempSocial = user.socials[orderIndex - 1];
            user.socials[orderIndex - 1] = user.socials[orderValue - 1];
            user.socials[orderValue - 1] = tempSocial;

            const indexChange = orderValue < orderIndex ? new Event('index-increase') : new Event('index-decrease')
            orderIndex = orderValue;
            divThis.dispatchEvent(indexChange);
        }
        
    };
    orderUp.addEventListener('click', changeOrder);
    orderDown.addEventListener('click', changeOrder);

    //Name input field
    const formName = document.createElement('input');
    formName.className = 'social-name';
    formName.setAttribute('name', 'name');
    formName.setAttribute('value', nameText);
    formName.disabled = true;
    const formNameLabel = document.createElement('label');
    formNameLabel.setAttribute('for', 'name');
    formNameLabel.innerText = 'Name';

    //Link input field
    const formLink = document.createElement('input');
    formLink.className = 'social-link';
    formLink.setAttribute('name', 'link');
    formLink.setAttribute('value', linkText);
    formLink.disabled = true;
    const formLinkLabel = document.createElement('label');
    formLinkLabel.setAttribute('for', 'link');
    formLinkLabel.innerText = 'Link';

    //Set image button
    const formImg = document.createElement('button');
    formImg.setAttribute('class', 'social-img-button');
    formImg.innerText = 'Set Image';
    formImg.setAttribute('type', 'button');
    formImg.addEventListener('click', showImageCard);

    //Save/Edit button
    const saveBtn = document.createElement('button');
    saveBtn.innerText = 'Edit';
    saveBtn.className = 'save-button';

    //Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.style.visibility = 'hidden';
    deleteBtn.innerText = '🗑️';
    deleteBtn.className = 'delete-button';
    formContainer.addEventListener('delete', () =>
    {
        orderIndex--;
        formContainer.setAttribute('id', 'form' + orderIndex);
        form.setAttribute('id', 'div' + orderIndex);
        indexView.innerText = orderIndex;
        
    })
    deleteBtn.addEventListener('click', (e) =>
    {
        const deleteEvent = new Event('delete');
        e.preventDefault();
        socialContainer.removeChild(document.getElementById('form' + orderIndex));
        user.socials.splice(orderIndex - 1, 1);
        for (let i = orderIndex; i <= user.socials.length; i++)
        {
            document.getElementById('form' + (i + 1)).dispatchEvent(deleteEvent);
        }
        document.getElementById('socials-submit').disabled = false;
    })

    //Error text (under the form)
    const errorText = document.createElement('p');
    errorText.style.color = 'red';

    const editSocial = e =>
    {
        e.preventDefault();
        window.addEventListener('beforeunload', onReload);
        e.target.innerText = 'Save';
        formName.disabled = false;
        formLink.disabled = false;
        e.target.onclick = saveSocial;
        document.getElementById('socials-submit').disabled = true;
        deleteBtn.style.visibility = 'visible';
        formName.focus();
        formName.select();
    }
    const saveSocial = e =>
    {
        e.preventDefault();
        try { const url = new URL(formLink.value) }
        catch
        { 
            errorText.innerText = 'Invalid URL';
            const removeText = (e) =>
            {
                errorText.innerText = null;
                e.target.removeEventListener('input', removeText);
            }
            formLink.addEventListener('input', removeText);
            return;
        }
        e.target.innerText = 'Edit';
        user.socials[orderIndex - 1].name = formName.value;
        user.socials[orderIndex - 1].link = formLink.value;
        formName.disabled = true;
        formLink.disabled = true;
        e.target.onclick = editSocial;
        document.getElementById('socials-submit').disabled = false;
        deleteBtn.style.visibility = 'hidden';
    };
    saveBtn.onclick = editSocial;
    if (linkText == '') saveBtn.click();

    //form.appendChild(orderContainer);
    // form.appendChild(formNameLabel);
    form.appendChild(deleteBtn);
    form.appendChild(formName);
    // form.appendChild(formLinkLabel);
    form.appendChild(formLink);
    // form.appendChild(formImg);
    form.appendChild(saveBtn);
    form.appendChild(errorText);
}

const refreshProfiles = () =>
{
    const socialContainer = document.getElementById('socials');
    Array.from(socialContainer.children).forEach(e =>
    {
        socialContainer.removeChild(e);
    })
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
    }).catch(err => console.log(err));
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
            const portName = location.port ? ':' + location.port : '';
            const profileUrl = location.protocol + location.hostname + portName + '/' + username;
            const userButton = document.getElementById('user-button');
            const userCopy = document.getElementById('user-copy');
            userLink.value = profileUrl;
            userButton.onclick = () => window.open(new URL(profileUrl), '_blank');
            userCopy.onclick = (e) =>
            {
                userLink.focus();
                userLink.select();
                document.execCommand('copy');
                const prevText = userCopy.innerText;
                userCopy.innerText = 'Copied!';
                const revertText = e =>
                {
                    userCopy.innerText = prevText;
                    e.target.removeEventListener('blur', revertText);
                }
                userLink.addEventListener('blur', revertText);
            }
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
