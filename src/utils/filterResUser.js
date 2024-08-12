export const filterResUser = (user) => {
  const userWithoutTimestamps = user.toObject();
  delete userWithoutTimestamps.createdAt;
  delete userWithoutTimestamps.updatedAt;
  delete userWithoutTimestamps.password;
  return userWithoutTimestamps;
};
