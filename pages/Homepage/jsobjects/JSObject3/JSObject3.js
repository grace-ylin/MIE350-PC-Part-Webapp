export default {
	Button2onClick() {
		storeValue(
			"build",
			Mock.generateBuild({ budget: 1200, useCase: "Gaming", formFactor: "ATX" })
		)
	}
}