const body = document.querySelector('body');
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
    let errorsLocal = [];
    element.conditions.forEach((e, i) =>
    {
        let isValid = false;
        const errorId = element.node.getAttribute('id') + String(i);
        if (e.condition(element.value))
        {
            let errorNode = document.getElementById(errorId);
            if (!errorNode)
            {
                errorNode = document.createElement('h4');
                errorNode.setAttribute('id', errorId);
                errorNode.setAttribute('class', 'error');
                const errorFlex = document.getElementById('error-flex' + String(formInputs.indexOf(element) + 1));
                errorFlex.appendChild(errorNode);
            }
            errorNode.innerText = element.message[i];
            errorNode.style.color = 'red';
            if (!errors.includes(element.message[i])) { errors.push(element.message[i]); errorsLocal.push(element.message[i]) };
            isValid = false;
        }
        else
        {
            if (errors.includes(element.message[i]))
            {
                errors.splice(errors.indexOf(element.message[i]), 1);
                errorsLocal.splice(errors.indexOf(element.message[i]), 1);
                const errorNode = document.getElementById(errorId);
                errorNode.innerText = null;
            }
            element.errorNode.style.color = 'green';
            isValid = true;
        };
        element.errorNode.innerText = isValid ? '✔' : null;
    })
    if (dependency && element.value !== '') checkError(dependency);
    return errorsLocal.length == 0;
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


let validArr = [false, false, false, false];
const isValidArr = () =>
{
    for (let i in validArr)
    {
        if (validArr[i] == false)
        {
            return false
        }
    }
    return true;
}

formInputs.forEach((element, index) =>
{
    element.node.oninput = () =>
    {
        element.value = element.node.value;
        validArr[index] = checkError(element, element.dependency);
        button.disabled = !((errors.length == 0) && isValidArr());
    }
})

body.onload = () =>
{
    document.getElementById('email').focus();
}