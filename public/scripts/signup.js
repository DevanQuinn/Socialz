const body = document.querySelector('body');
const button = document.getElementsByClassName('form-submit')[0];
const form = document.querySelector('form');

const errors = [];

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /\d/;

// Used to keep track of validation requirements and error messages
const formInputs =
[
    {
        node: document.getElementById('email'),
        errorNode: document.getElementById('email-error'),
        value: '',
        conditions: [
            { condition(value) { return !(emailRegex.test(value.toLowerCase())) } }
        ]
        ,
        message: ['Email invalid.'],
    },
    {
        node: document.getElementById('username'),
        errorNode: document.getElementById('username-error'),
        value: '',
        conditions: [{ condition(value) { return value.includes[' '] } }],
        message: ['Username must not contain whitespaces.']
        },
    {
        node: document.getElementById('password'),
        errorNode: document.getElementById('password-error'),
        value: '',
        conditions: [
            { condition(value) { return value.length < 6 }, },
            { condition(value) { return !(passwordRegex.test(value)) } }
        ],
        message: ['Password must be longer than 6 characters.', 'Password must contain at least one digit.']
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


//Unused rn, maybe in future
const invalidateMsg = (element, index = 0, msg = 'An error has occurred.') =>
{
    const errorId = element.node.getAttribute('id') + String(index);
    let errorNode = document.getElementById(errorId);
    if (!errorNode)
    {
        errorNode = document.createElement('h4');
        errorNode.setAttribute('id', errorId);
        errorNode.setAttribute('class', 'error');
        const errorFlex = document.getElementById('error-flex' + String(formInputs.indexOf(element) + 1));
        errorFlex.appendChild(errorNode);
    }
    errorNode.innerText = msg;
    errorNode.style.color = 'red';

    element.node.addEventListener('input', () => errorNode.remove());
}

// Checks for errors in the corresponding input object; if there is one, a message will be added containing the specified error. 
//If not, a text field with a green checkmark will display.
const checkError = (element, dependency = undefined) =>
{
    let errorsLocal = [];
    let isValid = true;
    element.conditions.forEach((e, i) =>
    {
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
            //isValid = true;
        };
        element.errorNode.innerText = isValid ? '✔' : null;
    })
    if (dependency && element.value !== '') checkError(dependency);
    return errorsLocal.length == 0;
}

// Honestly a pretty bad way to check if all form inputs are valid
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

const backError = document.getElementById('backend-error');

// Checks for errors and enables button accordingly based on each key typed
formInputs.forEach((element, index) =>
{
    element.node.addEventListener('input', () =>
    {
        //if (backError) backError.innerText = null;
        element.value = element.node.value;
        validArr[index] = checkError(element, element.dependency);
        button.disabled = !((errors.length == 0) && isValidArr());
    })
})

body.onload = () =>
{
    document.getElementById('email').focus();
}

//Responds to backend validation which responds w a query if failed
const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);
const text = searchParams.has('error');

if (text)
{
    backError.innerText = 'An error has occurred during sign up.';
    formInputs[0].node.addEventListener('input', () => backError.innerText = null);
} if (searchParams.has('email'))
{
    invalidateMsg(formInputs[0], 0, 'Email already in use.');
} if (searchParams.has('username'))
{
    invalidateMsg(formInputs[1], 0, 'Username already taken.');
}
