/*tslint:disable:unified-signatures*/
import {
    Base,
    PageModel,
    PanelModel,
    Question,
    SurveyModel,
} from "survey-jquery";
import { SurveyClientSettings } from "../Data/SurveyClientSettings";
import { SurveyJSThemeName } from "../Enums/SurveyJSThemeName";
import { SurveyPropertyName } from "../Enums/SurveyPropertyName";
import { SurveySessionTimer } from "../SurveySession/SurveySessionTimer";
import { ISurveySpecification } from "./UI/ISurveySpecification";

/**
 * Survey Container Interface
 */
export interface ISurveyContainer {
    // Properties
    readonly ADUserID: string;
    readonly assignedQuestionTypes: string[];
    readonly clientSettings: SurveyClientSettings;
    completionMessageHTML: string;
    readonly elementNameDelim: string;
    readonly hasErrorsOnCurrentPage: boolean;
    readonly hasPageErrors: boolean;
    readonly startPageNo: number;
    readonly surveyModel: SurveyModel;
    readonly surveySpec: ISurveySpecification;
    readonly surveyTemplate: SurveyModel;
    readonly themeName: SurveyJSThemeName;
    readonly timer: SurveySessionTimer;

    // Methods
    collapseQuestionGroups(): void;
    configureTimer(
        timerFunction: (survey: ISurveyContainer, options: any) => void,
        intervalSeconds: number
    ): SurveySessionTimer;
    expandQuestionGroups(): void;
    findHighestAncestorPanel(surveyElement: Question | PanelModel): PanelModel;
    findHighestAncestorPanel(elementName: string): PanelModel;
    getAllQuestionOnPage(questionPrefix?: string): Question[];
    getCurrentPage(): PageModel;
    getCurrentPageNo(): number;
    getPage(pageName: string): PageModel;
    getPageNames(surveyModel?: SurveyModel): string[];
    getPages(surveyModel?: SurveyModel): PageModel[];
    getPanel(panelName: string): PanelModel;
    getPageIndex(pageName: string): number;
    getPanelQuestions(panelName: string): Question[];
    getQuestion(questionName: string, containerName: string): Question;
    getRelatedQuestionNames(question: Question): Set<string>;
    getRelatedQuestionNames(questionName: string): Set<string>;
    getRelatedQuestionNames(questionNames: Set<string>): Set<string>;
    getSurveyElementProperty(
        elementName: Base,
        propertyName: SurveyPropertyName
    ): any;
    getSurveyProperty(
        propertyName: SurveyPropertyName,
        elementName?: string,
        isMatchOnRootNameEnabled?: boolean
    ): any;
    getSurveyProperty(propertyName: string, elementName?: string): any;
    getTemplatePageNames(): string[];
    getTemplatePages(): PageModel[];
    getVisiblePage(pageIndex: number): PageModel;
    hideSurveyElement(questionName: string, containerName?: string): boolean;
    isCurrentPageCollapsible(): boolean;
    movePage(pageName: string, newPageIndex): void;
    removePage(pageName: string): boolean;
    removeQuestionFromPanel(
        questionName: string,
        containerName: string
    ): boolean;
    setCurrentPageNo(pageNo: number): void;
    setSurveyElementProperty(
        elementName: Base,
        propertyName: SurveyPropertyName,
        propertyValue: any
    ): void;
    setSurveyProperty(
        propertyName: SurveyPropertyName,
        propertyValue: any,
        elementName?: string
    ): void;
    setSurveyProperty(
        propertyName: string,
        propertyValue: any,
        elementName?: string
    ): void;
}
