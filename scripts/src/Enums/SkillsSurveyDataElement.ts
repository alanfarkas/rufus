/**
 * Skills Survey Data Element - Each value represents a unique Survey data element in
 * the Skills database. The enum element name is irrelevant, however the value field must
 * match the corresponding 'SurveyDataElement' enum value in the 'SkillsTracker' project.
 */
export enum SkillsSurveyDataElement {
    NONE, // All new values should come after this one in alphabetical order
    Certification = "Certification",
    DIJurisdictionRegions = "DIJurisdictionRegions",
    EducationDegree = "EducationDegree",
    EducationMajor = "EducationMajor",
    EducationSchool = "EducationSchool",
    EngagementRole = "EngagementRole",
    ExperienceCompany = "ExperienceCompany",
    ExperienceIndustry = "ExperienceIndustry",
    ExperienceJobDuration = "ExperienceJobDuration",
    ExperienceJobTitle = "ExperienceJobTitle",
    IndustryGroups = "IndustryGroups",
    IndustryGroupsManufacturingExperience = "IndustryGroupsManufacturingExperience",
    InterimMgmt = "InterimMgmt",
    Language = "Language",
    LanguageProficiency = "LanguageProficiency",
    ManufacturingExperienceGroups = "ManufacturingExperienceGroups",
    QuestionList = "QuestionList",
    SecurityClearance = "SecurityClearance",
    SkillFamily = "SkillFamily",
    SkillProficiency = "SkillProficiency",
    SoftwareTool = "SoftwareTool",
    SolutionIndustry = "SolutionIndustry",
    SourcingCategoryType = "SourcingCategoryType",
}
