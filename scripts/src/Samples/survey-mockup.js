Survey.StylesManager.applyTheme("darkblue");

var surveyJSON = {
    pages: [
        {
            name: "Page.UndergradSchool",
            elements: [
                {
                    type: "panel",
                    name: "Panel.UndergradSchool",
                    elements: [
                        {
                            type: "html",
                            name: "Html.UndergradSchool",
                            html: "<h3>Part 1 - Background Information - Undergraduate Education</h3>",
                        },
                        {
                            type: "dropdown",
                            renderAs: "select2",
                            name: "Question.UndergradSchool",
                            title: 'Select your Undergraduate School from the box below. If you do not see your School listed, select "Other".',
                            hideNumber: true,
                            commentText: "Other Undergraduate School",
                            otherPlaceHolder:
                                "Please enter your Undergraduate School",
                            choicesOrder: "asc",
                            choicesByUrl: {
                                url: "/Survey/SkillsSurvey/AnswerChoices?dataElement=EducationSchool",
                                valueName: "value",
                                titleName: "text",
                            },
                            otherText: "Other Undergraduate School",
                            optionsCaption:
                                "Other (select this if you do not see your school listed)",
                        },
                        {
                            type: "text",
                            name: "Question.UndergradSchool.Other",
                            visibleIf: "{Question.UndergradSchool} empty",
                            title: " Type your Other Undergraduate School in the field below",
                            hideNumber: true,
                            placeHolder:
                                "Please enter your Undergraduate School",
                        },
                    ],
                },
            ],
        },
        {
            name: "Page.UndergradMajor",
            elements: [
                {
                    type: "panel",
                    name: "Panel.UndergradMajor",
                    elements: [
                        {
                            type: "html",
                            name: "Html.UndergradMajor",
                            html: "<h3>Part 1 - Background Information - Undergraduate Education</h3>",
                        },
                        {
                            type: "tagbox",
                            name: "Question.UndergradMajor",
                            //title: "Select any number of Undergraduate Major(s) from the box below. If you do not see your Major(s) listed, select \"Other\". ",
                            title: "Select any number of Undergraduate Major(s) from the box below. If you do not see your Major(s) listed, enter them them below: ",
                            hideNumber: true,
                            choicesByUrl: {
                                url: "/Survey/SkillsSurvey/AnswerChoices?dataElement=EducationMajor",
                                valueName: "value",
                                titleName: "text",
                            },
                            //choices: [
                            //    {
                            //        value: "Acc",
                            //        text: "Accounting"
                            //    },
                            //    {
                            //        value: "Adv",
                            //        text: "Advertising"
                            //    },
                            //    {
                            //        value: "AeroEng",
                            //        text: "Aerospace Engineering"
                            //    },
                            //    {
                            //        value: "AgEcon",
                            //        text: "Agricultural Economics"
                            //    },
                            //    {
                            //        value: "AmerHist",
                            //        text: "American History"
                            //    },
                            //    {
                            //        value: "Anthro",
                            //        text: "Anthropology"
                            //    },
                            //    {
                            //        value: "AppMath",
                            //        text: "Applied Mathematics"
                            //    },
                            //    {
                            //        value: "ChemEng",
                            //        text: "Chemical Engineering"
                            //    },
                            //    {
                            //        value: "Comm",
                            //        text: "Communications"
                            //    },
                            //    {
                            //        value: "Econ",
                            //        text: "Economics"
                            //    },
                            //    {
                            //        value: "Educ",
                            //        text: "Education"
                            //    },
                            //    {
                            //        value: "ElecEng",
                            //        text: "Electical Engineering"
                            //    },
                            //    {
                            //        value: "Eng",
                            //        text: "English"
                            //    },
                            //    {
                            //        value: "Phys",
                            //        text: "Physics"
                            //    }
                            //],
                            optionsCaption:
                                "Other (select this if you do not see your Major(s) listed)",
                        },
                        {
                            type: "matrixdynamic",
                            name: "Question.UndergradMajor.Other",
                            visibleIf: "{Question.UndergradMajor} empty",
                            title: 'Enter any "Other" Undergraduate Major(s), one to a row, below:',
                            hideNumber: true,
                            columns: [
                                {
                                    name: "UndergradMajor.Other",
                                    title: "Undergraduate Major(s)",
                                    cellType: "text",
                                },
                            ],
                            horizontalScroll: true,
                            optionsCaption: "Please enter undergraduate Major",
                            cellType: "text",
                            rowCount: 1,
                            maxRowCount: 8,
                            addRowText: "Add Additional Major",
                        },
                    ],
                },
            ],
            visibleIf:
                "{Question.UndergradSchool} notempty or {Question.UndergradSchool.Other} notempty",
        },
        {
            name: "Page.GraduateSchool",
            elements: [
                {
                    type: "html",
                    name: "Html.GraduateSchool",
                    html: '<h3>Part 1 - Background Information - Graduate Education</h3><br>Have you received a <strong>Graduate</strong> Degree?\n<br/>\n<ul>\n  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull; If your response is "Yes", &nbsp;  you will be allowed up to two (2) Graduate Educations.\n<ul/>',
                },
                {
                    type: "panel",
                    name: "Panel.GraduateSchool",
                    elements: [
                        {
                            type: "radiogroup",
                            name: "Question.GraduateYesNo",
                            defaultValue: "No",
                            isRequired: true,
                            titleLocation: "hidden",
                            choices: ["Yes", "No"],
                        },
                    ],
                },
                {
                    type: "matrixdynamic",
                    name: "Question.GraduateSchool",
                    visibleIf: "{Question.GraduateYesNo} = 'Yes'",
                    titleLocation: "hidden",
                    columns: [
                        {
                            name: "Graduate School",
                            cellType: "dropdown",
                            isRequired: true,
                            hasOther: true,
                            choicesByUrl: {
                                url: "/Survey/SkillsSurvey/AnswerChoices?dataElement=EducationSchool",
                                valueName: "value",
                                titleName: "text",
                            },
                            optionsCaption:
                                'Select Graduate (or scroll to end and select "Other" if you do not see your school listed)',
                            otherText: "Other",
                        },
                        {
                            name: "Degree Type",
                            cellType: "radiogroup",
                            isRequired: true,
                            showInMultipleColumns: true,
                            choices: [
                                {
                                    value: "m",
                                    text: "Masters",
                                },
                                {
                                    value: "d",
                                    text: "Doctorate",
                                },
                            ],
                        },
                    ],
                    rowCount: 1,
                    minRowCount: 1,
                    maxRowCount: 2,
                    defaultRowValue: {
                        "Degree Type": "m",
                    },
                    addRowText: "Add Graduate School",
                },
            ],
        },
    ],
    showQuestionNumbers: "off",
    showProgressBar: "both",
    questionsOnPageMode: "standard",
};

window.surveyModel = new Survey.Model(surveyJSON);

surveyModel.onComplete.add(function (result) {
    document.querySelector("#surveyResult").textContent =
        "Result JSON:\n" + JSON.stringify(result.data, null, 3);
});

//var authToken = "My token";
//Survey.ChoicesRestfull.onBeforeSendRequest = function (sender, options) {
//    options.request.setRequestHeader("Authorization", "Bearer " + authToken);
//};

$("#surveyElement").Survey({ model: surveyModel });
