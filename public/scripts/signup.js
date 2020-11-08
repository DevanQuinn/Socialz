const button = document.getElementsByClassName('form-submit')[0];
const message = document.getElementById('message');
const usernames = ['devan', 'joe'];
const emails = ['devan@gmail.com', 'joe@gmail.com']

const errors = [];

const formInputs =
[
    {
        node: document.getElementById('email'),
        value: '',
        condition() { return emails.includes(this.value) },
        message: 'Email already in use.'
    },
    {
        node: document.getElementById('username'),
        value: '',
        condition() { return usernames.includes(this.value) },
        message: 'Username already taken.'
        },
    {
        node: document.getElementById('password'),
        value: '',
        condition() { return this.value.length< 6 },
        message: 'Password must be longer than 6 characters.'
        },
    {
        node: document.getElementById('password2'),
        value: '',
        condition() { return this.value.length !== formInputs[2].value },
        message: 'Passwords must match.'
    },
]

const checkError = (element) =>
{
    if (element.condition())
    {
        message.innerText = element.message;
        if (!errors.includes(element.message)) errors.push(element.message);
    }
    else if (errors.includes(element.message)) errors.splice(errors.indexOf(element.message), 1);

}

formInputs.forEach((element) =>
{
    element.node.onblur = () =>
    {
        element.value = element.node.value;
        checkError(element);
        if (errors.length === 0)
        {
            button.disabled = false;
            message.innerText = 'No error';
        } else button.disabled = true;
    }
})


