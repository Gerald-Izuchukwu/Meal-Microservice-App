document.addEventListener("DOMContentLoaded", function () {
    const selectButton = document.getElementById("select-button");
    const selectedFood = document.getElementById('foods')
    const foodList = document.getElementsByClassName('food-list')
    const buyFoodButton = document.getElementsByClassName('buy-food')

    selectButton.addEventListener('click', async function (e){
        e.preventDefault()
        // buyFoodButton.style.display = 'block'

        console.log(selectedFood.value)
        const url = `http://localhost:9601/meal-api/v1/food/get-food-type?type=${selectedFood.value}`
        console.log('yes');
        // const url = `http://localhost:9601/meal-api/v1/food/get-food-type?type=soups`

        const response = await axios.get(url)
        console.log(response)
        foodList.style.display = "block"
        buyFoodButton.childElement.innerHTML = "Buy Selected Food"

    })



})

        // function clearFeilds() {
        //     firstNameInput.value = ''
        //     lastNameInput.value = ''
        //     emailInput.value = ''
        //     newPasswordInput.value=''
        //     submitButton.style.display = "none"
        // }