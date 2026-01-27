import { useSelector } from "react-redux";
import logo from "../assets/images/kiva-diamond-logo.png"; // ← your logo path

export default function Loader() {
  const loading = useSelector((state) => state.loader.loader);
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-32 h-32 flex items-center justify-center">

        {/* Glow Rings */}
        <div className="absolute inset-0 rounded-full border border-amber-400/40 animate-goldPulse" />
        <div className="absolute inset-3 rounded-full border border-amber-500/60 animate-goldPulse delay-500" />

        {/* Rotating Ring */}
        <div className="absolute inset-6 rounded-full border-2 border-dashed border-amber-400 animate-spin-slow" />

        {/* Logo */}
        <div className="relative z-10 flex items-center justify-center w-32 h-32 rounded-full bg-gray-800 shadow-[0_0_30px_rgba(255,191,0,0.6)]">
          <img
            src={logo}
            alt="Brand Logo"
            className="w-20 h-20 object-contain animate-logoFloat"
          />
        </div>
      </div>
    </div>
  );
}
