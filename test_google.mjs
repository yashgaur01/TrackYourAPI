import Google from "@auth/core/providers/google";

const config = Google({
  clientId: "test1234",
  clientSecret: "test1234secret"
});

console.log(JSON.stringify(config, null, 2));
