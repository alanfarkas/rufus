/**
 * Common SurveyJS Object Types
 *
 * Usage: "if (question.getType() === SureyJSType.Dropdown"
 *
 * This is a perferable alternative to "if (question instanceof Dropdown)" as the latter
 * example forces a "survey-jquery" import to be included in the transpiled javascript,
 * resuting in the browser error:
 *      Uncaught TypeError: Failed to resolve module specifier "survey-jquery"
 */
export enum SurveyJSType {
    // All new members should be added in alphabetical order. Type values should be in
    // lower case.
    Checkbox = "checkbox",
    Dropdown = "dropdown",
    HTML = "html",
    Matrix = "matrix",
    MatrixDynamic = "matrixdynamic",
    Panel = "panel",
    PanelDynamic = "paneldynamic",
    Question = "question",
    RadioGroup = "radiogroup",
    Tagbox = "tagbox",
    Text = "text",
}
