const button = document.getElementsByClassName('form-submit')[0];
const form = document.querySelector('form');

const usernames = ['devan', 'joe'];
const emails = ['devan@gmail.com', 'joe@gmail.com']

const errors = [];

const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const formInputs =
[
    {
        node: document.getElementById('email'),
        errorNode: document.getElementById('email-error'),
        value: '',
        conditions: [
            { condition(value) { return emails.includes(value) } },
            { condition(value) { return !(regex.test(value.toLowerCase())) } }
        ]
        ,
        message: ['Email already in use.', 'Email invalid.'],
    },
    {
        node: document.getElementById('username'),
        errorNode: document.getElementById('username-error'),
        value: '',
        conditions: [{ condition(value) { return usernames.includes(value) } }],
        message: ['Username already taken.']
        },
    {
        node: document.getElementById('password'),
        errorNode: document.getElementById('password-error'),
        value: '',
        conditions: [{ condition(value) { return value.length < 6 } }],
        message: ['Password must be longer than 6 characters.']
        },
    {
        node: document.getElementById('password2'),
        errorNode: document.getElementById('password2-error'),
        value: '',
        conditions: [{ condition(value) { return value !== formInputs[2].value } }],
        message: ['Passwords must match.'],
    },
    ]

formInputs[2].dependency = formInputs[formInputs.length - 1];

const checkError = (element, dependency = undefined) =>
{
    element.conditions.forEach((e, i) =>
    {
        let isValid;
        const errorId = element.node.getAttribute('id') + String(i);
        if (e.condition(element.value))
        {
            let errorNode = document.getElementById(errorId);
            if (!errorNode)
            {
                errorNode = document.createElement('h4');
                errorNode.setAttribute('id', errorId);
                errorNode.setAttribute('class', 'error');
                element.node.parentNode.parentNode.appendChild(errorNode);
            }
            errorNode.innerText = element.message[i];
            errorNode.style.color = 'red';
            if (!errors.includes(element.message[i])) errors.push(element.message[i]);
        }
        else
        {
            if (errors.includes(element.message[i]))
            {
                errors.splice(errors.indexOf(element.message), 1);
                const errorNode = document.getElementById(errorId);
                errorNode.innerText = null;
            }
            element.errorNode.style.color = 'green';
        };
        isValid = (errors.length === 0) && (element.node.checkValidity());
        element.errorNode.innerText = isValid ? '✔' : null;
    })
    if (dependency && element.value !== '') return checkError(dependency);
}

const checkIfFilled = () =>
{
    for (let i in formInputs)
    {
        if (formInputs[i].value == '') {
            return false;
        }
    }
    return true;
}


formInputs.forEach((element) =>
{
    element.node.oninput = () =>
    {
        element.value = element.node.value;
        checkError(element, element.dependency);
        button.disabled = !(errors.length === 0 && form.checkValidity());
    }
})
