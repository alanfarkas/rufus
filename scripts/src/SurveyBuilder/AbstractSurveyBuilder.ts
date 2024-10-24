import {
    JsonObject,
    MatrixRowModel,
    QuestionMatrixModel,
    QuestionSelectBase,
    SurveyModel,
} from "survey-jquery";
import { ISurveyState } from "../Controller/ISurveyState";
import { ISurveyDataProvider } from "../Data/ISurveyDataProvider";
import { SurveyJSType } from "../Enums/SurveyJSType";
import { SurveyJSThemeName } from "../Enums/SurveyJSThemeName";
import { AbstractPageBuilderFactory } from "../PageBuilder/AbstractPageBuilderFactory";
import { IPageBuilder } from "../PageBuilder/IPageBuilder";
import { IQuestionBuilder } from "../QuestionBuilder/Base/IQuestionBuilder";
import { AbstractQuestionBuilderFactory } from "../QuestionBuilder/Factory/AbstractQuestionBuilderFactory";
import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { ISurveySpecification } from "../Survey/UI/ISurveySpecification";
import { ISurveyBuilder } from "./ISurveyBuilder";
import { ISurveyMetaData } from "../Survey/ISurveyMetaData";
import { SurveyUtils as Utils } from "../Base/SurveyUtils";

/**
 * Common Survey Building Operations
 */
export abstract class AbstractSurveyBuilder<
    TQuestionType,
    TDataElement,
    TGroupedDataElement
    > implements ISurveyBuilder<TQuestionType>
{
    // #region fields
    protected groupedQuestionNames = new Set<string>(); // SKIL - 559
    protected abstract pageBuilderFactory: AbstractPageBuilderFactory<
        TQuestionType,
        TDataElement,
        TGroupedDataElement
    >;
    protected abstract questionBuilderFactory: AbstractQuestionBuilderFactory<
        TQuestionType,
        TDataElement,
        TGroupedDataElement
    >;
    // #endregion

    // #region constructor
    constructor(
        public readonly dataProvider: ISurveyDataProvider<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ) { }
    // #endregion

    // #region properties
    // #endregion

    // #region abstract methods
    protected abstract initializeSurvey(
        surveyJSONSpec: ISurveySpecification,
        metaData: ISurveyMetaData,
        themeName?: SurveyJSThemeName
    ): ISurveyContainer;
    // #endregion

    // #region implemented methods
    ///**
    // * Add custom function to survey
    // *
    // * @param funcName Function name
    // * @param func Function
    // * @param isAsync Indicates if function is asynchronous (defaults to FALSE)
    // */
    //protected addCustomFunction(funcName: string, func: (params: any[]) => any, isAsync: boolean = false): void {
    //    Survey.FunctionFactory.Instance.register(funcName, func, isAsync);
    //}

    /**
     * Build the survey
     *
     * @param surveySpec Survey specification (JSON)
     * @param metaData Survey meta-data
     * @param surveyState Survey state
     * @param themeName Survey theme name (optional)
     *
     * @returns Survey container
     */
    public build(
        surveySpec: ISurveySpecification,
        metaData: ISurveyMetaData,
        surveyState: ISurveyState<TQuestionType>,
        themeName?: SurveyJSThemeName
    ): ISurveyContainer {
        // Generate the survey page builders
        const assignedPageNames: string[] = [];
        const surveyPageBuilders = this.generatePageBuilders(
            surveySpec.pageNames,
            metaData.assignedQuestionTypes,
            assignedPageNames
        );

        // Remove unassigned pages from survey spec (SKIL-521)
        surveySpec.filterPages(assignedPageNames);

        // Initialize the survey
        const survey = this.initializeSurvey(surveySpec, metaData, themeName);

        // Prepare the survey pages
        for (const surveyPageBuilder of surveyPageBuilders) {

            // Build each survey page
            surveyPageBuilder.build(survey, surveyState);

            // Populate the set of grouped question names (SKIL-559)
            surveyPageBuilder.groupedQuestionNames.forEach((name: string) => this.groupedQuestionNames.add(name));
        }

        return survey;
    }

    /**
     * Map answers for questions with the same prefix to a single question. This method
     * simplifies the process of saving grouped question data back to the database.
     *
     * @param survey Survey model
     * @param questionPrefix Question prefix to match on
     * @param mappedQuestionName Name of question to map all the matching question answers to. This is
     * an optional field that defaults to the question prefix, minus the last trailing character.
     */
    public combineGroupedQuestionAnswers(
        survey: SurveyModel,
        questionPrefix: string,
        mappedQuestionName?: string
    ): void {
        const isPlainObject = (obj) => {
            return Object.prototype.toString.call(obj) === "[object Object]";
        };

        // Validate mapped question name param
        if (!mappedQuestionName || mappedQuestionName.length === 0) {
            // If mapped question name not supplied, then set it to question prefix less
            // the assumed trailing period character.
            mappedQuestionName = questionPrefix.slice(0, -1);
        }

        // Search through all the survey questions for questions with the matching prefix
        const questions = survey.getAllQuestions();
        let combinedAnswers: any[] = [];
        const combinedMatrixAnswers: Record<string, any> = {};
        let isMatrixQuestion = false;
        for (const question of questions) {
            // Skip any questions that aren't a match
            if (question.name.indexOf(questionPrefix) !== 0) {
                continue;
            }

            // Skip any matched questions that don't have any selected answers
            const questionAnswers = question.value;
            if (!questionAnswers) {
                continue;
            }

            // Add the matched questions's answers to a master list
            if (Array.isArray(questionAnswers)) {
                // "Common" Question Type
                combinedAnswers = combinedAnswers.concat(questionAnswers);
            } else {
                // Matrix Question Type
                Object.assign(combinedMatrixAnswers, questionAnswers);
                isMatrixQuestion = true;
            }
        }

        // Store all the answers for the matching questions to a single question name
        survey.setValue(
            mappedQuestionName,
            isMatrixQuestion ? combinedMatrixAnswers : combinedAnswers
        );
    }

    /**
     * Generate the page builders for the specified survey pages.Only page builders for pages that contain
     * any assigned question type will be generated.
     *
     * This list of assigned page names will be returned in the'assignedPageNames' parameter.
     *
     * @param pageNames Selected page names (should be arranged in preferred build order)
     * @param assignedQuestionTypes Assigned question types
     * @param assignedPageNames Array to hold assigned page names
     *
     * @returns The survey page builders
     */
    protected generatePageBuilders(
        pageNames: string[],
        assignedQuestionTypes: string[],
        assignedPageNames: string[]
    ): IPageBuilder<TQuestionType>[] {
        const pageBuilders: IPageBuilder<TQuestionType>[] = [];
        for (const surveyPage of pageNames) {
            const pageBuilder =
                this.pageBuilderFactory.createPageBuilder(surveyPage);
            if (
                Utils.hasCommonElements(
                    pageBuilder.definedQuestionTypes,
                    assignedQuestionTypes
                )
            ) {
                pageBuilders.push(pageBuilder);
                assignedPageNames.push(surveyPage);
            }
        }

        return pageBuilders;
    }

    /**
     * Return question builder for specified question type
     *
     * @param questionTypeEnum Question type enum type
     * @param questionTypeList List of question types to produce question builders for (optional)
     *
     * @returns An array of survey question builders
     */
    public getQuestionBuilder(
        questionType: TQuestionType
    ): IQuestionBuilder<TQuestionType> {
        return this.questionBuilderFactory.getQuestionBuilder(questionType);
    }

    /**
     * Return an array of survey question builders for any questions assigned to the current user.
     * An optional question type filter can be provided.
     *
     * @param assignedQuestionTypes List of question types assigned to the current user
     * @param surveyTemplate Survey model template
     * @param questionTypeFilter List of question types to produce question builders for (optional)
     *
     * @returns An array of survey question builders
     */
    protected getQuestionBuilders(
        assignedQuestionTypes: string[],
        surveyTemplate: SurveyModel,
        questionTypeFilter?: TQuestionType[]
    ): IQuestionBuilder<TQuestionType>[] {
        const builders: IQuestionBuilder<TQuestionType>[] = [];

        // Add all question builder instances to array. If a question type list was provided, use that to filter the
        // list of question builders returned (SKIL-521).
        for (const questionType of assignedQuestionTypes) {
            if (
                (!questionTypeFilter ||
                    questionTypeFilter.includes(
                        questionType as unknown as TQuestionType
                    )) &&
                assignedQuestionTypes.includes(questionType) // Only add assigned questions (SKIL-536)
            ) {
                const builder = this.getQuestionBuilder(
                    questionType as unknown as TQuestionType
                );
                if (builder) {
                    builders.push(builder);
                }
            }
        }

        // Sort the builders based on the initial survey question order so that question build process order is
        // driven by the survey gui definition. This sort logic is based on the example "Sorting based on another array"
        // at: https://dev.to/maciekgrzybek/ultimate-guide-to-sorting-in-javascript-and-typescript-4al9
        const surveyPages = surveyTemplate.pages;
        const surveyPageNames: string[] = [];
        surveyPages.forEach((surveyPage) =>
            surveyPageNames.push(surveyPage.name)
        );
        builders.sort(
            (a, b) =>
                surveyPageNames.indexOf(a.questionPageName) -
                surveyPageNames.indexOf(b.questionPageName)
        );

        return builders;
    }

    /**
     * Remove survey pages
     *
     * @param surveyPageNames Array of survey page names to remove
     */
    public removeSurveyPages(
        survey: SurveyModel,
        surveyPageNames: string[]
    ): SurveyModel {
        const surveyPages = survey.getPagesByNames(surveyPageNames);
        for (const surveyPage of surveyPages) {
            survey.removePage(surveyPage);
        }

        return survey;
    }

    /**
     * Re-assign data values mapped to a conslidated question  (ex. "Question.Industry")
     * to the approriate "question group" (ex. "Question.Industry.601", "Question.Industry.602")
     * based on the valid choices (ex. "801", "802", "803") of each individual survey question.
     *
     * This method simplifies the process of loading grouped question data from the database,
     * directly into the survey.
     *
     * This method also initializes empty matrix rows with a default valaue
     *
     * @param survey Survey container
     * @param data Loaded question data (JSON object)
     * @param defaultMatrixRowValue This value is used to initialize empty matrix rows (defaults to "-1")
     *
     * @returns Update question data (JSON object)
     */
    public splitGroupedQuestions(
        survey: ISurveyContainer,
        data: JsonObject,
        defaultMatrixRowValue = "-1"
    ): JsonObject {
        /**
         * Checks if a javascript object is empty
         *
         * @param object Javascript object
         */
        function isEmpty(object) {
            return Object.keys(object).length === 0;
        }

        // Loop through all survey questions
        const allQuestions = survey.surveyModel.getAllQuestions();
        Object.keys(data).forEach((originalQuestionName) => {
            // Look for any matching questions that have the same prefix followed
            // by a period.
            allQuestions.forEach((question: QuestionSelectBase) => {
                // If question name starts with ....
                if (
                    question.name.startsWith(
                        originalQuestionName + survey.elementNameDelim
                    )
                ) {
                    const questionValue = [];
                    const matrixQuestionValue = {};

                    // Matrix questions and other questions have different logic since their
                    // values are stored differently.
                    if (question.getType() !== SurveyJSType.Matrix) {
                        // Regular question
                        if (question.choices) {
                            // Loop through all answer choices
                            question.choices.forEach((choiceItem) => {
                                // Find any data mapped to any of these answer choices
                                const index = data[
                                    originalQuestionName
                                ].indexOf(choiceItem.value);
                                if (index !== -1) {
                                    // Add data to collection
                                    questionValue.push(choiceItem.value);

                                    // Delete data mapped to original question name
                                    data[originalQuestionName].splice(index, 1);
                                }
                            });

                            // Update "split" question with corresponding data
                            if (questionValue.length > 0) {
                                data[question.name] = questionValue;
                            }
                        }
                    } else {
                        // Matrix Question - loop through all matrix rows
                        const matrixQuestion =
                            question as unknown as QuestionMatrixModel;
                        const rows: MatrixRowModel[] = matrixQuestion.rows;
                        const questionData = data[originalQuestionName];
                        for (const row of rows) {
                            // Look for any data that is mapped to the question row
                            const rowValue = row.value;
                            const dataValue = questionData[rowValue];
                            if (dataValue) {
                                // Add data to collection
                                matrixQuestionValue[rowValue] = dataValue;

                                // Delete data mapped to original question name
                                delete questionData[rowValue];
                            } else {
                                // No pre-existing data - set matrix row to default value
                                matrixQuestionValue[rowValue] =
                                    defaultMatrixRowValue;
                            }

                            // Update "split" question with corresponding data
                            if (!isEmpty(matrixQuestionValue)) {
                                data[question.name] = matrixQuestionValue;
                            }
                        }
                    }
                }
            });
        });

        return data;
    }

    // #endregion

    // #region methods optionally implemented by sub-class

    /* tslint:disable:no-empty */

    /**
     * Perform pre-data load processing (optionally implemented by sub-class)
     *
     * @param survey Survey container
     * @param surveyState Survey state
     */
    //TODO Remove this after Survey Session implementation
    public performPreLoadProcess(
        survey: ISurveyContainer,
        surveyState: ISurveyState<TQuestionType>
    ): void {
        return;
    }

    /**
     * Perform any neccessary processing that's required before survey data is saved
     * back to the database (optionally implemented by sub-class).
     *
     * @param survey Survey container
     * @param surveyState Survey state
     */
    //TODO Remove this after Survey Session implementation
    public performPreSaveProcess(
        survey: ISurveyContainer,
        surveyState: ISurveyState<TQuestionType>
    ): void {
        return;
    }

    /**
     * Perform post-data load processing (optionally implemented by sub-class)
     *
     * @param survey Survey container
     * @param surveyState Survey state
     */
    //TODO Remove this after Survey Session implementation
    public performPostLoadProcess(
        survey: ISurveyContainer,
        surveyState: ISurveyState<TQuestionType>
    ): void {
        return;
    }

    /**
     * Refresh dynamic survey questions after data has been loaded / re-loaded. (optionally implemented by sub-class)
     *
     * @param survey Survey object
     * @param updatedQuestionTypes Set of types for any questions that need refreshening. If not provided (or null),
     *                             then all assigned questions will be refreshed.
     */
    //TODO Remove this after Survey Session implementation
    public refreshDynamicQuestions(
        survey: ISurveyContainer,
        updatedQuestionTypes?: Set<TQuestionType>
    ): void {
        // Refresh all questions assigned to the current user or just the questions provided.
        const questionTypeFilter = updatedQuestionTypes
            ? Array.from(updatedQuestionTypes)
            : null;
        const questionBuilders = this.getQuestionBuilders(
            survey.assignedQuestionTypes,
            survey.surveyTemplate,
            questionTypeFilter
        );
        for (const questionBuilder of questionBuilders) {
            questionBuilder.refreshDynamicQuestions(survey);
        }
    }

    /**
     * Perform any necessary transformations on the downloaded survey data
     *
     * @param survey Survey container
     * @param data Downloaded survey data
     */
    //TODO Remove this after Survey Session implementation
    public transformRawSurveyData(
        survey: ISurveyContainer,
        data: JsonObject
    ): JsonObject {
        return data;
    }

    // #endregion
}
