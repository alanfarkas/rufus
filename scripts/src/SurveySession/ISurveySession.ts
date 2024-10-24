import { SurveyModel } from "survey-jquery";
import { ISurveyEventHandler } from "../EventHandler/ISurveyEventHandler";
import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { ISurveyManager } from "../SurveyManager/ISurveyManager";
import { SurveySessionTimer } from "./SurveySessionTimer";

/**
 * Survey Session Interface
 */
export interface ISurveySession<TQuestionType> {
    // Properties
    //readonly dataProvider: ISurveyDataProvider<TDataElement, TGroupedDataElement>;
    readonly eventHandler: ISurveyEventHandler<TQuestionType>;
    isDebugMode: boolean;
    readonly survey: ISurveyContainer;
    readonly surveyManager: ISurveyManager<TQuestionType>;
    readonly surveyModel: SurveyModel;
    readonly surveyTimer: SurveySessionTimer;
    //isDataDirty: boolean;
    //isSurveyComplete: boolean;

    // Methods
    displayLoader(isOn?: boolean): void;
    displaySurveyResults(selectorName?: string): void;
    hidePageSelector(): void;
    intializePageSelector(): void;
    //loadSurvey(currentPageNo?: number): void;
    refreshGroupExpansionButtons(): void;
    resetSurveyTimer(): void;
    //resyncSurveyData(options: any): boolean;
    resyncPageSelector(): void;
    //saveSessionPageNo(pageNo?: number): void;
    //saveSurvey(options: any, returningPageNo?: number, areSaveMsgsDisplayed?: boolean): boolean;
    setHourglass(isOn?: boolean): void;
    showPageSelector(): void;
    start(startPageNo?: number): ISurveyContainer;
    //trackUpdatedQuestions(surveyQuestion: IQuestion): void;
}
