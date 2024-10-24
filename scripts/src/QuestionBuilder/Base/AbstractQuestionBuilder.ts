import { PageModel, QuestionSelectBase } from "survey-jquery";
import { ISurveyState } from "../../Controller/ISurveyState";
import { ISurveyDataProvider } from "../../Data/ISurveyDataProvider";
import { SurveyJSType } from "../../Enums/SurveyJSType";
import { SurveyPropertyName } from "../../Enums/SurveyPropertyName";
import { SurveyQuestionCollapsibleState } from "../../Enums/SurveyQuestionCollapsibleState";
import { IPageProperties } from "../../PageBuilder/IPageProperties";
import { ISurveyContainer } from "../../Survey/ISurveyContainer";
import { IQuestionBuilder } from "./IQuestionBuilder";
import { QuestionBuilderSettings } from "./QuestionBuilderSettings";
import { QuestionSelectionRefreshSpec } from "./QuestionSelectionRefreshSpec";

/**
 * Base Question Builder - Handles common question build processes.
 */
export abstract class AbstractQuestionBuilder<
    TQuestionType,
    TDataElement,
    TGroupedDataElement
> implements IQuestionBuilder<TQuestionType>
{
    //#region properties
    public readonly collapsibleState: SurveyQuestionCollapsibleState =
        SurveyQuestionCollapsibleState.NotCollapsible;
    protected readonly dataProvider: ISurveyDataProvider<
        TQuestionType,
        TDataElement,
        TGroupedDataElement
    >;
    protected readonly pageProperties: IPageProperties<TQuestionType>;
    protected propertyBag?: Record<string, any>; // Optional property collection
    public readonly questionContainerName: string; // Root-level panel element for question type
    public readonly questionName: string; // Main question for question type
    public readonly questionType: TQuestionType;

    // Question selection refresh specifications
    public readonly selectionRefreshSpecs: QuestionSelectionRefreshSpec<TDataElement>[] =
        [];
    //#endregion

    // #region constructor
    /**
     * Constructor
     *
     * @param settings Question builder initialization settings
     */
    constructor(
        settings: QuestionBuilderSettings<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ) {
        this.dataProvider = settings.dataProvider;
        this.pageProperties = settings.pageProperties;
        this.propertyBag = settings.propertyBag || {};
        this.questionContainerName = settings.questionContainerName;
        this.questionName = settings.questionName;
        this.questionType = settings.questionType;
        this.selectionRefreshSpecs = settings.selectionRefreshSpecs;
    }
    // #endregion

    //#region getters
    protected get pageSelectorTitle(): string {
        return this.pageProperties?.pageSelectorTitle;
    }
    public get questionPageName(): string {
        return this.pageProperties?.pageName;
    }
    //#endregion

    // #region implemented methods
    /**
     * Update the selections on a question with pre-populated selections (checkbox, dropdown, or radiogroup)
     *
     * @param survey Survey container
     * @param dataElement Data element contained in selection list
     * @param questionName Name of survey question to update
     * @param containerName Name of question container object (supported containers: dynamicmatrix, dynamicpanel,
     * matrix, panel)
     */
    protected updateQuestionSelections(
        survey: ISurveyContainer,
        dataElement: TDataElement,
        questionName: string = this.questionName,
        containerName: string = this.questionContainerName
    ): void {
        // Update answer choices on questions where the list of available choices can be
        // appended with user-entered "other" value(s).
        //
        // This is a necessary alternative to using the "choicesByURL" property.When using the
        // "choicesByURL" property, the possible answer choices are generated once, when the
        // survey is first loaded, and then cached for for the life of the user session.This
        // causes a problem because this cache won't contain any "other" value(s) that users
        // have entered in the same user session.

        // Retrieve question
        const question = survey.getQuestion(
            questionName,
            containerName
        ) as QuestionSelectBase;

        // Update selection list
        question.choices = this.dataProvider.getDataItems(dataElement);

        // Disable choices URL cache (this setting doesn't work - just here for reference)
        // Survey.settings.useCachingForChoicesRestfull = false;
    }
    // #endregion

    // #region methods optionally overridden by sub-class
    /**
     * Apply custom build logic to the survey question
     *
     * @param survey Survey container
     */
    public build(
        survey: ISurveyContainer,
        surveyState: ISurveyState<TQuestionType>
    ): void {
        // Set question properties
        this.setQuestionProperties(survey, surveyState);
    }

    /**
     * Refresh dynamic survey questions after survey data has been reloaded
     *
     * @param survey Survey container
     * @returns Updated survey model
     */
    public refreshDynamicQuestions(survey: ISurveyContainer): void {
        if (this.selectionRefreshSpecs) {
            for (const spec of this.selectionRefreshSpecs) {
                this.updateQuestionSelections(
                    survey,
                    spec.dataElement,
                    spec.questionName,
                    spec.questionContainerName
                );
            }
        }
    }

    /**
     * Set the page selector title on the supplied survey page
     *
     * @param survey Survey container
     * @param page Survey page
     * @param pageSelectorTitle Page selector title
     */
    protected setPageSelectorTitleProperty(
        survey: ISurveyContainer,
        page: PageModel,
        pageSelectorTitle: string
    ): void {
        if (page) {
            survey.setSurveyProperty(
                SurveyPropertyName.PageSelectorTitle,
                pageSelectorTitle,
                page.name
            );
        }
    }

    /**
     * Set question-related properties
     *
     * @param survey Survey container
     * @param questionName Question name (defaults to 'questionName' property)
     * @param containerName Name of question container element (defaults to 'questionContainerName' property)
     */
    protected setQuestionProperties(
        survey: ISurveyContainer,
        surveyState: ISurveyState<TQuestionType>,
        questionName: string = this.questionName,
        questionContainerName: string = this.questionContainerName
    ): void {
        // Store question type as survey property
        this.setQuestionTypeProperty(
            survey,
            questionName,
            questionContainerName
        );

        // Track the question type for all component question elements
        const panelQuestionNames = survey.getRelatedQuestionNames(
            questionContainerName
        );
        for (const panelQuestionName of panelQuestionNames) {
            surveyState.addQuestionTypeForQuestion(
                panelQuestionName,
                this.questionType
            );
        }
    }

    /**
     * Set the question type property on the supplied survey question so that the survey controller can track which
     * question types are "dirty" due to user input.
     *
     * @param survey Survey container
     * @param questionName Question name (defaults to 'questionName' property)
     * @param containerName Name of question container element (defaults to 'questionContainerName' property)
     */
    protected setQuestionTypeProperty(
        survey: ISurveyContainer,
        questionName: string = this.questionName,
        questionContainerName: string = this.questionContainerName
    ): void {
        // Depending on the specific question layout, the SurveyJS API will track user changes at either the named
        // question or its container element. Therefore we need to store the question type property at both the survey
        // question and corresponding container element.
        if (questionName.length > 0) {
            survey.setSurveyProperty(
                SurveyPropertyName.QuestionType,
                this.questionType,
                questionName
            );
        }
        if (questionContainerName.length > 0) {
            survey.setSurveyProperty(
                SurveyPropertyName.QuestionType,
                this.questionType,
                questionContainerName
            );
        }

        // If container is a panel, also store question type property all nested panels and questions. This will
        // facilitate the tracking of user changes on complex question layouts, "other" boxes, etc.
        for (const question of survey.getPanelQuestions(
            this.questionContainerName
        )) {
            // Skip "HTML" questions as there is no value in storing custom properties on them.
            if (question.getType() !== SurveyJSType.HTML) {
                survey.setSurveyProperty(
                    SurveyPropertyName.QuestionType,
                    this.questionType,
                    question.name
                );
            }
        }
    }
    // #endregion
}
