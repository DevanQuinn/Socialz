const user = {
    avatarDisplay: document.getElementById('avatar-display'),
    avatar: document.getElementById('avatar'),
    displayName: document.getElementById('display-name'),
    profilePicture: document.getElementById('profile-picture'),
    location: document.getElementById('location'),
    bio: document.getElementById('bio'),
    profiles: []
}

const handleReload = (e) => 
{
    e.preventDefault();
    e.returnValue = '';
};

const generalForm = document.getElementById('general-info');
const addProfileButton = document.getElementById('add-profile');
const generalSubmitButton = document.getElementById('general-submit');
const socialContainer = document.getElementById('socials');
const publishBtn = document.getElementById('socials-submit');

const enablePublish = () => 
{
    window.addEventListener('beforeunload', handleReload);
    publishBtn.disabled = false;
}
const disablePublish = () =>
{
    window.removeEventListener('beforeunload', handleReload);
    publishBtn.disabled = true;
}
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

//Submit form update to database
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
    }).then(res =>
    {
        disablePublish();
    }).catch(res => console.log(err))
};
publishBtn.onclick = () => updateSocials();

const switchOrder = (index1, index2) =>
{
    const temp = user.socials[index1];
    user.socials[index1] = user.socials[index2];
    user.socials[index2] = temp;
    console.log(user.socials)
    return true;
}

let activeElement;
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
    formContainer.style.order = index;

    socialContainer.appendChild(formContainer);
    
    const indexView = document.createElement('p');
    indexView.innerText = index;
    indexView.setAttribute('id', 'index' + index);
    // formContainer.appendChild(indexView);
    formContainer.appendChild(form);
    
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

    //Handle to drag
    const dragger = document.createElement('p');
    dragger.className = 'draggable';
    dragger.addEventListener('mousedown', () => formContainer.setAttribute('draggable', true))
    dragger.addEventListener('mouseup', () => formContainer.setAttribute('draggable', false))
    formContainer.ondragstart = (e) =>
    {
        activeElement = formContainer;
        setTimeout(() => form.classList.add('hidden'), 0);
        e.dataTransfer.effectAllowed = 'copyMove';
    }
    formContainer.ondragend = (e) =>
    {
        form.classList.remove('hidden')
        document.querySelectorAll('.form-div').forEach(el => el.style.backgroundColor = 'royalblue');
    };
    form.ondragenter = (e) =>
    {
        document.querySelectorAll('.form-div').forEach(el => el.style.backgroundColor = 'royalblue');
        console.log(e.target)
        form.style.backgroundColor = 'red';
    }
    form.ondragleave = (e) =>
    {
        const eClass = e.target.parentNode.className;
        if (eClass == 'form-div' || eClass == 'form-container') return;
    }
    formContainer.ondragover = (e) => e.preventDefault();
    formContainer.ondrop = (e) =>
    {
        e.stopPropagation();
        // form.style.backgroundColor = 'royalblue';
        if (activeElement == formContainer) return;
        const tempOrder = activeElement.style.order;
        switchOrder(tempOrder - 1, formContainer.style.order - 1)
        activeElement.style.order = formContainer.style.order;
        formContainer.style.order = tempOrder;
        enablePublish();

        activeElement = null;
    };


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
    formLink.setAttribute('type', 'url');
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
    saveBtn.type = 'submit';
    saveBtn.innerText = 'Edit';
    saveBtn.className = 'save-button';

    //Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('tabindex', -1);
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
        publishBtn.disabled = false;
    })

    //Error text (under the form)
    const errorText = document.createElement('p');
    errorText.style.color = 'red';

    const editSocial = e =>
    {
        e.preventDefault();
        disablePublish();
        e.target.innerText = 'Save';
        formName.disabled = false;
        formLink.disabled = false;
        e.target.onclick = saveSocial;
        dragger.style.visibility = 'hidden';
        dragger.style.pointerEvents = 'none';
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
        enablePublish();
        dragger.style.visibility = 'visible';
        dragger.style.pointerEvents = 'all';
        deleteBtn.style.visibility = 'hidden';
    };
    saveBtn.onclick = editSocial;
    if (linkText == '') saveBtn.click();

    //Append all elements to the individual form
    // form.appendChild(formNameLabel);
    form.appendChild(dragger);
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
            //Set Preset Avatar Image
            fetch(`/api/files/${profile.avatar}`)
                .then(avatar => avatar.blob())
                .then(blob =>
                {
                    const url = URL.createObjectURL(blob);
                    user.avatarDisplay.src = url;
                    user.avatarDisplay.addEventListener('click', () => user.avatar.click());
                    user.avatar.addEventListener('change', (e) =>
                    {
                        // const canvas = document.createElement('canvas');
                        // canvas.width = 125;
                        // canvas.height = 125;
                        // const ctx = canvas.getContext('2d');
                        // const file = e.target.files[0];
                        // const rawUrl = URL.createObjectURL(file);
                        // const tempImg = new Image();
                        // tempImg.src = rawUrl;
                        // tempImg.onload = () =>
                        // {
                            
                        //     ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
                        //     // const optimizedUrl = canvas.toDataURL("image/jpeg", 0.7);
                        //     canvas.toBlob(blob =>
                        //     {
                        //         const optimizedUrl = URL.createObjectURL(blob);
                        //         user.avatarDisplay.src = optimizedUrl;
                        //         console.log(user.avatar.value)
                        //     }, 'image/jpeg', 0.7);
                        //     // user.avatarDisplay.src = optimizedUrl;
                        // }
                        user.avatarDisplay.src = URL.createObjectURL(e.target.files[0]);
                    })
                })
            refreshProfiles();
        }).catch((err) => console.log(err));
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
            const profileUrl = location.protocol + '//' + location.hostname + portName + '/' + username;
            const userButton = document.getElementById('user-button');
            const userCopy = document.getElementById('user-copy');
            userLink.value = profileUrl;
            userLink.style.width = profileUrl.length / 1.75 + 'em';
            console.log(userLink.innerText)
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
    const form = document.getElementById('general-info');
    const formData = new FormData(form);
    console.log(user.avatar.files)
    // formData.set('avatar', user.avatarDisplay.src);
    const newVals = {
        avatar: user.avatarDisplay,
        displayName: user.displayName.value,
        location: user.location.value,
        bio: user.bio.value
    }
    fetch('/dashboard/api', {
        method: 'PUT',
        headers: {
            // 'Content-Type': 'application/json'
        },
        body: formData//JSON.stringify(newVals)
    }).then(res => console.log(res)).catch(err => console.log(err))
})
