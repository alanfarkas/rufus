import { IQuestion, SurveyModel } from "survey-jquery";
import { SurveyUtils as Utils } from "../Base/SurveyUtils";
import { ISurveyDataProvider } from "../Data/ISurveyDataProvider";
import { SurveyClientSettings } from "../Data/SurveyClientSettings";
import { SurveyPropertyName } from "../Enums/SurveyPropertyName";
import { IBaseSurveyEventHandler } from "../EventHandler/IBaseSurveyEventHandler";
import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { ISurveyMetaData } from "../Survey/ISurveyMetaData";
import { QuestionGroupExpander } from "../Survey/UI/QuestionGroupExpander";
import { SurveyPageSelector } from "../Survey/UI/SurveyPageSelector";
import { ISurveyBuilder } from "../SurveyBuilder/ISurveyBuilder";
import { SurveySessionSettings } from "../SurveySession/SurveySessionSettings";
import { SurveySessionTimer } from "../SurveySession/SurveySessionTimer";
import { ISurveyController } from "./ISurveyController";
import { ISurveyState } from "./ISurveyState";
import { SurveyState } from "./SurveyState";

/**
 * Abstract Survey Controller - Manages and coordinates all survey processes
 */
//TODO Refactor - Simplify load/save methods - and move some logic to survey builder / data handler
export abstract class AbstractSurveyController<
    TQuestionType,
    TDataElement,
    TGroupedDataElement
> implements
        ISurveyController<TQuestionType, TDataElement, TGroupedDataElement>
{
    /*
     * This class uses the "Template" design pattern
     *
     * Instructions for implementing this class:
     *
     *
     * Optional Tasks:
     * Additional Customizations:
     * Implementation Tips:
     * - Importing SurveyJS Libraries
     * -     controller.setDataChanged(false) - after survey is initially displayed.
     */

    //#region properties
    // Implemented Properties
    public survey: ISurveyContainer;
    protected readonly surveyState: ISurveyState<TQuestionType> =
        new SurveyState();
    protected readonly pageSelector: SurveyPageSelector;
    protected questionGroupExpander: QuestionGroupExpander;
    protected surveyResultsElementName: string;
    protected pageSelectorElementName: string;
    protected selectorLabelElementName: string;
    protected collapseButtonElementName: string;
    protected expandButtonElementName: string;

    // Abstract Properties
    public abstract readonly dataProvider: ISurveyDataProvider<
        TQuestionType,
        TDataElement,
        TGroupedDataElement
    >;
    protected abstract readonly eventHandler: IBaseSurveyEventHandler<
        TQuestionType,
        TDataElement,
        TGroupedDataElement
    >;
    protected abstract readonly surveyBuilder: ISurveyBuilder<TQuestionType>;
    // #endregion

    // #region constructor
    /**
     * Constructor
     *
     * @param settings Survey Session Settings
     */
    constructor(settings: SurveySessionSettings<TQuestionType>) {
        this.collapseButtonElementName =
            settings.collapseButtonElementName || "collapseGroups";
        this.expandButtonElementName =
            settings.expandButtonElementName || "expandGroups";
        this.isDebugMode = settings.isDebugMode;
        this.pageSelectorElementName =
            settings.pageSelectorName || "pageSelector";
        this.selectorLabelElementName =
            settings.selectorLabelName || "pageSelectorLabel";
        this.surveyResultsElementName =
            settings.surveyElementName || "surveyElement";
        this.pageSelector = new SurveyPageSelector(
            this.pageSelectorElementName,
            this.selectorLabelElementName
        );
    }
    areAnyUnsavedSurveyQuestions: boolean;
    isDataReloadRequired: boolean;
    // #endregion

    // #region abstract methods
    protected abstract getSurveySpecInstance(metaData: ISurveyMetaData);
    // #endregion

    // #region getters / setters
    public get clientSettings(): SurveyClientSettings {
        return this.survey?.clientSettings;
    }

    private get dirtyQuestionTypes(): Set<TQuestionType> {
        return this.surveyState.dirtyQuestionTypes;
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

    public get isSurveyComplete(): boolean {
        return this.surveyState.isComplete;
    }
    public set isSurveyComplete(isSurveyComplete: boolean) {
        this.surveyState.isComplete = isSurveyComplete;

        // Hide page selector as it's no longer relvant
        this.hidePageSelector();
    }

    public get isSurveyLoading(): boolean {
        return this.surveyState.isLoading;
    }
    public set isSurveyLoading(isSurveyLoading: boolean) {
        this.surveyState.isLoading = isSurveyLoading;
    }

    public get surveyModel(): SurveyModel {
        return this.survey.surveyModel;
    }

    public get surveyTimer(): SurveySessionTimer {
        return this.survey?.timer;
    }

    //#endregion

    //#region implemented methods

    /**
     * Build and display the initial survey from a JSON survey specification. A default survey event handler
     * will be implemented.
     *
     * @param startPageNo Survey starting page (defaults to NULL)
     * @param isSkipInitialDataLoad Determine if the initial data load should be skipped (defaults to FALSE)
     *
     * @returns Survey container
     */
    public buildSurvey(
        startPageNo?: number,
        isSkipInitialDataLoad = false
    ): ISurveyContainer {
        // Display loader
        this.displayLoader();

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
        if (!isSkipInitialDataLoad) {
            //this.isReloadRequired = true;
            this.loadSurvey(startPageNo);
        }

        // Add survey event handlers
        this.eventHandler.addEventHandlers(this);

        // Initialize page selector
        this.intializePageSelector();

        // Create Question Group Expander
        this.questionGroupExpander = new QuestionGroupExpander(
            this.survey,
            this.collapseButtonElementName,
            this.expandButtonElementName
        );

        // Configure and start the survey timer
        const func = (survey: ISurveyContainer, options: any) => {
            this.saveSurvey(options);
        };
        this.survey
            .configureTimer(func, this.clientSettings.autoSaveIntervalSeconds)
            .start();

        // Remove loader
        this.displayLoader(false);

        return this.survey;
    }

    /**
     * Display/remove the loader screen overlay. Default action is on.
     *
     * @param isOn Indicates if loader should be displayed or not (default is True)
     */
    public displayLoader(isOn = true): void {
        if (isOn) {
            // Display  hourglass
            this.setHourglass();

            // Display 'Loader' screen
            document.getElementById("loader").style.display = "block";
        } else {
            // Remove  hourglass
            this.setHourglass(false);

            // Remove 'Loader' screen
            document.getElementById("loader").style.display = "none";
        }
    }

    /**
     * Display survey JSON results in selected HTNML element
     *
     * @param survey Survey model
     * @param htmlElementName Name of HTML element to use for displaying the results
     */
    public displaySurveyResults(
        htmlElementName: string = this.surveyResultsElementName
    ): void {
        // Display JSON Results
        if (htmlElementName && this.isDebugMode) {
            document.querySelector(`#${htmlElementName}`).textContent =
                "Result JSON:\n" + JSON.stringify(surveyModel.data, null, 3);
        }
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
     * Hide the survey page selector
     */
    public hidePageSelector(): void {
        this.pageSelector.hide();
    }

    /**
     * Initialize / update the survey page selector
     */
    public intializePageSelector(): void {
        // Initialize page selector control
        this.pageSelector.initialize(this.survey);
    }

    /**
     * Perform core data load process
     *
     * @param currentPageNo
     * @param customParams
     */
    protected performCoreLoadProcess(currentPageNo?: number): void {
        // Perform pre-data load processing
        this.surveyBuilder.performPreLoadProcess(this.survey, this.surveyState);

        // Get employee survey data from database
        let response = this.dataProvider.getSurveyData(this.dirtyQuestionTypes);

        // Transform downloaded survey data
        response = this.surveyBuilder.transformRawSurveyData(
            this.survey,
            response
        );

        // Load survey data
        const surveyModel = this.survey.surveyModel;
        if (this.isInitialLoad) {
            // For the initial survey data load, the the "mergeData" method will be used to load data as it seems to be
            // much faster than directly assigning data to the survey ('survey.data = response.data;') and doesn't seem
            // to have any adverse side effects.
            surveyModel.mergeData(response);
        } else {
            // For resyncing operations, only "dirty" data is reloaded (SKIL-436). To handle "other" logic, its
            // necessary to reload all questions in the ancestor container for the "dirty" question type (SKIL-453).
            const dirtyData = {};
            const dirtyQuestionNames = this.survey.getRelatedQuestionNames(
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
        this.surveyBuilder.performPostLoadProcess(
            this.survey,
            this.surveyState
        );
    }

    /**
     * Load stored survey data into the survey
     *
     * @param currentPageNo
     */
    public loadSurvey(currentPageNo?: number): void {

        if (this.isReloadRequired || this.isInitialLoad) {
            // Set flag to indicate that survey load process has begun
            this.isSurveyLoading = true;

            // Perform core load process
            this.performCoreLoadProcess(currentPageNo);

            // Determine which survey page should be displayed
            if (
                currentPageNo &&
                Number.isInteger(currentPageNo) &&
                currentPageNo >= 0
            ) {
                // Use supplied page number if param is valid
                this.survey.setCurrentPageNo(currentPageNo);
            } else if (this.isInitialLoad) {
                // Otherwise, if this is the initial survey load, set survey page to
                // where user left off.
                this.survey.setCurrentPageNo(this.survey.startPageNo);
            }

            // Reset state flags
            this.isInitialLoad = false;
            this.isSurveyLoading = false;
            //this.isReloadRequired = false;
        }
    }

    /**
     * Display/Hide the group expansion buttons depending on whether or not the buttons are
     * appropriate for the active survey page.
     */
    public refreshGroupExpansionButtons(): void {
        this.questionGroupExpander.refreshGroupExpansionButtons();
    }

    /*
     * Reset the survey timer start time
     */
    public resetSurveyTimer(): void {
        this.surveyTimer?.reset();
    }

    /**
     * Resync page selector to match the current survey page
     */
    public resyncPageSelector(): void {
        this.pageSelector.resync(this.surveyModel.currentPageNo);
    }

    /**
     * Resync survey data with the backend database
     *
     * @param options
     * @param customParams
     *
     * @returns True if data was saved
     */
    public resyncSurveyData(options: any): boolean {
        // Resync survey data by saving any data changes to the server, and then
        // reloading the saved data back into the survey.
        //
        // It is necessary to reload after the save to ensure that the local data is in sync
        // with the database, as SQL server INSERT stored procedures will filter out errored
        // records(duplicate, etc.) from being saved to the database.

        // Exit if the survey is in the middle of the data loading process
        if (this.isSurveyLoading) {
            return;
        }

        // Save data to the server
        const wasDataSaved = this.saveSurvey(options);

        // Only resync if data is dirty or if a reload is required, but not if the survey
        // is in the middle of the data loading process.
        this.loadSurvey();

        return wasDataSaved;
    }

    /**
     * Save survey page number back to the database
     *
     * @param pageNo Page number (optional, if not provided then the current session page number is used)
     */
    public saveSessionPageNo(pageNo?: number): void {
        // Save survey page number to database
        pageNo ??= this.survey.getCurrentPageNo();
        this.dataProvider.saveSessionPageNo(pageNo);
    }

    /**
     * Save the survey data to the server
     *
     * @param options
     * @param returningPageNo Page number of initial survey page to display when the user re-enters the survey
     * (defaults to the current survey page).
     * @param areSaveMsgsDisplayed (defaults to false)
     *
     * @returns True if data was saved
     */
    public saveSurvey(
        options: any,
        returningPageNo?: number,
        areSaveMsgsDisplayed?: boolean
    ): boolean {
        //console.info("autosaving survey - " + new Date().toTimeString());
        if (this.surveyState.hasUnsavedQuestions && !this.survey.hasErrorsOnCurrentPage) {
            // Perform any pre-save processing
            this.surveyBuilder.performPreSaveProcess(
                this.survey,
                this.surveyState
            );

            // Update 'unsavedQuestionNames' collection to make sure that it includes all related questions in the
            // containing panel. This is to ensure that data for other questions on the same panel don't get deleted
            // (SKIL-453).
            const relatedQuestions = this.survey.getRelatedQuestionNames(
                this.surveyState.unsavedQuestionNames
            );
            this.surveyState.addUnsavedQuestionNames(relatedQuestions);

            // Save survey data back to database
            returningPageNo ??= this.getNextSurveyPageNo(options);
            const wasDataSaved = this.dataProvider.saveSurveyData(
                this.survey,
                options,
                this.surveyState.unsavedQuestionTypes,
                this.surveyState.unsavedQuestionNames,
                returningPageNo
            );

            // Mark questions as saved
            this.surveyState.markQuestionsAsSaved();

            // Clear collections of unsaved question types & names (SKIL-431, SKIL-541)
            //this.surveyState.clearUnsavedQuestions();

            // Indicate the data was saved
            return wasDataSaved;
        }

        // No data was saved
        return false;
    }

    /**
     * Set the pointer hourglass on/off. Default action is on.
     *
     * @param isOn Flag that determines if hourglass should be turned on/off (default is TRUE)
     */
    public setHourglass(isOn = true): void {
        // This arrow function sets/clears the hourglass on the navigation buttons
        const setButtonHourglass = (isHourglassOn = true) => {
            const buttonClassNames = ["prevButton", "navigateButton"];
            for (const buttonClassName of buttonClassNames) {
                const buttons =
                    document.getElementsByClassName(buttonClassName);
                for (const button of buttons as HTMLCollectionOf<HTMLElement>) {
                    if (button.style) {
                        button.style.cursor = isHourglassOn
                            ? "wait"
                            : "pointer";
                    }
                }
            }
        };

        // Set/clear hourglass on common page area (above survey)
        document.body.style.cursor = isOn ? "wait" : "default";

        // Set/clear hourglass on survey area
        document.getElementById("surveyElement").style.cursor = isOn
            ? "wait"
            : "default";

        // Set/clear hourglass on navigation buttons
        setButtonHourglass(isOn);
    }

    /**
     * Show the survey page selector
     */
    public showPageSelector(): void {
        this.pageSelector.show();
    }

    /**
     * Track updated survey questions in survey state
     *
     * @param surveyQuestion Survey question
     */
    public trackUpdatedQuestions(surveyQuestion: IQuestion): void {
        // Add question to (new) survey state question tracking collections (SKIL-462)
        if (surveyQuestion) {
            this.surveyState.addDirtyQuestion(surveyQuestion.name);
        } else {
            // TOOD Maybe add logic at Survey Controller to check for null question value before calling this method
            console.log("Warning: Null 'surveyQuestion' passed to 'AbstractSurveyController.trackUpdatedQuestions");
        }

    }

    // #endregion
}
