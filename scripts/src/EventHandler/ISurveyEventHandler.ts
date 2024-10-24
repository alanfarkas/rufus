import { ISurveySession } from "../SurveySession/ISurveySession";

/**
 * Survey Event Handler Interface
 */
export interface ISurveyEventHandler<TQuestionType> {
    addEventHandlers(session: ISurveySession<TQuestionType>): void;
}
