import { validateMealInput } from "../validation";

describe("validateMealInput", () => {
  it("requires name and calories", () => {
    const result = validateMealInput({
      name: " ",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
    });

    expect(result.values).toBeNull();
    expect(result.errors.name).toBeDefined();
    expect(result.errors.calories).toBeDefined();
  });

  it("rejects negative and invalid numbers", () => {
    const result = validateMealInput({
      name: "Steak",
      calories: "-10",
      protein: "abc",
      carbs: "20",
      fat: "10",
    });

    expect(result.values).toBeNull();
    expect(result.errors.calories).toMatch(/negative/i);
    expect(result.errors.protein).toMatch(/valid number/i);
  });

  it("parses a valid meal", () => {
    const result = validateMealInput({
      name: " Yogurt ",
      calories: "180",
      protein: "15",
      carbs: "",
      fat: "5",
    });

    expect(result.errors).toEqual({});
    expect(result.values).toEqual({
      name: "Yogurt",
      calories: 180,
      protein: 15,
      carbs: 0,
      fat: 5,
    });
  });
});
