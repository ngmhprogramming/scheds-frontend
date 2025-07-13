import * as auth from "./auth";
import * as groups from "./groups";
import * as schedule from "./schedule";
import * as profile from "./profile";

const API = {
	...auth,
	...groups,
	...schedule,
	...profile,
};

export default API;