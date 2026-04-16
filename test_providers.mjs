import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";

const g = Google({ clientId: "1", clientSecret: "2" });

console.log("Password:", Object.keys(Password));
console.log("Password type:", typeof Password, Password.type, Password.id);
console.log("Password config?", typeof Password.config);
console.log("Google:", Object.keys(g));
