// Declare v.s. Import - This script uses a Declare statement vs the traditional (import * from '') statement to
// reference the SurveyJS global namespace when needing to instantiate a SurveyJS type (e.g. 'x = new Survey.Model()').
// or when needing to access some SurveyJS configuration object (e.g. 'Survey.Serializer').
//
// Otherwise, an import (or "exports" and "require") statements will be generated in the locally transpiled javascript
// files, causing a browser error when debugging locally with with js files vs. using the webpack minified js file.
declare const Survey: typeof import("survey-jquery");
import {
    Model,
    PageModel,
    PanelModel,
    Question,
    QuestionMatrix,
    QuestionMatrixDynamicModel,
    QuestionPanelDynamicModel,
    SurveyElement,
    SurveyModel,
} from "survey-jquery";
import { SurveyUtils as Utils } from "../Base/SurveyUtils";
import { SurveyClientSettings } from "../Data/SurveyClientSettings";
import { SurveyJSType } from "../Enums/SurveyJSType";
import { SurveyPropertyName } from "../Enums/SurveyPropertyName";
import { SurveyQuestionCollapsibleState } from "../Enums/SurveyQuestionCollapsibleState";
import { SurveyJSThemeName } from "../Enums/SurveyJSThemeName";
import { ISurveyContainer } from "./ISurveyContainer";
import { ISurveyMetaData } from "./ISurveyMetaData";
import { SurveySessionTimer } from "../SurveySession/SurveySessionTimer";
import { ISurveySpecification } from "./UI/ISurveySpecification";

/*tslint:disable:unified-signatures*/

/**
 * Base Survey Container - A "rich" object that facilitates access to the survey model and common survey model
 * properties and operations.
 */
export class BaseSurveyContainer implements ISurveyContainer {
    //#region properties
    public surveyModel: SurveyModel;
    public surveyTemplate: SurveyModel; // Copy of "raw" survey for use by build process
    public timer: SurveySessionTimer;
    private readonly propertyMap: Map<string, any> = new Map<string, any>();
    //#endregion

    //#region constructor
    public constructor(
        public readonly surveySpec: ISurveySpecification,
        public readonly metaData: ISurveyMetaData,
        public readonly themeName: SurveyJSThemeName = SurveyJSThemeName.Default
    ) {
        this.initializeSurvey(surveySpec.surveyJSON, metaData, themeName);
    }
    //#endregion

    //#region properties
    public get ADUserID(): string {
        return this.metaData?.ADUserID;
    }

    public get assignedQuestionTypes(): string[] {
        return this.metaData?.assignedQuestionTypes;
    }

    public get clientSettings(): SurveyClientSettings {
        return this.metaData?.clientSettings;
    }

    public get completionMessageHTML(): string {
        return this.surveyModel?.completedHtml;
    }
    public set completionMessageHTML(completionMessageHTML: string) {
        this.surveyModel.completedHtml = completionMessageHTML;
    }

    public get elementNameDelim(): string {
        return this.surveySpec.surveyElementNameDelim;
    }

    /**
     * Returns true is the current page has any validation errors
     */
    public get hasErrorsOnCurrentPage(): boolean {
        return this.surveyModel.isCurrentPageHasErrors;
    }

    /**
     * Returns true if any survey page has any validation errors
     */
    public get hasPageErrors(): boolean {
        return this.surveyModel.hasPageErrors();
    }

    protected readonly questionTypeByQuestionName: Record<string, string> = {};

    public get startPageNo(): number {
        return this.metaData?.startPageNo;
    }

    //#endregion

    //#region implemented methods
    /**
     * Add custom function to survey
     *
     * @param funcName Function name
     * @param func Function
     * @param isAsync Indicates if function is asynchronous (defaults to FALSE)
     */
    protected addCustomFunction(
        funcName: string,
        func: (params: any[]) => any,
        isAsync = false
    ): void {
        Survey.FunctionFactory.Instance.register(funcName, func, isAsync);
    }

    /**
     * Collapse all the collapsible questions on the survey page
     */
    public collapseQuestionGroups(): void {
        //TODO this should really use the question name property from the question builder
        for (const question of this.getAllCollapsibleQuestions("Question.")) {
            question.collapse();
        }
    }

    /**
     * Configure the survey timer. There can only be on active timer at any given time.
     *
     * @param timerFunction Function to execute at specified timer interval
     * @param intervalSeconds How often in seconds to perform specfied function
     *
     * @returns Survey timer
     */
    public configureTimer(
        timerFunction: (survey: ISurveyContainer, options: any) => void,
        intervalSeconds: number
    ): SurveySessionTimer {
        this.timer = new SurveySessionTimer(
            this,
            timerFunction,
            intervalSeconds
        );
        return this.timer;
    }

    /**
     * Expand all the collapsible questions on the current survey page
     */
    public expandQuestionGroups(): void {
        //TODO change question prefix to array to support more specifix question expansion
        const questionPrefix = this.getCurrentPage().getPropertyValue(
            SurveyPropertyName.CollapsibleQuestionPrefix
        );
        for (const question of this.getAllCollapsibleQuestions(
            questionPrefix
        )) {
            question.expand();
        }
    }

    /**
     * Find the highest level panel that's an ancestor to the specified survey element
     *
     * @param surveyElement Survey question or panel
     * @returns Survey panel (PanelModel)
     */
    public findHighestAncestorPanel(
        surveyElement: Question | PanelModel
    ): PanelModel;

    /**
     * Find the highest level panel that's an ancestor to the specified survey element
     *
     * @param elementName Survey question or panel name
     * @returns Survey panel (PanelModel)
     */
    public findHighestAncestorPanel(elementName: string): PanelModel;
    public findHighestAncestorPanel(element: any): PanelModel {
        let highestPanel: PanelModel = null;
        let surveyElement: SurveyElement;

        // Determine if parameter is a survey element or an element name. If it's a
        // name then we need to retrieve the corresponding survey element.
        if (typeof element !== "string") {
            // Parameter is a survey element
            surveyElement = element;
        } else {
            // Named element - Attempt to retrieve survey question using the supplied name
            surveyElement = this.surveyModel.getQuestionByName(element);
            if (!surveyElement) {
                // If that fails, attempt to retrieve survey panel using the supplied name
                surveyElement = this.getPanel(element);
            }
        }

        // Search ancestor elements until we've reached a page or a null value.
        if (surveyElement) {
            const parent = (surveyElement as Question).parent as PanelModel;
            //TODO parent property not availble for certain question types (MatrxiDropDown, EDUC / SOFTWARE-TOOL, etc.)
            if (parent && !parent.isPage) {
                // If parent exists but it not a page, then look recursively for highest ancestor panel
                return this.findHighestAncestorPanel(parent);
            } else {
                // No parent or parent is a page - If survey element is a panel, then it is the highest level panel.
                if (surveyElement.isPanel) {
                    highestPanel = surveyElement as PanelModel;
                }
            }
        }

        // Return highest panel or null if no ancestor panel was found
        return highestPanel;
    }

    /**
     * Returns all collapsible questions on the page that match the question prefix
     *
     * @param questionPrefix Optional question prefix to match against
     */
    private getAllCollapsibleQuestions(questionPrefix: string): Question[] {
        // Return a list of all matching questions
        return this.getAllQuestionOnPage(questionPrefix);
    }

    /**
     * Returns all questions on the page or all matching page questions if a question prefix string is provided
     *
     * @param questionPrefix Optional question prefix to match against
     */
    public getAllQuestionOnPage(questionPrefix?: string): Question[] {
        const allPageQuestions = this.getCurrentPage().questions;

        // Return all page questions if no prefix was provided
        if (!questionPrefix) {
            return allPageQuestions;
        }

        // Otherwise, return just the matching questions
        const matchingQuestions: Question[] = [];
        for (const question of allPageQuestions) {
            if (question.name.startsWith(questionPrefix)) {
                matchingQuestions.push(question);
            }
        }
        return matchingQuestions;
    }

    /**
     * Returns that names of all the survey pages
     *
     * @param surveyModel Optional survey model or survey template model to use
     */
    public getPageNames(surveyModel?: SurveyModel): string[] {
        const pageNames: string[] = [];
        const model: SurveyModel = surveyModel ? surveyModel : this.surveyModel;
        for (const page of model.pages) {
            pageNames.push(page.name);
        }
        return pageNames;
    }

    /**
     * Returns all the survey pages
     *
     * @param surveyModel Optional survey model or survey template model to use
     */
    public getPages(surveyModel?: SurveyModel): PageModel[] {
        if (surveyModel) {
            return surveyModel.pages;
        } else {
            return this.surveyModel.pages;
        }
    }

    /**
     * Return the survey template page names
     */
    public getTemplatePageNames(): string[] {
        return this.getPageNames(this.surveyTemplate);
    }

    /**
     * Return the survey template pages
     */
    public getTemplatePages(): PageModel[] {
        return this.getPages(this.surveyTemplate);
    }

    /**
     * Returns the current survey page
     */
    public getCurrentPage(): PageModel {
        return this.surveyModel.currentPage;
    }

    /**
     * Returns the current survey page number
     */
    public getCurrentPageNo(): number {
        return this.surveyModel.currentPageNo;
    }

    /**
     * Returns the specified survey page
     *
     * @param pageName Survey page name
     */
    public getPage(pageName: string): PageModel {
        return this.surveyModel.getPageByName(pageName);
    }

    /**
     * Return the specified survey page's index
     *
     * @param pageName Survey page name (defaults to current page)
     *
     * @returns Page index (or undefined if page not found)
     */
    public getPageIndex(pageName?: string): number {
        // Get specified page (or current page if page name not supplied)
        const page = pageName ? this.getPage(pageName) : this.getCurrentPage();

        // Return index of page within page array
        return this.surveyModel.pages.indexOf(page);
    }

    /**
     * Returns the specified survey panel
     *
     * @param pageName Survey panel name
     */
    public getPanel(panelName: string): PanelModel {
        return this.surveyModel.getPanelByName(panelName) as PanelModel;
    }

    /**
     * Return all questions located on the specified panel
     *
     * @param panelName Panel name
     */
    public getPanelQuestions(panelName: string): Question[] {
        let questions: Question[] = [];
        const panel = this.getPanel(panelName);
        if (panel) {
            questions = panel.questions;
        }

        return questions;
    }

    /**
     * Return the specified survey question
     *
     * @param questionName Name of survey question to retrieve
     * @param containerName Name of question container object (required if container is dynamicmatrix or dynamicpanel)
     *
     * @returns Survey question
     */
    public getQuestion(
        questionName: string,
        containerName: string = null
    ): Question {
        let question: Question;

        // First attempt to retrieve question without even looking at the container. This will work
        // if question is under a regular (non-dynamic) panel.
        question = this.surveyModel.getQuestionByName(questionName) as Question;
        if (question) {
            // Found question - return it
            return question;
        } else if (containerName === null) {
            // Question not found and container not supplied - throw error
            const error = new Error(
                `Could not find question named: [${questionName}]`
            );
            throw error;
        }

        // Can't find question on its own - check if container exists
        const container = this.surveyModel.getQuestionByName(containerName);
        if (!container) {
            const panel = this.getPanel(containerName);
            if (panel) {
                // Container is panel but is not parent of question
                const error = new Error(
                    `Could not find question named: [${questionName}] under named panel: [${containerName}]`
                );
                throw error;
            } else {
                // Container does not exist
                const error = new Error(
                    `Could not find question container named: [${containerName}]`
                );
                throw error;
            }
        }

        // Retrieve survey question - logic differs by dynamic container type
        const containerType = container.getType();
        switch (containerType) {
            // Dynamic Matrix
            case SurveyJSType.MatrixDynamic: {
                const matrix = container as QuestionMatrixDynamicModel;
                question = matrix.getColumnByName(
                    questionName
                ) as unknown as Question;
                break;
            }

            // Dynamic Panel
            case SurveyJSType.PanelDynamic: {
                const panel = container as QuestionPanelDynamicModel;
                question = panel.template.getQuestionByName(
                    questionName
                ) as unknown as Question;
                break;
            }

            // Unsupported Type
            default: {
                const error = new Error(
                    `Unsupported SurveyJS Type value: [${containerType}]`
                );
                throw error;
            }
        }

        return question;
    }

    /**
     * Return the set of survey questions that are in the same top-level panel of the specified
     * question.
     *
     * @param question Question
     */
    public getRelatedQuestionNames(question: Question): Set<string>;

    /**
     * Return the set of survey questions that are in the same top-level panel of the specified
     * question name.
     *
     * @param question Question
     */
    public getRelatedQuestionNames(questionName: string);

    /**
     * Return the set of survey questions that are in the same top-level panel for each of the
     * specified question names.
     *
     * @param questionNames Set of question names
     */
    //TODO Change to set of questions as it's not possible to find questions in a dynamic panel without the container
    public getRelatedQuestionNames(questionNames: Set<string>);

    public getRelatedQuestionNames(questions: any): any {
        //TODO comment this logic
        const relatedQuestionNames = new Set<string>();
        const questionNames =
            questions instanceof Set
                ? questions
                : typeof questions === "string"
                ? [questions]
                : [questions.name];

        // For each question name, find all the questions that are contained in the same top-level
        // panel. "HTML" questions will be omitted as they are not actual questions.
        //TODO Only consistently works for panels / panel names due to issue with findHighestAncestorPanel
        //TODO Test with muti-question logic. May not work properly if each question type's container roll into the
        //TODO    same parent panel.
        for (const name of questionNames) {
            const panel = this.findHighestAncestorPanel(name);
            if (panel) {
                const panelQuestions = this.getPanelQuestions(panel.name);
                for (const panelQuestion of panelQuestions) {
                    // Select all questions except HTML
                    if (panelQuestion.getType() !== SurveyJSType.HTML) {
                        relatedQuestionNames.add(panelQuestion.name);
                    }
                }
                relatedQuestionNames.add(panel.name);
            }
        }

        return relatedQuestionNames;
    }

    /**
     * Get custom survey property value that's either associated with the entire survey, or a specific survey
     * element (page, question, etc.).
     *
     * @param propertyName Property name
     * @param elementName Survey element name (page, question, etc.)
     * @param isMatchOnRootNameEnabled If set to true (default is true), an attempt will be made to get the property
     * value using the root (non-split) version of the survey element name if no value can be found using the supplied
     * survey element name.
     */
    public getSurveyProperty(
        propertyName: SurveyPropertyName,
        elementName?: string,
        isMatchOnRootNameEnabled?: boolean
    ): any;
    public getSurveyProperty(
        propertyName: string,
        elementName?: string,
        isMatchOnRootNameEnabled?: boolean
    ): any;
    public getSurveyProperty(
        propertyName: any,
        elementName?: any,
        isMatchOnRootNameEnabled = true
    ): any {
        if (propertyName) {
            // If a element name was provided, get the element's requested property value. This property value is
            // itself a map which contains one or more property key/value pairs.
            if (elementName) {
                // Check if their is a map entry for 'elementName'
                if (this.propertyMap.has(elementName)) {
                    // Map entry found, attempt to retrieve property value from it.
                    const elementPropertyMap: Map<string, any> =
                        this.propertyMap.get(elementName);
                    if (elementPropertyMap.has(propertyName)) {
                        return elementPropertyMap.get(propertyName);
                    }
                }
            } else {
                // Else return the standalone survey property for 'propertyName'
                return this.propertyMap.get(propertyName);
            }
        }

        // Property value not found, attempt to retrieve property value using element name root if supplied element
        // name has a "split" suffix.
        if (isMatchOnRootNameEnabled) {
            const rootElementName = Utils.getSurveyElementRootName(
                elementName,
                this.elementNameDelim
            );
            if (rootElementName !== elementName) {
                return this.getSurveyProperty(propertyName, rootElementName);
            }
        }

        // If property value not found, just return 'undefined'
        return undefined;
    }

    /**
     * Return the specified visible suvey page using the specified page index
     *
     * @param pageIndex Visible survey page index
     */
    public getVisiblePage(pageIndex: number): PageModel {
        if (Number.isInteger(pageIndex)) {
            return this.surveyModel.visiblePages[pageIndex];
        } else {
            return null;
        }
    }

    /**
     * Hide the specified survey element (panel, question, etc.)
     *
     * @param elementName Name of survey element to hide
     * @param containerName Name of survey element container object (required if container is dynamicmatrix
     * or dynamicpanel)
     *
     * @returns True if operation was successful
     */

    public hideSurveyElement(
        elementName: string,
        containerName?: string
    ): boolean {
        // If element is a panel, hide it and return successful status
        const panel = this.getPanel(elementName);
        if (panel) {
            panel.visible = false;
            return true;
        }

        // Not a panel, attempt to retrieve named survey question, hide it, and return succcessful status
        const question = this.getQuestion(elementName, containerName);
        if (question) {
            question.visible = false;
            return true;
        }
    }

    /**
     * Create the intial survey as defined in the supplied survey specification
     *
     * @param surveyJSON Survey specification (JSON)
     * @param metaData Survey metaData
     * @param themeName Survey theme name
     */
    protected initializeSurvey(
        surveyJSON: any,
        metaData: any,
        themeName: SurveyJSThemeName
    ): void {
        // Set survey theme
        this.setSurveyTheme(themeName);

        // Create initial survey & backup of original template for later use
        this.surveyModel = new Survey.Model(surveyJSON);
        this.surveyTemplate = new Survey.Model(surveyJSON);

        // Record each keypress in text area as a value change (needed for timer functionality).
        // *** This option can potentially cause a lag in the user typing experience ***
        this.surveyModel.textUpdateMode = "onTyping";

        // Add custom functions
        this.addCustomFunction(
            getMatrixRowValueFunc.name,
            getMatrixRowValueFunc
        );
        this.addCustomFunction(
            getMatrixRowValueSumFunc.name,
            getMatrixRowValueSumFunc
        );

        // Add any custom functions implemented by sub-class
        this.addCustomFunctions();

        // Make the 'select2' dropdown control available on matrix questions.
        /*tslint:disable:object-literal-sort-keys*/
        Survey.Serializer.addProperty("matrixdropdowncolumn", {
            name: "renderAs",
            category: "general",
            default: "default",
            choices: ["select2", "default"],
        });

        // Lazy load survey rows (experimental feature)
        //Survey.settings.lazyRowsRendering = true;

        // Add any custom survey settings
        this.addCustomInitializationSettings();
    }

    /*
     * Determines if the current page contains collapsible questions
     */
    public isCurrentPageCollapsible(): boolean {
        const pageName = this.getCurrentPage().name;
        const collapsibleState: SurveyQuestionCollapsibleState =
            this.getSurveyProperty(
                SurveyPropertyName.PageCollapsibleState,
                pageName
            );

        if (
            collapsibleState &&
            collapsibleState !== SurveyQuestionCollapsibleState.NotCollapsible
        ) {
            return true;
        }

        return false;
    }

    /**
     * Move the named survey page to the specified position
     *
     * @param pageName Survey page name
     * @param newPageIndex New survey page index (0-based)
     */
    public movePage(pageName: string, newPageIndex) {
        const pageIndex = this.getPageIndex(pageName);

        if (pageIndex) {
            // Remove specified page from survey
            const page = this.surveyModel.pages.splice(pageIndex, 1)[0];

            // Re-add page to specified position
            this.surveyModel.pages.splice(newPageIndex, 0, page);
        }
    }

    /**
     * Remove specified page from survey
     *
     * @param pageName Survey page name
     * @returns True if operation was successful
     */
    public removePage(pageName: string): boolean {
        let isSuccess = false;
        const surveyPage = this.surveyModel.getPageByName(pageName);
        if (surveyPage) {
            this.surveyModel.removePage(surveyPage);
            isSuccess = true;
        }

        return isSuccess;
    }

    /**
     * Remove question from survey panel element
     *
     * @param questionName Name of survey question to remove
     * @param panelName Name of containing panel element
     *
     * @returns True if operation was successful
     */
    public removeQuestionFromPanel(
        questionName: string,
        panelName: string
    ): boolean {
        let isSuccess = false;

        const panel = this.surveyModel.getPanelByName(panelName) as PanelModel;
        if (panel) {
            const question = panel.getQuestionByName(questionName);
            if (question) {
                panel.removeQuestion(question);
                isSuccess = true;
            }
        }

        return isSuccess;
    }

    /**
     * Set the current page number
     *
     * @param pageNo Page number
     */
    public setCurrentPageNo(pageNo: number): void {
        this.surveyModel.currentPageNo = pageNo;
    }

    /**
     * Set survey element custom property value
     *
     * @param surveyElement Survey element (page, question, etc.)
     * @param propertyName Property name
     * @param propertyValue Property value
     */
    public setSurveyElementProperty(
        surveyElement: SurveyElement,
        propertyName: SurveyPropertyName,
        propertyValue: any
    ): void {
        if (surveyElement) {
            // Set property value
            surveyElement.setPropertyValue(propertyName, propertyValue);
        }
    }

    /**
     * Get survey element custom property value
     *
     * @param surveyElement Survey element (page, question, etc.)
     * @param propertyName Property name
     */
    public getSurveyElementProperty(
        surveyElement: SurveyElement,
        propertyName: SurveyPropertyName
    ): any {
        if (surveyElement) {
            return surveyElement.getPropertyValue(propertyName);
        }
    }

    /**
     * Set custom survey property value that's either associated with the entire survey, or a specific survey
     * element (page, question, etc.).
     *
     * @param propertyName Property name
     * @param propertyValue Property value
     * @param elementName Survey element name (page, question, etc.)
     */
    public setSurveyProperty(
        propertyName: SurveyPropertyName,
        propertyValue: any,
        elementName?: string
    ): void;
    public setSurveyProperty(
        propertyName: string,
        propertyValue: any,
        elementName?: string
    ): void;
    public setSurveyProperty(
        propertyName: any,
        propertyValue: any,
        elementName?: any
    ): void {
        if (propertyName) {
            // If an element name was provided
            if (elementName) {
                // Create a property entry for 'propertyName' indexed by 'elementName'
                let entry = this.propertyMap.get(elementName);
                if (!entry || !(entry instanceof Map)) {
                    entry = new Map<string, any>();
                    this.propertyMap.set(elementName, entry);
                }
                entry.set(propertyName, propertyValue);
            } else {
                // Otherwise - create a standalone survey property indexed by 'propertyName'
                this.propertyMap.set(propertyName, propertyValue);
            }
        }
    }

    /**
     * Set the survey theme
     *
     * @param themeName Survey theme name
     */
    protected setSurveyTheme(themeName: SurveyJSThemeName): void {
        Survey.StylesManager.applyTheme(themeName);
    }
    //#endregion

    //#region methods optionally implemented by sub-class
    /**
     * Add custom functions to survey
     */
    protected addCustomFunctions(): void {
        return;
    }

    /**
     * Add custom survey initialization settings
     */
    protected addCustomInitializationSettings(): void {
        return;
    }
    //#endregion
}

//#region Custom Survey Functions

/*
 * Get Maxtrix question row value
 *
 * Parameter 1 - Matrix question Name
 * Parameter 2 - Matrix row name
 * Parameter 3 - Survey model (necessary if being called from another function)
 */
function getMatrixRowValueFunc(params: any[]): number {
    const matrixQuestionName: string = params[0];
    const matrixRowName: string = params[1];
    const surveyModelParm: SurveyModel = params[2];
    const surveyModel: SurveyModel = surveyModelParm
        ? surveyModelParm
        : this.survey;

    let cellValue: number = null;
    const question = surveyModel.getQuestionByName(
        matrixQuestionName
    ) as QuestionMatrix;
    if (question) {
        const rowValue = question.value;
        if (rowValue) {
            cellValue = rowValue[matrixRowName];
        }
    }

    return cellValue;
}

/*
 * Get the sum of values across multiple Maxtrix question rows
 *
 * Parameter 1 - Matrix question Name
 * Parameter 2 - Array of Matrix row names
 */
function getMatrixRowValueSumFunc(params: any[]): number {
    const matrixQuestionName: string = params[0];
    const matrixRowNamesParm: string = params[1];

    // In case row names is a single value, convert it to an array
    const rowNames = Array.isArray(matrixRowNamesParm)
        ? matrixRowNamesParm
        : [matrixRowNamesParm];

    // Accumulate the value of each specified matrix row
    let sum = 0;
    for (const rowName of rowNames) {
        const rowValue = getMatrixRowValueFunc([
            matrixQuestionName,
            rowName,
            this.survey,
        ]);
        if (!isNaN(rowValue) && +rowValue > 0) {
            // Ignore "n/a" values and non-numeric data
            sum += +rowValue;
        }
    }

    return sum;
}
//#endregion
