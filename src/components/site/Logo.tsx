import logo from "@/assets/v2-logo.svg";
export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return <img src={logo} alt="V2 Classes logo" className={className} width={36} height={36} />;
}
