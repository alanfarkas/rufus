import { ISurveyState } from "../Controller/ISurveyState";
import { SurveyPropertyName } from "../Enums/SurveyPropertyName";
import { AbstractGroupedQuestionBuilder } from "../QuestionBuilder/Base/AbstractGroupedQuestionBuilder";
import { AbstractQuestionBuilderFactory } from "../QuestionBuilder/Factory/AbstractQuestionBuilderFactory";
import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { IPageBuilder } from "./IPageBuilder";
import { IPageProperties } from "./IPageProperties";
import { PageProperties } from "./PageProperties";

/**
 * Survey Page Builder
 */
export class PageBuilder<TQuestionType, TDataElement, TGroupedDataElement>
    implements IPageBuilder<TQuestionType>
{
    //#region properties
    private displayedQuestionTypes: TQuestionType[] = [];
    public groupedQuestionNames: string[] = []; // (SKIL-559)

    //#endregion

    //#region constructor
    /**
     * Constructor
     *
     * @param questionBuilderFactory Question builder factory
     * @param pageName Survey page name
     * @param pageSelectorTitle Survey page selector title
     * @param definedQuestionTypes Array of question types that indicate which survey questions are contained on the
     * survey page
     */
    constructor(
        protected questionBuilderFactory: AbstractQuestionBuilderFactory<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >,
        public readonly pageName: string,
        public readonly pageSelectorTitle: string,
        public readonly definedQuestionTypes: TQuestionType[] = []
    ) {}
    //#endregion

    //#region methods
    /**
     * Build the survey page
     *
     * @param surveyModel Survey container
     */
    public build(
        survey: ISurveyContainer,
        surveyState: ISurveyState<TQuestionType>
    ): void {

        // Iterate through all specified questions types on page
        for (const questionType of this.definedQuestionTypes) {

            // Create the question builder for the current question type
            const questionBuilder =
                this.questionBuilderFactory.getQuestionBuilder(
                    questionType,
                    this.getPageProperties()
                );

            // Add to the list of grouped question names (SKIL-559)
            if (questionBuilder instanceof AbstractGroupedQuestionBuilder) {
                this.groupedQuestionNames.push(questionBuilder.questionName);
            }

            // Check if user is authorized for this question
            if (
                survey.assignedQuestionTypes.includes(
                    questionType as unknown as string
                )
            ) {
                // Yes - Build the authorized question
                questionBuilder.build(survey, surveyState);
                this.displayedQuestionTypes.push(questionType);
            } else {
                // No - Hide the unauthorized question
                survey.hideSurveyElement(questionBuilder.questionContainerName);
            }
        }

        // Set page properties
        this.setPageProperties(survey, surveyState);
    }

    /**
     * Return the page properties
     */
    public getPageProperties(): IPageProperties<TQuestionType> {
        return new PageProperties(
            this.pageName,
            this.pageSelectorTitle,
            this.displayedQuestionTypes
        );
    }

    /**
     * Set page-related properties
     *
     * @param survey Survey container
     * @param surveyState Survey state
     */
    protected setPageProperties(
        survey: ISurveyContainer,
        surveyState: ISurveyState<TQuestionType>
    ) {
        // Store page selector title as a survey page property to be used by the page selector control.
        survey.setSurveyProperty(
            SurveyPropertyName.PageSelectorTitle,
            this.pageSelectorTitle,
            this.pageName
        );

        // Track page's displayed question types in survey state
        surveyState.addPageQuestionTypes(
            this.pageName,
            this.definedQuestionTypes
        );
    }

    //#endregion
}
