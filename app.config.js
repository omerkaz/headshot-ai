export default ({ config }) => ({
  ...config,
  extra: {
    FAL_API_KEY: process.env.FAL_API_KEY,
    // ... other environment variables
  },
}); 