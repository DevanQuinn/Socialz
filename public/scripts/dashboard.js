const user = {
    avatarDisplay: document.getElementById('avatar-display'),
    avatar: document.getElementById('avatar'),
    displayName: document.getElementById('display-name'),
    location: document.getElementById('location'),
    bio: document.getElementById('bio'),
    color: document.getElementById('bg-color'),
}

const initColor = () =>
{
    let body = document.body;
    body.style.backgroundColor = user.color.value;
    let prevColor = user.color.value;
    user.color.addEventListener('change', (e) =>
    {
        const val = e.target.value;
        const regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
        const passed = regex.test(val);
        if (!passed) { user.color.value = prevColor; return; }
        if (val == prevColor) return;
        body.style.backgroundColor = val;
        prevColor = val;
    })
}

const cardContainer = document.getElementById('card-container');
const imgCard = document.getElementById('image-card');
const cardDelete = document.getElementById('card-delete');
const fillForm = (e) =>
{
    e.preventDefault();
    const node = e.target.parentNode.parentNode;
    const index = node.style.order - 1;
    const social = user.socials[index];
    console.log(social);
    const arr = ['name', 'link'];
    arr.forEach(el =>
    {
        const input = document.getElementById(`card-${el}`);
        input.value = social[el];
    })
    showCard(e);
    const submitBtn = document.getElementById('card-submit');
    submitBtn.addEventListener('click', (event) =>
    {
        let url;
        event.preventDefault();
        const name = document.getElementById('card-name').value;
        const link = document.getElementById('card-link').value;

        try
        {
            url = new URL(link);
        } catch {
            return setErrorMsg('Link is not in the correct format.');
        }
        enablePublish();
        const newSocials = {
            index,
            name,
            link,
        }

        showCard(event, newSocials);
        
        
    })
    cardDelete.addEventListener('click', (event) => deleteSocial(event, node.parentNode, index));
}

const deleteSocial = (e, node, index) =>
{
    e.preventDefault();
    const deleteEvent = new Event('delete');
    node.removeChild(document.getElementById('form' + (index + 1)));
    user.socials.splice(index, 1);
    for (let i = index + 1; i <= user.socials.length; i++)
        {
            document.getElementById('form' + (i + 1)).dispatchEvent(deleteEvent);
    }
    enablePublish();
    showCard(e);
}

const showCard = (e, newSocials = null) =>
{
    e.preventDefault();
    // imgCard.classList.toggle('shrink');
    const visibility = cardContainer.style.visibility;
    if (visibility == 'hidden')
    {
        imgCard.classList.remove('shrink');
        cardContainer.style.visibility = 'visible';
    }
    else
    {
        imgCard.classList.add('shrink');
        setTimeout(() =>
        {
            cardContainer.style.visibility = 'hidden';
        }, 100)
        if (newSocials)
        {
            const social = user.socials[newSocials.index];
            social.name = newSocials.name;
            social.link = newSocials.link;
            refreshProfiles(newSocials.index);
        }
    }
}
document.getElementById('background-card').onclick = showCard;

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

//Submit form update to database
const updateSocials = () =>
{
    const socialsToSubmit = {
        id: user.id,
        socials: user.socials
    }
    fetch('/api/dashboard/request/update', {
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

const optimizeImg = (e, blobProp, urlProp) =>
{
    disablePublish();
    const mimetype = e.target.files[0].type;
    if (mimetype.split('/')[0] !== 'image') return;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const file = e.target.files[0];
    const rawUrl = URL.createObjectURL(file);
    const tempImg = new Image();
    tempImg.src = rawUrl;
    tempImg.onload = () =>
    {
        const size = tempImg.width <= tempImg.height ? tempImg.width : tempImg.height;
        ctx.drawImage(tempImg, 0, 0, size, size, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob =>
        {
            user[blobProp] = blob;
            const url = URL.createObjectURL(blob);
            user[urlProp].src = url;
        }, 'image/jpeg', 1);
        
    }
}

let activeElement;
//Adds a form with appropriate input fields and order functionality
const addSocialForm = (index = 1, nameText = '', linkText = '', isNew = false) =>
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

    //Save/Edit button
    const editBtn = document.createElement('button');
    editBtn.type = 'submit';
    editBtn.innerText = 'Edit';
    editBtn.className = 'save-button';

    editBtn.onclick = fillForm;

    formContainer.addEventListener('delete', () =>
    {
        //FIXME: fix wonky behavior when deleting after reordering
        orderIndex--;
        formContainer.style.order = orderIndex;
        // formContainer.setAttribute('id', 'form' + orderIndex);
        // form.setAttribute('id', 'div' + orderIndex);
        indexView.innerText = orderIndex;
        
    })

    //Append all elements to the individual form
    // form.appendChild(formNameLabel);
    form.appendChild(dragger);
    form.appendChild(formName);
    // form.appendChild(formLinkLabel);
    form.appendChild(formLink);
    form.appendChild(editBtn);

    if (isNew) editBtn.click();
}

const refreshProfiles = (index = null) =>
{
    const socialContainer = document.getElementById('socials');
    if (index)
    {
        const child = Array.from(socialContainer.children)[index];
        socialContainer.removeChild(child);
        addSocialForm(index + 1, user.socials[index].name, user.socials[index].link)
        return;
    }
    Array.from(socialContainer.children).forEach(e =>
    {
        socialContainer.removeChild(e);
    })
    user.socials.forEach((e, i) =>
    {
        addSocialForm(i + 1, e.name, e.link);
    })
}

const loginIntervalCheck = id =>
{
    fetch('/api/cookies/request/_id').then(result => result.json())
        .then(resultJson =>
        {
            const _id = resultJson?.doc?._id;
            if (id != _id) location.reload();
        })
        .catch(() => location.reload());
}
//Fetch user info on page load
const fetchSocials = async () =>
{
    await fetch('/api/dashboard/request').then(res =>
    {
        if (res.status != 200) return location.replace('/p/login');

        res.json().then(resJson =>
        {
            const profile = resJson.profile;
            setInterval(() => loginIntervalCheck(profile._id), 10000);

            user.id = profile._id;
            user.displayName.value = profile.displayName;
            user.location.value = profile.location;
            user.bio.value = profile.bio;
            user.color.value = profile.color;
            user.socials = profile.socials;
            initColor();
            //Set Preset Avatar Image
            fetch(`/api/files/${profile.avatar}`)
                .then(avatar => avatar.blob())
                .then(blob =>
                {
                    const url = URL.createObjectURL(blob);
                    user.avatarDisplay.src = url;
                    user.avatarDisplay.addEventListener('click', () => user.avatar.click());
                    user.avatar.addEventListener('change', async (e) =>
                    {
                        optimizeImg(e, 'imageToUpload', 'avatarDisplay');
                    })
                })
            refreshProfiles();
        }).catch((err) => console.log(err));
    }).catch(err => console.log(err));
}
document.querySelector('body').onload = async () =>
{
    fetchSocials();
    fetch('/api/dashboard/request/username').then(res =>
    {
        res.json().then(resJson =>
        {
            const username = resJson.username;
            const userLink = document.getElementById('user-link');
            
            const portName = location.port ? ':' + location.port : '';
            const profileUrl = location.origin + '/' + username;
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
    addSocialForm(index, '', '', true);
})
generalSubmitButton.addEventListener('click', (e) =>
{
    e.preventDefault();
    const form = document.getElementById('general-info');
    const formData = new FormData(form);
    formData.delete('avatar');
    if (user.imageToUpload) formData.append('avatar', user.imageToUpload, 'avatar.jpeg');

    fetch('/api/dashboard/request', {
        method: 'PUT',
        headers: {
            // 'Content-Type': 'application/json'
        },
        body: formData//JSON.stringify(newVals)
    }).then(res => console.log(res)).catch(err => console.log(err))
})

const errorContainer = document.getElementById('error-container');
const errorMsg = document.getElementById('error-msg');
const errorExit = document.getElementById('error-exit');
errorExit.onclick = () => errorContainer.classList.add('invisible');

const setErrorMsg = ((msg = 'An error has occurred.') =>
{
    errorContainer.classList.remove('invisible');
    errorMsg.innerText = msg;
})