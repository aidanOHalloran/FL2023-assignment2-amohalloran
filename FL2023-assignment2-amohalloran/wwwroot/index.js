$(document).ready(function () {
    const timeButton = $("#timeButton");
    const timeDialog = $("#time");

    // Function to get the url of the first item returned from a bing search
    function getFirstResult() {
        let results = ""; // Clear the results variable for each new search

        var params = {
            q: $("#query").val(),
            count: "50",
            offset: "0",
            mkt: "en-us",
        };

        $.ajax({
            url: "https://api.bing.microsoft.com/v7.0/search?" + $.param(params),
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader(
                    "Ocp-Apim-Subscription-Key",
                    "75f75ee9f84448b1814b1fd9621aeb85"
                );
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Region", "global");
            },
            type: "GET",
        }).done(function (data) {
            console.log(params.q);
            searchResults = data.webPages.value; // Store the search results
            currentResultIndex = 0; // Reset the current result index

            // go to url of first result
            goToFirstResult(currentResultIndex);
        })
            .fail(function () {
                alert("error");
            });
    }

    //Function to go to first result
    function goToFirstResult() {
        var url = searchResults[0].url;
        console.log(url);
        window.open(url, '_blank');
    }

    //event listener for clicking the I'm Feeling Lucky button
    $("#luckyBtn").on("click", function () {
        getFirstResult();
    });

    // Function to get and format the current time
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        return hours + ":" + minutes;
    }

    // Event listener for clicking the time button
    timeButton.on("click", function () {
        const currentTime = getCurrentTime();
        $("#time").css("visibility", "visible");
        timeDialog.text(currentTime); // Set the time text
        timeDialog.dialog({
            autoOpen: true,
            modal: true,
            title: "Current Time:",
            buttons: {
                Close: function () {
                    $(this).dialog("close");
                },
            },
            close: function () {
                $(this).dialog("destroy").css("display", "none");
            },
        });
    });

    const searchEngineName = document.getElementById("searchEngineName");

    // Array of background image URLs
    const backgroundImages = [
        "https://images.unsplash.com/photo-1573868507561-c859b3ce5818?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3687&q=80",
        "https://images.unsplash.com/photo-1585441694812-6f21997b88ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2816&q=80",
        "https://images.unsplash.com/photo-1567446042105-d18dc59d4677?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNyaW1zb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    ];

    let currentIndex = 0;

    // Create a dialog element
    const dialogElement = $("#searchResults");
    dialogElement.dialog({
        autoOpen: false,
        position: { my: "top", at: "bottom+20", of: '#luckyBtn' },
        width: 600,
    });


    const searchBtn = document.getElementById("searchBtn");
    searchBtn.addEventListener("click", apiSearch);

    // Store the search results and current result index
    let searchResults = [];
    let currentResultIndex = 0;

    function changeBackground() {
        document.body.style.backgroundImage = `url('${backgroundImages[currentIndex]}')`;
        currentIndex = (currentIndex + 1) % backgroundImages.length; // Cycle through images
    }

    // Event listener for clicking the search engine name
    searchEngineName.addEventListener("click", changeBackground);

    function apiSearch() {
        let results = ""; // Clear the results variable for each new search

        var params = {
            q: $("#query").val(),
            count: "50",
            offset: "0",
            mkt: "en-us",
        };

        $.ajax({
            url: "https://api.bing.microsoft.com/v7.0/search?" + $.param(params),
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader(
                    "Ocp-Apim-Subscription-Key",
                    "75f75ee9f84448b1814b1fd9621aeb85"
                );
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Region", "global");
            },
            type: "GET",
        })
            .done(function (data) {
                console.log(params.q);
                searchResults = data.webPages.value; // Store the search results
                currentResultIndex = 0; // Reset the current result index

                // Display the first result
                displayResult(currentResultIndex);

                // Open the dialog after setting the content
                dialogElement.dialog("open");

                //set search results to visible
                dialogElement.css("visibility", "visible");
            })
            .fail(function () {
                alert("error");
            });
    }

    // Function to display a specific result
    function displayResult(index) {
        const result = searchResults[index];
        const resultContent =
            '<p id="resultsP"><a href="' +
            result.url +
            '">' +
            result.name +
            "</a>: " +
            result.snippet +
            "</p>";
        $("#searchResultContent").html(resultContent);
    }

    // Handle clicking the "Next" button
    $("#nextResultBtn").on("click", function () {
        if (currentResultIndex < searchResults.length - 1) {
            currentResultIndex++;
            displayResult(currentResultIndex);
        }
    });

    // Handle clicking the "Previous" button
    $("#previousResultBtn").on("click", function () {
        if (currentResultIndex > 0) {
            currentResultIndex--;
            displayResult(currentResultIndex);
        }
    });
});