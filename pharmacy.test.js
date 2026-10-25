import { Drug, Pharmacy } from "./pharmacy";

describe("Pharmacy.updateBenefitValue()", () => {
  test("generic drug: benefit decreases by 1 per update and expiresIn decreases by 1", () => {
    const drugs = [new Drug("Doliprane", 10, 7)];
    const pharmacy = new Pharmacy(drugs);

    pharmacy.updateBenefitValue();

    expect(drugs[0].benefit).toBe(6);
    expect(drugs[0].expiresIn).toBe(9);
  });

  test("generic drug on its last day (expiresIn 1 -> 0): benefit still decreases by 1", () => {
    const drugs = [new Drug("Doliprane", 1, 5)];
    const pharmacy = new Pharmacy(drugs);

    pharmacy.updateBenefitValue();

    expect(drugs[0].benefit).toBe(4);
    expect(drugs[0].expiresIn).toBe(0);
  });

  test("generic drug past expiration: benefit decreases twice in one update", () => {
    const drugs = [new Drug("Doliprane", 0, 5)];
    const pharmacy = new Pharmacy(drugs);

    pharmacy.updateBenefitValue();

    expect(drugs[0].benefit).toBe(3);
    expect(drugs[0].expiresIn).toBe(-1);
  });

  test("benefit never goes below 0 (generic)", () => {
    const drugs = [new Drug("Doliprane", 0, 1)];
    const pharmacy = new Pharmacy(drugs);

    pharmacy.updateBenefitValue();
    expect(drugs[0].benefit).toBe(0);

    pharmacy.updateBenefitValue();
    expect(drugs[0].benefit).toBe(0);
  });

  describe("Herbal Tea (benefit increases over time)", () => {
    test("increases by 1 while under max 50", () => {
      const drugs = [new Drug("Herbal Tea", 5, 10)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();

      expect(drugs[0].benefit).toBe(11);
      expect(drugs[0].expiresIn).toBe(4);
    });

    test("after expiration, increases by 2 per update", () => {
      const drugs = [new Drug("Herbal Tea", 0, 10)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();

      expect(drugs[0].benefit).toBe(12);
      expect(drugs[0].expiresIn).toBe(-1);
    });

    test("is capped at 50", () => {
      const drugs = [new Drug("Herbal Tea", 0, 49)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();
      expect(drugs[0].benefit).toBe(50);

      pharmacy.updateBenefitValue();
      expect(drugs[0].benefit).toBe(50);
    });
  });

  describe("Magic Pill (never expires, never loses benefit)", () => {
    test("does not change benefit nor expiresIn", () => {
      const drugs = [new Drug("Magic Pill", 0, 40)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();

      expect(drugs[0].benefit).toBe(40);
      expect(drugs[0].expiresIn).toBe(0);
    });
  });

  describe("Fervex (tiered increase and zero after expiration)", () => {
    test("increases by 1 when expiresIn is more than 10", () => {
      const drugs = [new Drug("Fervex", 11, 20)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();

      expect(drugs[0].benefit).toBe(21);
      expect(drugs[0].expiresIn).toBe(10);
    });

    test("increases by 2 when expiresIn is 10 or less", () => {
      const drugs = [new Drug("Fervex", 10, 20)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();

      expect(drugs[0].benefit).toBe(22);
      expect(drugs[0].expiresIn).toBe(9);
    });

    test("still increases by 2 when expiresIn is 6", () => {
      const drugs = [new Drug("Fervex", 6, 20)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();

      expect(drugs[0].benefit).toBe(22);
      expect(drugs[0].expiresIn).toBe(5);
    });

    test("increases by 3 when expiresIn is 5 or less", () => {
      const drugs = [new Drug("Fervex", 5, 20)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();

      expect(drugs[0].benefit).toBe(23);
      expect(drugs[0].expiresIn).toBe(4);
    });

    test("on its last day (expiresIn 1 -> 0), still increases by 3", () => {
      const drugs = [new Drug("Fervex", 1, 20)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();

      expect(drugs[0].benefit).toBe(23);
      expect(drugs[0].expiresIn).toBe(0);
    });

    test("increase is capped at 50", () => {
      const drugs = [new Drug("Fervex", 5, 49)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();

      expect(drugs[0].benefit).toBe(50);
      expect(drugs[0].expiresIn).toBe(4);
    });

    test("after expiration (expiresIn becomes < 0), benefit drops to 0", () => {
      const drugs = [new Drug("Fervex", 0, 20)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();

      expect(drugs[0].benefit).toBe(0);
      expect(drugs[0].expiresIn).toBe(-1);
    });
  });

  describe("Dafalgan (benefit decreases twice as fast)", () => {
    test("benefit decreases by 2 per update and expiresIn decreases by 1", () => {
      const drugs = [new Drug("Dafalgan", 10, 7)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();

      expect(drugs[0].benefit).toBe(5);
      expect(drugs[0].expiresIn).toBe(9);
    });

    test("past expiration: benefit decreases by 4 in one update", () => {
      const drugs = [new Drug("Dafalgan", 0, 5)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();

      expect(drugs[0].benefit).toBe(1);
      expect(drugs[0].expiresIn).toBe(-1);
    });

    test("benefit never goes below 0", () => {
      const drugs = [new Drug("Dafalgan", 0, 3)];
      const pharmacy = new Pharmacy(drugs);

      pharmacy.updateBenefitValue();

      expect(drugs[0].benefit).toBe(0);
      expect(drugs[0].expiresIn).toBe(-1);
    });
  });

  test("updates a mixed list of drugs consistently in one pass", () => {
    const drugs = [
      new Drug("Doliprane", 5, 7),
      new Drug("Herbal Tea", 0, 49),
      new Drug("Magic Pill", 2, 40),
      new Drug("Fervex", 10, 9),
      new Drug("Fervex", 0, 3),
      new Drug("Ibuprofen", 0, 1),
      new Drug("Dafalgan", 10, 7),
      new Drug("Dafalgan", 0, 5),
    ];

    const pharmacy = new Pharmacy(drugs);
    pharmacy.updateBenefitValue();

    expect(drugs).toEqual([
      new Drug("Doliprane", 4, 6),
      new Drug("Herbal Tea", -1, 50),
      new Drug("Magic Pill", 2, 40),
      new Drug("Fervex", 9, 11),
      new Drug("Fervex", -1, 0),
      new Drug("Ibuprofen", -1, 0),
      new Drug("Dafalgan", 9, 5),
      new Drug("Dafalgan", -1, 1),
    ]);
  });
});
