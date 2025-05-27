declare module "*.svg" {
	// biome-ignore lint/style/useImportType: <explanation>
	import React from "react";
	const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
	export default SVG;
}
