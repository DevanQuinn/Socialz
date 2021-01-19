

const form = document.getElementsByClassName('reset-form')[0];
const emailNode = document.getElementById('input');
const submitBtn = document.getElementById('submit');

submitBtn.addEventListener('click', (e) => 
{
    e.preventDefault();
    const email = emailNode.value
    emailNode.value = '';
    emailNode.blur();
    const url = location.origin;
    fetch('/api/reset/request', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, url })
    }).then(res =>
    {
        const msg = document.querySelector('p');
        msg.classList.remove('hidden');
        emailNode.addEventListener('input', () => msg.classList.add('hidden'));
    })
    
})