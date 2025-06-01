import * as auth from "./auth";
import * as schedule from "./schedule";

const API = {
	...auth,
	...schedule,
};

export default API;