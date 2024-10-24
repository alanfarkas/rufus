import { SurveyModel } from "survey-jquery";
import { SurveyUtils as Utils } from "../Base/SurveyUtils";
import { ISurveyEventHandler } from "../EventHandler/ISurveyEventHandler";
import { ISurveyContainer } from "../Survey/ISurveyContainer";
import { ISurveySpecification } from "../Survey/UI/ISurveySpecification";
import { QuestionGroupExpander } from "../Survey/UI/QuestionGroupExpander";
import { SurveyPageSelector } from "../Survey/UI/SurveyPageSelector";
import { ISurveyManager } from "../SurveyManager/ISurveyManager";
import { ISurveySession } from "./ISurveySession";
import { ISurveySessionSettings } from "./ISurveySessionSettings";
import { SurveySessionTimer } from "./SurveySessionTimer";

/**
 * Abstract Survey Session - Manages the User's Survey Session
 */
export class SurveySession<TQuestionType>
    implements ISurveySession<TQuestionType>
{
    //#region properties

    // Implemented Properties
    private collapseButtonElementName: string;
    private expandButtonElementName: string;
    public isDebugMode: boolean;
    private readonly pageSelector: SurveyPageSelector;
    private questionGroupExpander: QuestionGroupExpander;
    public survey: ISurveyContainer;
    private surveyResultsElementName: string;

    // NOT-Abstract Properties
    public readonly eventHandler: ISurveyEventHandler<TQuestionType>;
    public readonly surveyManager: ISurveyManager<TQuestionType>;
    protected surveySpecification: ISurveySpecification;

    //#endregion

    // #region constructor
    /**
     * Constructor
     *
     * @param settings Survey Session Settings
     */
    constructor(settings: ISurveySessionSettings<TQuestionType>) {
        // Set optional properties
        this.collapseButtonElementName =
            settings.collapseButtonElementName || "collapseGroups";
        this.expandButtonElementName =
            settings.expandButtonElementName || "expandGroups";
        this.isDebugMode = settings.isDebugMode;
        const pageSelectorElementName =
            settings.pageSelectorName || "pageSelector";
        const selectorLabelElementName =
            settings.selectorLabelName || "pageSelectorLabel";
        this.surveyResultsElementName =
            settings.surveyElementName || "surveyElement";
        this.pageSelector = new SurveyPageSelector(
            pageSelectorElementName,
            selectorLabelElementName
        );

        // Set and validate required properties
        if (settings.eventHandler) {
            this.eventHandler = settings.eventHandler;
        } else {
            this.handleParamValidationError(
                Utils.nameof("eventHandler", settings)
            );
        }
        if (settings.surveyManager) {
            this.surveyManager = settings.surveyManager;
            this.surveyManager.setSession(this);
        } else {
            this.handleParamValidationError(
                Utils.nameof("surveyManager", settings)
            );
        }
    }
    // #endregion

    //#region getters / setters
    // -- Toggles the display of JSON results data (used for testing purposes)
    //public get isDebugMode(): boolean {
    //    return this.surveyState.isDebugMode;
    //}
    //public set isDebugMode(debugMode: boolean) {
    //    this.surveyState.isDebugMode = debugMode;
    //}

    public get surveyModel(): SurveyModel {
        return this.survey.surveyModel;
    }

    public get surveyTimer(): SurveySessionTimer {
        return this.survey?.timer;
    }

    //#endregion

    //#region methods
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
     * Handle paramater validation errors
     *
     * @param paramName Parameter name
     * @param message Custom message (optional)
     */
    private handleParamValidationError(paramName: string, message?: string) {
        const errMsg = message || `The parameter [${paramName}] was missing`;
        console.error(errMsg);
        throw new Error(errMsg);
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
     * Start the survey session
     *
     * @param startPageNo Survey starting page number override (defaults to last accessed page)
     *
     * @returns Survey container
     */

    public start(startPageNo?: Readonly<number>): ISurveyContainer {
        // Display loader
        this.displayLoader();

        // Assemble the survey
        this.survey = this.surveyManager.assembleSurvey();

        // Validate starting page number parameter
        if (!startPageNo || !Number.isInteger(startPageNo) || startPageNo < 0) {
            // Invalid - use last visited page by user
            startPageNo = this.survey.startPageNo;
        }

        // Set starting survey page
        this.survey.setCurrentPageNo(startPageNo);

        // Add survey event handlers
        this.eventHandler.addEventHandlers(this);
        //TODO this.isDataDirty = false;

        // Initialize page selector
        this.intializePageSelector();

        // Create Question Group Expander
        this.questionGroupExpander = new QuestionGroupExpander(
            this.survey,
            this.collapseButtonElementName,
            this.expandButtonElementName
        );

        // Remove loader
        this.displayLoader(false);

        return this.survey;
    }

    //#endregion
}
