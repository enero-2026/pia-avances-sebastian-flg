import 'dotenv/config';

export default {
  expo: {
    name: "react-camara",
    slug: "react-camara",
    extra: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
  },
};