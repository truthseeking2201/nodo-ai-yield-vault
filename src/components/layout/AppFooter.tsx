
import { Link } from "react-router-dom";

export function AppFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-nodo-darker py-6">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-white/60 text-sm">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/5d391ecc-3691-475a-afc3-4e1cebf3e796.png" 
              alt="Nodo Logo" 
              className="h-6 w-auto"
            />
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
