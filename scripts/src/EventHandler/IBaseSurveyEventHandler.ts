import { ISurveyController } from "../Controller/ISurveyController";

/**
 * Survey Event Handler Interface
 */
export interface IBaseSurveyEventHandler<
    TQuestionType,
    TDataElement,
    TGroupedDataElement
> {
    addEventHandlers(
        surveyController: ISurveyController<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ): void;
}
