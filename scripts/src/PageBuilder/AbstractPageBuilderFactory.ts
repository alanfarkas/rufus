import { AbstractQuestionBuilderFactory } from "../QuestionBuilder/Factory/AbstractQuestionBuilderFactory";
import { IPageBuilder } from "./IPageBuilder";

/**
 * Abstract Survey Page Builder Factory
 */
export abstract class AbstractPageBuilderFactory<
    TQuestionType,
    TDataElement,
    TGroupedDataElement
> {
    constructor(
        protected questionBuilderFactory: AbstractQuestionBuilderFactory<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ) {}

    public abstract createPageBuilder(
        surveyPageName: string
    ): IPageBuilder<TQuestionType>;
}
