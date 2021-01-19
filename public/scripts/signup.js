const body = document.querySelector('body');
const button = document.getElementsByClassName('form-submit')[0];
//const form = document.getElementsByClassName('form')[0];

const errors = [];

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const usernameRegex = /[^A-Za-z0-9]+/;
const passwordRegex = /\d/;

// Used to keep track of validation requirements and error messages
const formInputs =
[
    {
        node: document.getElementById('email'),
        errorNode: document.getElementById('email-error'),
        value: '',
        conditions: [{ condition(value) { return !(emailRegex.test(value.toLowerCase())) } }],
        message: ['Email invalid.'],
    },
    {
        node: document.getElementById('username'),
        errorNode: document.getElementById('username-error'),
        value: '',
        conditions: [{ condition(value) { return (usernameRegex.test(value)) } }, { condition(value) { return value.length > 16 } }],
        message: ['Username may only contain letters and numbers.', 'Username must not be more than 16 characters.']
        },
    {
        node: document.getElementById('password1'),
        errorNode: document.getElementById('password-error'),
        value: '',
        conditions: [
            { condition(value) { return value.length < 6 }, },
            { condition(value) { return !(passwordRegex.test(value)) } }
        ],
        message: ['Must be longer than 6 characters.', 'Must contain at least one digit.']
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

let validArr = [false, false, false, false];
//Used for displaying error messages under specific form input fields
const invalidateMsg = (element, index = 0, msg = 'An error has occurred.') =>
{
    let errorId;
    if (element)
    {
        errorId = element.node.getAttribute('id') + String(index);
        element.errorNode.innerText = null;
    } else errorId = 'backend-error';
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
    validArr[formInputs.indexOf(element)] = false;
    if (element) element.node.addEventListener('input', () => errorNode.remove());
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
            errorNode.innerText = '• ' + element.message[i];
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

let cannotBeEnabled = true;

const changeButtonStatus = (condition, callback = null) =>
{
    cannotBeEnabled = callback || condition;
    button.disabled = cannotBeEnabled;
}

// Checks for errors and enables button accordingly based on each key typed
formInputs.forEach((element, index) =>
{
    element.node.value = '';
    element.node.addEventListener('input', () =>
    {
        //if (backError) backError.innerText = null;
        element.value = element.node.value;
        validArr[index] = checkError(element, element.dependency);
        // cannotBeEnabled = !((errors.length == 0) && isValidArr());
        // button.disabled = cannotBeEnabled;
        changeButtonStatus(!((errors.length == 0) && isValidArr()));
    })
})

const dynamicFetch = async (obj, index, msg) => 
{
    const canNow = cannotBeEnabled;
    changeButtonStatus(true);
    const prevVal = obj.email || obj.username;
    await fetch('/api/signup/submit/usercheck', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    }).then(async res =>
    {
        const resJson = await res.json();
        if (resJson && prevVal == formInputs[index].value)
        {
            invalidateMsg(formInputs[index], 0, msg)
        }
        else changeButtonStatus(canNow);
    }).catch(err => console.log(err));
}

//Checks for username availability when user leaves the input field
formInputs[0].node.addEventListener('input', () => dynamicFetch({ email: formInputs[0].value }, 0, 'Email already in use.'));
formInputs[1].node.addEventListener('input', () => dynamicFetch({ username: formInputs[1].value }, 1, 'Username taken.'));

const signUpFetch = async (e) =>
{
    e.preventDefault();
    button.disabled = true;
    if (cannotBeEnabled) return;
    let credentials = {};
    formInputs.forEach((val) =>
    {
        const name = val.node.getAttribute('id');
        credentials[name] = val.value;
    });
    await fetch('/api/signup/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    }).then(async res =>
    {
        const resJson = await res.json();
        if (res.status == 201)
        {
            location.href = '/p/dashboard';
        }
        else if (resJson.success == false)
        {
            button.disabled = cannotBeEnabled;
            resJson.issues.forEach(val =>
            {
                console.log(val);
                invalidateMsg(formInputs[val.id], 0, val.msg)
            })
        } else console.log(resJson.status)
    }).catch(err => console.log(err))
}
button.onclick = signUpFetch;