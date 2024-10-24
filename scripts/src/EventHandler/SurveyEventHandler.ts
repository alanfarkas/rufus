import { ISurveySession } from "../SurveySession/ISurveySession";
import { ISurveyEventHandler } from "./ISurveyEventHandler";

/**
 * Survey Event Handler
 */
export class SurveyEventHandler<TQuestionType>
    implements ISurveyEventHandler<TQuestionType>
{
    /**
     * Add survey events handlers. Any implemented survey event handler must be added here. Any custom events
     * can be added by extending this class and overriding the 'addCustomEvents' method.
     *
     * @param session Survey session
     */
    public addEventHandlers(session: ISurveySession<TQuestionType>): void {
        this.addCompletionEventHandler(session);
        this.addPageChangeEventHandler(session);
        this.addPageChangingEventHandler(session);
        this.addPageVisibleChangedEventHandler(session);
        this.addTimerEventHandler(session);
        this.addValueChangeEventHandler(session);
        this.addCustomEvents(session);
        //this.addTestEventHandler(surveyController);
    }

    /**
     * Add any custom event handlers (this method would be overwritten in sub-class)
     *
     * NOTE: Only new event handlers should be defined here. Overrides to existing
     *       event handlers should be specified as a method override.
     *
     * @param session Survey session
     */
    protected addCustomEvents(session: ISurveySession<TQuestionType>): void {
        return;
    }

    /**
     * Add survey completion event
     *
     * @param session Survey session
     */
    protected addCompletionEventHandler(
        session: ISurveySession<TQuestionType>
    ) {
        // Save the data on survey completion
        const surveyModel = session.surveyModel;
        const surveyManager = session.surveyManager;

        surveyModel.onComplete.add((sender, options) => {
            // Save survey data to database, indicating that the survey is complete
            surveyManager.saveSurvey(options, true);

            // Display survey results
            session.displaySurveyResults();
        });
    }

    /**
     * Add page change event handler
     *
     * @param session Survey session
     */
    protected addPageChangeEventHandler(
        session: ISurveySession<TQuestionType>
    ): void {
        const surveyModel = session.surveyModel;

        surveyModel.onCurrentPageChanged.add((sender, options) => {
            // Sync page selector to current survey page
            session.resyncPageSelector();

            // Refresh group expansion buttons
            session.refreshGroupExpansionButtons();

            // Scroll to top of new page
            window.scrollTo(0, 0);

            // Remove loader screen
            setTimeout(() => {
                session.displayLoader(false);
            }, 100);
        });
    }

    /**
     * Add page changing event handler
     *
     * @param session Survey session
     */
    protected addPageChangingEventHandler(
        session: ISurveySession<TQuestionType>
    ): void {
        // Intercept any page errors before user goes to previous page
        // Process any pending user entries when the user changes the survey page.

        const surveyModel = session.surveyModel;

        surveyModel.onCurrentPageChanging.add((sender, options) => {
            if (surveyModel.isCurrentPageHasErrors) {
                // Don't allow user to switch pages is there are errors on page
                options.allowChanging = false;
                session.resyncPageSelector();
            } else {
                // Display loader screen
                setTimeout(() => {
                    session.displayLoader();
                }, 100);

                // Resync survey data
                session.surveyManager.resyncSurveyData(options);
            }
        });
    }

    /**
     * Add page visible changed event handler
     *
     * @param session Survey session
     */
    protected addPageVisibleChangedEventHandler(
        session: ISurveySession<TQuestionType>
    ) {
        // Re-initialize the survey page selector whenever the visiblity of a page changes. Also
        // address data ramifications when a page becomes invisible (SKIL-461).

        const surveyModel = session.surveyModel;

        surveyModel.onPageVisibleChanged.add((sender, options) => {
            // Re-initialize survey page selector
            session.intializePageSelector();
        });
    }

    /**
     * Add timer event handler
     *
     * @param session Survey session
     */
    protected addTimerEventHandler(session: ISurveySession<TQuestionType>) {
        // Respond to survey timer events
        const survey = session.survey;
        const surveyModel = survey.surveyModel;

        surveyModel.onTimer.add((sender, options) => {
            // Process survey timer event
            survey.timer.processTimerEvent(options);
        });
    }

    /**
     * Add question value change event
     *
     * @param session Survey session
     */
    protected addValueChangeEventHandler(
        session: ISurveySession<TQuestionType>
    ): void {
        const surveyModel = session.surveyModel;

        surveyModel.onValueChanged.add((sender, options) => {
            // Reset survey timer to avoid conflicts when user is actively editing the survey.
            session.resetSurveyTimer();

            // Set the changed flag whenever the user modifies the survey.
            //session.isDataDirty = true;

            // Add the associate question type to survey state
            session.surveyManager.trackUpdatedQuestions(options.question);
        });
    }

    /**
     * Add default on started event handler
     *
     * @param session Survey session
     */
    protected addTestEventHandler(
        session: ISurveySession<TQuestionType>
    ): void {
        // NOT CURRENTLY IN USE - WAS ATTEMPTING TO USE THIS EVENT TO CLEAR THE DATA CHANGED FLAG WHEN THE
        // SURVEY IS FIRST DISPLAYED
        const surveyModel = session.surveyModel;

        surveyModel.onAfterRenderPage.add((sender) => {
            // Clear the data changed flag when the survey is first started
            //session.isDataDirty = false;
        });

        surveyModel.onAfterRenderSurvey.add((sender) => {
            // Clear the data changed flag when the survey is first started
            //session.isDataDirty = false;
        });

        surveyModel.onValueChanging.add((sender, options) => {
            // TEST
            const x = 1;
        });
    }
}
