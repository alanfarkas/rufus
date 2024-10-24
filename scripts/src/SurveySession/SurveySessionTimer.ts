import { ISurveyContainer } from "../Survey/ISurveyContainer";

/**
 * Survey Session Timer
 */
export class SurveySessionTimer {
    /* tslint:disable:variable-name */
    private _isEnabled = false;
    private _isRunning = false;
    private _startTime: Date;

    /**
     * Create a Survey Timer instance
     *
     * @param survey Survey object
     * @param timerFunction Function to execute at specified timer interval
     * @param intervalSeconds How often in seconds to perform specfied function
     */
    constructor(
        protected readonly survey: ISurveyContainer,
        protected readonly timerFunction: (
            survey: ISurveyContainer,
            options: any
        ) => void,
        protected readonly intervalSeconds: number
    ) {
        // Enable timer only if interval seconds is valid
        if (intervalSeconds > 0) {
            this.isEnabled = true;
        }
    }

    /**
     * Return the timer enabled state
     */
    public get isEnabled(): boolean {
        return this._isEnabled;
    }
    /**
     * Set the timer enabled state
     *
     * @param isEnabled Timer enabled state
     */
    private set isEnabled(isEnabled: boolean) {
        this._isEnabled = isEnabled;
    }

    /**
     * Return the timer run state
     */
    public get isRunning(): boolean {
        return this._isRunning;
    }
    /**
     * Set the timer run state
     *
     * @param isRunning Timer start time
     */
    private set isRunning(isRunning: boolean) {
        this._isRunning = isRunning;
    }

    /**
     * Process the timer event
     *
     * @param options Survey event options
     * @param isFunctionAlwaysRun If true, always execute timer function regardless of timer interval
     *
     * @returns True is function is run
     */
    public processTimerEvent(
        options: any,
        isFunctionAlwaysRun = false
    ): boolean {
        let status = false;

        // If running, only execute timer function if the specfied interval has passed or if the 'isFunctionAlwaysRun'
        // flag is set.
        const elapsedTime =
            (new Date().getTime() - this.startTime.getTime()) / 1000;
        if (
            this.isRunning &&
            (elapsedTime >= this.intervalSeconds || isFunctionAlwaysRun)
        ) {
            // Stop survey timer
            this.stop();

            // Call function
            this.timerFunction(this.survey, options);

            // Restart survey timer
            this.start();

            status = true;
        }

        return status;
    }

    /**
     * Reset the timer start time
     */
    public reset(): void {
        if (this.isRunning) {
            this.startTime = new Date();
        }
    }

    /**
     * Restart survey timer
     */
    public restart(): void {
        if (this.isRunning) {
            this.stop();
            this.start();
        }
    }

    /**
     * Start the survey timer
     */
    public start(): void {
        if (this.isEnabled && !this.isRunning) {
            this.startTime = new Date();
            this.survey.surveyModel.startTimer();
            this.isRunning = true;
        }
    }

    /**
     * Return the timer start time
     */
    public get startTime(): Date {
        return this._startTime;
    }
    /**
     * Set the timer start time
     *
     * @param startTime Timer start time
     */
    private set startTime(startTime: Date) {
        this._startTime = startTime;
    }

    /**
     * Start the survey timer
     */
    public stop(): void {
        if (this.isRunning) {
            this.survey.surveyModel.stopTimer();
            this.isRunning = false;
        }
    }
}
