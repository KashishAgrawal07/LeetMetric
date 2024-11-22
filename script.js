document.addEventListener("DOMContentLoaded", function(){

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgress = document.querySelector(".easy");
    const mediumProgress = document.querySelector(".medium");
    const hardProgress = document.querySelector(".hard");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats");

    //returns true or false based on a regex(for leetcode)
    function validateUsername(username){
        if(username.trim() === ""){
            alert("username cannot be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9._]{1,30}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Enter valid username");
        }
        return isMatching;
    }

        //calling the API 
    async function fetchUserDetails(username){
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{

            searchButton.textContent = "searching...";
            searchButton.disabled = true;

           // const response = await fetch(url);
           // const targetUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;

            const response = await fetch(url);

            if(!response.ok){
                throw new Error("unable to fetch user details");
            }

            const data = await response.json();
            console.log("Logging data: ",data);

            displayUserData(data);
        }catch(error){
            statsContainer.innerHTML = `<p>${error.message}</p>`;
        }
        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved,total,label,circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(data){

        //fetching the data from json query
        const totalQues = data.totalQuestions;
        const totalEasy = data.totalEasy;
        const totalMedium = data.totalMedium;
        const totalHard = data.totalHard;

        const solvedTotal = data.totalSolved;
        const solvedEasy = data.easySolved;
        const solvedMedium = data.mediumSolved;
        const solvedHard = data.hardSolved;

        //Piechart Container
        updateProgress(solvedEasy,totalEasy,easyLabel,easyProgress);
        updateProgress(solvedMedium,totalMedium,mediumLabel,mediumProgress);
        updateProgress(solvedHard,totalHard,hardLabel,hardProgress);

        //cardContainer
        const cardsData = [{label: "Overall Solved", value: solvedTotal},
            {label: "Easy Solved", value: solvedEasy},
            {label: "Medium Solved", value: solvedMedium},
            {label: "Hard Solved", value: solvedHard}
        ];

        console.log("Card data: ",cardsData);

        cardStatsContainer.innerHTML = cardsData.map(
            data => 
                `<div class = "card">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
                </div>`
            
        ).join("")
        
    }

    //fetching value of username textbox
    searchButton.addEventListener('click',function(){
        const username = usernameInput.value;
        console.log("Login username: ",username);

        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    });


});