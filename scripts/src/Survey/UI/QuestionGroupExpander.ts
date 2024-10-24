import { ISurveyContainer } from "../ISurveyContainer";

/**
 * Survey Question Group Expander
 */
export class QuestionGroupExpander {
    private readonly collapseButton: JQuery<HTMLElement>;
    private readonly expandButton: JQuery<HTMLElement>;

    constructor(
        protected readonly survey: ISurveyContainer,
        protected readonly collapseButtonElementName: string,
        protected readonly expandButtonElementName: string
    ) {
        this.collapseButton = $(`#${this.collapseButtonElementName}`);
        this.expandButton = $(`#${this.expandButtonElementName}`);
        this.collapseButton.click(() => survey.collapseQuestionGroups());
        this.expandButton.click(() => survey.expandQuestionGroups());
        this.refreshGroupExpansionButtons();
    }

    /**
     * Hide the expand and collapse buttons
     */
    public hidebuttons() {
        this.collapseButton.hide();
        this.expandButton.hide();
    }

    /**
     * Display/Hide the group expansion buttons depending on whether or not the buttons are
     * appropriate for the active survey page.
     */
    public refreshGroupExpansionButtons(): void {
        if (this.survey.isCurrentPageCollapsible()) {
            this.showbuttons();
        } else {
            this.hidebuttons();
        }
    }

    /**
     * Hide the expand and collapse buttons
     */
    public showbuttons() {
        this.collapseButton.show();
        this.expandButton.show();
    }
}
