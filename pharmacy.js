const MIN_BENEFIT = 0;
const MAX_BENEFIT = 50;

const updateDefaultDrug = (drug) => {
  drug.decreaseExpiresIn();
  drug.decreaseBenefit(drug.isExpired() ? 2 : 1);
};

const updateHerbalTea = (drug) => {
  drug.decreaseExpiresIn();
  drug.increaseBenefit(drug.isExpired() ? 2 : 1);
};

const updateFervex = (drug) => {
  if (drug.expiresIn <= 5) {
    drug.increaseBenefit(3);
  } else if (drug.expiresIn <= 10) {
    drug.increaseBenefit(2);
  } else {
    drug.increaseBenefit(1);
  }

  drug.decreaseExpiresIn();
  if (drug.isExpired()) {
    drug.benefit = MIN_BENEFIT;
  }
};

const updateMagicPill = () => {};

const UPDATE_RULES = {
  "Herbal Tea": updateHerbalTea,
  Fervex: updateFervex,
  "Magic Pill": updateMagicPill,
};

export class Drug {
  constructor(name, expiresIn, benefit) {
    this.name = name;
    this.expiresIn = expiresIn;
    this.benefit = benefit;
  }

  update() {
    const updateRule = UPDATE_RULES[this.name] ?? updateDefaultDrug;
    updateRule(this);
  }

  isExpired() {
    return this.expiresIn < 0;
  }

  increaseBenefit(number = 1) {
    if (this.benefit < MAX_BENEFIT) {
      this.benefit = Math.min(MAX_BENEFIT, this.benefit + number);
    }
  }

  decreaseBenefit(number = 1) {
    if (this.benefit > MIN_BENEFIT) {
      this.benefit = Math.max(MIN_BENEFIT, this.benefit - number);
    }
  }

  decreaseExpiresIn() {
    this.expiresIn--;
  }
}

export class Pharmacy {
  constructor(drugs = []) {
    this.drugs = drugs;
  }

  updateBenefitValue() {
    for (const drug of this.drugs) {
      drug.update();
    }

    return this.drugs;
  }
}
