/**
 * Common Survey Property Names
 */
export enum SurveyPropertyName {
    // All new members should be added in alphabetical order. Type values should be in
    // camel case.
    CollapsibleQuestionPrefix = "collapsibleQuestionPrefix",
    DataProvider = "dataProvider",
    PageCollapsibleState = "pageCollapsibleState",
    PageSelectorTitle = "pageSelectorTitle", // Used for populating the survey page selector
    QuestionType = "questionType",
    PageQuestionTypes = "pageQuestionTypes", // Array of question types used on page
}
