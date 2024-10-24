import { ISurveyState } from "../Controller/ISurveyState";
import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { IPageProperties } from "./IPageProperties";

/**
 * Page Builder Interface
 */
export interface IPageBuilder<TQuestionType> {
    // Properties
    readonly pageName: string;
    readonly pageSelectorTitle: string;
    readonly definedQuestionTypes: TQuestionType[];
    readonly groupedQuestionNames: string[];    // SKIL-559


    // Methods
    build(
        survey: ISurveyContainer,
        surveyState: ISurveyState<TQuestionType>
    ): void;
    getPageProperties(): IPageProperties<TQuestionType>;
}
