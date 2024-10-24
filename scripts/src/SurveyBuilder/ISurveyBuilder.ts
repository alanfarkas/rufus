import { JsonObject, SurveyModel } from "survey-jquery";
import { ISurveyState } from "../Controller/ISurveyState";
import { SurveyJSThemeName } from "../Enums/SurveyJSThemeName";
import { IQuestionBuilder } from "../QuestionBuilder/Base/IQuestionBuilder";
import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { ISurveyMetaData } from "../Survey/ISurveyMetaData";
import { ISurveySpecification } from "../Survey/UI/ISurveySpecification";

/**
 * Survey Builder Interface
 */
export interface ISurveyBuilder<TQuestionType> {
    build(
        surveySpec: ISurveySpecification,
        metaData: ISurveyMetaData,
        surveyState: ISurveyState<TQuestionType>,
        themeName?: SurveyJSThemeName
    ): ISurveyContainer;
    combineGroupedQuestionAnswers(
        survey: SurveyModel,
        questionPrefix: string,
        mappedQuestionName?: string
    ): void;
    getQuestionBuilder(
        questionType: TQuestionType
    ): IQuestionBuilder<TQuestionType>;
    performPreLoadProcess(
        survey: ISurveyContainer,
        surveyState: ISurveyState<TQuestionType>
    ): void;
    performPreSaveProcess(
        survey: ISurveyContainer,
        surveyState: ISurveyState<TQuestionType>
    ): void;
    performPostLoadProcess(
        survey: ISurveyContainer,
        surveyState: ISurveyState<TQuestionType>
    ): void;
    refreshDynamicQuestions(
        survey: ISurveyContainer,
        updatedQuestionTypes?: Set<TQuestionType>
    ): void;
    removeSurveyPages(
        surveyModel: SurveyModel,
        questionPageNames: string[]
    ): void;
    splitGroupedQuestions(
        survey: ISurveyContainer,
        data: JsonObject
    ): JsonObject;
    transformRawSurveyData(
        survey: ISurveyContainer,
        data: JsonObject
    ): JsonObject;
}
