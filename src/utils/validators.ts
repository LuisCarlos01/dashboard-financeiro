export const validateRequired = (value: string | undefined): boolean => {
  return value !== undefined && value.trim().length > 0;
};

export const validateMinValue = (value: number, min: number = 0.01): boolean => {
  return value >= min;
};

export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

