import { ISurveyEventHandler } from "../EventHandler/ISurveyEventHandler";
import { ISurveyManager } from "../SurveyManager/ISurveyManager";

/**
 * Survey Session Settings Interface
 */
export interface ISurveySessionSettings<TQuestionType> {
    collapseButtonElementName: string;
    eventHandler: ISurveyEventHandler<TQuestionType>;
    expandButtonElementName: string;
    isDebugMode: boolean;
    pageSelectorName: string;
    selectorLabelName: string;
    surveyElementName: string;
    surveyManager: ISurveyManager<TQuestionType>;
}
