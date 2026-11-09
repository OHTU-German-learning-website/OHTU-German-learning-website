import Image from "next/image";
import { withBasePath } from "@/shared/utils/basePath";

export default function Custom404() {
  return (
    <div>
      <h2>
        <Image
          src={withBasePath("/gradesa_favicon.svg")}
          alt="Gradesa"
          width={64}
          height={64}
        />
        404 - Seite nicht gefunden
      </h2>
    </div>
  );
}
