import { ISurveyDataProvider } from "../../Data/ISurveyDataProvider";
import { IPageProperties } from "../../PageBuilder/IPageProperties";
import { IQuestionBuilder } from "../Base/IQuestionBuilder";

/**
 * Abstract Question Builder Factory
 */
export abstract class AbstractQuestionBuilderFactory<
    TQuestionType,
    TDataElement,
    TGroupedDataElement
> {
    constructor(
        protected dataProvider: ISurveyDataProvider<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ) {}

    public abstract getQuestionBuilder(
        questionType: TQuestionType,
        pageProperties?: IPageProperties<TQuestionType>
    ): IQuestionBuilder<TQuestionType>;
}
