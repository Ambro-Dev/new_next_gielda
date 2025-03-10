export const GetExpireTimeLeft = (expireDate: Date) => {
  const today = new Date();
  const date = new Date(expireDate);

  const timeLeft = date.getTime() - today.getTime();
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  const isExpired = timeLeft < 0;

  return { daysLeft, hoursLeft, isExpired };
};
