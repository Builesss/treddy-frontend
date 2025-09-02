import Link from "next/link";
import {useRouter} from "next/navigation";
export default function Nav() {
  const router = useRouter();
    return(
        <header className="flex justify-between items-center px-8 py-6 bg-[#0A0F2C] border-b border-[#1a1f40]">
        <h1 className="text-2xl font-bold text-[#00E6F6]">TREDDY</h1>
        <nav className="space-x-6">
          <Link href="/../" className="hover:text-[#00E6F6]" >Inicio</Link>
          <Link href="/../" className="hover:text-[#00E6F6]">Productos</Link>
          <Link href="/../" className="hover:text-[#00E6F6]">Personalizar</Link>
          <Link href="/../" className="hover:text-[#00E6F6]">Contacto</Link>
        </nav>
        <div className="space-x-4">
          <Link href="/../carritoCompras" className="hover:text-[#00E6F6]">Carrito</Link>
          <Link href="/../perfil" className="hover:text-[#00E6F6]">Perfil</Link>
        </div>
      </header>
    )
}