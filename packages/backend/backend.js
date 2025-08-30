// The main entry point for the backend service.
// This file orchestrates the real-time communication with Firestore,
// command execution, and logging.

const { db } = require("./firebaseService");
const { executeCommand } = require("./commandExecutor");

console.log("Backend service started. Listening for commands...");

const COLLECTION_ROOT = "artifacts";

// Listen to all command history collections in real-time.
// This is done to listen for new sessions without having to poll.
db.collectionGroup("commandHistory").onSnapshot(
  (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      // Only process new commands.
      if (change.type === "added") {
        const commandDoc = change.doc.data();
        const commandId = change.doc.id;
        const { command, userId, sessionId } = commandDoc;
        const docRef = change.doc.ref;

        if (command && !commandDoc.output) {
          console.log(
            `Executing command '${command}' for session: ${sessionId}, user: ${userId}`,
          );

          // Execute the command in the sandbox.
          const output = await executeCommand(command);

          // Update the Firestore document with the output.
          await docRef.update({
            output: output,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          });

          console.log(`Command '${command}' completed. Output: ${output}`);
        }
      }
    });
  },
  (error) => {
    console.error("Firestore listener error:", error);
  },
);
