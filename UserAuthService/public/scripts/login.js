// const axios = require('axios').default
document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const submitButton = document.getElementById("submit-button");
    const flashMessage = document.getElementById('flash-message');

    submitButton.addEventListener('click', async function(e){
        e.preventDefault()
        const url = 'http://localhost:9602/meal-api/v1/auth/login'
        const email = emailInput.value;
        const password = passwordInput.value
        const details = {
            email, password
        }

        try {
            const response = await axios.post(url, details)
            console.log(response)
            console.log('Success')
        } catch (error) {
            if(error){
                console.log(error);
            }
        }
    })
    
})

