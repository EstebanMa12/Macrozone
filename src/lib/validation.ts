export type MealInput = {
  name: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

export type MealValidationErrors = Partial<Record<keyof MealInput, string>>;

export type ParsedMealInput = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

function parsePositiveNumber(value: string, fieldLabel: string): string | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return `${fieldLabel} must be a valid number.`;
  }

  if (parsed < 0) {
    return `${fieldLabel} cannot be negative.`;
  }

  return null;
}

export function validateMealInput(input: MealInput): {
  errors: MealValidationErrors;
  values: ParsedMealInput | null;
} {
  const errors: MealValidationErrors = {};
  const name = input.name.trim();

  if (!name) {
    errors.name = "Meal name is required.";
  }

  if (!input.calories.trim()) {
    errors.calories = "Calories are required.";
  } else {
    const caloriesError = parsePositiveNumber(input.calories, "Calories");
    if (caloriesError) {
      errors.calories = caloriesError;
    }
  }

  const proteinError = parsePositiveNumber(input.protein, "Protein");
  if (proteinError) {
    errors.protein = proteinError;
  }

  const carbsError = parsePositiveNumber(input.carbs, "Carbs");
  if (carbsError) {
    errors.carbs = carbsError;
  }

  const fatError = parsePositiveNumber(input.fat, "Fat");
  if (fatError) {
    errors.fat = fatError;
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: null };
  }

  return {
    errors: {},
    values: {
      name,
      calories: Number(input.calories),
      protein: Number(input.protein) || 0,
      carbs: Number(input.carbs) || 0,
      fat: Number(input.fat) || 0,
    },
  };
}
