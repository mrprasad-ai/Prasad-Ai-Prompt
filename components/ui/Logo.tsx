import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
 <Link href="/" className="pa-logo">

  {/* Logo Image */}



<Image
  src="/logo/logo.svg"
  alt="Prasad AI Prompt"
  width={46}
  height={46}
  priority
  className="pa-logo-image"
/>

  {/* Text */}

  <div className="pa-logo-content">

    <span className="pa-logo-text">
      Prasad <span className="pa-logo-ai">AI</span> Prompt
    </span>

    <span className="pa-logo-subtitle">
      Premium AI Prompt Library
    </span>

  </div>

</Link>
  );
}