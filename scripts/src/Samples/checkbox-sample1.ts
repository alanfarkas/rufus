//tslint:disable: object-literal-sort-keys object-literal-key-quotes trailing-comma
//import * as Survey from 'survey-jquery';
declare const Survey: typeof import("survey-jquery");
import { SurveyModel } from "survey-jquery";

Survey.StylesManager.applyTheme("modern");

const surveyJSON = {
    pages: [
        {
            name: "page_industry-experience",
            elements: [
                {
                    type: "panel",
                    name: "panel_experience",
                    elements: [
                        {
                            type: "checkbox",
                            name: "Honda",
                            title: "Honda",
                            choices: [
                                {
                                    value: "Honda.Accord",
                                    text: "Honda Accord",
                                },
                                {
                                    value: "Honda.Civic",
                                    text: "Honda Civic",
                                },
                                {
                                    value: "Honda.Pilot",
                                    text: "Honda Pilot",
                                },
                            ],
                            hasSelectAll: true,
                        },
                        {
                            type: "checkbox",
                            name: "Mazda",
                            title: "Mazda",
                            commentText: "some comment text",
                            choices: [
                                {
                                    value: "Mazda.CX3",
                                    text: "Mazda CX-3",
                                },
                                {
                                    value: "Mazda.CX5",
                                    text: "Mazda CX-5",
                                },
                                {
                                    value: "Mazda.Miata",
                                    text: "Mazda Miata",
                                },
                            ],
                            hasSelectAll: true,
                        },
                        {
                            type: "checkbox",
                            name: "question2",
                            title: "Toyota",
                            choices: [
                                {
                                    value: "Camry",
                                    text: "Toyota Camry",
                                },
                                {
                                    value: "Corolla",
                                    text: "Toyota Corolla",
                                },
                                {
                                    value: "Prius",
                                    text: "Toyota Prius",
                                },
                                {
                                    value: "toytacoma",
                                    text: "Toyata Tacoma",
                                },
                            ],
                            hasSelectAll: true,
                        },
                    ],
                },
            ],
            description: "Please select any previous driven car",
        },
        {
            name: "page_software-and-tools",
            elements: [
                {
                    type: "panel",
                    name: "panel1",
                    elements: [
                        {
                            type: "html",
                            name: "html-header",
                            html: '<h3>Software & Tools Experience</h3>\n\nPlease select any software and/or tools that you are <b>experienced</b> with from the list below. <b>“Experience” is defined as having either:\n<br><ul>\n<li>&bull; used the tool in an applied setting on a previous project or job, or</li>\n<li>&bull; had exposure to the tool as part of sourcing/software selection or implementation.</li></b>\n</ul>\n\nIf you have experience with other software or tools not shown in the list below, you may type those in the "Other" box at the bottom of the page.<br>',
                        },
                        {
                            type: "checkbox",
                            name: "software_tools-ai",
                            title: "Artificial Intelligence (AI)",
                            choices: [
                                {
                                    value: "AI001",
                                    text: "IBM Watson",
                                },
                                {
                                    value: "AI002",
                                    text: "Ipsof",
                                },
                            ],
                            otherText: "Other AI Tool",
                        },
                        {
                            type: "matrixdynamic",
                            name: "matrix-other-dynamic-epm",
                            descriptionLocation: "underInput",
                            hideNumber: true,
                            titleLocation: "hidden",
                            showHeader: false,
                            columns: [
                                {
                                    name: "Column 1",
                                },
                            ],
                            choices: [1, 2, 3, 4, 5],
                            optionsCaption: "Options test",
                            cellType: "text",
                            rowCount: 0,
                            maxRowCount: 20,
                            addRowLocation: "top",
                            addRowText: "Add Other AI Tool",
                            removeRowText: "Remove Other AI Tool",
                        },
                        {
                            type: "checkbox",
                            name: "q-bi-analytics-visualization",
                            title: "Business Intelligence Analytics Visualization",
                            hasOther: true,
                            choices: [
                                {
                                    value: "BIAV001 ",
                                    text: " MicroStrategy",
                                },
                                {
                                    value: "BIAV002 ",
                                    text: " Qlik",
                                },
                                {
                                    value: "BIAV003 ",
                                    text: " RedSift (AWS)",
                                },
                                {
                                    value: "BIAV004 ",
                                    text: " SAP BI",
                                },
                                {
                                    value: "BIAV005 ",
                                    text: " SAS ",
                                },
                                {
                                    value: "BIAV006 ",
                                    text: " Snowflake",
                                },
                                {
                                    value: "BIAV007 ",
                                    text: " Tableau",
                                },
                                {
                                    value: "BIAV008 ",
                                    text: " TIBCO Spotfire / Jaspersoft",
                                },
                            ],
                            otherText: "Other BI Analytics Visualization Tool",
                        },
                        {
                            type: "checkbox",
                            name: "q-st-epm",
                            title: "Enterprise Performance Management",
                            hasOther: true,
                            choices: [
                                {
                                    value: "EPM001",
                                    text: "Anaplan",
                                },
                                {
                                    value: "EPM002",
                                    text: "Blackline",
                                },
                                {
                                    value: "EPM003",
                                    text: "Host Analytics",
                                },
                                {
                                    value: "EPM004",
                                    text: "IBM Cognos",
                                },
                                {
                                    value: "EPM005 ",
                                    text: "OneStream",
                                },
                                {
                                    value: "EPM006",
                                    text: "Oracle Hyperion/Cloud EPM",
                                },
                                {
                                    value: "EPM007 ",
                                    text: "SAP BPC (Outlooksoft)",
                                },
                                {
                                    value: "EPM008 ",
                                    text: "Trintech",
                                },
                            ],
                            otherText: "Other EPM Tool",
                        },
                    ],
                },
            ],
        },
    ],
    showQuestionNumbers: "off",
    showProgressBar: "both",
    questionsOnPageMode: "questionPerPage",
};

function sendDataToServer(sender: SurveyModel) {
    //send Ajax request to your web server.
    alert("The results are:" + JSON.stringify(sender.data));
}

const survey: SurveyModel = new Survey.Model(surveyJSON);

survey.onComplete.add((result) => {
    document.querySelector("#surveyResult").textContent =
        "Result JSON:\n" + JSON.stringify(result.data, null, 3);
});

const propName = "Survey";
$("#surveyElement")[propName]({ model: survey });

//$("#surveyElement").Survey({ model: survey });
//$("#surveyElement").Survey({
//    model: survey,
//    onComplete: sendDataToServer
//});
