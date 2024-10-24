Survey.StylesManager.applyTheme("darkblue");

var json = {
    elements: [
        {
            type: "dropdown",
            renderAs: "select2",
            hasOther: true,
            choicesByUrl: {
                url: "https://restcountries.eu/rest/v2/all",
            },
            name: "countries",
            title: "Please select the country you have arrived from:",
        },
    ],
};

window.surveyModel = new Survey.Model(json);

surveyModel.onComplete.add(function (result) {
    document.querySelector("#surveyResult").textContent =
        "Result JSON:\n" + JSON.stringify(result.data, null, 3);
});

//var authToken = "My token";
//Survey.ChoicesRestfull.onBeforeSendRequest = function (sender, options) {
//    options.request.setRequestHeader("Authorization", "Bearer " + authToken);
//};

surveyModel.data = {
    countries: "Aruba",
};

$("#surveyElement").Survey({ model: surveyModel });
