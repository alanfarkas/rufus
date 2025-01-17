﻿/*
 * THIS JAVASCRIPT IS GENERATED BY THE TYPESCRIPT COMPILER. MAINTENANCE SHOULD BE DONE
 * DIRECTLY ON THE SOURCE TYPESCRIPT FILE UNDER THE 'scripts\src' FOLDER
 *
 */

import * as Survey from "survey-jquery";
import { SurveyDataRow } from "../../Data/SurveyDataRow";
import { SurveyGroupedDataRow } from "../../Data/SurveyGroupedDataRow";
import { SkillsSurveyDataElement } from "../../Enums/SkillsSurveyDataElement";
import { SkillsSurveyGroupedDataElement } from "../../Enums/SkillsSurveyGroupedDataElement";
import { SkillsSurveyQuestionType } from "../../Enums/SkillsSurveyQuestionType";
import { SurveyQuestionCollapsibleState } from "../../Enums/SurveyQuestionCollapsibleState";
import { ISurveyContainer } from "../../Survey/ISurveyContainer";
import { AbstractGroupedQuestionBuilder } from "../Base/AbstractGroupedQuestionBuilder";

/**
 * DI Jurisdiction Question Builder
 */
export class DIJurisdictionQuestionBuilder extends AbstractGroupedQuestionBuilder<
    SkillsSurveyQuestionType,
    SkillsSurveyDataElement,
    SkillsSurveyGroupedDataElement
> {
    // Abstract properties
    public readonly collapsibleState: SurveyQuestionCollapsibleState =
        SurveyQuestionCollapsibleState.Collapsed;

    // Regular properties
    private readonly questionFooterTemplateName =
        "Html.DIJurisdiction.Footer";

    /**
     * Clone a survey question template across a set of groups
     *
     * @param survey Survey container
     * @param groupIndex Group index (0-based)
     * @param groupId Group id
     * @param groupDescription Group description
     * @param choices Answer choices
     * @param position Element index to clone question at (UNUSED)
     */
    //TODO See if this can be moved up to the super class
    protected cloneQuestionTemplate(
        survey: ISurveyContainer,
        groupIndex: number,
        groupId: string,
        groupDescription: string,
        choices: any[],
        position?: number
    ): number {
        const questionNameSuffix = `${survey.elementNameDelim}${groupId}`;
        const surveyModel = survey.surveyModel;

        // Clone industry experience question
        let question = surveyModel.getQuestionByName(
            this.questionName
        ) as Survey.QuestionCheckbox;
        question = question.clone() as Survey.QuestionCheckbox;
        question.name += questionNameSuffix;

        // Set question title
        question.title = groupDescription.toUpperCase();

        // Set question answer choices
        question.choices = choices;

        // Only show "Select All" option if there are multiple selections (SKIL-432)
        question.hasSelectAll = choices?.length > 1 ? true : false;

        // Add new question to question panel
        const panel = surveyModel.getPanelByName(
            this.questionContainerName
        ) as Survey.PanelModel;
        panel.addQuestion(question);

        // Clone question footer
        const htmlQuestionFooter = panel
            .getQuestionByName(this.questionFooterTemplateName)
            .clone() as Survey.Question;
        htmlQuestionFooter.name += questionNameSuffix;
        panel.addElement(htmlQuestionFooter);

        // Return dummy value
        return 0;
    }

    //TODO See if this can be moved up to the super class
    protected getQuestionGroups(): SurveyDataRow[] {
        const regions = this.dataProvider.getDataItems(
            SkillsSurveyDataElement.DIJurisdictionRegions
        );
        return regions;
    }

    //TODO See if this can be moved up to the super class
    protected getDetailRecordsByGroup(): Record<
        string,
        SurveyGroupedDataRow[]
    > {
        const countries = this.dataProvider.getDataItemsByGroup(
            SkillsSurveyGroupedDataElement.DIJurisdictionCountries
        );
        return countries;
    }

    //TODO See if this can be moved up to the super class
    protected getFirstClonePosition(survey: ISurveyContainer): number {
        return 0;
    }

    //TODO See if this can be moved up to the super class
    protected performPostBuildProcess(survey: ISurveyContainer): void {
        // Remove question template
        survey.removeQuestionFromPanel(
            this.questionName,
            this.questionContainerName
        );
        survey.removeQuestionFromPanel(
            this.questionFooterTemplateName,
            this.questionName
        );
    }
}
