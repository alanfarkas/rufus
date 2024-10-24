import { ISurveyDataProvider } from "../../Data/ISurveyDataProvider";
import { SkillsSurveyDataElement as DataElement } from "../../Enums/SkillsSurveyDataElement";
import { SkillsSurveyGroupedDataElement as GroupedDataElement } from "../../Enums/SkillsSurveyGroupedDataElement";
import { SkillsSurveyPageName } from "../../Enums/SkillsSurveyPageName";
import { SkillsSurveyQuestionType } from "../../Enums/SkillsSurveyQuestionType";
import { SurveyJSThemeName } from "../../Enums/SurveyJSThemeName";
import { ISurveyMetaData } from "../ISurveyMetaData";
import { ISurveySpecification } from "./ISurveySpecification";

/* tslint:disable:object-literal-sort-keys */
/* tslint:disable:max-line-length */

/*
 * The Skills Survey survey & css specifications for SurveyJS
 */

export class SkillsSurveySpec implements ISurveySpecification {
    //#region properties
    public themeName = SurveyJSThemeName.Darkblue;
    //#endregion

    //#region constructor
    constructor(
        protected dataProvider: ISurveyDataProvider<
            SkillsSurveyQuestionType,
            DataElement,
            GroupedDataElement
        >,
        private metaData: ISurveyMetaData
    ) {}
    //#endregion

    //#region general constants
    /* Must use Fat Arrow expression to resolve occurrence of 'this' inside choicesURL method */
    private readonly getChoicesURL = (dataType: DataElement) =>
        this.dataProvider.choicesURL(dataType);
    private readonly getGroupChoicesURL = (
        dataType: GroupedDataElement,
        groupId: string
    ) => this.dataProvider.groupChoicesURL(dataType, groupId);

    private readonly choicesValueField: string = "value";
    private readonly choicesTitleField: string = "text";
    private readonly NOCACHE: string = "{NOCACHE}";
    private readonly DATESTAMP: string = "&_=" + Date.now();
    private readonly noCacheOption: string = this.NOCACHE;
    public readonly surveyElementNameDelim: string = ".";
    private readonly contactEmailAddress = this.metaData.contactEmailAddress;
    private readonly contactName = this.metaData.contactName;
    //#endregion

    //#region notification messages
    private readonly defaultNotificationHTML = "";
    //'<h6><span class="red-text font-bold">4/25/2022 - ATTN existing users (CPI, PS, Energy, AIG, ESG)</span >:' +
    //' The Employee Profile has been updated with two new pages: (1) <span class="font-bold">Industry by Manufacturing Experience</span>' +
    //' and (2) <span class="font-bold">Skills - Cross-Business Unit.</span> Please navigate to these pages' +
    //" and enter your applicable experience. If you have any questions, contact the" +
    //' <a href ="mailto:' +
    //this.contactEmailAddress +
    //'"><u>' +
    //this.contactName +
    //"</u></a>." +
    //"</h6>";

    private readonly CTSNotificationHTML =
        this.defaultNotificationHTML +
        '<h6 class="mt-2">' +
        '<span class ="font-bold">Note,</span> the CTS skills taxonomy has been updated with new categories and skills. Please review and enter proficiencies below as relevant to your experience.' +
        ' <a target="_blank" href ="https://itinfoalvarezandmarsal.sharepoint.com/:p:/r/sites/CPI/ServiceOffering/knowledgemanagement/SkillsandExperiencetracker/Shared Documents/Training/Skills and Experience Tracker_CTS Skills Taxonomy Reference Guide_vFINAL.pptx?d=w7b22477a4a3e4b61bc93972129474e11&csf=1&web=1&e=IfE3tw"' +
        "><u>Click here</u></a> to access detailed descriptions for each skill." +
        "</h6>";

    private readonly DABMNotificationHTML =
        this.defaultNotificationHTML +
        '<h6 class="mt-2">' +
        '<span class ="font-bold">Note,</span> the following skills have moved to the <span class="font-italic">' +
        "Skills - Cross-Business Unit</span> page: (1) Financial Statement Analysis; (2) 3-Statement Financial Modeling; (3) 13-Week Cash Flow Modeling." +
        "</h6>";
    //#endregion

    //#region survey CSS overrides
    // *** SurveyJS CSS Overrides ***
    public readonly surveyCSS = {
        //
        // Override selected SurveyJS CSS classes. The list of classes that can be overwritten can be found here:
        // https://surveyjs.io/Examples/Library?id=survey-customcss&platform=jQuery&theme=modern#content-docs
        //
        checkbox: {
            root: "checkboxGroup",
            item: "pl-3 pt-2",
            controlLabel: "surveyFont fontBold",
        },
        expression: {
            // root: "hideMe",
            // title: "hideMe"
        },
        matrix: {
            root: "surveyFont font15 matrixTable",
        },
        matrixdynamic: {
            buttonAdd: "addButton",
            buttonRemove: "deleteButton",
            headerCell: "font15 surveyFont",
        },
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
    };
    //#endregion

    //#region survey specification

    // *** SurveyJS Specification ***
    //
    // All the questions, panels, and other survey elements corresponding to a given 'QuestionType' should be
    // contained in a single ancestor panel element. Questions for the same 'QuestionType' can be nested
    // under different child panel elements, as long as all the questions are contained in the same root-level panel
    // element.
    //
    // Multiple 'QuestionType's represented on a single survey page will each need to have their own ancestor panel
    // object.
    //
    // Other standards that should be adhered to:
    //
    // 1) When adding a new survey page, add a member to the 'SkillsSurveyPageName' enum and use it in this survey
    //    specification.
    // 2) The naming conventions already used should be adhered to, the most important being to prefix all question
    //    names with "Question." and page names with "Page."
    // 2) Using the "." character as a question name delimiter (e.g. "Page.Education", "Question.Industry",
    //    "Question.SolutionSkills.4001").
    //
    public readonly surveyJSON = {
        //#region page specifications
        pages: [
            // #region Page.Education
            {
                name: SkillsSurveyPageName.Education,
                elements: [
                    {
                        type: "panel",
                        name: "Panel.Education.Outside",
                        elements: [
                            {
                                type: "html",
                                name: "Html.Education.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.Education.Header",
                                html: "<h3>Background Information - Education</h3>",
                            },
                            {
                                type: "html",
                                name: "Html.Education.Instructions.1",
                                html: "<h6 class='fontBold'>Enter all Higher Education degrees received below.</h6>",
                            },
                            {
                                type: "html",
                                name: "Html.Education.Instructions.2",
                                html: "<h6 class='fontBold pb-1'>Helpful tips:</h6><h6 class='pl-5'><ul class='mb-0'><li class='pb-1'>Begin typing a <span class='fontBold'>School</span> or <span class='fontBold'>Major</span> in the boxes below and select the correct value from the filtered list.</li><li class='pb-1'>If the <span class='fontBold'>School</span> or <span class='fontBold'>Major</span> is not listed, you can add it manually in the <span class='fontBold'>Add Other</span> boxes below.</li><li><span class='fontBold'>If you have added a row by mistake and cannot proceed to the next page,</span> click <span class='fontBold'>Remove School</span> to delete the row and move on to the next page of the survey.</li></ul></h6>",
                            },
                            {
                                type: "paneldynamic",
                                name: "Container.Education",
                                title: " ",
                                validators: [
                                    {
                                        type: "expression",
                                    },
                                ],
                                templateElements: [
                                    {
                                        type: "html",
                                        name: "Html.DividerTop",
                                        html: "<hr class='dividerLine'>",
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
                                                text: "Please select a SCHOOL or enter a SCHOOL in the 'Add Other School' box or click the 'Remove School' button to remove this row and proceed to the next page.",
                                                expression:
                                                    "{panel.Question.School} notempty or {panel.Question.School.Other} notempty",
                                            },
                                        ],
                                        // Choices dynamically populated by Survey Builder
                                        //choicesByUrl: {
                                        //    url: this.getChoicesURL(DataType.EducationSchool),
                                        //    valueName: this.choicesValueField,
                                        //    titleName: this.choicesTitleField,
                                        //},
                                        optionsCaption:
                                            "Other (select this if you do not see your School listed)",
                                    },
                                    {
                                        type: "dropdown",
                                        renderAs: "select2",
                                        name: "Question.Degree",
                                        width: "5%",
                                        startWithNewLine: false,
                                        title: "Degree",
                                        // requiredErrorText: "Please select a Degree.",
                                        validators: [
                                            {
                                                type: "expression",
                                                text: "Please select a Degree.",
                                                expression:
                                                    "{Panel.Question.Degree} notempty",
                                            },
                                        ],
                                        choicesByUrl: {
                                            url: this.getChoicesURL(
                                                DataElement.EducationDegree
                                            ),
                                            valueName: this.choicesValueField,
                                            titleName: this.choicesTitleField,
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
                                                text: "Please select one or more MAJORS or enter a single MAJOR in the 'Add Other Major' box or click the 'Remove School' buton to remove this row and proceed to the next page.",
                                                expression:
                                                    "{Panel.Question.Major} notempty or {Panel.Question.Major.Other} notempty",
                                            },
                                        ],
                                        // Choices dynamically populated by Survey Builder
                                        // choicesByUrl: {
                                        //    url: choicesURL(DataElement.EducationMajor),
                                        //    valueName: choicesValueField,
                                        //    titleName: choicesTitleField
                                        // },
                                        // optionsCaption: "Other (select this if you do not see your Major listed)",
                                        placeholder:
                                            "Please select one or more Majors or enter a single Major in 'Add Other Major' box",
                                    },
                                    {
                                        type: "text",
                                        name: "Question.School.Other",
                                        visibleIf:
                                            "{panel.Question.School} empty",
                                        title: "Add Other School:",
                                        titleLocation: "left",
                                    },
                                    {
                                        type: "text",
                                        name: "Question.Major.Other",
                                        visibleIf:
                                            "{panel.Question.Major} empty",
                                        startWithNewLine: false,
                                        title: "Add Other Major:",
                                        titleLocation: "left",
                                    },
                                    {
                                        // Hidden / Disabled
                                        type: "html",
                                        name: "Html.DividerBottom",
                                        // html: "<hr class='dividerLine'>"
                                        html: "",
                                    },
                                ],
                                panelCount: 0,
                                // maxPanelCount: 5,
                                defaultPanelValue: {
                                    "Question.Degree": "100",
                                },
                                panelAddText: "Add School",
                                panelRemoveText: "Remove School",
                            },
                        ],
                    },
                ],
            },
            // #endregion
            // #region Page.Language
            {
                name: SkillsSurveyPageName.Language,
                elements: [
                    {
                        type: "panel",
                        name: "Panel.Language.Outside",
                        elements: [
                            {
                                type: "html",
                                name: "Html.Language.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.Language.Header",
                                html: "<h3>Background Information - Languages</h3><br /><h6>Please select any languages (other than English) that you speak, as well as your level of spoken proficiency for each. Refer to the proficiency level descriptions below when making your selection for each language.</h6 >",
                            },
                            {
                                type: "html",
                                name: "Html.LanguageProficiency.Table",
                                html: "<table class=ratingsTable <tbody><tr><th class='fontBold' style='border-right-color:white;'>Language Proficiency</th><th class='fontBold'>Description</th></tr><tr><td class='fontBold'>Elementary</td><td>Individual can form basic sentences, including asking and answering simple questions.</td></tr><tr><td class='fontBold'>Limited Working</td><td>Individual can manage basic work commands and social phrases and can carry on limited casual conversations at the office.</td></tr><tr><td class='fontBold'>Minimum Professional</td><td>Individual can contribute to office meetings, have conversations with clients, and carry out most work functions requested of them.</td></tr><tr><td class='fontBold'>Full Professional</td><td>Individual can have advanced discussions on a wide range of topics about personal life, current events, and technical topics such as business and finance; vocabulary is extensive and the person can carry on conversations with ease.</td></tr><tr><td class='fontBold'>Native or Bilingual</td><td>Individual is either a native speaker or is completely fluent. They have little or no accent.</td></tr></tbody></table><br />",
                            },
                            {
                                type: "paneldynamic",
                                name: "Container.Language",
                                // titleLocation: "hidden",
                                title: 'Click on the "Add Language" or "Remove Language" buttons to add or delete LANGUAGES.',
                                templateElements: [
                                    {
                                        type: "dropdown",
                                        renderAs: "select2",
                                        name: "Question.Language",
                                        titleLocation: "top",
                                        title: "Language",
                                        validators: [
                                            {
                                                type: "expression",
                                                text: "Please select a LANGUAGE  or click the 'Remove Language' button to remove this row and proceed to the next page.",
                                                expression:
                                                    "{Panel.Question.Language} notempty",
                                            },
                                        ],
                                        choicesByUrl: {
                                            url: this.getChoicesURL(
                                                DataElement.Language
                                            ),
                                            valueName: this.choicesValueField,
                                            titleName: this.choicesTitleField,
                                        },
                                    },
                                    {
                                        type: "dropdown",
                                        renderAs: "select2",
                                        name: "Question.LanguageProficiency",
                                        startWithNewLine: false,
                                        titleLocation: "top",
                                        title: "Language Proficiency",
                                        validators: [
                                            {
                                                type: "expression",
                                                text: "Please select a LANGUAGE PROFICIENCY:",
                                                expression:
                                                    "{Panel.Question.LanguageProficiency} notempty",
                                            },
                                        ],
                                        choicesByUrl: {
                                            url: this.getChoicesURL(
                                                DataElement.LanguageProficiency
                                            ),
                                            valueName: this.choicesValueField,
                                            titleName: this.choicesTitleField,
                                        },
                                    },
                                ],
                                panelCount: 0,
                                // maxPanelCount: 8,
                                defaultPanelValue: {
                                    "Question.LanguageProficiency": "1200",
                                },
                                panelAddText: "Add Language",
                                panelRemoveText: "Remove Language",
                            },
                        ],
                    },
                ],
            },
            // #endregion
            // #region Page.Certification
            {
                name: SkillsSurveyPageName.Certification,
                elements: [
                    {
                        type: "panel",
                        name: "Panel.Certification.Outside",
                        elements: [
                            {
                                type: "html",
                                name: "Html.Certification.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.Certification.Header",
                                html: "<h3>Background Information - Professional Industry Certifications</h3>",
                            },
                            {
                                type: "html",
                                name: "Html.Certification.Instructions.1",
                                html: "<h6>Add <span class='fontBold'>active</span> or <span class='fontBold'>inactive</span> certifications from external Professional or Trade organizations.</h6>",
                            },
                            {
                                type: "html",
                                name: "Html.Certification.Instructions.2",
                                html: "<h6 class='pl-5'><ul><li>Click \"Add Certification\" to add or \"Remove\" to delete a certification.</li><li>Make sure to indicate if the certification is Active or Inactive.</li><li>If your certification is not available in the master list, add it manually in the 'Add Other Certification' box.</ul></h6>",
                            },
                            {
                                type: "matrixdynamic",
                                name: "Container.Certification",
                                //title: "",
                                titleLocation: "hidden",
                                columns: [
                                    {
                                        name: "Question.Certification",
                                        cellType: "dropdown",
                                        renderAs: "select2",
                                        title: "Certification",
                                        width: "40%",
                                        //choicesByUrl: {
                                        //    url: this.getChoicesURL(DataElement.Certification),
                                        //    valueName: this.choicesValueField,
                                        //    titleName: this.choicesTitleField,
                                        //},
                                        validators: [
                                            {
                                                type: "expression",
                                                text: "Please select a CERTIFICATION or enter a CERTIFICATION in the 'Add Other Certification' box  or click the 'Remove' button to remove this row and proceed to the next page.",
                                                expression:
                                                    "{row.Question.Certification} notempty or {row.Question.Certification.Other} notempty ",
                                            },
                                        ],
                                        optionsCaption:
                                            "Other (select this if you do not see your Certification listed)",
                                    },
                                    {
                                        cellType: "radiogroup",
                                        name: "Question.Certification.Status",
                                        title: "Active / Inactive",
                                        maxWidth: "100px",
                                        startWithNewLine: false,
                                        isRequired: true,
                                        requiredErrorText:
                                            "Please select ACTIVE or INACTIVE",
                                        choices: [
                                            {
                                                value: 1,
                                                text: "Active",
                                            },
                                            {
                                                value: 0,
                                                text: "Inactive",
                                            },
                                        ],
                                    },
                                    {
                                        cellType: "text",
                                        name: "Question.Certification.Other",
                                        enableIf:
                                            "{row.Question.Certification} empty",
                                        title: "Add Other Certification",
                                        width: "30%",
                                    },
                                ],
                                rowCount: 0,
                                defaultRowValue: {
                                    "Question.Certification.Status": 1,
                                },
                                addRowText: "Add Certification",
                                removeRowText: "Remove",
                                hideColumnsIfEmpty: true,
                                emptyRowsText:
                                    'Click the "Add Certification" button to get started.',
                            },
                        ],
                    },
                ],
            },
            // #endregion
            // #region Page.SecurityClearance
            {
                name: SkillsSurveyPageName.SecurityClearance,
                elements: [
                    {
                        type: "panel",
                        name: "Container.SecurityClearance",
                        elements: [
                            {
                                type: "html",
                                name: "Html.SecurityClearance.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.SecurityClearance.1",
                                html: "<h3>Background Information - Active Government Security Clearances</h3><br><h6>Please indicate which <span class='fontBold'>active</span> government security clearances you currently have and/or if you have passed a government background check in the last 12 months. This question is especially important for those who are or could potentially be staffed on Public Sector projects.</h6>",
                            },
                            {
                                type: "html",
                                name: "Html.SecurityClearance.2",
                                html: "<h6>Click <span class='fontBold'>NEXT PAGE</span> if you do not have any <span class='fontBold'>active</span> security clearances.</h6>",
                            },
                            {
                                type: "checkbox",
                                name: "Question.SecurityClearance",
                                colCount: 1,
                                title: "",
                                titleLocation: "none",
                                choicesByUrl: {
                                    url: this.getChoicesURL(
                                        DataElement.SecurityClearance
                                    ),
                                    valueName: this.choicesValueField,
                                    titleName: this.choicesTitleField,
                                },
                            },
                        ],
                    },
                ],
            },
            // #endregion
            // #region Page.WorkExperience
            {
                name: SkillsSurveyPageName.WorkExperience,
                elements: [
                    {
                        type: "panel",
                        name: "Panel.WorkExperience.Outside",
                        elements: [
                            {
                                type: "html",
                                name: "Html.WorkExperience.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.WorkExperience.Header",
                                html: "<h3>Previous Work Experience (Prior to A&M Employment)</h3>",
                            },
                            {
                                type: "html",
                                name: "Html.WorkExperience.Instructions.1",
                                html: "<h6>Enter all companies where you have worked, dating back to the completion of your undergraduate education. You may also add relevant interships if desired. <span class='fontBold'>If you have no experience to add, just click Next Page.</span></h6>",
                            },
                            {
                                type: "html",
                                name: "Html.WorkExperience.Instructions.2",
                                html: "<h6 class='fontBold pb-1'>Additional guidance for this page:</h6><h6 class='pl-5'><ul class='mb-0'><li class='pb-1'><span class='fontBold'>You can manually add your previous Employer and/or Job/Title Function</span> using the <span class='fontBold'>Add Other</span> fields below if you do not see them in the pre-populated lists. You will still need to associate an industry and indicate length of time spent in the role.</li><li class='pb-1'><span class='fontBold'>Enter one line for each unique Company & Job/Title combination.</span></li><li class='pb-1'><span class='fontBold'>If you worked at a prior consulting / professional services firm,</span> capture this on one row and indicate your most recent role/level in the <span class='fontBold'>Job Title/Function</span> column. In the <span class='fontBold'>Industry</span> column, select \"Commercial & Professional Services > Research & Consulting Firms\". If you wish to add relevant projects from your past consulting firm, you may add those on a separate row and enter 'As a Consultant' in the <span class='fontBold'>Job Title/Function</span> column.</li><li><span class='fontBold'>If you have added a row by mistake and cannot proceed to the next page,</span> click <span class='fontBold'>Remove Job</span> to delete the row and move on to the next page of the survey.</li></ul></h6>",
                            },
                            {
                                type: "paneldynamic",
                                name: "Container.WorkExperience",
                                title: " ",
                                //title: "Enter your previous Work Experience.  Jobs can be added or deleted by clicking on the \"Add Job\" or \"Remove Job\" buttons.",
                                validators: [
                                    {
                                        type: "expression",
                                    },
                                ],
                                templateElements: [
                                    {
                                        type: "html",
                                        name: "Html.DividerTop",
                                        html: "<hr class='dividerLine'>",
                                    },
                                    {
                                        type: "dropdown",
                                        renderAs: "select2",
                                        name: "Question.Company",
                                        width: "20%",
                                        title: "Company Name",
                                        validators: [
                                            {
                                                type: "expression",
                                                text: "Please select a COMPANY NAME or enter a new COMPANY in the 'Add Other Company' box or click the 'Remove Job' button to remove this row and proceed to the next page.",
                                                expression:
                                                    "{panel.Question.Company} notempty or {Panel.Question.Company.Other} notempty",
                                            },
                                        ],
                                        // Choices dynamically populated by Survey Builder
                                        // choicesByUrl: {
                                        //     url: choicesURL(DataElement.ExperienceCompany),
                                        //     valueName: choicesValueField,
                                        //     titleName: choicesTitleField
                                        // },
                                        optionsCaption:
                                            "Other (select this if you do not see your Company listed)",
                                    },
                                    {
                                        type: "dropdown",
                                        renderAs: "select2",
                                        name: "Question.Industry",
                                        width: "35%",
                                        startWithNewLine: false,
                                        title: "Industry",
                                        validators: [
                                            {
                                                type: "expression",
                                                text: "Please select an INDUSTRY or click the 'Remove Job' button to remove this row and proceed to the next page.",
                                                expression:
                                                    "{panel.Question.Industry} notempty",
                                            },
                                        ],
                                        choicesByUrl: {
                                            url: this.getChoicesURL(
                                                DataElement.ExperienceIndustry
                                            ),
                                            valueName: this.choicesValueField,
                                            titleName: this.choicesTitleField,
                                        },
                                        // optionsCaption: "Other (select this if you do not see your Industry listed)"
                                    },
                                    {
                                        type: "dropdown",
                                        renderAs: "select2",
                                        name: "Question.JobTitle",
                                        width: "18%",
                                        startWithNewLine: false,
                                        title: "Job Title/Function",
                                        validators: [
                                            {
                                                type: "expression",
                                                text: "Please select a JOB TITLE/FUNCTION or click the 'Remove Job' button to remove this row and proceed to the next page.",
                                                expression:
                                                    "{Panel.Question.JobTitle} notempty or {Panel.Question.JobTitle.Other} notempty",
                                            },
                                        ],
                                        // Choices dynamically populated by Survey Builder
                                        // choicesByUrl: {
                                        //     url: choicesURL(DataElement.ExperienceJobTitle),
                                        //     valueName: choicesValueField,
                                        //     titleName: choicesTitleField
                                        // },
                                        optionsCaption:
                                            "Other (select this if you do not see your Job listed)",
                                    },
                                    {
                                        type: "dropdown",
                                        renderAs: "select2",
                                        name: "Question.JobDuration",
                                        width: "3%",
                                        startWithNewLine: false,
                                        title: "Time Spent in Role(s)",
                                        isRequired: true,
                                        requiredErrorText:
                                            "Please select a Duration.",
                                        choicesByUrl: {
                                            url: this.getChoicesURL(
                                                DataElement.ExperienceJobDuration
                                            ),
                                            valueName: this.choicesValueField,
                                            titleName: this.choicesTitleField,
                                        },
                                        // optionsCaption: "Other (select this if you do not see your Job listed)"
                                    },
                                    {
                                        type: "text",
                                        name: "Question.Company.Other",
                                        visibleIf:
                                            "{panel.Question.Company} empty",
                                        title: "Add Other Company:",
                                        titleLocation: "left",
                                    },
                                    {
                                        type: "text",
                                        name: "Question.JobTitle.Other",
                                        visibleIf:
                                            "{panel.Question.JobTitle} empty",
                                        startWithNewLine: false,
                                        title: "Add Other Job Title/Function:",
                                        titleLocation: "left",
                                    },
                                ],
                                panelCount: 0,
                                // maxPanelCount: 5,
                                defaultPanelValue: {
                                    "Question.JobDuration": "702", // Job duration default is "1-3 years"
                                },
                                panelAddText: "Add Job",
                                panelRemoveText: "Remove Job",
                            },
                        ],
                    },
                ],
            },
            // #endregion
            // #region Page.IndustryExperience
            {
                // Question is dynamically cloned for each industry by the survey customization process
                name: SkillsSurveyPageName.IndustryExperience,
                elements: [
                    {
                        type: "panel",
                        name: "Container.IndustryExperience",
                        elements: [
                            {
                                type: "html",
                                name: "Html.IndustryExperience.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.IndustryExperience.Header",
                                html: "<h3>Industry Experience</h3>",
                            },
                            {
                                type: "html",
                                name: "Html.IndustryExperience.Instructions.1",
                                html: "<h6>Select all Industry categories where you have worked over the course of your career (<span class='fontBold'>including during your employment at A&M</span>). Any industries selected in the <span class='fontBold'>Previous Work Experience</span> section will be reported in the Skills & Experience tracker and do not need to be selected again here.</h6>",
                            },
                            {
                                type: "html",
                                name: "Html.IndustryExperience.Instructions.2",
                                html: "<h6>Navigation Tips:</h6><h6 class='pl-5'><ul><li>Click the <span class='fontBold'>Collapse All</span> and <span class='fontBold'>Expand All</span> buttons above to collapse/expand all Industry categories.</li><li>Click a Category name or the <span class='expandButtonSymbol'>&and;</span>/<span class='expandButtonSymbol'>&or;</span> button at the far-right to collapse/expand an individual Industry's sub-categories.</li></ul></h6>",
                            },
                            {
                                type: "checkbox",
                                name: "Question.IndustryExperience",
                                // CAN'T USE VALUENAME PROPERTY AS IT INTEREFERES WITH SELECT ALL FUNCTIONALITY
                                // valueName: "Question.IndustryExperience",
                                colCount: 1,
                                title: "GROUP_DESCRIPTION",
                                // The answer choices are dynamically set by the IndustryExperienceQuestionBuilder
                                //choices: [
                                //    {
                                //        value: "801",
                                //        text: "Automobiles & Components > Aftermarket Parts - Retail & Distribution",
                                //    },
                                //    {
                                //        value: "802",
                                //        text: "Automobiles & Components > Auto Parts & Equipment Manufacturing",
                                //    },
                                //    {
                                //        value: "803",
                                //        text: "Automobiles & Components > Automobile Manufacturers",
                                //    },
                                //],
                                hasSelectAll: true,
                                selectAllText: "SELECT ALL",
                            },
                            {
                                // Add some blank lines between industry groups
                                type: "html",
                                name: "Html.IndustryExperience.Footer",
                                html: "",
                            },
                        ],
                    },
                ],
            },
            // #endregion
            // #region Page.DIJurisdiction
            {
                // Question is dynamically cloned for each DI Jurisdiction Country by the survey customization process
                name: SkillsSurveyPageName.DIJurisdiction,
                elements: [
                    {
                        type: "panel",
                        name: "Container.DIJurisdiction",
                        elements: [
                            {
                                type: "html",
                                name: "Html.DIJurisdiction.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.DIJurisdiction.Header",
                                html: "<h3>DI Jurisdiction Experience</h3>",
                            },
                            {
                                type: "html",
                                name: "Html.DIJurisdiction.Instructions.1",
                                html: "<h6>Select jurisdictions where you have relevant experience <span class='fontBold'>(at A&M or previously)</span>. <u>If you consider your experience of a jurisdiction limited or outdated, you should not include it in your selection.</u></h6>",
                            },
                            {
                                type: "html",
                                name: "Html.DIJurisdiction.Instructions.2",
                                html: "<h6>Navigation Tips:</h6><h6 class='pl-5'><ul><li>Click the <span class='fontBold'>Collapse All</span> and <span class='fontBold'>Expand All</span> buttons above to collapse/expand all Industry categories.</li><li>Click a <span class='fontBold'>Region</span> name or the <span class='expandButtonSymbol'>&and;</span>/<span class='expandButtonSymbol'>&or;</span> button at the far-right to collapse/expand an individual Industry's sub-categories.</li></ul></h6>",
                            },
                            {
                                type: "checkbox",
                                name: "Question.DIJurisdiction",
                                // CAN'T USE VALUENAME PROPERTY AS IT INTEREFERES WITH SELECT ALL FUNCTIONALITY
                                // valueName: "Question.DIJurisdiction",
                                colCount: 1,
                                title: "GROUP_DESCRIPTION",
                                hasSelectAll: true,
                                selectAllText: "SELECT ALL",
                            },
                            {
                                // Add some blank lines between region groups
                                type: "html",
                                name: "Html.DIJurisdiction.Footer",
                                html: "",
                            },
                        ],
                    },
                ],
            },
            // #endregion
            // #region Page.IndustryManufacturingExperience
            {
                // Question is dynamically cloned for each industry by the survey customization process
                name: SkillsSurveyPageName.IndustryManufacturing,
                elements: [
                    {
                        type: "panel",
                        name: "Container.IndustryManufacturingExperience",
                        elements: [
                            {
                                type: "html",
                                name: "Html.IndustryManufacturingExperience.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.IndustryManufacturingExperience.Header",
                                html: "<h3>Industry Manufacturing Experience</h3>",
                            },
                            {
                                type: "html",
                                name: "Html.IndustryManufacturingExperience.Instructions.1",
                                html: "<h6>Select all Industries where you have <span class='fontBold'>manufacturing experience</span> over the course of your career (<span class='fontBold'>including during your employment at A&M</span>):</h6>",
                            },
                            {
                                type: "html",
                                name: "Html.IndustryManufacturingExperience.2",
                                html: "<h6>Click <span class='fontBold'>NEXT PAGE</span> if you do not have any <span class='fontBold'>manufacturing experience</span>.</h6>",
                            },
                            {
                                type: "checkbox",
                                name: "Question.IndustryManufacturingExperience",
                                colCount: 1,
                                title: "",
                                titleLocation: "none",
                                choicesByUrl: {
                                    url: this.getChoicesURL(
                                        DataElement.IndustryGroupsManufacturingExperience
                                    ),
                                    valueName: this.choicesValueField,
                                    titleName: this.choicesTitleField,
                                },
                            },
                        ],
                    },
                ],
            },
            // #endregion
            // #region Page.InterimMgmt
            {
                name: SkillsSurveyPageName.InterimMgmt,
                elements: [
                    {
                        type: "panel",
                        name: "Container.InterimMgmt",
                        elements: [
                            {
                                type: "html",
                                name: "Html.InterimMgmt.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.InterimMgmt.Header",
                                html: "<h3>Interim Management Executive Advisory Roles</h3>",
                            },
                            {
                                type: "html",
                                name: "Html.InterimMgmt.Instructions",
                                html: "<h6>Select any <span class='fontBold'>Management / Executive Advisory roles</span> that you have served in previously. Click \"Add Other Role\" at the bottom of the page to add any roles you do not see in the list below.</h6>",
                            },
                            {
                                type: "checkbox",
                                name: "Question.InterimMgmt",
                                colCount: 1,
                                title: "",
                                titleLocation: "none",
                                // Choices dynamically populated by Survey Builder
                                //    choicesByUrl: {
                                //        url: this.getChoicesURL(DataElement.InterimMgmt),
                                //        valueName: this.choicesValueField,
                                //        titleName: this.choicesTitleField,
                                //    },
                            },
                            {
                                type: "html",
                                name: "Html.InterimMgmt.Divider",
                                html: "<hr class='dividerLine'>",
                            },
                            {
                                type: "paneldynamic",
                                name: "Container.InterimMgmt.Other",
                                title: "Add Other Interim Management Roles",
                                //titleLocation: "none",
                                validators: [
                                    {
                                        type: "expression",
                                    },
                                ],
                                templateElements: [
                                    {
                                        type: "text",
                                        name: "Question.InterimMgmt.Other",
                                        isRequired: true,
                                        requiredErrorText:
                                            "Please enter an Interim Management Role or click the 'Remove Other Role' button to remove this row and proceed to the next page.",
                                        title: "",
                                        titleLocation: "none",
                                    },
                                ],
                                panelCount: 0,
                                // maxPanelCount: 5,
                                panelAddText: "Add Other Role",
                                panelRemoveText: "Remove Other Role",
                            },
                        ],
                    },
                ],
            },
            // #endregion
            //#region Page.NACR
            {
                name: SkillsSurveyPageName.NACR,
                elements: [
                    {
                        type: "panel",
                        name: "Container.EngagementRole",
                        elements: [
                            {
                                type: "html",
                                name: "Html.EngagementRole.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.EngagementRole.Header",
                                html: "<h3>Engagement Roles</h3>",
                            },
                            {
                                type: "html",
                                name: "Html.EngagementRole.Instructions",
                                html: "<h6>Do you have experience representing the following on an engagement?</h6>",
                            },
                            {
                                type: "checkbox",
                                name: "Question.EngagementRole",
                                colCount: 1,
                                title: "",
                                titleLocation: "none",
                                choicesByUrl: {
                                    url: this.getChoicesURL(
                                        DataElement.EngagementRole
                                    ),
                                    valueName: this.choicesValueField,
                                    titleName: this.choicesTitleField,
                                },
                            },
                        ],
                    },
                    //{
                    //    type: "panel",
                    //    name: "Container.GamingLicense",
                    //    elements: [
                    //    {
                    //        type: "html",
                    //        name: "Html.EngagementRole.BottomSpacer",
                    //        html: "<br /><br /><hr class='dividerLine'>",
                    //    },
                    //    {
                    //        type: "html",
                    //        name: "Html.GamingLicense.Header",
                    //        html: "<h3>Gaming Board Licenses</h3>",
                    //    },
                    //    {
                    //        type: "html",
                    //        name: "Html.GamingLicense.Instructions",
                    //        html: "<h6>For each of the states listed below indicate if you have any <span class='fontBold'>Active</span> or <span class='fontBold'>Inactive</span> gaming board licenses, or if you have ever been <span class='fontBold'>Denied</span> approval of a state gaming board license:</h6>",
                    //    },
                    //    {
                    //        type: "matrix",
                    //        name: "Question.GamingLicense",
                    //        titleLocation: "hidden",
                    //        columns: [
                    //            {
                    //                value: "-1",
                    //                text: "None",
                    //            },
                    //            {
                    //                value: "3100",
                    //                text: "Active",
                    //            },
                    //            {
                    //                value: "3101",
                    //                text: "Inactive",
                    //            },
                    //            {
                    //                value: "3102",
                    //                text: "Denied",
                    //            },
                    //        ],
                    //        // Rows dyanmically populated during build process
                    //        rows: [
                    //            {
                    //                value: "2400",
                    //                text: "Alabama",
                    //            },
                    //            {
                    //                value: "2401",
                    //                text: "Alaska",
                    //            },
                    //            {
                    //                value: "2402",
                    //                text: "Arizona",
                    //            },
                    //            {
                    //                value: "2403",
                    //                text: "Arkansas",
                    //            },
                    //            {
                    //                value: "2404",
                    //                text: "California",
                    //            },
                    //            {
                    //                value: "2405",
                    //                text: "Colorado",
                    //            },
                    //            {
                    //                value: "2406",
                    //                text: "Connecticut",
                    //            },
                    //        ],
                    //        defaultValue: {
                    //            2400: -1,
                    //            2401: -1,
                    //            2402: -1,
                    //            2403: -1,
                    //            2404: -1,
                    //            2405: -1,
                    //            2406: -1,
                    //        },
                    //        isAllRowRequired: true,
                    //        maxWidth: "800px",
                    //    },
                    //        ],
                    //    },
                ],
            },
            //#endregion
            // #region Page.SoftwareTool
            {
                name: SkillsSurveyPageName.SoftwareTool,
                elements: [
                    {
                        type: "panel",
                        name: "Panel.SoftwareTool.Outside",
                        elements: [
                            {
                                type: "html",
                                name: "Html.SoftwareTool.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.SoftwareTool.Header",
                                html: "<h3>Software & Tools Experience</h3>",
                            },
                            {
                                type: "html",
                                name: "Html.SoftwareTool.Instructions.1",
                                html: "<h6>Add software and/or tools that you either: 1) used in an applied setting on a previous project or job, or 2) had exposure to as part of sourcing/software selection or implementation.</h6>",
                            },
                            {
                                type: "html",
                                name: "Html.SoftwareTool.Instructions.2",
                                html: "<h6 class='pl-5'><ul><li>Click \"Add Software/Tool\" to add or \"Remove\" to delete a Software/Tool.</li><li>If a Software/Tool is not available in the master list, add it manually in the 'Add Other Software/Tool' box.</li></ul></h6>",
                            },
                            {
                                type: "matrixdynamic",
                                name: "Container.SoftwareTool",
                                //title: "",
                                titleLocation: "hidden",
                                columns: [
                                    {
                                        cellType: "dropdown",
                                        renderAs: "select2",
                                        name: "Question.SoftwareTool",
                                        title: "Software/Tool",
                                        width: "50%",
                                        // Choices dynamically populated by Survey Builder
                                        //choicesByUrl: {
                                        //    url: this.getChoicesURL(DataElement.SoftwareTool),
                                        //    valueName: this.choicesValueField,
                                        //    titleName: this.choicesTitleField,
                                        //},
                                        validators: [
                                            {
                                                type: "expression",
                                                text: "Please select a Software/Tool or enter a Software/Tool in the 'Add Other Software/Tool' box  or click the 'Remove' button to remove this row and proceed to the next page.",
                                                expression:
                                                    "{row.Question.SoftwareTool} notempty or {row.Question.SoftwareTool.Other} notempty ",
                                            },
                                        ],
                                        optionsCaption:
                                            "Other (select this if you do not see your Software/Tool listed)",
                                    },
                                    {
                                        cellType: "text",
                                        name: "Question.SoftwareTool.Other",
                                        enableIf:
                                            "{row.Question.SoftwareTool} empty",
                                        title: "Add Other Software/Tool:",
                                        width: "40%",
                                    },
                                ],
                                rowCount: 0,
                                // maxPanelCount: 5,
                                defaultRowValue: {},
                                addRowText: "Add Software/Tool",
                                removeRowText: "Remove",
                                hideColumnsIfEmpty: true,
                                emptyRowsText:
                                    'Click the "Add Software/Tool" button to get started.',
                            },
                        ],
                    },
                ],
            },
            // #endregion
            //#region Page.SolutionSkills
            {
                // This question is dynamically cloned for each Skill Family and Category during by the survey
                // customization process
                name: SkillsSurveyPageName.SolutionSkills,
                elements: [
                    {
                        type: "html",
                        name: "Html.SolutionSkills.Notifications.Default",
                        html: this.defaultNotificationHTML,
                    },
                    {
                        type: "html",
                        name: "Html.SolutionSkills.Notifications.CTS",
                        html: this.CTSNotificationHTML,
                        visible: false,
                    },
                    {
                        type: "html",
                        name: "Html.SolutionSkills.Notifications.DABM",
                        html: this.DABMNotificationHTML,
                        visible: false,
                    },
                    {
                        type: "panel",
                        name: "Container.SolutionSkills",
                        elements: [
                            {
                                type: "html",
                                name: "Html.SolutionSkills.Header",
                                html: "<h3>Skills - [FAMILY NAME]</h3>",
                            },
                            {
                                type: "html",
                                name: "Html.SolutionSkills.Instructions",
                                html: "<h6>Using the Proficiency Rating Scale below, rate your level of expertise with the following <span class='fontBold'>[FAMILY NAME]</span> skills. Note for first time entries, all skill proficiencies have been defaulted and will be saved in your Profile as <span class='fontBold'>None</span> unless you change the proficiency rating.",
                            },
                            {
                                type: "html",
                                name: "Html.SolutionSkills.ProficiencyTable",
                                html: "<table class=ratingsTable <tbody><tr><th class='fontBold' style='border-right-color:white;'>Skill Proficiency</th><th class='fontBold'>Description</th></tr><tr><td class='fontBold'>None</td><td>Has no knowledge or experience in this area.</td></tr><tr><td class='fontBold'>Basic</td><td>Has basic knowledge and/or experience needed to complete work while under guidance or supervison.</td></tr><tr><td class='fontBold'>Intermediate</td><td>Has detailed knowledge and experience required to complete work with minimal guidance or supervision. Consistently demonstrates success and can assist others in this area.</td></tr><tr><td class='fontBold'>Advanced</td><td>Has a high degree of knowledge and experience, and can lead projects in this area. Seen as a SME who can provide coaching to others and apply the skill across many projects and functions.</td></tr><br /></tbody></table><br />",
                            },
                            {
                                type: "html",
                                name: "Html.SolutionSkills.MatrixHeader",
                                html: "</br ><h6><span class='highlightBold'>[CATEGORY NAME]</span></h6>",
                            },
                            {
                                type: "matrix",
                                name: "Question.SolutionSkills",
                                titleLocation: "hidden",
                                columns: [
                                    {
                                        value: "-1",
                                        text: "None",
                                    },
                                    {
                                        value: "1000",
                                        text: "Basic",
                                    },
                                    {
                                        value: "1001",
                                        text: "Intermediate",
                                    },
                                    {
                                        value: "1002",
                                        text: "Advanced",
                                    },
                                ],
                                // Rows dyanmically populated during build process
                                //rows: [
                                //    {
                                //        value: "101768",
                                //        text: "Basic Excel",
                                //    },
                                //    {
                                //        value: "101769",
                                //        text: "Excel Modelling, Visualization & Validation",
                                //    },
                                //    {
                                //        value: "101770",
                                //        text: "Advanced Business Analysis & Visualization",
                                //    },
                                //    {
                                //        value: "101771",
                                //        text: "Financial statement analysis",
                                //    },
                                //    {
                                //        value: "101772",
                                //        text: "3 statement modeling",
                                //    },
                                //    {
                                //        value: "101773",
                                //        text: "13 week cash flow",
                                //    },
                                //],
                                //defaultValue: {
                                //    101768: -1,
                                //    101769: -1,
                                //    101770: -1,
                                //    101771: -1,
                                //    101772: -1,
                                //    101773: -1,
                                //},
                                isAllRowRequired: true,
                                maxWidth: "1300px",
                            },
                            {
                                type: "html",
                                name: "Html.SolutionSkills.BottomSpacer",
                                html: "<br /><br /><hr class='dividerLine'>",
                            },
                        ],
                    },
                ],
            },
            //#endregion
            //#region Page.SourcingCategory
            {
                name: SkillsSurveyPageName.Sourcing,
                visible: false,
                elements: [
                    {
                        type: "panel",
                        name: "Container.SourcingCategory",
                        elements: [
                            {
                                type: "html",
                                name: "Html.SourcingCategory.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.SourcingCategory.Header",
                                html: "<h3>Sourcing Category ([TYPE NAME])</h3>",
                            },
                            {
                                type: "html",
                                name: "Html.SourcingCategory.Instructions.1",
                                html: "<h6><span class='fontBold'>You indicated that you have experience with </span><span class='highlightBold'>Strategic Sourcing</span>. Select all <span class='fontBold'>[TYPE NAME]</span> sourcing categories where you have experience.</h6>",
                            },
                            {
                                type: "html",
                                name: "Html.SourcingCategory.Instructions.2",
                                html: "<h6>Navigation Tips:</h6><h6 class='pl-5'><ul><li>Click the <span class='fontBold'>Collapse All</span> and <span class='fontBold'>Expand All</span> buttons above to collapse/expand all Sourcing categories.</li><li>Click a Category name or the <span class='expandButtonSymbol'>&and;</span>/<span class='expandButtonSymbol'>&or;</span> button at the far-right to collapse/expand a specific set of Sourcing sub-categories.</li></ul></h6>",
                            },
                            {
                                // Question is dynamically cloned for each manufacturing experience group by the survey
                                // customization process.
                                type: "checkbox",
                                name: "Question.SourcingCategory",
                                colCount: 1,
                                title: "GROUP_DESCRIPTION",
                                /*                                state: "collapsed",*/
                                // The answer choices are dynamically set by the Question Builder
                                //choices: [
                                //    {
                                //        value: "1700",
                                //        text: "Interim Management (or Direct Industry Experience) > Maintenance Management",
                                //    },
                                //    {
                                //        value: "1701",
                                //        text: "Interim Management (or Direct Industry Experience) > Materials Management",
                                //    },
                                //    {
                                //        value: "1702",
                                //        text: "Interim Management (or Direct Industry Experience) > Plant Management / GM",
                                //    },
                                //],
                                hasSelectAll: true,
                                selectAllText: "SELECT ALL",
                            },
                            {
                                // Add some blank lines between sourcing category groups
                                type: "html",
                                name: "Html.SourcingCategory.Footer",
                                html: "",
                            },
                        ],
                    },
                ],
                // Page is only visible if user has selected any "Strategic Sourcing" experience on the Solution Skills
                // question. 'GROUPID' and 'SKILLID' tokens are populated by the Sourcing question builder.
                visibleIf:
                    "getMatrixRowValueFunc('Question.SolutionSkills.[GROUPID]', '[SKILLID]') > 0",
            },
            //#endregion
            //#region Page.ManufacturingExperience
            {
                name: SkillsSurveyPageName.Manufacturing,
                elements: [
                    {
                        type: "panel",
                        name: "Container.ManufacturingExperience",
                        elements: [
                            {
                                type: "html",
                                name: "Html.ManufacturingExperience.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.ManufacturingExperience.Header",
                                html: "<h3>Manufacturing Experience</h3>",
                            },
                            {
                                type: "html",
                                name: "Html.ManufacturingExperience.Instructions.1",
                                html: "<h6><span class='fontBold'>You indicated that you have experience with </span><span class='highlightBold'>Manufacturing</span>. Select all the manufacturing categories where you have experience.</h6>",
                            },
                            {
                                type: "html",
                                name: "Html.ManufacturingExperience.Instructions.2",
                                html: "<h6>Navigation Tips:</h6><h6 class='pl-5'><ul><li>Click the <span class='fontBold'>Collapse All</span> and <span class='fontBold'>Expand All</span> buttons above to collapse/expand all Manufacturing categories.</li><li>Click a Category name or the <span class='expandButtonSymbol'>&and;</span>/<span class='expandButtonSymbol'>&or;</span> button at the far-right to collapse/expand a specific set of Manufacturing sub-categories.</li></ul></h6>",
                            },
                            {
                                // Question is dynamically cloned for each manufacturing experience group by the survey
                                // customization process.
                                type: "checkbox",
                                name: "Question.ManufacturingExperience",
                                colCount: 1,
                                title: "GROUP_DESCRIPTION",
                                // The answer choices are dynamically set by the Question Builder
                                //choices: [
                                //    {
                                //        value: "1700",
                                //        text: "Interim Management (or Direct Industry Experience) > Maintenance Management",
                                //    },
                                //    {
                                //        value: "1701",
                                //        text: "Interim Management (or Direct Industry Experience) > Materials Management",
                                //    },
                                //    {
                                //        value: "1702",
                                //        text: "Interim Management (or Direct Industry Experience) > Plant Management / GM",
                                //    },
                                //],
                                hasSelectAll: true,
                                selectAllText: "SELECT ALL",
                            },
                            {
                                // Add some blank lines between manuafucturing experience groups
                                type: "html",
                                name: "Html.ManufacturingExperience.Footer",
                                html: "",
                            },
                        ],
                    },
                ],
                // Page is only visible if user has selected any "Manufacturing" experience on the Solution Skills
                // question. 'GROUPID' and 'SKILLID' tokens are populated by the Manufacturing question builder.
                visibleIf:
                    "getMatrixRowValueSumFunc('Question.SolutionSkills.[GROUPID]', [[SKILLID]]) > 0",
                //visibleIf: "getMatrixRowValueSumFunc('Question.SolutionSkills.[GROUPID]', [106520, 106521, 106522]) > 0",
            },
            //#endregion
            //#region Page.AdditionalInfo
            {
                name: SkillsSurveyPageName.AdditionalInfo,
                elements: [
                    {
                        type: "panel",
                        name: "Container.AdditionalInfo",
                        elements: [
                            {
                                type: "html",
                                name: "Html.AdditionalInfo.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.AdditionalInfo.Header.1",
                                html: "<h3>Additional Information</h3><br /><h6 class='fontBold'>You're almost done! One last question...</h6>",
                            },
                            {
                                type: "html",
                                name: "Html.AdditionalInfo.Header.2",
                                html: "<h6>Where would you like to gain more or new experience while at A&M? Be specific - list industries, solutions/enterprise services, offerings, etc.</h6>",
                            },
                            {
                                type: "html",
                                name: "Html.AdditionalInfo.Header.3",
                                html: "<h6>Note, your response will be provided to your Staffing and Operations team and <span class='fontBold'>will not</span> be visible by A&M employees in the Skills & Experience Tracker.</h6>",
                            },
                            {
                                type: "comment",
                                name: "Question.AdditionalInfo",
                                maxLength: 500,
                                //rows: 2,
                                acceptCarriageReturn: false,
                                autoGrow: true,
                                title: "Please enter your response (500 characters max.) :",
                                //titleLocation: "hidden",
                            },
                        ],
                    },
                ],
            },
            //#endregion
            // #region Page.SolutionIndustry
            {
                name: SkillsSurveyPageName.SolutionIndustry,
                elements: [
                    {
                        type: "panel",
                        name: "Container.SolutionIndustry",
                        elements: [
                            {
                                type: "html",
                                name: "Html.SolutionIndustry.Notifications",
                                html: this.defaultNotificationHTML,
                            },
                            {
                                type: "html",
                                name: "Html.SolutionIndustry.1",
                                html: "<h3>ACE Solution/Industry Preference</h3><br><h6>Drag your preferred <span class='fontBold'>Solutions/Industries</span> inside the <span class='fontBold'>Preferred Solutions/Industries</span> box and rank your preferences in DESCENDING ORDER, putting the HIGHEST priority group(s) at the TOP of the list.</h6><br><h6 class='fontBold'>Please note:</h6><h6 class='pl-5'><ul><li>You do not need to force rank all of the available <span class='fontBold'>Solutions/Industries</span> options below &mdash; please select and rank accordingly.</li><li>Your selections will be visible only to <span class='fontBold'>ACE/Solution/Industry</span> Operations and Staffing.</li><li>Your preferences will help to support staffing decisions and ensure you are included in relevant <span class='fontBold'>Solution / Industry</span> events and communications.</li><li>You can update your preferences throughout the course of the fiscal year as you gain additional project experience and your interests evolve.</li></ul></h6>",
                            },
                            {
                                type: "sortablelist",
                                name: "Question.SolutionIndustry",
                                colCount: 1,
                                title: "Preferrred Solutions/Industries:",
                                titleLocation: "top",
                                choicesByUrl: {
                                    url: this.getChoicesURL(
                                        DataElement.SolutionIndustry
                                    ),
                                    valueName: this.choicesValueField,
                                    titleName: this.choicesTitleField,
                                },
                            },
                        ],
                    },
                ],
            },
            // #endregion
        ],
        //#endregion

        //#region global survey properties
        // calculatedValues: [
        //     {
        //         name: "Question.IndustryExperience",
        //         expression: "joinGroupedQuestionAnswers('Question.IndustryExperience.')",
        //         includeIntoResult: true
        //     }
        // ],
        // sendResultOnPageNext: true,  // When set to true, use the 'OnPartialSend' event to resync survey data
        showNavigationButtons: "both",
        showProgressBar: "both",
        pageNextText: "NEXT PAGE",
        pagePrevText: "PREV PAGE",
        completeText: "COMPLETE",
        // checkErrorsMode: "onValueChanged",
        showQuestionNumbers: "off",
        // Clear data on Manuacturing and Sourcing questions when their pages are hidden (SKIL-461)
        clearInvisibleValues: "onHiddenContainer",

        //#endregion
    };
    //#endregion

    //#region methods
    /**
     * Remove any page specifications not in the supplied page name filter
     *
     * @param pageNameFilter Page name filter
     */
    public filterPages(pageNameFilter: string[]): void {
        // Validate page name filter
        if (pageNameFilter && pageNameFilter.length === 0) return;

        // Iterate through page defintions names and delete any pages not in filter. Iterate
        // backwards so that deletions won't pollute the iteration process.
        const pages = this.surveyJSON.pages;
        for (let i = this.surveyJSON.pages.length - 1; i >= 0; --i) {
            const pageName = pages[i].name;
            if (!pageName || !pageNameFilter.includes(pageName)) {
                pages.splice(i, 1);
            }
        }
    }

    /**
     * Return an array of defined page names
     */
    public get pageNames(): string[] {
        const pageNames: string[] = [];
        for (const page of this.surveyJSON.pages) {
            pageNames.push(page.name);
        }

        return pageNames;
    }
    //#endregion
}
