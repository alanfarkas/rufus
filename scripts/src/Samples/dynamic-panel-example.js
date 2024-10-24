Survey.StylesManager.applyTheme("darkblue");

var json = {
    pages: [
        {
            name: "page1",
            elements: [
                {
                    type: "paneldynamic",
                    name: "relatives",
                    title: "Please enter all blood relatives you know",
                    renderMode: "progressTop",
                    templateTitle: "Information about: {panel.relativeType}",
                    templateElements: [
                        {
                            name: "relativeType",
                            type: "dropdown",
                            title: "Relative",
                            choices: [
                                "father",
                                "mother",
                                "brother",
                                "sister",
                                "son",
                                "dauhter",
                            ],
                            isRequired: true,
                        },
                        {
                            name: "isalive",
                            type: "radiogroup",
                            title: "Alive?",
                            startWithNewLine: false,
                            isRequired: true,
                            colCount: 0,
                            choices: ["Yes", "No"],
                        },
                        {
                            name: "liveage",
                            type: "dropdown",
                            title: "Age",
                            isRequired: true,
                            startWithNewLine: false,
                            visibleIf: "{panel.isalive} = 'Yes'",
                            choicesMin: 1,
                            choicesMax: 115,
                        },
                        {
                            name: "deceasedage",
                            type: "dropdown",
                            title: "Deceased Age",
                            isRequired: true,
                            startWithNewLine: false,
                            visibleIf: "{panel.isalive} = 'No'",
                            choices: [
                                {
                                    value: -1,
                                    text: "Unknown",
                                },
                            ],
                            choicesMin: 1,
                            choicesMax: 115,
                        },
                        {
                            name: "causeofdeathknown",
                            type: "radiogroup",
                            title: "Cause of Death Known?",
                            isRequired: true,
                            colCount: 0,
                            startWithNewLine: false,
                            visibleIf: "{panel.isalive} = 'No'",
                            choices: ["Yes", "No"],
                        },
                        {
                            name: "causeofdeath",
                            type: "text",
                            title: "Cause of Death",
                            isRequired: true,
                            startWithNewLine: false,
                            visibleIf:
                                "{panel.isalive} = 'No' and {panel.causeofdeathknown} = 'Yes'",
                        },
                        {
                            type: "panel",
                            name: "moreInfo",
                            state: "expanded",
                            title: "Detail Information about: {panel.relativeType}",
                            elements: [
                                {
                                    type: "matrixdynamic",
                                    name: "relativeillness",
                                    title: "Describe the illness or condition.",
                                    rowCount: 0,
                                    columns: [
                                        {
                                            name: "illness",
                                            cellType: "dropdown",
                                            title: "Illness/Condition",
                                            choices: [
                                                "Cancer",
                                                "Heart Disease",
                                                "Diabetes",
                                                "Stroke/TIA",
                                                "High Blood Pressure",
                                                "High Cholesterol or Triglycerides",
                                                "Liver Disease",
                                                "Alcohol or Drug Abuse",
                                                "Anxiety, Depression or Psychiatric Illness",
                                                "Tuberculosis",
                                                "Anesthesia Complications",
                                                "Genetic Disorder",
                                                "Other � describe",
                                            ],
                                            isRequired: true,
                                        },
                                        {
                                            name: "description",
                                            cellType: "text",
                                            title: "Describe",
                                            isRequired: true,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    panelCount: 2,
                    panelAddText: "Add a blood relative",
                    panelRemoveText: "Remove the relative",
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

surveyModel.data = {
    relatives: [
        {
            relativeType: "father",
        },
        {
            relativeType: "mother",
        },
    ],
};

$("#surveyElement").Survey({ model: surveyModel });
