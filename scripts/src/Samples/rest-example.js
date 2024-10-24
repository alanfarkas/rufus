Survey.StylesManager.applyTheme("modern");

var json = {
    elements: [
        {
            type: "dropdown",
            name: "country",
            title: "Select the country...",
            isRequired: true,
            choicesByUrl: {
                url: "https://restcountries.eu/rest/v2/all",
                valueName: "name",
            },
        },
        {
            type: "panel",
            name: "panel_countriesByRegion",
            title: "Show countries by region",
            elements: [
                {
                    type: "dropdown",
                    name: "region",
                    title: "Select the region...",
                    choices: [
                        "Africa",
                        "Americas",
                        "Asia",
                        "Europe",
                        "Oceania",
                    ],
                },
                {
                    type: "dropdown",
                    name: "reg_country",
                    title: "Select the country...",
                    isRequired: true,
                    choicesByUrl: {
                        url: "https://restcountries.eu/rest/v2/region/{region}",
                        valueName: "name",
                    },
                },
            ],
        },
    ],
};

window.surveyModel = new Survey.Model(json);

surveyModel.onComplete.add(function (result) {
    document.querySelector("#surveyResult").textContent =
        "Result JSON:\n" + JSON.stringify(result.data, null, 3);
});

$("#surveyElement").Survey({ model: surveyModel });
