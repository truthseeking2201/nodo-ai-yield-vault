
import { Link } from "react-router-dom";

export function AppFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-nodo-darker py-6">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
          <div>
            <span className="gradient-text-nova font-bold">NODO AI</span> Yield Vaults &copy; {new Date().getFullYear()}
          </div>
          <div className="mt-4 md:mt-0 flex gap-4">
            <Link to="/" className="hover:text-white">Terms</Link>
            <Link to="/" className="hover:text-white">Privacy</Link>
            <Link to="/" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
