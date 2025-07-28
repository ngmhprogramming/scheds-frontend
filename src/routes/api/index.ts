import * as auth from "./auth";
import * as groups from "./groups";
import * as schedule from "./schedule";
import * as profile from "./profile";
import * as notifs from "./notifs";

const API = {
	...auth,
	...groups,
	...schedule,
	...profile,
	...notifs,
};

export default API;