Survey.StylesManager.applyTheme("darkblue");

var surveyJSON = {
    pages: [
        {
            name: "Page.Education",
            elements: [
                {
                    type: "panel",
                    name: "Panel.Education.Outside",
                    elements: [
                        {
                            type: "html",
                            name: "Html.Education",
                            html: "<h2>Part 1 - Background Information - Education</h2>",
                        },
                        {
                            type: "paneldynamic",
                            name: "Panel.Education",
                            title: 'Enter your School, Major(s), and Degree received. Additional schools can be added by clicking on the "Add School" button.',
                            validators: [
                                {
                                    type: "expression",
                                },
                            ],
                            templateElements: [
                                {
                                    type: "html",
                                    name: "Html.DividerTop",
                                    html: '<hr style="border-bottom: 2px solid black; margin: 0px; padding: 0px">',
                                },
                                {
                                    type: "dropdown",
                                    renderAs: "select2",
                                    name: "Question.School",
                                    width: "30%",
                                    title: "School",
                                    validators: [
                                        {
                                            type: "expression",
                                            text: 'Please select a School or enter a value for "Other School".',
                                            expression:
                                                "{panel.Question.School} notempty or {panel.Question.School.Other} notempty",
                                        },
                                    ],
                                    choicesByUrl: {
                                        url: "/Survey/SkillsSurvey/AnswerChoices?dataElement=EducationSchool",
                                        valueName: "value",
                                        titleName: "text",
                                    },
                                    optionsCaption:
                                        "Other (select this if you do not see your School listed)",
                                },
                                {
                                    type: "dropdown",
                                    name: "Question.Degree",
                                    width: "5%",
                                    startWithNewLine: false,
                                    title: "Degree",
                                    requiredErrorText:
                                        "Please select a Degree.",
                                    validators: [
                                        {
                                            type: "expression",
                                            text: "Please select a Degree.",
                                            expression:
                                                "{Panel.Question.Degree} notempty",
                                        },
                                    ],
                                    choicesByUrl: {
                                        url: "/Survey/SkillsSurvey/AnswerChoices?dataElement=EducationDegree",
                                        valueName: "value",
                                        titleName: "text",
                                    },
                                    optionsCaption: "Select Degree",
                                },
                                {
                                    type: "tagbox",
                                    name: "Question.Major",
                                    width: "50%",
                                    startWithNewLine: false,
                                    title: "Major(s)",
                                    validators: [
                                        {
                                            type: "expression",
                                            text: 'Please select one or more Majors or enter "Other Major".',
                                            expression:
                                                "{Panel.Question.Major} notempty or {Panel.Question.Major.Other} notempty",
                                        },
                                    ],
                                    choicesByUrl: {
                                        url: "/Survey/SkillsSurvey/AnswerChoices?dataElement=EducationMajor",
                                        valueName: "value",
                                        titleName: "text",
                                    },
                                    //optionsCaption: "Other (select this if you do not see your Major listed)",
                                    placeholder:
                                        "Please select one or more Majors",
                                },
                                {
                                    type: "text",
                                    name: "Question.School.Other",
                                    visibleIf: "{panel.Question.School} empty",
                                    title: "Add Other School:",
                                    titleLocation: "left",
                                },
                                {
                                    type: "text",
                                    name: "Question.Major.Other",
                                    visibleIf: "{panel.Question.Major} empty",
                                    startWithNewLine: false,
                                    title: "Add Other Major:",
                                    titleLocation: "left",
                                },
                                {
                                    // Hidden / Disabled
                                    type: "html",
                                    name: "Html.DividerBottom",
                                    html: '<hr style="border-bottom: 0px solid black; margin: 0px; padding: 0px">',
                                },
                            ],
                            panelCount: 1,
                            maxPanelCount: 5,
                            panelAddText: "Add School",
                            panelRemoveText: "Remove School",
                        },
                    ],
                },
            ],
        },
    ],
    showQuestionNumbers: "off",
};

window.surveyModel = new Survey.Model(surveyJSON);

surveyModel.onComplete.add(function (result) {
    document.querySelector("#surveyResult").textContent =
        "Result JSON:\n" + JSON.stringify(result.data, null, 3);
    //save the data on survey complete. You may call another function to store the final results
    //saveState(survey);
});

surveyModel.onCurrentPageChanged.add(function (survey, options) {});

var storageName = "SurveyJS_Test1_LoadState";
var timerId = 0;

function loadState(survey) {
    //Here should be the code to load the data from your database
    var storageSt = window.localStorage.getItem(storageName) || "";

    var res = {};
    if (storageSt) res = JSON.parse(storageSt);
    //Create the survey state for the demo. This line should be deleted in the real app.
    //res = {
    //    currentPageNo: 1,
    //    data: {
    //        "satisfaction": "4",
    //        "Quality": {
    //            "does what it claims": "1"
    //        },
    //        "recommend friends": "3",
    //        "price to competitors": "More expensive",
    //        "price": "correct",
    //        "pricelimit": {
    //            "mostamount": ""
    //        }
    //    }
    //};
    //Set the loaded data into the survey.
    else if (res.currentPageNo) survey.currentPageNo = res.currentPageNo;
    if (res.data) survey.data = res.data;
}

function saveState(survey) {
    var res = {
        currentPageNo: survey.currentPageNo,
        data: survey.data,
    };
    //Here should be the code to save the data into your database
    window.localStorage.setItem(storageName, JSON.stringify(res));
}

surveyModel.onCurrentPageChanged.add(function (survey, options) {
    saveState(survey);
});
surveyModel.onComplete.add(function (survey, options) {
    //kill the timer
    clearInterval(timerId);
    //save the data on survey complete. You may call another function to store the final results
    saveState(survey);
});

// Load the initial state
loadState(surveyModel);

//save the data every 10 seconds, it is a good idea to change it to 30-60 seconds or more.
timerId = window.setInterval(function () {
    saveState(surveyModel);
}, 10000);

// Display survey
$("#surveyElement").Survey({ model: surveyModel });

// Example of passing authorization token to restAPI call
//var authToken = "My token";
//Survey.ChoicesRestfull.onBeforeSendRequest = function (sender, options) {
//    options.request.setRequestHeader("Authorization", "Bearer " + authToken);
//};
