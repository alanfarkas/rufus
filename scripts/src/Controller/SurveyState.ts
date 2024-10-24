/* tslint:disable:variable-name */
import { SurveyUtils as Utils } from "../Base/SurveyUtils";
import { ISurveyState } from "./ISurveyState";

/**
 * Survey State
 */
export class SurveyState<TQuestionType> implements ISurveyState<TQuestionType> {
    markQuestionsAsSaved(): void {
        //TODO Add implementation for SurveyState.marQuestionsAsSaved
        //throw new Error("Method not implemented.");
    }
    //#region properties

    //TODO * * * Migrate helper properties from Survey Controller / Manager to BaseSurveyContainer * * *

    // Survey-based names of questions that need to be reloaded due to user updates
    public readonly dirtyQuestionNames = new Set<string>();

    // Question types that need to be reloaded due to user updates
    public readonly dirtyQuestionTypes = new Set<TQuestionType>();

    // Indicates if any survey questions need to be saved back to the database
    public get hasUnsavedQuestions(): boolean {
        return this.unsavedQuestionTypes?.size > 0;
    }

    // Indicates if the survey is complete
    public isComplete = false;

    // Indicates if the survey is running in Debug Mode
    public isDebugMode = false;

    // Indicates if this is the initial data load for the survey
    public isInitialLoad = true;

    // Indicates if the survey is in the middle of loading data
    public isLoading = false;

    // Indicates if the survey needs to be reloaded to pickup updated question data saved to the database
    public get isReloadRequired(): boolean {
        return this.dirtyQuestionNames?.size > 0;
    }

    // Survey-based names of questions that need to be saved to the database due to user updates
    public unsavedQuestionNames = new Set<string>();

    // Question types that need to be saved to the database due to user updates
    public readonly unsavedQuestionTypes = new Set<string>();

    // Survey-based names of questions that need to be reloaded due to user updates, indexed by question type
    private readonly dirtyQuestionsByQuestionType = new Map<
        TQuestionType,
        Set<string>
    >();

    // Question types indexed by page name
    private readonly questionTypesByPage = new Map<string, TQuestionType[]>();

    // Question types indexed by question name root
    private readonly questionTypeByQuestion = new Map<string, TQuestionType>();

    //#endregion

    //#region getters/setters
    //#endregion

    //#region methods

    /**
     * Add question name to dirty question tracking collections
     *
     * @param questionName Question name
     */
    public addDirtyQuestion(questionName) {
        // Get question type using original (non-split) question name
        let questionType: TQuestionType;
        if (questionName) {
            const questionNameRoot =
                Utils.getSurveyElementRootName(questionName);
            questionType = this.questionTypeByQuestion.get(questionNameRoot);
        }

        // Exit if question type can't be found
        if (!questionType) {
            return;
        }

        // Add question to dirty question collections
        this.dirtyQuestionNames.add(questionName);
        this.dirtyQuestionTypes.add(questionType);
        const dirtyQuestions =
            this.dirtyQuestionsByQuestionType.get(questionType) ||
            new Set<string>();
        dirtyQuestions.add(questionName);
        this.dirtyQuestionsByQuestionType.set(questionType, dirtyQuestions);

        // Add question to unsaved question collections. Unsaved question names are truncated("split" suffix removed)
        // since it's the "combined" questions that are being saved back to the database.
        this.unsavedQuestionTypes.add(questionType as unknown as string);
        const rootQuestionName = Utils.getSurveyElementRootName(questionName);
        this.unsavedQuestionNames.add(rootQuestionName);
    }

    /**
     * Add a survey page's question types to survey state
     *
     * @param pageName Survey page name
     * @param questionTypes Array of question types associated with specified page
     */
    public addPageQuestionTypes(
        pageName: string,
        questionTypes: TQuestionType[]
    ) {
        if (pageName && questionTypes) {
            this.questionTypesByPage.set(pageName, questionTypes);
        }
    }

    /**
     * Add a survey question's question types to survey state
     *
     * @param questionName Survey question name
     * @param questionType Question type associated with specified survey question
     */
    public addQuestionTypeForQuestion(
        questionName: string,
        questionType: TQuestionType
    ) {
        if (questionName && questionType) {
            this.questionTypeByQuestion.set(questionName, questionType);
        }
    }

    /**
     * Add a set of question names to the 'unsavedQuestionNames' collection
     *
     * @param questionNames Set of question names
     */
    public addUnsavedQuestionNames(questionNames: Set<string>): void {
        this.unsavedQuestionNames = new Set([
            ...this.unsavedQuestionNames,
            ...questionNames,
        ]);
    }

    /**
     * Clear the collections of unsaved question types and names
     */
    public clearUnsavedQuestions(): void {
        this.unsavedQuestionTypes.clear();
        this.unsavedQuestionNames.clear();
    }

    /**
     * Get the dirty question types associated the specified survey page
     *
     * @param pageName Survey page name
     * @returns Set of dirty question types
     */
    public getDirtyQuestionTypesForPage(pageName: string): Set<TQuestionType> {
        const dirtyQuestionTypes: Set<TQuestionType> = new Set();
        if (pageName) {
            const questionTypes = this.getQuestionTypes(pageName);
            if (questionTypes) {
                for (const questionType of questionTypes) {
                    if (this.isQuestionTypeDirty(questionType)) {
                        dirtyQuestionTypes.add(questionType);
                    }
                }
            }
        }

        return dirtyQuestionTypes;
    }

    /**
     * Get the dirty question names associated the specified question types
     *
     * @param questionType Survey question type collection
     * @returns Set of dirty question names
     */
    public getDirtyQuestionNames(
        questionTypes: Set<TQuestionType>
    ): Set<string> {
        const dirtyQuestionNames: Set<string> = new Set();
        if (questionTypes) {
            for (const questionType of questionTypes) {
                const dirtyQuestions =
                    this.dirtyQuestionsByQuestionType.get(questionType);
                if (dirtyQuestions) {
                    for (const dirtyQuestion of dirtyQuestions) {
                        dirtyQuestionNames.add(dirtyQuestion);
                    }
                }
            }
        }

        return dirtyQuestionNames;
    }
    /**
     * Returns the question types associated with the specified survey page
     *
     * @param pageName Survey page name
     *
     * @returns Array of question types
     */
    public getQuestionTypes(pageName: string): TQuestionType[] {
        const truncatedPageName = Utils.getSurveyElementRootName(pageName);
        return this.questionTypesByPage.get(truncatedPageName);
    }

    /**
     * Returns true if the specified question type is dirty
     *
     * @param questionType Question type
     */
    public isQuestionTypeDirty(questionType: TQuestionType): boolean {
        return this.dirtyQuestionsByQuestionType.has(questionType);
    }

    /**
     * Remove the dirty questions associated with the specified question types
     *
     * @param questionTypes Set of question types to remove
     */
    public removeDirtyQuestions(questionTypes: Set<TQuestionType>): void {
        if (questionTypes) {
            Utils.removeFromSet(this.dirtyQuestionTypes, questionTypes);
            const questionsToRemove = this.getDirtyQuestionNames(questionTypes);
            Utils.removeFromSet(this.dirtyQuestionNames, questionsToRemove);
            Utils.removeFromMap(
                this.dirtyQuestionsByQuestionType,
                questionTypes
            );
            //TODO Fix logic to clear corresponding entries from dirtyQuestionsByQuestionType
        }
    }

    //#endregion
}
