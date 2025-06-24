import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId:
        "1076117647515-ler43v7batfuj3ocb1bvq2kg4apcu6qj.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
};
