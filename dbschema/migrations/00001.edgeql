CREATE MIGRATION m1rebn7hxsbxmurw3asjc66ujsu7jhdhbo6kpt3ngqgbrpnm5nd6sa
    ONTO initial
{
  CREATE TYPE default::Address {
      ALTER PROPERTY id {
          SET OWNED;
          ALTER CONSTRAINT std::exclusive {
              SET OWNED;
          };
      };
      CREATE REQUIRED PROPERTY address: std::str;
      CREATE REQUIRED PROPERTY city: std::str;
      CREATE REQUIRED PROPERTY country: std::str;
      CREATE REQUIRED PROPERTY current_location: std::str;
      CREATE REQUIRED PROPERTY postal_code: std::str;
      CREATE REQUIRED PROPERTY state: std::str;
  };
  CREATE TYPE default::Resume {
      ALTER PROPERTY id {
          SET OWNED;
          ALTER CONSTRAINT std::exclusive {
              SET OWNED;
          };
      };
      CREATE MULTI LINK addresses: default::Address;
      CREATE REQUIRED PROPERTY created_at: std::datetime {
          SET default := (std::datetime_of_statement());
          SET readonly := true;
      };
      CREATE REQUIRED PROPERTY resume_name: std::str;
      CREATE REQUIRED PROPERTY resume_theme: std::str;
  };
  ALTER TYPE default::Address {
      CREATE LINK resume: default::Resume;
  };
  CREATE TYPE default::BasicDetails {
      ALTER PROPERTY id {
          SET OWNED;
          ALTER CONSTRAINT std::exclusive {
              SET OWNED;
          };
      };
      CREATE LINK resume: default::Resume;
      CREATE PROPERTY avatar_src: std::str;
      CREATE REQUIRED PROPERTY designation: std::str;
      CREATE REQUIRED PROPERTY email: std::str;
      CREATE REQUIRED PROPERTY full_name: std::str;
      CREATE REQUIRED PROPERTY phone: std::str;
      CREATE REQUIRED PROPERTY summary: std::str;
  };
  ALTER TYPE default::Resume {
      CREATE MULTI LINK basic_details: default::BasicDetails;
  };
  CREATE TYPE default::Certification {
      ALTER PROPERTY id {
          SET OWNED;
          ALTER CONSTRAINT std::exclusive {
              SET OWNED;
          };
      };
      CREATE LINK resume: default::Resume;
      CREATE PROPERTY certification_name: std::str;
      CREATE PROPERTY certification_url: std::str;
      CREATE PROPERTY certified_on: std::str;
  };
  ALTER TYPE default::Resume {
      CREATE MULTI LINK certifications: default::Certification;
  };
  CREATE TYPE default::Education {
      ALTER PROPERTY id {
          SET OWNED;
          ALTER CONSTRAINT std::exclusive {
              SET OWNED;
          };
      };
      CREATE LINK resume: default::Resume;
      CREATE REQUIRED PROPERTY course: std::str;
      CREATE REQUIRED PROPERTY institution: std::str;
      CREATE REQUIRED PROPERTY marks: std::int32;
      CREATE REQUIRED PROPERTY passout_year: std::int32;
      CREATE REQUIRED PROPERTY specialization: std::str;
  };
  ALTER TYPE default::Resume {
      CREATE MULTI LINK educations: default::Education;
  };
  CREATE SCALAR TYPE default::ProficiencyEnum EXTENDING enum<beginner, intermediate, advanced>;
  CREATE TYPE default::Language {
      ALTER PROPERTY id {
          SET OWNED;
          ALTER CONSTRAINT std::exclusive {
              SET OWNED;
          };
      };
      CREATE LINK resume: default::Resume;
      CREATE REQUIRED PROPERTY language: std::str;
      CREATE REQUIRED PROPERTY proficiency: default::ProficiencyEnum;
  };
  ALTER TYPE default::Resume {
      CREATE MULTI LINK languages: default::Language;
  };
  CREATE TYPE default::Project {
      ALTER PROPERTY id {
          SET OWNED;
          ALTER CONSTRAINT std::exclusive {
              SET OWNED;
          };
      };
      CREATE LINK resume: default::Resume;
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY end_date: std::str;
      CREATE PROPERTY start_date: std::str;
      CREATE PROPERTY title: std::str;
  };
  ALTER TYPE default::Resume {
      CREATE MULTI LINK projects: default::Project;
  };
  CREATE TYPE default::Skill {
      ALTER PROPERTY id {
          SET OWNED;
          ALTER CONSTRAINT std::exclusive {
              SET OWNED;
          };
      };
      CREATE LINK resume: default::Resume;
      CREATE REQUIRED PROPERTY skill: std::str;
  };
  ALTER TYPE default::Resume {
      CREATE MULTI LINK skills: default::Skill;
  };
  CREATE TYPE default::SocialMedia {
      ALTER PROPERTY id {
          SET OWNED;
          ALTER CONSTRAINT std::exclusive {
              SET OWNED;
          };
      };
      CREATE LINK resume: default::Resume;
      CREATE REQUIRED PROPERTY platform: std::str;
      CREATE REQUIRED PROPERTY url: std::str;
  };
  ALTER TYPE default::Resume {
      CREATE MULTI LINK social_media: default::SocialMedia;
  };
  CREATE TYPE default::WorkExperience {
      ALTER PROPERTY id {
          SET OWNED;
          ALTER CONSTRAINT std::exclusive {
              SET OWNED;
          };
      };
      CREATE LINK resume: default::Resume;
      CREATE PROPERTY company: std::str;
      CREATE PROPERTY designation: std::str;
      CREATE PROPERTY joining_date: std::str;
      CREATE PROPERTY total_experience: std::str;
      CREATE PROPERTY worked_till: std::str;
  };
  ALTER TYPE default::Resume {
      CREATE MULTI LINK work_experiences: default::WorkExperience;
  };
};
