import Container from "@/components/ui/Container";
import Search from "@/components/home/Search";
import { Sparkles, Lightbulb,Gem,ImageIcon, Bookmark} from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
      <Container className="hero-container">
        {/* Left Content */}

        <div className="hero-left">

          <div className="hero-badge">
            <span className="hero-badge-icon">✦ Ai Prompt • Photography • Creativity</span>

          </div>

          <h1 className="hero-title">
            <span>
              Find the <span className="pa-gradient-text">Perfect</span>
            </span>

            <span>
              Prompt for <span className="pa-gradient-text">Anything.</span>
            </span>
          </h1>

          <p className="hero-description pa-text-lg">
            1000+ high-quality prompts for students,
            creators, developers, marketers and
            professionals.
          </p>

          <div className="hero-search">

            <Search />

          </div>

          <div className="hero-stats">

            {/* Stats Component */}

          </div>

        </div>

        {/* Right Illustration */}

        <div className="hero-right">

       <div className="hero-illustration">

    {/* Background */}

    <div className="hero-bg">

      <div className="hero-glow"></div>

      <div className="hero-orbit hero-orbit-1"></div>

      <div className="hero-orbit hero-orbit-2"></div>

    </div>

    {/* Main Card */}

    <div className="hero-main-card">

      <div className="hero-main-header">

        <div className="hero-main-icon main-icon-green">
           <Sparkles size={22} strokeWidth={2.3} />
        </div>

        <div className="hero-main-content">

          <h2 className="hero-main-title">
            Turn imagination into visual
          </h2>

          <p className="hero-main-description">
            "Creativity is not just about ideas,Its's about
            how you express them."
          </p>

        </div>

        <button className="hero-bookmark" aria-label="Save Prompt">
         <Bookmark size={18} />
        </button>

      </div>

      <div className="hero-preview">

    <Image
        src="/images/hero-preview.png"
        alt="AI Prompt Preview"
        fill
        priority
        sizes="460px"
        className="hero-preview-image"
    />

    </div>

    </div>

    {/* Floating Card Top */}

    <div className="hero-floating-card hero-floating-top">

        <div className="hero-floating-icon icon-yellow">
            <Lightbulb size={24} strokeWidth={2.3}/>
        </div>

    <span>Creative Ideas</span>

    </div>

    {/* Floating Card Left */}

   <div className="hero-floating-card hero-floating-left">

    <div className="hero-floating-icon icon-blue">
        <Gem size={24} strokeWidth={2.3}/>
    </div>

    <span>Premium Prompts</span>

</div>

    {/* Floating Card Bottom */}

    <div className="hero-floating-card hero-floating-bottom">

    <div className="hero-floating-icon icon-purple">
        <ImageIcon size={24} strokeWidth={2.3}/>
    </div>

    <span>Realistic Results</span>

</div>

  </div>

</div>

      </Container>
    </section>
  );
}