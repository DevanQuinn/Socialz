fetch('/cookies/api').then(res =>
{
    if (res.status == 200) location.replace('/p/dashboard');
    else return;
})

const button = document.getElementsByClassName('form-submit')[0];
let cannotBeEnabled = true;
button.disabled = cannotBeEnabled;

const username = document.getElementById('username');
const password = document.getElementById('password');
const errorNode = document.getElementById('backend-error');

const inputValidate = () =>
{
    cannotBeEnabled = !(username.value != '' && password.value != '');
    button.disabled = cannotBeEnabled;
}

username.addEventListener('input', inputValidate);
password.addEventListener('input', inputValidate);

const credentialFetch = async () =>
{
    button.disabled = true;
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
            cannotBeEnabled = true;
            button.disabled = cannotBeEnabled;
            errorNode.innerText = 'Username or password incorrect.'
        }
    }).catch(err => console.log(err))
    button.disabled = cannotBeEnabled;
}

button.addEventListener('click', (e) =>
{
    e.preventDefault();
    if (cannotBeEnabled) return;
    credentialFetch();
})

document.querySelector('body').onload = () =>
{
    document.getElementById('username').focus();
}