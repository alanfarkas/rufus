/**
 * Survey State Interface
 */
export interface ISurveyState<TQuestionType> {
    // Properties

    /* Question types that need to be reloaded due to user updates */
    readonly dirtyQuestionTypes: Set<TQuestionType>;

    /* Survey-based names of questions that need to be reloaded due to user updates */
    readonly dirtyQuestionNames: Set<string>;

    /* Indicates if any survey questions need to be saved back to the database */
    readonly hasUnsavedQuestions: boolean;

    /* Indicates if the survey is complete */
    isComplete: boolean;

    /*  Indicates if the survey is running in Debug Mode */
    isDebugMode: boolean;

    /* Indicates if any survey questions need to be saved back to the database */
    isInitialLoad: boolean;

    /* Indicates if the survey is in the middle of loading data */
    isLoading: boolean;

    /* Indicates if the survey needs to reload dirty question data that was saved back to the database */
    readonly isReloadRequired: boolean;

    /* Question types that need to be saved to the database due to user updates */
    readonly unsavedQuestionTypes: Set<string>;

    /* Survey-based names of questions that need to be saved to the database due to user updates */
    readonly unsavedQuestionNames: Set<string>;

    // Methods
    addDirtyQuestion(questionName: string): void;
    addPageQuestionTypes(
        pageName: string,
        questionTypes: TQuestionType[]
    ): void;
    addQuestionTypeForQuestion(
        questionName: string,
        questionType: TQuestionType
    ): void;
    addUnsavedQuestionNames(questionNames: Set<string>): void;
    getDirtyQuestionTypesForPage(pageName: string): Set<TQuestionType>;
    getQuestionTypes(pageName: string): TQuestionType[];
    isQuestionTypeDirty(questionType: TQuestionType): boolean;
    markQuestionsAsSaved(): void;

}
