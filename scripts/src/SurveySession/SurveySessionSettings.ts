import { ISurveyEventHandler } from "../EventHandler/ISurveyEventHandler";
import { ISurveyManager } from "../SurveyManager/ISurveyManager";
import { ISurveySessionSettings } from "./ISurveySessionSettings";

/**
 * Survey Session Initialization Object
 */
export class SurveySessionSettings<TQuestionType>
    implements ISurveySessionSettings<TQuestionType>
{
    //#region properties
    public collapseButtonElementName: string;
    public eventHandler: ISurveyEventHandler<TQuestionType>;
    public expandButtonElementName: string;
    public isDebugMode: boolean;
    public pageSelectorName: string;
    public selectorLabelName: string;
    public surveyElementName: string;
    public surveyManager: ISurveyManager<TQuestionType>;
    //#endregion

    //tslint:disable:no-empty
    constructor() {}
}
