//
// This script launches the Skils Survey client application
//

import { SkillsSurveyController } from "./Controller/SkillsSurveyController";
import { SkillsSurveyQuestionType } from "./Enums/SkillsSurveyQuestionType";
import { SkillsSurveyEventHandler } from "./EventHandler/SkillsSurveyEventHandler";
import { SkillsSurveyManager } from "./SurveyManager/SkillsSurveyManager";
import { SurveySession } from "./SurveySession/SurveySession";
import { SurveySessionSettings } from "./SurveySession/SurveySessionSettings";

// Setup
const settings = new SurveySessionSettings<SkillsSurveyQuestionType>();
settings.isDebugMode = false;   // Set to 'true' to enable JSON data "dump" at survey completion
settings.pageSelectorName = "pageSelector";
settings.selectorLabelName = "pageSelectorLabel";
settings.surveyElementName = "surveyElement";
settings.collapseButtonElementName = "collapseGroups";
settings.expandButtonElementName = "expandGroups";
const startPageNo: number = null; // (0-based) A 'null' value indicates that the last accessed page is initially opened

// Create survey controller and start survey (CURRENT Process)
const controller = new SkillsSurveyController(settings);
const survey = controller.buildSurvey(startPageNo);

// Create survey session and start survey (NEW Process)
settings.eventHandler = new SkillsSurveyEventHandler();
settings.surveyManager = new SkillsSurveyManager();
//const survey = new SurveySession(settings).start(startPageNo);

// Display Survey (with CSS Overrides)
//TODO Try to embed this code within SurveySession.start()
// tslint:disable-next-line
$(`#${settings.surveyElementName}`)["Survey"]({
    model: survey.surveyModel,
    css: survey.surveySpec.surveyCSS,
});
$(function() {  // Handler for .ready() is called
    document.getElementById(settings.surveyElementName).style.display =
        "inline-block";
});
