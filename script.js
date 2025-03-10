document.getElementById("countryForm").addEventListener("submit", function (event) {
    event.preventDefault();
  
    // assign variables 
    const countryName = document.getElementById("countryName").value;
    const countryInfo = document.getElementById("countryStuff");
    const borderingCountries = document.getElementById("borders");
    // set the strings to empty again
    countryInfo.innerHTML = "";
    borderingCountries.innerHTML = "";
    //if blank entry show error.
    if (!countryName) {
      alert("enter a country name");
      return;
    }
    // fetch data ffrom api
    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`).then((response) => {
        return response.json();
      }).then((data) => {
        const country = data[0];

        //assigning variables from json
        const capital = country.capital; 
        const population = country.population; 
        const region = country.region;
        const flag = country.flags;

        // displaying country info in html
        countryInfo.innerHTML = `
          <h2>details about the country</h2>
          <p><strong>capital city:</strong> ${capital}</p>
          <p><strong>countries population:</strong> ${population}</p>
          <p><strong>subregion:</strong> ${region}</p>
          <p><strong>flag:</strong> <img src="${country.flags.png}" ></p>
        `;

        // bordering countries
        const neighbours = country.borders;
        if (country.borders&& country.borders.length>0) {
          const neighbourInfo = neighbours.map(async (border) => {
            
              const response = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
              const neighbourData = await response.json();
              const neighbourCountry = neighbourData[0];
              const neighbourFlag = neighbourCountry.flags;
              return `
                    <p>
                      ${neighbourCountry.name.common} 
                      <img src="${neighbourCountry.flags.png}" width = 100px>
                    </P>
                  `;
            });
            // display the neighbouring countries and flags
          Promise.all(neighbourInfo).then((results) => {
              borderingCountries.innerHTML = `
                <h3>countries sharing border</h3>
                <ul>${results.join("")}</ul>
              `;
            })
        } else {
            const li = document.createElement('li');
            li.textContent = 'no borders';
            borderingCountries.appendChild(li);
        }
      }).catch((error) => {
        countryInfo.innerHTML = "<p>Error: " + error.message + "</p>";
      });
  });
  