// This file is responsible for the command sandboxing and execution logic.
// Separating this from the main backend file is a best practice.

// This is where you would implement the Docker integration in a real project.
// For this example, we're using mock data to simulate the file system.
const mockFileSystem = {
  "/home/": ["user", "guest", "README.md", "secret_file.txt"],
  "/home/user/": ["documents", "downloads"],
  "/etc/": ["hosts", "passwd"],
};

// A whitelist of allowed commands to prevent malicious execution.
const allowedCommands = ["ls", "pwd", "whoami", "cd", "cat"];

const executeCommand = async (command) => {
  const [cmd, ...args] = command.split(" ");
  const trimmedCmd = cmd.trim();

  // Security: Check if the command is in the whitelist.
  if (!allowedCommands.includes(trimmedCmd)) {
    return `bash: ${trimmedCmd}: command not found`;
  }

  // Security: Implement sandboxing logic here.
  // In a real app, this would send the command to a secure Docker container
  // for execution and return the output.
  switch (trimmedCmd) {
    case "ls":
      const dir = args[0] || "/home/user/";
      if (mockFileSystem[dir]) {
        return mockFileSystem[dir].join("\t");
      } else {
        return `ls: cannot access '${dir}': No such file or directory`;
      }
    case "pwd":
      return "/home/user";
    case "whoami":
      return "user";
    case "cd":
      return `cd: Not supported in this sandbox yet.`;
    case "cat":
      const file = args[0] || "";
      switch (file) {
        case "README.md":
          return "Welcome to the collaborative Linux Sandbox!";
        case "secret_file.txt":
          return "Access Denied: This is a simulated secret file.";
        default:
          return `cat: ${file}: No such file or directory`;
      }
    default:
      return `bash: ${command}: command not found`;
  }
};

module.exports = {
  executeCommand,
};
