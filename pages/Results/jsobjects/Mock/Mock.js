export default {
  // --- Mock catalog of parts ---
  parts: {
    cpu: [
      {
        id: "cpu_5600",
        name: "AMD Ryzen 5 5600",
        price: 169,
        score: 78,
        imageUrl: "https://picsum.photos/seed/cpu_5600/800/400",
        specs: { cores: 6, threads: 12, socket: "AM4", tdp: 65 }
      },
      {
        id: "cpu_7600",
        name: "AMD Ryzen 5 7600",
        price: 239,
        score: 86,
        imageUrl: "https://picsum.photos/seed/cpu_7600/800/400",
        specs: { cores: 6, threads: 12, socket: "AM5", tdp: 65 }
      },
      {
        id: "cpu_13600k",
        name: "Intel i5-13600K",
        price: 299,
        score: 90,
        imageUrl: "https://picsum.photos/seed/cpu_13600k/800/400",
        specs: { cores: 14, threads: 20, socket: "LGA1700", tdp: 125 }
      }
    ],
    gpu: [
      {
        id: "gpu_4060",
        name: "NVIDIA RTX 4060",
        price: 299,
        score: 75,
        imageUrl: "https://picsum.photos/seed/gpu_4060/800/400",
        specs: { vramGB: 8, tdp: 115 }
      },
      {
        id: "gpu_4070s",
        name: "NVIDIA RTX 4070 SUPER",
        price: 599,
        score: 92,
        imageUrl: "https://picsum.photos/seed/gpu_4070s/800/400",
        specs: { vramGB: 12, tdp: 220 }
      },
      {
        id: "gpu_7800xt",
        name: "AMD RX 7800 XT",
        price: 499,
        score: 88,
        imageUrl: "https://picsum.photos/seed/gpu_7800xt/800/400",
        specs: { vramGB: 16, tdp: 263 }
      }
    ],
    ram: [
      {
        id: "ram_16",
        name: "16GB DDR4",
        price: 45,
        score: 60,
        imageUrl: "https://picsum.photos/seed/ram_16/800/400",
        specs: { sizeGB: 16, type: "DDR4" }
      },
      {
        id: "ram_32",
        name: "32GB DDR5",
        price: 95,
        score: 80,
        imageUrl: "https://picsum.photos/seed/ram_32/800/400",
        specs: { sizeGB: 32, type: "DDR5" }
      }
    ],
    storage: [
      {
        id: "ssd_1tb",
        name: "1TB NVMe SSD",
        price: 70,
        score: 75,
        imageUrl: "https://picsum.photos/seed/ssd_1tb/800/400",
        specs: { type: "NVMe", sizeGB: 1000 }
      },
      {
        id: "ssd_2tb",
        name: "2TB NVMe SSD",
        price: 120,
        score: 85,
        imageUrl: "https://picsum.photos/seed/ssd_2tb/800/400",
        specs: { type: "NVMe", sizeGB: 2000 }
      }
    ],
    motherboard: [
      {
        id: "mb_am4",
        name: "B550 (AM4)",
        price: 120,
        score: 70,
        imageUrl: "https://picsum.photos/seed/mb_am4/800/400",
        specs: { socket: "AM4", formFactor: "ATX" }
      },
      {
        id: "mb_am5",
        name: "B650 (AM5)",
        price: 160,
        score: 78,
        imageUrl: "https://picsum.photos/seed/mb_am5/800/400",
        specs: { socket: "AM5", formFactor: "ATX" }
      },
      {
        id: "mb_lga1700",
        name: "B760 (LGA1700)",
        price: 150,
        score: 76,
        imageUrl: "https://picsum.photos/seed/mb_lga1700/800/400",
        specs: { socket: "LGA1700", formFactor: "ATX" }
      }
    ],
    psu: [
      {
        id: "psu_650",
        name: "650W 80+ Gold",
        price: 85,
        score: 70,
        imageUrl: "https://picsum.photos/seed/psu_650/800/400",
        specs: { wattage: 650 }
      },
      {
        id: "psu_750",
        name: "750W 80+ Gold",
        price: 105,
        score: 78,
        imageUrl: "https://picsum.photos/seed/psu_750/800/400",
        specs: { wattage: 750 }
      }
    ],
    case: [
      {
        id: "case_atx",
        name: "Mid Tower ATX Case",
        price: 75,
        score: 70,
        imageUrl: "https://picsum.photos/seed/case_atx/800/400",
        specs: { formFactor: "ATX" }
      },
      {
        id: "case_itx",
        name: "Mini ITX Case",
        price: 110,
        score: 72,
        imageUrl: "https://picsum.photos/seed/case_itx/800/400",
        specs: { formFactor: "ITX" }
      }
    ]
  },

  pickBestWithin(items, maxPrice) {
    const candidates = items.filter((x) => x.price <= maxPrice);
    if (!candidates.length) return items.slice().sort((a, b) => b.score - a.score)[0];
    return candidates.slice().sort((a, b) => b.score - a.score)[0];
  },

  generateBuild(prefs) {
    const budget = Number(prefs?.budget ?? 1200);
    const useCase = prefs?.useCase ?? "Gaming";
    const formFactor = prefs?.formFactor ?? "ATX";

    const alloc =
      useCase === "ML"
        ? { cpu: 0.25, gpu: 0.45, ram: 0.12, storage: 0.08, rest: 0.10 }
        : { cpu: 0.22, gpu: 0.48, ram: 0.10, storage: 0.08, rest: 0.12 };

    const cpuBudget = Math.floor(budget * alloc.cpu);
    const gpuBudget = Math.floor(budget * alloc.gpu);
    const ramBudget = Math.floor(budget * alloc.ram);
    const storageBudget = Math.floor(budget * alloc.storage);
    const restBudget = budget - (cpuBudget + gpuBudget + ramBudget + storageBudget);

    const cpu = this.pickBestWithin(this.parts.cpu, cpuBudget);
    const gpu = this.pickBestWithin(this.parts.gpu, gpuBudget);
    const ram = this.pickBestWithin(this.parts.ram, ramBudget);
    const storage = this.pickBestWithin(this.parts.storage, storageBudget);

    const motherboardOptions = this.parts.motherboard.filter(
      (mb) => mb.specs.socket === cpu.specs.socket
    );
    const motherboard = this.pickBestWithin(
      motherboardOptions.length ? motherboardOptions : this.parts.motherboard,
      Math.floor(restBudget * 0.45)
    );

    const caseOptions = this.parts.case.filter((c) => c.specs.formFactor === formFactor);
    const pcCase = caseOptions.length ? caseOptions[0] : this.parts.case[0];

    const estWattage = (cpu.specs.tdp ?? 65) + (gpu.specs.tdp ?? 150) + 150;
    const psuNeeded = estWattage >= 600 ? 750 : 650;
    const psuOptions = this.parts.psu.filter((p) => p.specs.wattage >= psuNeeded);
    const psu = psuOptions[0] ?? this.parts.psu[0];

    const totalPrice =
      cpu.price + gpu.price + ram.price + storage.price + motherboard.price + psu.price + pcCase.price;

    const notes = [
      `Use case: ${useCase}`,
      `Estimated wattage: ~${estWattage}W`,
      totalPrice <= budget ? "Fits your budget." : "Over budget — adjust preferences or budget."
    ];

    return {
      prefs: { budget, useCase, formFactor, ...prefs },
      parts: { cpu, gpu, ram, storage, motherboard, psu, case: pcCase },
      totals: { price: totalPrice, wattage: estWattage },
      notes
    };
  },

  buildSummary(build, customTitle) {
    const cpu = build.parts.cpu.name;
    const gpu = build.parts.gpu.name;
    const ram = build.parts.ram.name;

    return {
      id: `${Date.now()}_${Math.floor(Math.random() * 100000)}`,
      title: customTitle || `${build.prefs.useCase} Build`,
      preview_image_url: build.parts.gpu.imageUrl,
      total_price: build.totals.price,
      highlight_1: cpu,
      highlight_2: gpu,
      highlight_3: ram,
      created_at: new Date().toLocaleDateString(),
      fullBuild: build
    };
  },

  getSelectedBuild() {
		return appsmith.store.selectedBuild || null;
	},

	async selectBuild(build) {
		await storeValue("selectedBuild", build);
		navigateTo("Results");
	},

	async generateAndSaveBuild(prefs, customTitle) {
		const build = this.generateBuild(prefs);
		const summary = this.buildSummary(build, customTitle);
		const current = this.getSavedBuilds();
		const updated = [summary, ...current];
		await storeValue("savedBuilds", updated);
		await storeValue("selectedBuildId", summary.id);
		navigateTo("Results");
	},
	
  initialBuilds() {
    return [
      this.buildSummary(
        this.generateBuild({ budget: 1200, useCase: "Gaming", formFactor: "ATX" }),
        "Budget Gaming Build"
      ),
      this.buildSummary(
        this.generateBuild({ budget: 1800, useCase: "Gaming", formFactor: "ATX" }),
        "1440p Performance Build"
      ),
      this.buildSummary(
        this.generateBuild({ budget: 1600, useCase: "ML", formFactor: "ATX" }),
        "Starter ML Workstation"
      )
    ];
  },

  getSavedBuilds() {
    return appsmith.store.savedBuilds || this.initialBuilds();
  }

};