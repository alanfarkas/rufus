import { SurveyJSThemeName } from "../../Enums/SurveyJSThemeName";

export interface ISurveySpecification {
    // Properties
    readonly pageNames: string[];
    readonly surveyCSS: Record<string, unknown>;
    readonly surveyElementNameDelim: string;
    readonly surveyJSON: Record<string, unknown>;
    readonly themeName: SurveyJSThemeName;

    // Methods
    filterPages(pageNameFilter: string[]): void;
}
