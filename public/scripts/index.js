const leftSideAccount = document.getElementById('left-account');
const rightSideAccount = document.getElementById('right-account');
const mainBtn = document.getElementById('heading-btn');

leftSideAccount.onclick = () => location.href = '/p/login';
rightSideAccount.onclick = () => location.href = '/p/signup';


const token = localStorage.getItem('token');

fetch('/cookies/api/username').then(res =>
{
    res.json().then( resJson =>
    {
        leftSideAccount.firstChild.remove();
        rightSideAccount.firstChild.remove();
        leftSideAccount.innerText = 'Logout';
        rightSideAccount.innerText = resJson.doc.username[0];

        mainBtn.innerText = 'Go to Dashboard';
        mainBtn.parentNode.href = '/p/dashboard';

        leftSideAccount.addEventListener('click', () =>
        {
            fetch('/cookies/api', { method: 'DELETE' })
            location.reload();
        })
        rightSideAccount.addEventListener('click', () => location.href = '/p/dashboard')
    }).catch(() =>
    {
        leftSideAccount.innerText = 'Login';
        rightSideAccount.innerText = 'Sign Up';
    })
}).catch(err => console.log(err))