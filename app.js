const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".message");

// Populating Dropdowns with Currency Codes
for(let select of dropdowns){
    for(currCode in countryList){
       let newOption = document.createElement("option");
       newOption.innerText = currCode;
       newOption.value = currCode;

       //The below if else will make sure to put USD as default in from dropdown and INR in to dropdown
       if(select.name === "from" && currCode ==="USD"){
        newOption.selected = "selected";
       }else if(select.name === "to" && currCode ==="INR"){
        newOption.selected = "selected";
       }
       select.append(newOption);
    }
    select.addEventListener("change", (evt) =>{
        updateFlag(evt.target);
    })
}


//This code will be used to update the flag acc to the country code
// Breakdown:
// evt.target: When the "change" event occurs (i.e., when the user selects a different currency from the dropdown), evt.target represents the dropdown element that triggered the event. This is passed to the updateFlag function as the element argument.
// So, in context:
// If you are selecting a currency from the "from" dropdown, element will refer to the "from" <select> element.
// If you are selecting a currency from the "to" dropdown, element will refer to the "to" <select> element.
const updateFlag = (element)=>{
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img =  element.parentElement.querySelector("img");
    img.src = newSrc;
}

// btn.addEventListener("click", async (evt)=>{
//     evt.preventDefault();
// //     evt represents the event object associated with the button click.
// // preventDefault() is called to prevent the default behavior of the button, which in this case might be submitting a form and causing the page to refresh. This ensures that the currency conversion process happens without reloading the page.

//     let amount = document.querySelector(".amount input");
//     let amtVal = amount.value;

//     if(amtVal ==="" || amtVal<1){
//         amtVal = 1;
//         amount.value = 1;
//     }
    
//     const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

// //   fetch(URL): This sends an asynchronous HTTP request to the API URL to get the exchange rates.
// //   await: The code waits for the API's response without blocking other code. It ensures that the next line (parsing the JSON) doesn't execute until the response has been received.
// // response.json(): Once the response is received, it is parsed as JSON data, which is stored in the variable data.
//     let response = await fetch(URL);
//     let data = await response.json();
//     // Now we will fetch the rate
//     let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()]; 
//     let finalAmount = amtVal * rate;
//     msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
// });


// below is the code with fallback CSSConditionRule
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();  // Prevents page refresh

    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    // Validate amount input (fallback if invalid input is given)
    if (amtVal === "" || amtVal < 1) {
        amtVal = 1;
        amount.value = 1;
    }

    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

    try {
        // Fetch the exchange rate data from the API
        let response = await fetch(URL);

        // Fallback in case the response is not OK (non-200 status)
        if (!response.ok) {
            throw new Error(`Error fetching exchange rate: ${response.status}`);
        }

        let data = await response.json();

        // Check if the exchange rate exists in the data (fallback for invalid currency codes)
        if (!data[fromCurr.value.toLowerCase()] || !data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()]) {
            throw new Error("Invalid currency pair. Please select valid currencies.");
        }

        // Fetch the conversion rate
        let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
        let finalAmount = amtVal * rate;

        // Display the result
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

    } catch (error) {
        // Fallback code to handle errors (e.g., network issues, invalid data)
        console.error("Error occurred:", error);
        msg.innerText = "Sorry, an error occurred. Please try again later.";
    }
});
