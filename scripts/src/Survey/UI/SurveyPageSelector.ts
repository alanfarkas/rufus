import { SurveyModel } from "survey-jquery";
import { SurveyPropertyName } from "../../Enums/SurveyPropertyName";
import { ISurveyContainer } from "../ISurveyContainer";

/*
 * Survey Page Selector
 */
export class SurveyPageSelector {
    private readonly selectorControl: JQuery<HTMLSelectElement>;
    private readonly selectorLabel: JQuery<HTMLLabelElement>;

    constructor(
        protected selectorElementName: string,
        protected labelElementName: string
    ) {
        this.selectorControl = $(`#${this.selectorElementName}`);
        this.selectorLabel = $(`#${this.labelElementName}`);
    }

    /**
     * Change Survey Page Number in Response to Selector Change
     *
     * @param surveyModel Survey model
     * @param event DOM event state object
     */
    private changeSurveyPageNo(
        surveyModel: SurveyModel,
        event: JQuery.ChangeEvent
    ): void {
        const selectedPageNo = this.selectorControl.val() as number;
        if (selectedPageNo) {
            surveyModel.currentPageNo = selectedPageNo;
        }
    }

    /**
     * Hide the survey page selector
     */
    public hide(): void {
        this.selectorControl.hide();
        this.selectorLabel.hide();
    }

    /**
     * Initialize / update the survey page selector
     *
     * @param survey Survey container
     */
    public initialize(survey: ISurveyContainer): void {
        // Exit if page selector control doesn't exist
        if (!this.selectorControl) {
            return;
        }

        // Initialize page selector
        this.selectorControl.empty();

        // Populate the page selector with the current visible page numbers and corresponding page titles
        const surveyModel = survey.surveyModel;
        const surveyPages = surveyModel.visiblePages;
        for (let i = 0; i < surveyPages.length; i++) {
            const option = document.createElement("option");
            option.value = i.toString();
            const pageTitle = survey.getSurveyProperty(
                SurveyPropertyName.PageSelectorTitle,
                surveyPages[i].name
            );
            const pageNo: string = i + 1 + "";
            option.text =
                "Page " +
                pageNo.padStart(2, "0") +
                (pageTitle ? " - " + pageTitle : "");
            this.selectorControl.append(option);
        }

        // Set selector value to match current survey page number
        this.resync(surveyModel.currentPageNo);

        // Add change event that will cause the survey to change to the selected page whenever the user interacts
        // with the page selector.
        this.selectorControl.change((event) =>
            this.changeSurveyPageNo(surveyModel, event)
        );
    }

    /**
     * Resync page selector to match the current survey page
     *
     * @param currentPageNo Current survey page number
     */
    public resync(currentPageNo: number): void {
        this.selectorControl.val(currentPageNo);
    }

    /**
     * Show the survey page selector
     */
    public show(): void {
        this.selectorControl.show();
        this.selectorLabel.show();
    }
}
