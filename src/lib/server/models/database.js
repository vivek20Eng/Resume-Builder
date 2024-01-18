// @ts-nocheck
import * as edgedb from 'edgedb';
import e from '$dbschema/edgeql-js';
export { e };

export let client = edgedb.createClient();

export class Database {
	static async select(params) {
		const query = e.select(this.type, params);
		return await query.run(client);
	}
	static select_query(params) {
		return e.select(this.type, params);
	}
	static select_query_by_ids(ids) {
		return e.select(this.type, (item) => ({
			id: true,
			filter: e.op(item.id, 'in', e.set(...ids.map((id) => e.uuid(id))))
		}));
	}
	static async insert(params) {
		const query = e.insert(this.type, params);
		return await query.run(client);
	}
	static async insert_in_readonly_mode(params) {
		const query = e.insert(this.type, params);
		return await query.run(client);
	}
	static async update(params, userDetails) {
		if (this.type == e.User) {
			let paramData = params();
			let permissionSuccess = await this.checkpermission(paramData, userDetails);
			if (!permissionSuccess) {
				return false;
			}
		}
		const query = e.update(this.type, params);
		return await query.run(client);
	}
	static async delete(params) {
		const query = e.delete(this.type, params);
		return await query.run(client);
	}
}
// Resume
export class Resume extends Database {
	static type = e.Resume;
}
// Basic Details
export class BasicDetails extends Database {
	static type = e.BasicDetails;
}
// Address
export class Address extends Database {
	static type = e.Address;
}
// Education
export class Education extends Database {
	static type = e.Education;
}
// work Experience
export class WorkExperience extends Database {
	static type = e.WorkExperience;
}
// project
export class Project extends Database {
	static type = e.Project;
}

// language
export class Language extends Database {
	static type = e.Language;
}

// skill
export class Skill extends Database {
	static type = e.Skill;
}

// social media
export class SocialMedia extends Database {
	static type = e.SocialMedia;
}
