
const token = location.pathname.split('/')[3];
const form = document.getElementsByClassName('reset-form')[0];
const password1 = document.getElementById('password1');
const password2 = document.getElementById('password2');
const submitBtn = document.getElementById('submit');
const success = document.getElementById('success');
const failure = document.getElementById('failure');

submitBtn.addEventListener('click', e =>
{
    e.preventDefault();
    const body = { password1: password1.value, password2: password2.value };
    password1.value = '';
    password2.value = '';
    fetch(`/api/reset/request/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(resJson =>
    {
        const targetText = resJson.status == 204 ? success : failure;
        if (resJson.message) targetText.innerText = resJson.message;
        targetText.classList.remove('hidden');
        const handleInput = () => targetText.classList.add('hidden');
        password1.addEventListener('input', handleInput);
        password2.addEventListener('input', handleInput);
    })
})