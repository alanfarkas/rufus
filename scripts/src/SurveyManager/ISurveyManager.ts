import { Question, SurveyModel } from "survey-jquery";
import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { ISurveyBuilder } from "../SurveyBuilder/ISurveyBuilder";
import { ISurveySession } from "../SurveySession/ISurveySession";
/**
 * Survey Manager Interface
 */
export interface ISurveyManager<TQuestionType> {
    // Properties
    readonly session: ISurveySession<TQuestionType>;
    readonly surveyBuilder: ISurveyBuilder<TQuestionType>;
    readonly surveyModel: SurveyModel;

    // Methods
    assembleSurvey(): ISurveyContainer;
    resyncSurveyData(options: any): boolean;
    saveSurvey(options: any, isComplete?: boolean): boolean;
    setSession(session: ISurveySession<TQuestionType>): void;
    trackUpdatedQuestions(surveyQuestion: Question): void;
}
