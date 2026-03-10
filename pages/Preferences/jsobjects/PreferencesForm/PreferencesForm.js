export default {
  cpuOptions() {
    return [
      {
        label: "Intel",
        value: "INTEL",
        children: [
          { label: "Core i5", value: "INTEL_I5" },
          { label: "Core i7", value: "INTEL_I7" },
          { label: "Core i9", value: "INTEL_I9" }
        ]
      },
      {
        label: "AMD",
        value: "AMD",
        children: [
          { label: "Ryzen 5", value: "AMD_RYZEN_5" },
          { label: "Ryzen 7", value: "AMD_RYZEN_7" },
          { label: "Ryzen 9", value: "AMD_RYZEN_9" }
        ]
      }
    ];
  },

  buildCategoryOptions() {
    return [
      { label: "Gaming", value: "GAMING" },
      { label: "Productivity", value: "PRODUCTIVITY" },
      { label: "Content Creation", value: "CONTENT_CREATION" }
    ];
  },

  buildPayload() {
    return {
      preferredCpuBrand: MultiTreeSelect1.selectedOptionValues?.[0] || null,
      buildCategory: Select2.selectedOptionValue || null,
      maxBudget: CurrencyInput1.value || null
    };
  },

  save() {
    showAlert(JSON.stringify(this.buildPayload(), null, 2), "success");
  }
}