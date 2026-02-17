import { PiDownloadSimple } from "react-icons/pi";
import { showCvDownloadToast } from "../../utils/toast";

type Props = {
  href: string;
  download: string;
  className: string;
  label: string;
  locale: "es" | "en";
  cvName: "es" | "en";
};

export default function CvDownloadButton({
  href,
  download,
  className,
  label,
  locale,
  cvName,
}: Props) {
  const handleClick = () => {
    showCvDownloadToast({ locale, cvName });
  };

  return (
    <a
      href={href}
      download={download}
      className={className}
      onClick={handleClick}
    >
      <PiDownloadSimple className="w-5 h-5" />
      {label}
    </a>
  );
}
