import * as auth from "./auth";
import * as groups from "./groups";
import * as schedule from "./schedule";

const API = {
	...auth,
	...groups,
	...schedule,
};

export default API;