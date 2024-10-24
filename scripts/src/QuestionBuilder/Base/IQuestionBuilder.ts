import { ISurveyState } from "../../Controller/ISurveyState";
import { ISurveyContainer } from "../../Survey/ISurveyContainer";

/**
 * Question Builder Interface
 */
export interface IQuestionBuilder<TQuestionType> {
    // Properties
    readonly questionType: TQuestionType;
    readonly questionContainerName: string;
    readonly questionPageName: string;

    // Methods
    build(
        survey: ISurveyContainer,
        surveyState: ISurveyState<TQuestionType>
    ): void;
    refreshDynamicQuestions(survey: ISurveyContainer): void;
}
