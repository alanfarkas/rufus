import { BaseSurveyContainer } from "./BaseSurveyContainer";

/**
 * Skills Survey Container
 */
export class SkillsSurveyContainer extends BaseSurveyContainer {
    /**
     * Add custom survey initialization settings
     */
    protected addCustomInitializationSettings() {
        // Override default "RequiredText" value of '*'
        this.surveyModel.requiredText = "";

        // Update completed html property
        let completedHtml =
            "<br /><h3 class='fontBold'>Thank you for completing your Employee Profile!</h3>";
        const employeeDetailPageURL =
            "/EmployeeDetail?talentAreaID=1800&skillID=0&employeeID=" +
            this.ADUserID;
        const hyperlink =
            "<a href=" + employeeDetailPageURL + "><u>here</u></a>"; // Underline hyperlink
        completedHtml +=
            "<br /><h4 class='fontBold'>Click " +
            hyperlink +
            " to view your updated Profile in the Skills & Experience Tracker";
        completedHtml +=
            " (note, please allow approximately 5 minutes for new/updated information to appear).</h4>";
        this.completionMessageHTML = completedHtml;

        // Add custom properties to survey
        /*tslint:disable:object-literal-sort-keys*/

        //// -- Sourcing Category question - name of last page
        //Survey
        //    .Serializer
        //    .addProperty("survey", {
        //        name: SkillsSurveyPropertyName.SourcingCategoryLastPage + ":string",
        //        default: "Page.SourcingCategory.4101",
        //        category: "general",
        //    });
    }
}

// #region Custom Survey Functions

/*
 * Check if data passes validation
 *
 * @deprecated - not being actively used; only being used as example
 */
function isValidDataFunc(params: any[]): boolean {
    const questionValue: string = params[0];
    const targetValue: string = params[1];
    //const dataProvider: ISurveyDataProvider = this.survey.getPropertyValue(SurveyPropertyName.DataProvider);
    //const status = dataProvider.isDataCriteriaMet(SkillsSurveyDataValidationType.HasManufacturingData);
    //return status;
    return true;
    //return true;
    //return questionValue && questionValue.includes(targetValue);
}

// #endregion
