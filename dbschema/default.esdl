module default {

  # Enum types

  scalar type ProficiencyEnum extending enum <"beginner", "intermediate", "advanced">;

  # Entity types
  type Resume {
    required created_at: datetime {
			readonly := true;
			default := datetime_of_statement();
		}
    overloaded required id: std::uuid {
      constraint exclusive;
    };

   required resume_name: str;
   required property resume_theme -> str;
    multi basic_details: BasicDetails;
    multi addresses: Address;
    multi educations: Education;
    multi work_experiences: WorkExperience;
    multi skills: Skill;
    multi projects: Project;
    multi certifications: Certification;
    multi languages: Language;
    multi social_media: SocialMedia;
  };

  type BasicDetails {
    overloaded required id: std::uuid {
      constraint exclusive;
    };
        link resume -> Resume;

    required full_name: str;
    required email: str;
    required phone: str;
    required designation: str;
    required summary: str;
    avatar_src -> str;
  };

  type Address {
    overloaded required id: std::uuid {
      constraint exclusive;
    };
        link resume -> Resume;
    required address: str;
    required city: str;
    required state: str;
    required postal_code: str;
    required country: str;
    required current_location: str;
  };

  type Education {
    overloaded required id: std::uuid {
      constraint exclusive;
    };
        link resume -> Resume;
    required institution: str;
    required course: str;
    required specialization: str;
    required passout_year: int32;
    required marks: int32;
  };

  type WorkExperience {
    overloaded required id: std::uuid {
      constraint exclusive;
    };
        link resume -> Resume;
     company: str;
     designation: str;
     joining_date: str;
     worked_till: str;
     total_experience: str;
  };

  type Skill {
    overloaded required id: std::uuid {
      constraint exclusive;
    };
        link resume -> Resume;
    required skill: str;
  };

  type Project {
    overloaded required id: std::uuid {
      constraint exclusive;
    };
        link resume -> Resume;
     title: str;
     description: str;
     start_date: str;
     end_date: str;
  };

  type Certification {
    overloaded required id: std::uuid {
      constraint exclusive;
    };
        link resume -> Resume;
     certification_name: str;
     certification_url: str;
     certified_on: str;
  };

  type Language {
    overloaded required id: std::uuid {
      constraint exclusive;
    };
        link resume -> Resume;
    required language: str;
    required proficiency: ProficiencyEnum;
  };

  type SocialMedia {
    overloaded required id: std::uuid {
      constraint exclusive;
    };
        link resume -> Resume;
    required platform: str;
    required url: str;
  };
};
