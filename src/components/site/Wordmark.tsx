import mark from "@/assets/v2-wordmark.svg";
export function Wordmark({ className = "h-6 w-auto" }: { className?: string }) {
  return <img src={mark} alt="V2 Classes" className={className} width={156} height={24} />;
}
