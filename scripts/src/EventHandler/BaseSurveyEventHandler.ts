import { ISurveyController } from "../Controller/ISurveyController";
import { IBaseSurveyEventHandler } from "./IBaseSurveyEventHandler";

/**
 * Base Survey Event Handler
 */
export class BaseSurveyEventHandler<
    TQuestionType,
    TDataElement,
    TGroupedDataElement
> implements
        IBaseSurveyEventHandler<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
{
    /**
     * Add survey events handlers. Any implemented survey event handler must be added here. Any custom events
     * can be added by extending this class and overriding the 'addCustomEvents' method.
     */
    public addEventHandlers(
        surveyController: ISurveyController<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ): void {
        this.addCompletionEventHandler(surveyController);
        this.addPageChangeEventHandler(surveyController);
        this.addPageChangingEventHandler(surveyController);
        this.addPageVisibleChangedEventHandler(surveyController);
        this.addTimerEventHandler(surveyController);
        this.addValueChangeEventHandler(surveyController);
        this.addCustomEvents(surveyController);
        //this.addTestEventHandler(surveyController);
    }

    /**
     * Add any custom event handlers (this method would be overwritten in sub-class)
     *
     * NOTE: Only new event handlers should be defined here. Overrides to existing
     *       event handlers should be specified as a method override.
     *
     * @param controller Survey controller
     */
    protected addCustomEvents(
        controller: ISurveyController<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ): void {
        return;
    }

    /**
     * Add survey completion event
     *
     * @param controller Survey controller
     */
    protected addCompletionEventHandler(
        controller: ISurveyController<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ) {
        // Save the data on survey completion
        const surveyModel = controller.surveyModel;

        surveyModel.onComplete.add((sender, options) => {
            // Save survey data to database. Reset survey page number to 0, so that the user will start at the
            // first page the next time they enter the survey.
            controller.isSurveyComplete = true;
            const wasDataSaved = controller.saveSurvey(options, 0);

            // If no data was saved then issue explicit call to save page number
            if (!wasDataSaved) {
                controller.saveSessionPageNo(0);
            }

            // Display survey results
            controller.displaySurveyResults();
        });
    }

    /**
     * Add page change event handler
     *
     * @param controller Survey controller
     */
    protected addPageChangeEventHandler(
        controller: ISurveyController<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ): void {
        const surveyModel = controller.surveyModel;

        surveyModel.onCurrentPageChanged.add((sender, options) => {
            // Sync page selector to current survey page
            controller.resyncPageSelector();

            // Refresh group expansion buttons
            controller.refreshGroupExpansionButtons();

            // Scroll to top of new page
            window.scrollTo(0, 0);

            // Remove loader screen
            setTimeout(() => {
                controller.displayLoader(false);
            }, 100);
        });
    }

    /**
     * Add page changing event handler
     *
     * @param controller Survey controller
     */
    protected addPageChangingEventHandler(
        controller: ISurveyController<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ): void {
        // Intercept any page errors before user goes to previous page
        // Process any pending user entries when the user changes the survey page.

        const surveyModel = controller.surveyModel;

        surveyModel.onCurrentPageChanging.add((sender, options) => {
            if (surveyModel.isCurrentPageHasErrors) {
                // Don't allow user to switch pages is there are errors on page
                options.allowChanging = false;
                controller.resyncPageSelector();
            } else {
                // Display loader screen
                setTimeout(() => {
                    controller.displayLoader();
                }, 100);

                // Determine if new page is before or after the current page. Since the user may be
                // using the page selector to navigate, this is not as simple as checking 'options.isNextPage'
                // property.
                let isNextPage = true;
                try {
                    if (
                        options.newCurrentPage.visibleIndex <
                        options.oldCurrentPage.visibleIndex
                    ) {
                        isNextPage = false;
                    }
                } catch (e) {
                    isNextPage = false; // If error, default to forcing a resync operation
                }

                // If next page, save survey data. If previous page, it may be necessary to save and/or reload
                // the survey data to ensure that the survey is in sync with the server data.
                const wasDataSaved = isNextPage
                    ? controller.saveSurvey(options)
                    : controller.resyncSurveyData(options);

                // Save new page number in the event that no data was saved. This isn't necessary when data is
                // saved, as the page number is included the data that get saved to the server (SKIL-431).
                if (!wasDataSaved) {
                    controller.saveSessionPageNo(
                        options.newCurrentPage.visibleIndex
                    );
                }
            }
        });
    }

    /**
     * Add page visible changed event handler
     *
     * @param controller Survey controller
     */
    protected addPageVisibleChangedEventHandler(
        controller: ISurveyController<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ) {
        // Re-initialize the survey page selector whenever the visiblity of a page changes. Also
        // address data ramifications when a page becomes invisible (SKIL-461).

        const surveyModel = controller.surveyModel;

        surveyModel.onPageVisibleChanged.add((sender, options) => {
            // Re-initialize survey page selector
            controller.intializePageSelector();
        });
    }

    /**
     * Add timer event handler
     *
     * @param controller Survey controller
     */
    protected addTimerEventHandler(
        controller: ISurveyController<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ) {
        // Respond to survey timer events
        const survey = controller.survey;
        const surveyModel = survey.surveyModel;

        surveyModel.onTimer.add((sender, options) => {
            // Process survey timer event
            survey.timer.processTimerEvent(options);
        });
    }

    /**
     * Add question value change event
     *
     * @param controller Survey controller
     */
    protected addValueChangeEventHandler(
        controller: ISurveyController<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ): void {
        const surveyModel = controller.surveyModel;

        surveyModel.onValueChanged.add((sender, options) => {
            // Reset survey timer to avoid conflicts when user is actively editing the survey.
            controller.resetSurveyTimer();

            // Add the associated question type of the changed value to the survey state
            controller.trackUpdatedQuestions(options.question);
        });
    }

    /**
     * Add default on started event handler
     *
     * @param controller Survey controller
     */
    protected addTestEventHandler(
        controller: ISurveyController<
            TQuestionType,
            TDataElement,
            TGroupedDataElement
        >
    ): void {
        // NOT CURRENTLY IN USE - WAS ATTEMPTING TO USE THIS EVENT TO CLEAR THE DATA CHANGED FLAG WHEN THE
        // SURVEY IS FIRST DISPLAYED
        const surveyModel = controller.surveyModel;

        surveyModel.onAfterRenderPage.add((sender) => {
            // Clear the data changed flag when the survey is first started
            //controller.isDataDirty = false;
        });

        surveyModel.onAfterRenderSurvey.add((sender) => {
            // Clear the data changed flag when the survey is first started
            //controller.isDataDirty = false;
        });

        surveyModel.onValueChanging.add((sender, options) => {
            // TEST
            const x = 1;
        });
    }
}
