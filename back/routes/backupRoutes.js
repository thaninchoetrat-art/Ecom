import express from "express";
import {
  getBackups,
  triggerBackup,
  downloadBackup,
  removeBackup,
  restoreBackupHandler,
  getBackupPreview,
  restoreSelectedHandler,
} from "../controllers/backupController.js";
import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// 🔒 ทุก endpoint ของระบบ Backup เฉพาะ Admin เท่านั้น
router.get("/", verifyToken, requireRole("Admin"), getBackups);
router.post("/run", verifyToken, requireRole("Admin"), triggerBackup);
router.get("/:fileName/preview", verifyToken, requireRole("Admin"), getBackupPreview);
router.post("/:fileName/restore", verifyToken, requireRole("Admin"), restoreBackupHandler);
router.post("/:fileName/restore-selected", verifyToken, requireRole("Admin"), restoreSelectedHandler);
router.get("/:fileName", verifyToken, requireRole("Admin"), downloadBackup);
router.delete("/:fileName", verifyToken, requireRole("Admin"), removeBackup);

export default router;
