fetch('/cookies/api').then(res =>
{
    if (res.status == 200) location.href = '/p/dashboard';
    else return;
})

const button = document.getElementsByClassName('form-submit')[0];
let buttonDisabled = true;
button.disabled = buttonDisabled;

const username = document.getElementById('username');
const password = document.getElementById('password');
const errorNode = document.getElementById('backend-error');

const inputValidate = () =>
{
    buttonDisabled = !(username.value != '' && password.value != '');
    button.disabled = buttonDisabled;
}

username.addEventListener('input', inputValidate);
password.addEventListener('input', inputValidate);

const credentialFetch = async () =>
{
    credentials = { username: username.value, password: password.value };
    await fetch('/api/login/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(async res =>
    {
        if (res.status == 200)
        {
            location.href = '/p/dashboard';
        }
        else
        {
            const inputRemove = (e) =>
            {
                errorNode.innerText = null;
                e.target.removeEventListener('input', inputRemove);
            }
            username.addEventListener('input', inputRemove);
            password.addEventListener('input', inputRemove);
            password.value = null;
            buttonDisabled = true;
            button.disabled = buttonDisabled;
            errorNode.innerText = 'Username or password incorrect.'
        }
    }).catch(err => console.log(err))
}

button.addEventListener('click', (e) =>
{
    e.preventDefault();
    if (buttonDisabled) return;
    credentialFetch();
})

document.querySelector('body').onload = () =>
{
    document.getElementById('username').focus();
}