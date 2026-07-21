import app from "./app.js";
import pool from "./config/db.js";

// Nothing should fail silently: an error that reaches here would otherwise kill
// the process, or vanish entirely, with no clue as to what went wrong.
process.on("unhandledRejection", (reason) => {
    console.error("UNHANDLED PROMISE REJECTION:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("UNCAUGHT EXCEPTION:", error);
});

// Warn about missing configuration at startup rather than at first use
const REQUIRED_ENV = ["POSTGRES_URI", "JWT_SECRET_KEY"];
const missing = REQUIRED_ENV.filter(key => !process.env[key]);
if (missing.length) {
    console.error(
        "\n" +
        "==============================================================\n" +
        ` MISSING REQUIRED CONFIGURATION: ${missing.join(", ")}\n` +
        "--------------------------------------------------------------\n" +
        " The server will start but will not work correctly.\n" +
        " Copy backend/.env.example to backend/.env and fill it in.\n" +
        "==============================================================\n"
    );
}

// Run database schema migrations & performance index checks
const runAutoMigrate = async () => {
    try {
        console.log("Ensuring database columns and performance indexes exist...");
        await pool.query("ALTER TABLE mlef_forms ADD COLUMN IF NOT EXISTS part_a_pdf_url VARCHAR(500);");
        await pool.query("ALTER TABLE mlef_forms ADD COLUMN IF NOT EXISTS part_b_pdf_url VARCHAR(500);");
        await pool.query("ALTER TABLE mlr_reports ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(500);");
        await pool.query("ALTER TABLE pmr_forms ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(500);");

        // Foreign Key Indexes to eliminate full table scans & optimize JOIN performance
        await pool.query("CREATE INDEX IF NOT EXISTS idx_mlef_forms_patient_id ON mlef_forms(patient_id);");
        await pool.query("CREATE INDEX IF NOT EXISTS idx_mlef_forms_created_by ON mlef_forms(created_by);");
        await pool.query("CREATE INDEX IF NOT EXISTS idx_mlr_reports_patient_id ON mlr_reports(patient_id);");
        await pool.query("CREATE INDEX IF NOT EXISTS idx_mlr_reports_created_by ON mlr_reports(created_by);");
        await pool.query("CREATE INDEX IF NOT EXISTS idx_pmr_forms_patient_id ON pmr_forms(patient_id);");
        await pool.query("CREATE INDEX IF NOT EXISTS idx_pmr_forms_created_by ON pmr_forms(created_by);");
        await pool.query("CREATE INDEX IF NOT EXISTS idx_lab_requests_patient_id ON lab_requests(patient_id);");
        await pool.query("CREATE INDEX IF NOT EXISTS idx_lab_requests_requested_by ON lab_requests(requested_by);");
        await pool.query("CREATE INDEX IF NOT EXISTS idx_mlr_injuries_mlr_id ON mlr_injuries(mlr_id);");
        await pool.query("CREATE INDEX IF NOT EXISTS idx_mlr_grievous_entries_mlr_id ON mlr_grievous_entries(mlr_id);");
        await pool.query("CREATE INDEX IF NOT EXISTS idx_pmr_identifiers_pmr_id ON pmr_identifiers(pmr_id);");

        console.log("Database columns and performance indexes verified successfully!");
    } catch (err) {
        console.error("Auto migration check error:", err);
    }
};

// Test database connection
pool.connect()
    .then(async client => {
        console.log("Connected to PostgreSQL successfully");
        client.release();
        await runAutoMigrate();
    })
    .catch(err => {
        console.error(
            "\n" +
            "==============================================================\n" +
            " DATABASE CONNECTION FAILED\n" +
            "--------------------------------------------------------------\n" +
            ` ${err.message}\n` +
            "\n" +
            " Check POSTGRES_URI in backend/.env.\n" +
            "==============================================================\n"
        );
        console.error(err);
    });

app.listen(3000, () => {
    console.log("Server started successfully");
    console.log("Listening on port 3000");
});

export default pool;