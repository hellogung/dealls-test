import db from "../src/config/database";
import { setupUpdatedAtTriggers } from "../src/lib/db";

(async () => {

    await setupUpdatedAtTriggers(db, ["attendances", "overtimes", "reimbursements", "payrolls", "users"]);
})()
