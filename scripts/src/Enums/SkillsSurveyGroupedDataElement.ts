/**
 * Skills Survey Grouped Data Element - Each value represents a unique Survey data element in
 * the Skills database, that is broken out by sub-group. The enum element name is irrelevant,
 * however the value field must match the corresponding 'SurveyGroupedDataElement' enum value
 * in the 'SkillsTracker'project.
 */
export enum SkillsSurveyGroupedDataElement {
    NONE, // All new values should come after this one in alphabetical order
    Certification = "Certification",
    DIJurisdictionCountries = "DIJurisdictionCountries",
    Industry = "Industry",
    ManufacturingExperience = "ManufacturingExperience",
    ManufacturingSkillKeys = "ManufacturingSkillKeys",
    Skill = "Skill",
    SkillCategory = "SkillCategory",
    SourcingCategory = "SourcingCategory",
    SourcingCategoryGroup = "SourcingCategoryGroup",
    SourcingSkillKeys = "SourcingSkillKeys",
}
