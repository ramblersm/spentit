type HeaderProps = {
    total: number;
  };
  
  export default function Header({ total }: HeaderProps) {
    return (
      <header className="p-4 bg-white shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold tracking-tight">SpentIt 💸</h1>
        <p className="text-sm text-gray-500 mt-1">Track what you spend, effortlessly 💸</p>
      </header>
    );
  }  