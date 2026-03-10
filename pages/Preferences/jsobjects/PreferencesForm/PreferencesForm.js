export default {
  options: {
    buildCategories: [
      { label: "Gaming", value: "GAMING" },
      { label: "Productivity", value: "PRODUCTIVITY" },
      { label: "Content Creation", value: "CONTENT_CREATION" },
      { label: "Workstation", value: "WORKSTATION" },
      { label: "General Use", value: "GENERAL_USE" },
			{ label: "Gooning", value: "GOONING" }
    ],

    cpu: [
      {
        label: "Intel",
        value: "INTEL",
        children: [
          { label: "Core i3", value: "INTEL_CORE_I3" },
          { label: "Core i5", value: "INTEL_CORE_I5" },
          { label: "Core i7", value: "INTEL_CORE_I7" },
          { label: "Core i9", value: "INTEL_CORE_I9" }
        ]
      },
      {
        label: "AMD",
        value: "AMD",
        children: [
          { label: "Ryzen 3", value: "AMD_RYZEN_3" },
          { label: "Ryzen 5", value: "AMD_RYZEN_5" },
          { label: "Ryzen 7", value: "AMD_RYZEN_7" },
          { label: "Ryzen 9", value: "AMD_RYZEN_9" }
        ]
      }
    ],

    gpu: [
      {
        label: "NVIDIA",
        value: "NVIDIA",
        children: [
          { label: "RTX 4060", value: "NVIDIA_RTX_4060" },
          { label: "RTX 4070", value: "NVIDIA_RTX_4070" },
          { label: "RTX 4080", value: "NVIDIA_RTX_4080" },
          { label: "RTX 4090", value: "NVIDIA_RTX_4090" }
        ]
      },
      {
        label: "AMD",
        value: "AMD_GPU",
        children: [
          { label: "RX 7600", value: "AMD_RX_7600" },
          { label: "RX 7700 XT", value: "AMD_RX_7700_XT" },
          { label: "RX 7800 XT", value: "AMD_RX_7800_XT" },
          { label: "RX 7900 XT", value: "AMD_RX_7900_XT" }
        ]
      },
      {
        label: "Intel",
        value: "INTEL_GPU",
        children: [
          { label: "Arc A580", value: "INTEL_ARC_A580" },
          { label: "Arc A750", value: "INTEL_ARC_A750" },
          { label: "Arc A770", value: "INTEL_ARC_A770" }
        ]
      }
    ],

    motherboard: ["ASUS", "MSI", "Gigabyte", "ASRock", "Biostar"],
    ram: ["Corsair", "G.Skill", "Kingston", "Crucial", "TeamGroup"],
    psu: ["Corsair", "EVGA", "Seasonic", "Cooler Master", "be quiet!"],
    pcCase: ["NZXT", "Corsair", "Lian Li", "Fractal Design", "Phanteks"],
    storage: ["Samsung", "WD", "Seagate", "Crucial", "Kingston"],
    cooler: ["Noctua", "Cooler Master", "Corsair", "DeepCool", "be quiet!"]
  },

  toFlatOptions(items) {
    return items.map((item) => ({
      label: item,
      value: item
    }));
  },

  buildCategoryOptions() {
    return this.options.buildCategories;
  },

  cpuBrandOptions() {
    return this.options.cpu;
  },

  gpuBrandOptions() {
    return this.options.gpu;
  },

  motherboardBrandOptions() {
    return this.toFlatOptions(this.options.motherboard);
  },

  ramBrandOptions() {
    return this.toFlatOptions(this.options.ram);
  },

  psuBrandOptions() {
    return this.toFlatOptions(this.options.psu);
  },

  caseBrandOptions() {
    return this.toFlatOptions(this.options.pcCase);
  },

  storageBrandOptions() {
    return this.toFlatOptions(this.options.storage);
  },

  coolerBrandOptions() {
    return this.toFlatOptions(this.options.cooler);
  },

  firstSelected(values) {
    if (!Array.isArray(values) || values.length === 0) {
      return null;
    }
    return values[0];
  },

  moneyToNumber(rawValue) {
    if (rawValue === undefined || rawValue === null || rawValue === "") {
      return null;
    }

    if (typeof rawValue === "number") {
      return Number.isFinite(rawValue) ? rawValue : null;
    }

    const cleaned = String(rawValue).replace(/[^0-9.]/g, "");
    const parsed = Number(cleaned);

    return Number.isFinite(parsed) ? parsed : null;
  },

  buildPayload() {
    return {
      preferredCpuBrand: this.firstSelected(MTS_CpuBrand.selectedOptionValues),
      preferredGpuBrand: this.firstSelected(MTS_GpuBrand.selectedOptionValues),
      preferredMotherboardBrand: this.firstSelected(MTS_MotherboardBrand.selectedOptionValues),
      preferredRamBrand: this.firstSelected(MTS_RamBrand.selectedOptionValues),
      preferredPsuBrand: this.firstSelected(MTS_PsuBrand.selectedOptionValues),
      preferredCaseBrand: this.firstSelected(MTS_CaseBrand.selectedOptionValues),
      preferredStorageBrand: this.firstSelected(MTS_StorageBrand.selectedOptionValues),
      preferredCoolerBrand: this.firstSelected(MTS_CoolerBrand.selectedOptionValues),

      buildCategory: Select2.selectedOptionValue || null,
      maxBudget: this.moneyToNumber(CurrencyInput1.value)
    };
  },

  validate(payload) {
    const errors = [];

    if (!payload.buildCategory) {
      errors.push("Please select an intended use.");
    }

    if (payload.maxBudget === null || payload.maxBudget <= 0) {
      errors.push("Please enter a valid budget.");
    }

    return errors;
  },

  previewPayload() {
    return this.buildPayload();
  },

  async save() {
    const payload = this.buildPayload();
    const errors = this.validate(payload);

    if (errors.length > 0) {
      showAlert(errors.join(" "), "warning");
      return;
    }

    try {
      await saveUserPreferences.run(payload);
      showAlert("Preferences saved successfully.", "success");
      return payload;
    } catch (error) {
      showAlert(error?.message || "Could not save preferences.", "error");
      throw error;
    }
  }
};