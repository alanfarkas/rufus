//import * as Survey from 'survey-jquery';
declare const Survey: typeof import("survey-jquery");
import { SurveyModel } from "survey-jquery";
//import { surveyCss } from "../SkillsSurveyGUI.js";

// #region survey CSS overrides
// *** Survey CSS Overrides ***
export const surveyCss = {
    //
    // Override selected SurveyJS CSS classes. The list of classes that can be overwritten can be found here:
    // https://surveyjs.io/Examples/Library?id=survey-customcss&platform=jQuery&theme=modern#content-docs
    //
    navigation: {
        complete: "navigateButton",
        prev: "prevButton",
        next: "navigateButton",
    },
    paneldynamic: {
        buttonAdd: "addButton",
        buttonRemove: "deleteButton",
        // title: "panelSubHeader"
    },
    question: {
        title: "questionTitle",
        // description: "font15"
    },
    html: {
        root: "surveyFont questionHtml",
    },
    expression: {
        // root: "hideMe",
        // title: "hideMe"
    },
    checkbox: {
        // root: "font15 surveyFont",
        // checkboxControl: "font15",
        controlLabel: "font15 surveyFont",
        // label:"font15",
    },
    matrix: {
        root: "surveyFont font15 matrixTable",
        // Row headers are set to Bold font in 'survey.css'
    },
};
// #endregion

Survey.StylesManager.applyTheme("darkred");

const surveyJSON = {
    focusFirstQuestionAutomatic: true,
    pages: [
        {
            name: "Page.Education",
            elements: [
                {
                    type: "panel",
                    name: "Panel.Education",
                    elements: [
                        {
                            type: "html",
                            name: "Html.Education",
                            html: "<h3>Part 1 - Background Information - Education</h3>\n",
                        },
                        {
                            type: "matrixdynamic",
                            name: "Question.Education",
                            titleLocation: "hidden",
                            columns: [
                                {
                                    name: "School",
                                    cellType: "dropdown",
                                    renderAs: "select2",
                                    isRequired: true,
                                    hasOther: true,
                                    width: "45%",
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
                                    name: "Major",
                                    cellType: "tagbox",
                                    isRequired: true,
                                    hasOther: true,
                                    width: "45%",
                                    choicesByUrl: {
                                        url: "/Survey/SkillsSurvey/AnswerChoices?dataElement=EducationMajor",
                                        valueName: "value",
                                        titleName: "text",
                                    },
                                    optionsCaption:
                                        'Select Major (or scroll to end and select "Other" if you do not see your major listed',
                                },
                                {
                                    name: "Degree",
                                    cellType: "dropdown",
                                    isRequired: true,
                                    showInMultipleColumns: true,
                                    minWidth: 150,
                                    choices: [
                                        {
                                            value: "u",
                                            text: "Undergrad",
                                        },
                                        {
                                            value: "m",
                                            text: "Masters",
                                        },
                                        {
                                            value: "d",
                                            text: "Doctorate",
                                        },
                                    ],
                                    optionsCaption: "Select Degree",
                                },
                            ],
                            columnColCount: 3,
                            rowCount: 1,
                            minRowCount: 1,
                            maxRowCount: 5,
                            defaultRowValue: {
                                "Degree Type": "m",
                            },
                            addRowText: "Add School",
                        },
                    ],
                },
            ],
        },
    ],
    showPageTitles: false,
    showQuestionNumbers: "off",
    requiredText: "",
};

const survey: SurveyModel = new Survey.Model(surveyJSON);

survey.onComplete.add(function (result) {
    document.querySelector("#surveyResult").textContent =
        "Result JSON:\n" + JSON.stringify(result.data, null, 3);
});

$("#surveyElement")["Survey"]({ model: survey, css: surveyCss });

//var authToken = "My token";
//Survey.ChoicesRestfull.onBeforeSendRequest = function (sender, options) {
//    options.request.setRequestHeader("Authorization", "Bearer " + authToken);
//};

//$("#surveyElement").Survey({ model: survey });
