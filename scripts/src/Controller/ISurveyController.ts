import { IQuestion, SurveyModel } from "survey-jquery";
import { ISurveyDataProvider } from "../Data/ISurveyDataProvider";
import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { SurveySessionTimer } from "../SurveySession/SurveySessionTimer";

/**
 * Survey Controller Interface
 */
export interface ISurveyController<
    TQuestionType,
    TDataElement,
    TGroupedDataElement
> {
    // Properties
    areAnyUnsavedSurveyQuestions: boolean;

    readonly dataProvider: ISurveyDataProvider<
        TQuestionType,
        TDataElement,
        TGroupedDataElement
    >;
    readonly survey: ISurveyContainer;
    readonly surveyModel: SurveyModel;
    readonly surveyTimer: SurveySessionTimer;
    readonly isDataReloadRequired: boolean;
    readonly isDebugMode: boolean;
    isSurveyComplete: boolean;

    // Methods
    buildSurvey(
        startPageNo?: number,
        isSkipInitialDataLoad?: boolean
    ): ISurveyContainer;
    displayLoader(isOn?: boolean): void;
    displaySurveyResults(selectorName?: string): void;
    hidePageSelector(): void;
    intializePageSelector(): void;
    loadSurvey(currentPageNo?: number): void;
    refreshGroupExpansionButtons(): void;
    resetSurveyTimer(): void;
    resyncSurveyData(options: any): boolean;
    resyncPageSelector(): void;
    saveSessionPageNo(pageNo?: number): void;
    saveSurvey(
        options: any,
        returningPageNo?: number,
        areSaveMsgsDisplayed?: boolean
    ): boolean;
    setHourglass(isOn?: boolean): void;
    showPageSelector(): void;
    trackUpdatedQuestions(surveyQuestion: IQuestion): void;
}
