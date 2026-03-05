export default {
  // --- Mock catalog of parts (keep it small at first; expand later) ---
  parts: {
    cpu: [
      { id: "cpu_5600", name: "AMD Ryzen 5 5600", price: 169, score: 78, specs: { cores: 6, threads: 12, socket: "AM4", tdp: 65 } },
      { id: "cpu_7600", name: "AMD Ryzen 5 7600", price: 239, score: 86, specs: { cores: 6, threads: 12, socket: "AM5", tdp: 65 } },
      { id: "cpu_13600k", name: "Intel i5-13600K", price: 299, score: 90, specs: { cores: 14, threads: 20, socket: "LGA1700", tdp: 125 } }
    ],
    gpu: [
      { id: "gpu_4060", name: "NVIDIA RTX 4060", price: 299, score: 75, specs: { vramGB: 8, tdp: 115 } },
      { id: "gpu_4070s", name: "NVIDIA RTX 4070 SUPER", price: 599, score: 92, specs: { vramGB: 12, tdp: 220 } },
      { id: "gpu_7800xt", name: "AMD RX 7800 XT", price: 499, score: 88, specs: { vramGB: 16, tdp: 263 } }
    ],
    ram: [
      { id: "ram_16", name: "16GB DDR4", price: 45, score: 60, specs: { sizeGB: 16, type: "DDR4" } },
      { id: "ram_32", name: "32GB DDR5", price: 95, score: 80, specs: { sizeGB: 32, type: "DDR5" } }
    ],
    storage: [
      { id: "ssd_1tb", name: "1TB NVMe SSD", price: 70, score: 75, specs: { type: "NVMe", sizeGB: 1000 } },
      { id: "ssd_2tb", name: "2TB NVMe SSD", price: 120, score: 85, specs: { type: "NVMe", sizeGB: 2000 } }
    ],
    motherboard: [
      { id: "mb_am4", name: "B550 (AM4)", price: 120, score: 70, specs: { socket: "AM4", formFactor: "ATX" } },
      { id: "mb_am5", name: "B650 (AM5)", price: 160, score: 78, specs: { socket: "AM5", formFactor: "ATX" } },
      { id: "mb_lga1700", name: "B760 (LGA1700)", price: 150, score: 76, specs: { socket: "LGA1700", formFactor: "ATX" } }
    ],
    psu: [
      { id: "psu_650", name: "650W 80+ Gold", price: 85, score: 70, specs: { wattage: 650 } },
      { id: "psu_750", name: "750W 80+ Gold", price: 105, score: 78, specs: { wattage: 750 } }
    ],
    case: [
      { id: "case_atx", name: "Mid Tower ATX Case", price: 75, score: 70, specs: { formFactor: "ATX" } },
      { id: "case_itx", name: "Mini ITX Case", price: 110, score: 72, specs: { formFactor: "ITX" } }
    ]
  },

  // --- Helper: choose a part within remaining budget, biased by score ---
  pickBestWithin(items, maxPrice) {
    const candidates = items.filter(x => x.price <= maxPrice);
    if (!candidates.length) return items.slice().sort((a, b) => b.score - a.score)[0];
    return candidates.slice().sort((a, b) => b.score - a.score)[0];
  },

  // --- Main: generates a build from prefs (simple + deterministic for now) ---
  generateBuild(prefs) {
    // prefs you'll likely pass in:
    // { budget, useCase, formFactor, noise, ... }
    const budget = Number(prefs?.budget ?? 1200);
    const useCase = prefs?.useCase ?? "Gaming";
    const formFactor = prefs?.formFactor ?? "ATX";

    // Allocate rough budget buckets (you can tune these)
    const alloc = (useCase === "ML")
      ? { cpu: 0.25, gpu: 0.45, ram: 0.12, storage: 0.08, rest: 0.10 }
      : { cpu: 0.22, gpu: 0.48, ram: 0.10, storage: 0.08, rest: 0.12 };

    const cpuBudget = Math.floor(budget * alloc.cpu);
    const gpuBudget = Math.floor(budget * alloc.gpu);
    const ramBudget = Math.floor(budget * alloc.ram);
    const storageBudget = Math.floor(budget * alloc.storage);
    const restBudget = budget - (cpuBudget + gpuBudget + ramBudget + storageBudget);

    // Pick CPU/GPU/RAM/Storage
    const cpu = this.pickBestWithin(this.parts.cpu, cpuBudget);
    const gpu = this.pickBestWithin(this.parts.gpu, gpuBudget);
    const ram = this.pickBestWithin(this.parts.ram, ramBudget);
    const storage = this.pickBestWithin(this.parts.storage, storageBudget);

    // Motherboard must match CPU socket
    const motherboardOptions = this.parts.motherboard.filter(mb => mb.specs.socket === cpu.specs.socket);
    const motherboard = this.pickBestWithin(motherboardOptions.length ? motherboardOptions : this.parts.motherboard, Math.floor(restBudget * 0.45));

    // Case must match form factor preference (simple)
    const caseOptions = this.parts.case.filter(c => c.specs.formFactor === formFactor);
    const pcCase = (caseOptions.length ? caseOptions[0] : this.parts.case[0]);

    // PSU based on GPU TDP (very rough)
    const estWattage = (cpu.specs.tdp ?? 65) + (gpu.specs.tdp ?? 150) + 150;
    const psuNeeded = estWattage >= 600 ? 750 : 650;
    const psuOptions = this.parts.psu.filter(p => p.specs.wattage >= psuNeeded);
    const psu = psuOptions[0] ?? this.parts.psu[0];

    const totalPrice = cpu.price + gpu.price + ram.price + storage.price + motherboard.price + psu.price + pcCase.price;

    const notes = [
      `Use case: ${useCase}`,
      `Estimated wattage: ~${estWattage}W`,
      totalPrice <= budget ? "Fits your budget." : "Over budget — adjust preferences or budget."
    ];

    return {
      prefs: { budget, useCase, formFactor, ...prefs },
      parts: {
        cpu,
        gpu,
        ram,
        storage,
        motherboard,
        psu,
        case: pcCase
      },
      totals: {
        price: totalPrice,
        wattage: estWattage
      },
      notes
    };
  }
};