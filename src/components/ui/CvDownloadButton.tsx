import { PiDownloadSimple } from "react-icons/pi";

type Props = {
  href: string;
  download: string;
  className: string;
  label: string;
};

export default function CvDownloadButton({
  href,
  download,
  className,
  label,
}: Props) {
  return (
    <a href={href} download={download} className={className}>
      <PiDownloadSimple className="w-5 h-5" />
      {label}
    </a>
  );
}
