import { IPageProperties } from "./IPageProperties";

/**
 * Survey Page Custom Properties
 */
export class PageProperties<TQuestionType>
    implements IPageProperties<TQuestionType>
{
    constructor(
        public readonly pageName: string,
        public readonly pageSelectorTitle: string,
        public readonly pageQuestionTypes: TQuestionType[]
    ) {}
}
