import { Question, SurveyModel } from "survey-jquery";
import { ISurveyState } from "../Controller/ISurveyState";
import { SurveyState } from "../Controller/SurveyState";
import { ISurveyDataProvider } from "../Data/ISurveyDataProvider";
import { SurveyClientSettings } from "../Data/SurveyClientSettings";
import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { ISurveyMetaData } from "../Survey/ISurveyMetaData";
import { ISurveySpecification } from "../Survey/UI/ISurveySpecification";
import { ISurveyBuilder } from "../SurveyBuilder/ISurveyBuilder";
import { ISurveySession } from "../SurveySession/ISurveySession";
import { SurveySessionTimer } from "../SurveySession/SurveySessionTimer";
import { ISurveyManager } from "./ISurveyManager";

/**
 * Survey Manager - Manages the assembly, loading, and saving of the survey
 */
export abstract class SurveyManager<
    TQuestionType,
    TDataElement,
    TGroupedElement
> implements ISurveyManager<TQuestionType>
{
    //#region concrete properties
    private _session: ISurveySession<TQuestionType>;
    protected survey: ISurveyContainer;
    protected surveyState: ISurveyState<TQuestionType> = new SurveyState();
    //#endregion

    //#region constructor
    //#endregion

    //#region abstract properties
    protected abstract readonly dataProvider: ISurveyDataProvider<
        TQuestionType,
        TDataElement,
        TGroupedElement
    >;
    public abstract readonly surveyBuilder: ISurveyBuilder<TQuestionType>;
    //#endregion

    //#region abstract methods
    protected abstract getSurveySpecInstance(metaData: ISurveyMetaData);
    //#endregion

    //#region getters / setters

    public get clientSettings(): SurveyClientSettings {
        return this.survey?.clientSettings;
    }

    private get dirtyQuestionTypes(): Set<TQuestionType> {
        return this.surveyState.dirtyQuestionTypes;
    }

    public get isAnyQuestionUnsaved(): boolean {
        return this.surveyState.hasUnsavedQuestions;
    }

    // -- Toggles the display of JSON results data (used for testing purposes)
    public get isDebugMode(): boolean {
        return this.surveyState.isDebugMode;
    }
    public set isDebugMode(debugMode: boolean) {
        this.surveyState.isDebugMode = debugMode;
    }

    public get isInitialLoad(): boolean {
        return this.surveyState.isInitialLoad;
    }
    public set isInitialLoad(isInitialLoad: boolean) {
        this.surveyState.isInitialLoad = isInitialLoad;
    }

    public get isReloadRequired(): boolean {
        return this.surveyState.isReloadRequired;
    }
    public set isReloadRequired(isReloadRequired: boolean) {
       // this.surveyState.isReloadRequired = isReloadRequired;
    }

    public get isSurveyComplete(): boolean {
        return this.surveyState.isComplete;
    }
    public set isSurveyComplete(isSurveyComplete: boolean) {
        this.surveyState.isComplete = isSurveyComplete;

        // Hide page selector as it's no longer relvant
        //this.hidePageSelector();
    }

    public get isSurveyLoading(): boolean {
        return this.surveyState.isLoading;
    }
    public set isSurveyLoading(isSurveyLoading: boolean) {
        this.surveyState.isLoading = isSurveyLoading;
    }

    public get session(): ISurveySession<TQuestionType> {
        return this._session;
    }
    public setSession(session: ISurveySession<TQuestionType>): void {
        this._session = session;
    }

    public get surveyModel(): SurveyModel {
        return this.survey.surveyModel;
    }

    public get surveyTimer(): SurveySessionTimer {
        return this.survey?.timer;
    }

    private get unsavedQuestionTypes(): Set<string> {
        return this.surveyState.unsavedQuestionTypes;
    }

    private get unsavedQuestionNames(): Set<string> {
        return this.surveyState.unsavedQuestionNames;
    }

    //#endregion

    //#region concrete methods

    /**
     * Assemble the survey
     */
    public assembleSurvey(): ISurveyContainer {
        // Get survey metdata
        const metaData = this.dataProvider.getSurveyMetaData();

        // Build the survey
        const surveySpec = this.getSurveySpecInstance(metaData);
        this.survey = this.surveyBuilder.build(
            surveySpec,
            metaData,
            this.surveyState
        );

        // Load survey data
        this.loadSurvey();

        // Configure and start the survey timer
        const func = (survey: ISurveyContainer, options: any) => {
            this.saveSurvey(options);
        };
        this.survey
            .configureTimer(func, this.clientSettings.autoSaveIntervalSeconds)
            .start();

        return this.survey;
    }

    /**
     * Return page number of the next displayed survey page
     *
     * @param options Survey event options
     */
    protected getNextSurveyPageNo(options: any): number {
        // Return the index of the next visible page. If this value is not available then just return the current
        // survey page number.
        let pageNo = options?.newCurrentPage?.visibleIndex;
        pageNo ??= this.survey.getCurrentPageNo();

        return pageNo;
    }

    /**
     * Load survey data into survey
     *
     * @param pageName The name of the page to be displayed after data is loaded.
     */
    protected loadSurvey(pageName?: string): void {
        // Determine the dirty question types on the current page
        const dirtyQuestionTypes =
            this.surveyState.getDirtyQuestionTypesForPage(pageName);

        // Exit if no dirty question types on page and not the initial survey load
        if (
            (!dirtyQuestionTypes || dirtyQuestionTypes.size === 0) &&
            !this.isInitialLoad
        ) {
            return;
        }

        // Set flag to indicate that survey load process has begun
        this.isSurveyLoading = true;

        // Perform pre-load processing
        this.performPreLoadProcess();

        // Refresh dynamic survey questions
        const questionTypesToRefresh = this.isInitialLoad
            ? null
            : dirtyQuestionTypes;
        this.refreshDynamicQuestions(questionTypesToRefresh);

        // Get employee survey data from database
        let response = this.dataProvider.getSurveyData(dirtyQuestionTypes);

        // Transform downloaded survey data
        response = this.surveyBuilder.transformRawSurveyData(
            this.survey,
            response
        );

        // Load survey data
        const surveyModel = this.survey.surveyModel;
        let dirtyQuestionNames: Set<string> = null;
        if (this.isInitialLoad) {
            // For the initial survey data load, the the "mergeData" method will be used to load data as it seems to be
            // much faster than directly assigning data to the survey ('survey.data = response.data;') and doesn't seem
            // to have any adverse side effects.
            surveyModel.mergeData(response);
        } else {
            // For resyncing operations, only "dirty" data is reloaded (SKIL-436). To handle "other" logic, its
            // necessary to reload all questions in the ancestor container for the "dirty" question type (SKIL-453).
            const dirtyData = {};
            dirtyQuestionNames = this.survey.getRelatedQuestionNames(
                this.surveyState.dirtyQuestionNames
            );
            for (const questionName of dirtyQuestionNames) {
                // Only load survey elements that are represented in the data received (SKIL-453).
                if (response[questionName]) {
                    dirtyData[questionName] = response[questionName];
                }
            }
            surveyModel.mergeData(dirtyData);
        }

        // Perform post-data load processing
        this.performPostLoadProcess();

        // Reset state flags
        //TODO determine which flags are still needed
        //TODO Clear "dirty" collections loaded on this page
        //this.surveyState.removeDirtyQuestions(dirtyQuestionTypes);
        this.isInitialLoad = false;
        this.isSurveyLoading = false;
        this.isReloadRequired = false;
    }

    /**
     * Perform post-load processing (optionally implemented by sub-class)
     */
    protected performPostLoadProcess(): void {
        return;
    }

    /**
     * Perform post-save processing (optionally implemented by sub-class)
     */
    protected performPostSaveProcess(): void {
        return;
    }

    /**
     * Perform pre-load processing (optionally implemented by sub-class)
     */
    protected performPreLoadProcess(): void {
        return;
    }

    /**
     * Perform pre-save processing (optionally implemented by sub-class)
     */
    protected performPreSaveProcess(): void {
        return;
    }

    /**
     * Perform save survey data processing
     *
     * @param options SurveyJS event information
     * @param savedPageNo Page number to save
     *
     * @returns True if data was saved
     */
    protected performSaveProcess(options: any, savedPageNo: number): boolean {
        // Perform pre-save process
        this.performPreSaveProcess();

        // Update 'unsavedQuestionNames' collection to make sure that it includes all related questions in the
        // containing panel. This is to ensure that data for other questions on the same panel don't get deleted
        // (SKIL-453).
        //TODO Possibly migrate this logic to track updated changes
        const relatedQuestions = this.survey.getRelatedQuestionNames(
            this.surveyState.unsavedQuestionNames
        );
        this.surveyState.addUnsavedQuestionNames(relatedQuestions);

        // Save survey data back to database
        const wasDataSaved = this.dataProvider.saveSurveyData(
            this.survey,
            options,
            this.surveyState.unsavedQuestionTypes,
            this.surveyState.unsavedQuestionNames,
            savedPageNo
        );

        // Perform post-save process
        this.performPostSaveProcess();

        // Indicate that data was saved
        return wasDataSaved;
    }

    /**
     * Refresh questions that must change due to user input. This is typically any question that accepts "other"
     * values.
     *
     * @param questionTypeFilter Set of types for any questions that need refreshening. If not provided (or null),
     *                             then all assigned questions will be refreshed.
     */
    protected refreshDynamicQuestions(
        questionTypeFilter: Set<TQuestionType>
    ): void {
        this.surveyBuilder.refreshDynamicQuestions(
            this.survey,
            questionTypeFilter
        );
    }

    /**
     * Resync survey data
     *
     * @param options SurveyJS event information
     *
     * @returns True if data was saved
     */
    public resyncSurveyData(options: any): boolean {
        const wasDataSaved = this.saveSurvey(options);
        this.loadSurvey(options?.newCurrentPage?.name);

        return wasDataSaved;
    }

    /**
     * Save survey data to the server
     *
     * @param options SurveyJS event information
     * @param isComplete If true, indicates that survey is complete (defaults to False)
     *
     * @returns True if data was saved
     */
    public saveSurvey(options: any, isComplete = false): boolean {
        let wasDataSaved: boolean;

        // Exit if there are any errors on current page
        if (this.survey.hasErrorsOnCurrentPage) {
            return;
        }

        // If survey is complete then saved page number is 0 (first page). Otherwise, save the number of the page
        // being navigated to.
        const savedPageNo = isComplete ? 0 : this.getNextSurveyPageNo(options);

        // Save any unsaved survey modifications
        if (this.isAnyQuestionUnsaved) {
            // Perform save process
            wasDataSaved = this.performSaveProcess(options, savedPageNo);

            // Clear collections of unsaved question types & names (SKIL-431)
            this.unsavedQuestionTypes.clear();
            this.unsavedQuestionNames.clear();

            //TODO use or delete
            //this.isReloadRequired = true;

            // Indicate the data was saved
            return true;
        } else {
            // No unsaved data - just save page number if page is changing
            if (savedPageNo !== this.survey.getCurrentPageNo()) {
                this.dataProvider.saveSessionPageNo(savedPageNo);
            }
        }

        // No data was saved
        return wasDataSaved;
    }

    /**
     * Track updated survey questions in survey state
     *
     * @param surveyQuestion Survey question
     */
    public trackUpdatedQuestions(surveyQuestion: Question): void {
        // Exit if question is null
        if (!surveyQuestion) {
            return;
        }

        // Add question to (new) survey state question tracking collections (SKIL-462)
        this.surveyState.addDirtyQuestion(surveyQuestion.name);
    }

    //#endregion
}
